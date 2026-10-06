import { useCallback, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { CloseIcon, LockIcon, ReloadIcon } from '@/components/Icons';
import { PlatformWebView, type PlatformWebViewHandle } from '@/components/PlatformWebView';
import { isAllowedPath, isLoginPath, parseUrl } from '@/rules/matching';
import { getPack } from '@/rules/store';
import type { PlatformId } from '@/rules/types';
import { PLATFORM_META } from '@/state/platformMeta';
import { connectedPlatforms, markSignedInTo, setActivePlatform } from '@/state/platforms';
import { readProgress } from '@/state/progress';
import { colors, radius, sizes, spacing } from '@/theme/tokens';

/** Modal sheet showing the platform's own login page. Success = the route leaves the login paths. */
export default function Login() {
  const router = useRouter();
  const { platform = 'instagram' } = useLocalSearchParams<{ platform?: PlatformId }>();
  const pack = getPack(platform);
  const meta = PLATFORM_META[platform];
  const webRef = useRef<PlatformWebViewHandle>(null);
  const finished = useRef(false);
  const initial = parseUrl(pack.loginUrl);
  const [address, setAddress] = useState({ host: initial?.host ?? '', path: initial?.path ?? '/', secure: true });

  const onUrlChange = useCallback((url: string) => {
    const p = parseUrl(url);
    if (p && (p.protocol === 'https' || p.protocol === 'http')) {
      setAddress({ host: p.host, path: p.path, secure: p.protocol === 'https' });
    }
  }, []);

  const onRoute = useCallback(
    (path: string) => {
      if (finished.current) return;
      if (isAllowedPath(pack, path) && !isLoginPath(pack, path)) {
        finished.current = true;
        const first = connectedPlatforms().length === 0;
        markSignedInTo(platform);
        if (!readProgress().onboardingComplete) {
          // Onboarding: the first account signed in opens first in the inbox.
          if (first) setActivePlatform(platform);
          router.dismissTo({ pathname: '/(onboarding)/trust', params: { signedIn: platform } });
        } else {
          setActivePlatform(platform);
          router.dismissTo('/(main)/inbox');
        }
      }
    },
    [pack, platform, router],
  );

  const touch = { minWidth: sizes.touch, minHeight: sizes.touch, alignItems: 'center' as const, justifyContent: 'center' as const };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'bottom', 'left', 'right']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.sm, paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.hairline }}>
        <Pressable accessibilityRole="button" accessibilityLabel="Close" hitSlop={6} onPress={() => router.back()} style={touch}>
          <CloseIcon color={colors.paper} />
        </Pressable>
        <View
          accessible
          accessibilityLabel={`Address: ${address.secure ? 'secure, ' : ''}${address.host}${address.path}`}
          style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.surface, borderRadius: radius.pill, paddingHorizontal: spacing.md, minHeight: 40, borderWidth: 1, borderColor: colors.hairline }}
        >
          {address.secure && <LockIcon color={colors.keep} />}
          <AppText variant="mono" numberOfLines={1} style={{ flex: 1, fontSize: 13 }}>
            {address.host}
            <AppText variant="mono" muted style={{ fontSize: 13 }}>{address.path}</AppText>
          </AppText>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Reload page" hitSlop={6} onPress={() => webRef.current?.reload()} style={touch}>
          <ReloadIcon color={colors.paper} />
        </Pressable>
        <Pressable accessibilityRole="link" accessibilityLabel="Help" hitSlop={6} onPress={() => WebBrowser.openBrowserAsync(meta.helpUrl).catch(() => {})} style={touch}>
          <AppText variant="bodyMedium">Help</AppText>
        </Pressable>
      </View>

      <View style={{ flex: 1 }}>
        <PlatformWebView ref={webRef} pack={pack} uri={pack.loginUrl} showProgress onUrlChange={onUrlChange} onRoute={onRoute} />
      </View>

      <View style={{ borderTopWidth: 1, borderTopColor: colors.hairline, padding: spacing.md }}>
        <AppText variant="caption" muted center>
          {meta.label}'s own page. Deems never reads your password.
        </AppText>
      </View>
    </SafeAreaView>
  );
}
