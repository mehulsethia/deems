import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Receipt } from '@/components/onboarding/Receipt';
import { Screen } from '@/components/Screen';
import { formatDuration } from '@/onboarding/maths';
import { useBreakdown, useToday } from '@/onboarding/useAnswers';
import { progressFor } from '@/state/onboardingSteps';
import { motion, sizes, spacing } from '@/theme/tokens';

export default function Refund() {
  const router = useRouter();
  const b = useBreakdown();
  const today = useToday();
  const [stamped, setStamped] = useState(false);

  return (
    <Screen
      scroll
      progress={progressFor('refund')}
      footer={
        stamped ? (
          <Animated.View entering={FadeIn.duration(motion.base)}>
            <Button label="Show me" onPress={() => router.push('/(onboarding)/whats-left')} />
          </Animated.View>
        ) : (
          <View style={{ height: sizes.button }} />
        )
      }
    >
      <View style={{ gap: spacing.xl, paddingBottom: spacing.lg }}>
        <Receipt b={b} date={today} showYear printedAtStart={7} refunded onStamped={() => setStamped(true)} />
        {stamped && (
          <Animated.View entering={FadeIn.duration(motion.slow)}>
            <AppText variant="title" accessibilityLiveRegion="polite">
              Keep the {formatDuration(b.talking)}. Refund the rest.
            </AppText>
          </Animated.View>
        )}
      </View>
    </Screen>
  );
}
