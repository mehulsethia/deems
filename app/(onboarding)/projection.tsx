import { View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { Easing, FadeIn } from 'react-native-reanimated';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { formatDuration, formatNumber, HORIZON_YEARS, projection } from '@/onboarding/projection';
import { readProgress } from '@/state/progress';
import { fonts, motion, spacing } from '@/theme/tokens';

export default function Projection() {
  const router = useRouter();
  const p = readProgress();
  const result = projection({ hoursPerDay: p.usageHours ?? 0, messagingMinutesPerDay: p.messagingMinutes ?? 0 });
  const none = result.years === 0;
  const spoken = none
    ? `At this pace, you'd spend almost none of the next ${HORIZON_YEARS} years scrolling.`
    : `At this pace, that's about ${formatDuration(result.duration)} of scrolling over the next ${HORIZON_YEARS} years.`;

  return (
    <Screen scroll footer={<Button label="Continue" onPress={() => router.push('/(onboarding)/comparison')} />}>
      <View style={{ flex: 1, justifyContent: 'center', gap: spacing.md, paddingBottom: spacing.lg }} accessible accessibilityLabel={`${spoken} ${result.formula}`}>
        {none ? (
          <AppText variant="title">{spoken}</AppText>
        ) : (
          <>
            <AppText variant="heading" muted>At this pace, that's about</AppText>
            <Animated.View entering={FadeIn.duration(motion.slow).easing(Easing.out(Easing.cubic))}>
              <AppText accent style={{ fontFamily: fonts.heading, fontSize: 88, lineHeight: 96 }} accessibilityRole="text" maxFontSizeMultiplier={1.2}>
                {formatNumber(result.duration.value)}
              </AppText>
              <AppText variant="title" accent>{result.duration.unit}</AppText>
            </Animated.View>
            <AppText variant="heading">of scrolling over the next {HORIZON_YEARS} years.</AppText>
          </>
        )}
        <AppText variant="caption" muted>{result.formula}</AppText>
      </View>
    </Screen>
  );
}
