import { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState, type Ref } from 'react';
import { BackHandler, Platform, StyleSheet, View } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';
import type {
  ShouldStartLoadRequest,
  WebViewNavigation,
  WebViewOpenWindowEvent,
} from 'react-native-webview/lib/WebViewTypes';
import * as WebBrowser from 'expo-web-browser';
import { decideNavigation, lockPackToUrl } from '@/rules/matching';
import { buildScript } from '@/rules/scriptBuilder';
import type { PlatformRules, WebMessage } from '@/rules/types';
import { colors, sizes, spacing } from '@/theme/tokens';
import { useLayout } from '@/theme/useLayout';
import { AppText } from './AppText';
import { Button } from './Button';

export interface PlatformWebViewHandle {
  reload(): void;
  goBack(): void;
  /** Wipes the web view's local storage and caches. */
  clearStorage(): void;
}

interface Props {
  pack: PlatformRules;
  /** Initial address; defaults to the pack's start URL. */
  uri?: string;
  /** Lock the view to one URL (shared post / reel modal). */
  lockedUrl?: string;
  showProgress?: boolean;
  /** Inactive (hidden) views must not handle the Android back button. */
  active?: boolean;
  onRoute?: (path: string) => void;
  onUrlChange?: (url: string) => void;
  onShared?: (url: string) => void;
  ref?: Ref<PlatformWebViewHandle>;
}

type LoadError = { offline: boolean };

const OFFLINE_HINTS = ['internet', 'offline', 'network', 'not connected', '-1009'];

function looksOffline(description: string, code?: number): boolean {
  const d = description.toLowerCase();
  return code === -1009 || OFFLINE_HINTS.some((h) => d.includes(h));
}

function parseMessage(raw: string): WebMessage | null {
  try {
    const m = JSON.parse(raw);
    if (m?.type === 'route' && typeof m.path === 'string') return m;
    if (m?.type === 'shared' && typeof m.url === 'string') return m;
  } catch {}
  return null;
}

