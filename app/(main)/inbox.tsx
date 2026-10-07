import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { Logo } from '@/components/Logo';
import { PlatformWebView, type PlatformWebViewHandle } from '@/components/PlatformWebView';
import { StoriesBackBar } from '@/components/StoriesBackBar';
import { isAllowedPath, isLoginPath, pathMatches } from '@/rules/matching';
import { getPack } from '@/rules/store';
import type { PlatformId } from '@/rules/types';
import { PICK_ORDER, platformLabel } from '@/state/platformMeta';
import { connectedPlatforms, getActivePlatform, markSignedInTo, setActivePlatform } from '@/state/platforms';
import { readProgress } from '@/state/progress';
import { onWebEvent } from '@/state/webEvents';
import { STORY_RINGS_SCRIPT } from '@/stories/instagram';
import { colors, fonts, radius, sizes, spacing } from '@/theme/tokens';

/** Connected platforms, in the order the user picked them. Falls back to the active one if none is connected. */
function tabsFor(connected: PlatformId[]): PlatformId[] {
  const picked = readProgress().picked;
  const order = [...picked, ...PICK_ORDER.filter((id) => !picked.includes(id))];
  const tabs = order.filter((id) => connected.includes(id));
  return tabs.length ? tabs : [getActivePlatform()];
}

const isMessages = (path: string) => pathMatches(path, ['/direct']);
const isStory = (path: string) => pathMatches(path, ['/stories']);

export default function Inbox() {
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

  const [igPath, setIgPath] = useState('');

  const onRoute = useCallback((id: PlatformId, path: string) => {
    const pack = getPack(id);
    const live = isAllowedPath(pack, path) && !isLoginPath(pack, path);
    // Being on a real page (not sign-in or a checkpoint) means the session is live.
    if (live) markSignedInTo(id);
    if (id !== 'instagram') return;
    setIgPath(path);
    // Instagram's web inbox doesn't mark who has a story; the script rings those avatars like the app does.
    // Safe to run on every visit: it installs once per page and refreshes at most every 30 seconds.
    if (live && isMessages(path)) refs.current.instagram?.inject(STORY_RINGS_SCRIPT);
  }, []);

  const onShared = useCallback(
    (id: PlatformId, url: string) => router.push({ pathname: '/(main)/post', params: { url, platform: id } }),
    [router],
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top, paddingBottom: insets.bottom, paddingLeft: insets.left, paddingRight: insets.right }}>
      <View style={{ minHeight: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.md }}>
        <Logo size={22} />
        <Pressable accessibilityRole="button" accessibilityLabel="Settings" hitSlop={6} onPress={() => router.push('/(main)/settings')} style={{ minHeight: sizes.touch, justifyContent: 'center', paddingHorizontal: spacing.sm }}>
          <AppText variant="bodyMedium" muted>Settings</AppText>
        </Pressable>
      </View>

      {tabs.length > 1 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          accessibilityRole="tablist"
          style={{ flexGrow: 0 }}
          contentContainerStyle={{ gap: spacing.sm, paddingHorizontal: spacing.md, paddingBottom: spacing.sm }}
        >
          {tabs.map((id) => {
            const on = id === active;
            return (
              <Pressable
                key={id}
                accessibilityRole="tab"
                accessibilityState={{ selected: on }}
                accessibilityLabel={platformLabel(id)}
                onPress={() => select(id)}
                style={{ minHeight: sizes.touch, justifyContent: 'center', paddingHorizontal: spacing.md, borderRadius: radius.pill, backgroundColor: on ? colors.primary : colors.surface, borderWidth: 1, borderColor: on ? colors.primary : colors.hairline }}
              >
                <AppText variant="small" tone={on ? 'onPrimary' : 'text'} style={{ fontFamily: fonts.bodyMedium }}>{platformLabel(id)}</AppText>
              </Pressable>
            );
          })}
        </ScrollView>
      )}

      {active === 'instagram' && isStory(igPath) && (
        <StoriesBackBar onBack={() => refs.current.instagram?.load(getPack('instagram').startUrl)} />
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
