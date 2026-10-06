import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Receipt } from '@/components/onboarding/Receipt';
import { Screen } from '@/components/Screen';
import { skipsYear } from '@/onboarding/maths';
import { useBreakdown, useToday } from '@/onboarding/useAnswers';
import { progressFor } from '@/state/onboardingSteps';
import { motion, sizes, spacing } from '@/theme/tokens';

export default function ReceiptScreen() {
  const router = useRouter();
  const b = useBreakdown();
  const today = useToday();
  const skip = skipsYear(b);
  const [printed, setPrinted] = useState(false);

  const line = skip ? "You're already mostly here to talk. Deems keeps it that way." : `${b.percent}% of your time here isn't with anyone.`;

  return (
    <Screen
      scroll
      progress={progressFor('receipt')}
      footer={
        printed ? (
          <Animated.View entering={FadeIn.duration(motion.base)}>
            <Button label="Keep going" onPress={() => router.push(skip ? '/(onboarding)/whats-left' : '/(onboarding)/year')} />
          </Animated.View>
        ) : (
          <View style={{ height: sizes.button }} />
        )
      }
    >
      <View style={{ gap: spacing.xl, paddingBottom: spacing.lg }}>
        <Receipt b={b} date={today} slideIn onPrinted={() => setPrinted(true)} />
        {printed && (
          <Animated.View entering={FadeIn.duration(motion.slow)}>
            <AppText variant="title" accessibilityLiveRegion="polite">{line}</AppText>
          </Animated.View>
        )}
      </View>
    </Screen>
  );
}