export function PlatformWebView({ pack, uri, lockedUrl, showProgress, active = true, onRoute, onUrlChange, onShared, ref }: Props) {
  const { isWide, webWidth } = useLayout();
  const webRef = useRef<WebView>(null);
  const canGoBack = useRef(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<LoadError | null>(null);

  const effectivePack = useMemo(() => (lockedUrl ? lockPackToUrl(pack, lockedUrl) : pack), [pack, lockedUrl]);
  const script = useMemo(() => buildScript(effectivePack), [effectivePack]);
  const userAgent = isWide ? pack.userAgent.desktop : Platform.OS === 'ios' ? pack.userAgent.ios : pack.userAgent.android;

  useImperativeHandle(ref, () => ({
    reload: () => webRef.current?.reload(),
    goBack: () => webRef.current?.goBack(),
    clearStorage: () => webRef.current?.clearCache?.(true),
  }));

  // Android hardware back goes back in web history first.
  useEffect(() => {
    if (Platform.OS !== 'android' || !active) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (canGoBack.current) {
        webRef.current?.goBack();
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [active]);

  const handle = useCallback(
    (url: string): boolean => {
      const d = decideNavigation(effectivePack, url);
      if (__DEV__) console.log(`[deems:${effectivePack.id}] nav ${d.action}`, url);
      switch (d.action) {
        case 'allow':
          return true;
        case 'redirect':
          webRef.current?.injectJavaScript(`window.location.replace(${JSON.stringify(d.url)});true;`);
          return false;
        case 'external':
          WebBrowser.openBrowserAsync(d.url).catch(() => {});
          return false;
        case 'shared':
          onShared?.(d.url);
          return false;
        default:
          return false;
      }
    },
    [effectivePack, onShared],
  );

  const onShouldStart = useCallback(
    (req: ShouldStartLoadRequest) => (req.isTopFrame === false ? true : handle(req.url)),
    [handle],
  );

  const onOpenWindow = useCallback(
    (e: WebViewOpenWindowEvent) => {
      const target = e.nativeEvent.targetUrl;
      if (__DEV__) console.log(`[deems:${effectivePack.id}] openWindow`, target);
      if (!target) return;
      const d = decideNavigation(effectivePack, target);
      if (d.action === 'allow') {
        webRef.current?.injectJavaScript(`window.location.href = ${JSON.stringify(target)};true;`);
      } else {
        handle(target);
      }
    },
    [effectivePack, handle],
  );

  const onMessage = useCallback(
    (e: WebViewMessageEvent) => {
      const msg = parseMessage(e.nativeEvent.data);
      if (__DEV__) console.log(`[deems:${effectivePack.id}] message`, e.nativeEvent.data);
      if (!msg) return;
      if (msg.type === 'route') onRoute?.(msg.path);
      else onShared?.(msg.url);
    },
    [onRoute, onShared, effectivePack.id],
  );

  const onNavigationStateChange = useCallback(
    (nav: WebViewNavigation) => {
      canGoBack.current = nav.canGoBack;
      onUrlChange?.(nav.url);
    },
    [onUrlChange],
  );

  const retry = () => {
    setError(null);
    webRef.current?.reload();
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.column, { width: webWidth }, isWide && { borderColor: colors.hairline, borderLeftWidth: 1, borderRightWidth: 1 }]}>
        <WebView
          key={userAgent}
          ref={webRef}
          source={{ uri: uri ?? effectivePack.startUrl }}
          style={{ backgroundColor: colors.background }}
          userAgent={userAgent}
          injectedJavaScriptBeforeContentLoaded={script}
          onMessage={onMessage}
          onShouldStartLoadWithRequest={onShouldStart}
          onNavigationStateChange={onNavigationStateChange}
          onOpenWindow={onOpenWindow}
          setSupportMultipleWindows={false}
          onLoadProgress={(e) => setProgress(e.nativeEvent.progress)}
          onLoadStart={() => setError(null)}
          onHttpError={(e) => __DEV__ && console.log(`[deems:${effectivePack.id}] http`, e.nativeEvent.statusCode, e.nativeEvent.url)}
          onError={(e) => {
            if (__DEV__) console.log(`[deems:${effectivePack.id}] error`, e.nativeEvent.code, e.nativeEvent.description, e.nativeEvent.url);
            setError({ offline: looksOffline(e.nativeEvent.description ?? '', e.nativeEvent.code) });
          }}
          onContentProcessDidTerminate={() => webRef.current?.reload()}
          onRenderProcessGone={() => webRef.current?.reload()}
          renderError={() => <View />}
          sharedCookiesEnabled
          thirdPartyCookiesEnabled
          domStorageEnabled
          javaScriptEnabled
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
          mediaCapturePermissionGrantType="prompt"
          allowsBackForwardNavigationGestures
          pullToRefreshEnabled
          allowFileAccess
          allowsLinkPreview={false}
          textZoom={100}
          originWhitelist={['*']}
          webviewDebuggingEnabled={__DEV__}
        />

        {showProgress && progress < 1 && !error && (
          <View pointerEvents="none" style={[styles.progressTrack]}>
            <View style={[styles.progressBar, { width: `${Math.max(progress, 0.05) * 100}%`, backgroundColor: colors.keep }]} />
          </View>
        )}

        {error && (
          <View style={[styles.error, { backgroundColor: colors.background }]}>
            <AppText variant="label" tone={error.offline ? 'muted' : 'cut'} center>
              {error.offline ? 'Offline' : 'Error'}
            </AppText>
            <AppText variant="title" center>
              {error.offline ? "You're offline." : "Couldn't load your messages."}
            </AppText>
            <AppText muted center>
              {error.offline ? 'Check your connection and try again.' : 'Try again in a moment.'}
            </AppText>
            <Button label="Try again" onPress={retry} style={{ alignSelf: 'stretch' }} />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center' },
  column: { flex: 1, maxWidth: '100%' },
  progressTrack: { position: 'absolute', top: 0, left: 0, right: 0, height: sizes.progress },
  progressBar: { height: sizes.progress },
  error: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: sizes.gutter,
  },
});
