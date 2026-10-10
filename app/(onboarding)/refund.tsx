import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { AnimatedHeadline } from '@/components/AnimatedHeadline';
import { Button } from '@/components/Button';
import { Receipt } from '@/components/onboarding/Receipt';
import { Screen } from '@/components/Screen';
import { formatDuration } from '@/onboarding/maths';
import { useBreakdown, useToday } from '@/onboarding/useAnswers';
import { progressFor } from '@/state/onboardingSteps';
import { motion, sizes } from '@/theme/tokens';

export default function Refund() {
  const router = useRouter();
  const b = useBreakdown();
  const today = useToday();
  const [stamped, setStamped] = useState(false);

  return (
    <Screen
      progress={progressFor('refund')}
      pane={<Receipt b={b} date={today} showYear printedAtStart={7} refunded onStamped={() => setStamped(true)} />}
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
      {stamped && (
          <Animated.View entering={FadeIn.duration(motion.slow)}>
            <AnimatedHeadline>{`Keep the ${formatDuration(b.talking)}. Refund the rest.`}</AnimatedHeadline>
          </Animated.View>
        )}
    </Screen>
  );
}
