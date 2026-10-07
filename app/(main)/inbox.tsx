import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { Logo } from '@/components/Logo';
import { PlatformWebView, type PlatformWebViewHandle } from '@/components/PlatformWebView';
import { StoriesBackBar, StoriesTray } from '@/components/StoriesTray';
import { isAllowedPath, isLoginPath, pathMatches } from '@/rules/matching';
import { getPack } from '@/rules/store';
import type { PlatformId } from '@/rules/types';
import { PICK_ORDER, platformLabel } from '@/state/platformMeta';
import { connectedPlatforms, getActivePlatform, markSignedInTo, setActivePlatform } from '@/state/platforms';
import { readProgress } from '@/state/progress';
import { onWebEvent } from '@/state/webEvents';
import { parseStories, STORIES_SCRIPT, storyUrl, type StoryItem } from '@/stories/instagram';
import { colors, fonts, radius, sizes, spacing } from '@/theme/tokens';

/** Connected platforms, in the order the user picked them. Falls back to the active one if none is connected. */
function tabsFor(connected: PlatformId[]): PlatformId[] {
  const picked = readProgress().picked;
  const order = [...picked, ...PICK_ORDER.filter((id) => !picked.includes(id))];
  const tabs = order.filter((id) => connected.includes(id));
  return tabs.length ? tabs : [getActivePlatform()];
}

/** How often the story tray is refreshed while the inbox list is showing. */
const STORIES_REFRESH_MS = 60_000;
const isInboxList = (path: string) => pathMatches(path, ['/direct/inbox']);
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

  // Instagram's web inbox has no story row, so DeeMs draws one from the signed-in session.
  const [igPath, setIgPath] = useState('');
  const [stories, setStories] = useState<StoryItem[]>([]);
  const storiesFetchedAt = useRef(0);

  const onRoute = useCallback((id: PlatformId, path: string) => {
    const pack = getPack(id);
    const live = isAllowedPath(pack, path) && !isLoginPath(pack, path);
    // Being on a real page (not sign-in or a checkpoint) means the session is live.
    if (live) markSignedInTo(id);
    if (id !== 'instagram') return;
    setIgPath(path);
    if (live && isInboxList(path) && Date.now() - storiesFetchedAt.current > STORIES_REFRESH_MS) {
      storiesFetchedAt.current = Date.now();
      refs.current.instagram?.inject(STORIES_SCRIPT);
    }
  }, []);

  const openStory = (username: string) => {
    // Coming back from a story should show it as watched.
    storiesFetchedAt.current = 0;
    refs.current.instagram?.load(storyUrl(username));
  };

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

      {active === 'instagram' && isInboxList(igPath) && stories.length > 0 && (
        <StoriesTray items={stories} onOpen={openStory} />
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
                onStories={id === 'instagram' ? (items) => setStories(parseStories(items)) : undefined}
              />
            </View>
          ))}
      </View>
    </View>
  );
}
