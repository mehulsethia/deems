import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { Logo } from '@/components/Logo';
import { PlatformWebView, type PlatformWebViewHandle } from '@/components/PlatformWebView';
import { isAllowedPath, isLoginPath } from '@/rules/matching';
import { getPack } from '@/rules/store';
import type { PlatformId } from '@/rules/types';
import { connectedPlatforms, getActivePlatform, markSignedInTo, setActivePlatform } from '@/state/platforms';
import { onWebEvent } from '@/state/webEvents';
import { radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/ThemeProvider';

/** Instagram is always shown; Messenger and Threads appear once connected from Settings. */
function tabsFor(connected: PlatformId[]): PlatformId[] {
  return ['instagram', ...connected.filter((p) => p !== 'instagram')];
}

export default function Inbox() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const refs = useRef<Partial<Record<PlatformId, PlatformWebViewHandle | null>>>({});

  const [tabs, setTabs] = useState<PlatformId[]>(() => tabsFor(connectedPlatforms()));
  const [active, setActive] = useState<PlatformId>(getActivePlatform);
  // Views are created on first visit and then kept alive, so switching is instant and keeps scroll position.
  const [visited, setVisited] = useState<PlatformId[]>(() => [getActivePlatform()]);

  useFocusEffect(
    useCallback(() => {
      setTabs(tabsFor(connectedPlatforms()));
      const a = getActivePlatform();
      setActive(a);
      setVisited((v) => (v.includes(a) ? v : [...v, a]));
    }, []),
  );

  const select = (id: PlatformId) => {
    setActive(id);
    setActivePlatform(id);
    setVisited((v) => (v.includes(id) ? v : [...v, id]));
  };

  useEffect(() => {
    const offReload = onWebEvent('reload', () => refs.current[active]?.reload());
    const offClear = onWebEvent('clear', () => Object.values(refs.current).forEach((h) => h?.clearStorage()));
    return () => {
      offReload();
      offClear();
    };
  }, [active]);

  const onRoute = useCallback((id: PlatformId, path: string) => {
    const pack = getPack(id);
    // Being on a real page (not sign-in or a checkpoint) means the session is live.
    if (isAllowedPath(pack, path) && !isLoginPath(pack, path)) markSignedInTo(id);
  }, []);

  const onShared = useCallback(
    (id: PlatformId, url: string) => router.push({ pathname: '/(main)/post', params: { url, platform: id } }),
    [router],
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <View style={{ height: 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.md }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }} accessible accessibilityRole="header" accessibilityLabel="Hearth">
          <Logo size={22} />
          <AppText variant="bodyMedium">Hearth</AppText>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Settings" hitSlop={10} onPress={() => router.push('/(main)/settings')} style={{ minHeight: 40, justifyContent: 'center' }}>
          <AppText variant="bodyMedium" accent>Settings</AppText>
        </Pressable>
      </View>

      {tabs.length > 1 && (
        <View accessibilityRole="tablist" style={{ flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.md, paddingBottom: spacing.sm }}>
          {tabs.map((id) => {
            const on = id === active;
            return (
              <Pressable
                key={id}
                accessibilityRole="tab"
                accessibilityState={{ selected: on }}
                accessibilityLabel={getPack(id).displayName}
                onPress={() => select(id)}
                style={{ minHeight: 36, justifyContent: 'center', paddingHorizontal: spacing.md, borderRadius: radius.pill, backgroundColor: on ? colors.primary : colors.card, borderWidth: 1, borderColor: on ? colors.primary : colors.border }}
              >
                <AppText variant="small" style={{ color: on ? colors.onPrimary : colors.text }}>{getPack(id).displayName}</AppText>
              </Pressable>
            );
          })}
        </View>
      )}

      <View style={{ flex: 1 }}>
        {tabs
          .filter((id) => visited.includes(id))
          .map((id) => (
            <View key={id} style={{ flex: 1, display: id === active ? 'flex' : 'none' }}>
              <PlatformWebView
                ref={(h) => {
                  refs.current[id] = h;
                }}
                pack={getPack(id)}
                active={id === active}
                showProgress
                onRoute={(p) => onRoute(id, p)}
                onShared={(u) => onShared(id, u)}
              />
            </View>
          ))}
      </View>
    </View>
  );
}
