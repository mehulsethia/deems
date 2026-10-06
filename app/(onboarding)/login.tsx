import { useCallback, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { LockIcon, ReloadIcon } from '@/components/Icons';
import { PlatformWebView, type PlatformWebViewHandle } from '@/components/PlatformWebView';
import { isAllowedPath, isLoginPath, parseUrl } from '@/rules/matching';
import { getPack } from '@/rules/store';
import type { PlatformId } from '@/rules/types';
import { markSignedInTo, setActivePlatform } from '@/state/platforms';
import { radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/ThemeProvider';

const HELP_URL = 'https://help.instagram.com/';

/** Modal sheet showing Instagram's own login page. Success = the route leaves the login paths. */
export default function Login() {
  const router = useRouter();
  const { colors } = useTheme();
  const { platform = 'instagram' } = useLocalSearchParams<{ platform?: PlatformId }>();
  const pack = getPack(platform);
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
        markSignedInTo(platform);
        if (platform === 'instagram') {
          router.dismissTo('/(onboarding)/setup');
        } else {
          setActivePlatform(platform);
          router.dismissTo('/(main)/inbox');
        }
      }
    },
    [pack, platform, router],
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['bottom']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.md }}>
        <Pressable accessibilityRole="button" accessibilityLabel="Close" hitSlop={10} onPress={() => router.back()} style={{ minWidth: 44, minHeight: 44, justifyContent: 'center' }}>
          <AppText variant="bodyMedium">Close</AppText>
        </Pressable>
        <View
          accessible
          accessibilityLabel={`Address: ${address.secure ? 'secure, ' : ''}${address.host}${address.path}`}
          style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.card, borderRadius: radius.pill, paddingHorizontal: spacing.md, minHeight: 40, borderWidth: 1, borderColor: colors.border }}
        >
          {address.secure && <LockIcon color={colors.primary} />}
          <AppText variant="small" numberOfLines={1} style={{ flex: 1 }}>
            {address.host}
            <AppText variant="small" muted>{address.path}</AppText>
          </AppText>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Reload page" hitSlop={10} onPress={() => webRef.current?.reload()} style={{ minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' }}>
          <ReloadIcon color={colors.text} />
        </Pressable>
        <Pressable accessibilityRole="link" accessibilityLabel="Help" hitSlop={10} onPress={() => WebBrowser.openBrowserAsync(HELP_URL).catch(() => {})} style={{ minHeight: 44, justifyContent: 'center' }}>
          <AppText variant="bodyMedium" accent>Help</AppText>
        </Pressable>
      </View>

      <View style={{ flex: 1 }}>
        <PlatformWebView ref={webRef} pack={pack} uri={pack.loginUrl} showProgress onUrlChange={onUrlChange} onRoute={onRoute} />
      </View>

      <AppText variant="caption" muted center style={{ padding: spacing.md }}>
        {pack.displayName}'s own page. Hearth never sees your password.
      </AppText>
    </SafeAreaView>
  );
}
