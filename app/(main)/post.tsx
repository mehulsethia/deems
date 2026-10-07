import { useEffect } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { PlatformWebView } from '@/components/PlatformWebView';
import { sharedPackFor } from '@/rules/sharedContent';
import type { PlatformId } from '@/rules/types';
import { colors, spacing } from '@/theme/tokens';

/** A post or reel shared in a DM, locked to that single URL. Reels can't be swiped to the next one. */
export default function SharedPost() {
  const { url, platform } = useLocalSearchParams<{ url?: string; platform?: PlatformId }>();
  const router = useRouter();
  // The platform the link was shared on first, then any other that can show it (an Instagram reel sent on Facebook).
  const pack = typeof url === 'string' ? sharedPackFor(url, platform) : null;
  const valid = pack !== null;

  useEffect(() => {
    if (!valid) router.back();
  }, [valid, router]);

  if (!pack || typeof url !== 'string') return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'bottom', 'left', 'right']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.hairline }}>
        <AppText variant="heading">Shared with you</AppText>
        <Button label="Done" variant="ghost" onPress={() => router.back()} style={{ minHeight: 44, paddingVertical: 0, paddingHorizontal: spacing.md }} />
      </View>
      <PlatformWebView pack={pack} lockedUrl={url} showProgress />
    </SafeAreaView>
  );
}
