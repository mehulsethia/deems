import { useEffect } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { WebView } from 'react-native-webview';
import { PlatformWebView } from '@/components/PlatformWebView';
import { isMediaUrl, sharedPackFor } from '@/rules/sharedContent';
import type { PlatformId } from '@/rules/types';
import { colors, spacing } from '@/theme/tokens';

const escapeAttr = (v: string) => v.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/** A photo or video file sent in a chat, shown on its own: nothing to tap through to. */
function MediaViewer({ url }: { url: string }) {
  const video = /\.(mp4|mov|m4v|webm)(\?|$)/i.test(url);
  const src = escapeAttr(url);
  const html = `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=5"><style>html,body{margin:0;height:100%;background:#0A0A0A}body{display:flex;align-items:center;justify-content:center}img,video{max-width:100%;max-height:100%}</style></head><body>${
    video ? `<video src="${src}" controls autoplay playsinline></video>` : `<img src="${src}" alt="">`
  }</body></html>`;
  return (
    <WebView
      source={{ html }}
      originWhitelist={['about:*']}
      style={{ flex: 1, backgroundColor: colors.background }}
      allowsInlineMediaPlayback
      mediaPlaybackRequiresUserAction={false}
      // The file itself is the only thing this view loads.
      onShouldStartLoadWithRequest={(req) => req.url.startsWith('about:')}
    />
  );
}

/** A post, reel, story, photo or video shared in a DM, locked to that one item. Reels and stories can't be swiped through. */
export default function SharedPost() {
  const { url, platform } = useLocalSearchParams<{ url?: string; platform?: PlatformId }>();
  const router = useRouter();
  // The platform the link was shared on first, then any other that can show it (an Instagram reel sent on Facebook).
  const media = typeof url === 'string' && isMediaUrl(url);
  const pack = typeof url === 'string' && !media ? sharedPackFor(url, platform) : null;
  const valid = media || pack !== null;

  useEffect(() => {
    if (!valid) router.back();
  }, [valid, router]);

  if (!valid || typeof url !== 'string') return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'bottom', 'left', 'right']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.hairline }}>
        <AppText variant="heading">Shared with you</AppText>
        <Button label="Done" variant="ghost" onPress={() => router.back()} style={{ minHeight: 44, paddingVertical: 0, paddingHorizontal: spacing.md }} />
      </View>
      {pack ? <PlatformWebView pack={pack} lockedUrl={url} showProgress /> : <MediaViewer url={url} />}
    </SafeAreaView>
  );
}
