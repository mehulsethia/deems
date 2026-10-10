import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { Easing, FadeIn, useAnimatedReaction, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { AnimatedHeadline } from '@/components/AnimatedHeadline';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Receipt } from '@/components/onboarding/Receipt';
import { Screen } from '@/components/Screen';
import { formatDaysCaps, formatDuration } from '@/onboarding/maths';
import { useBreakdown, useToday } from '@/onboarding/useAnswers';
import { progressFor } from '@/state/onboardingSteps';
import { motion, sizes, spacing } from '@/theme/tokens';

const COUNT_MS = 1100;

export default function Year() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const b = useBreakdown();
  const today = useToday();
  const [shown, setShown] = useState(reduce ? b.days : 0);
  const [done, setDone] = useState(reduce);

  // Count up from 0 once the PER YEAR line has printed.
  const n = useSharedValue(reduce ? b.days : 0);
  useAnimatedReaction(
    () => Math.round(n.value),
    (v, prev) => {
      if (v !== prev) scheduleOnRN(setShown, v);
    },
  );
  const startCount = () => {
    if (reduce) return;
    n.value = withTiming(b.days, { duration: COUNT_MS, easing: Easing.out(Easing.cubic) }, (finished) => {
      if (finished) scheduleOnRN(setDone, true);
    });
  };

  return (
    <Screen
      progress={progressFor('year')}
      /* "0 DAYS" is never displayed: the figure appears from 1 upwards. */
      pane={<Receipt b={b} date={today} showYear printedAtStart={6} yearText={formatDaysCaps(shown) ?? ''} onPrinted={startCount} />}
      footer={
        done ? (
          <Animated.View entering={FadeIn.duration(motion.base)}>
            <Button label="And now" onPress={() => router.push('/(onboarding)/refund')} />
          </Animated.View>
        ) : (
          <View style={{ height: sizes.button }} />
        )
      }
    >
      {done && (
          <Animated.View entering={FadeIn.duration(motion.slow)} style={{ gap: spacing.md }}>
            <AnimatedHeadline live>{`That's ${b.days} full days a year. Not talking to a single person.`}</AnimatedHeadline>
            <AppText variant="small" muted>{formatDuration(b.other)} a day x 365 days</AppText>
          </Animated.View>
        )}
    </Screen>
  );
}
