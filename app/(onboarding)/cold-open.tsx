import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { ClockFace } from '@/components/onboarding/ClockFace';
import { NotificationBanner } from '@/components/onboarding/NotificationBanner';
import { Screen } from '@/components/Screen';
import { tick } from '@/motion/haptics';
import { progressFor } from '@/state/onboardingSteps';
import { motion, sizes, spacing } from '@/theme/tokens';
import { useLayout } from '@/theme/useLayout';

const MINUTES_LATER = 47;

export default function ColdOpen() {
  const router = useRouter();
  const { spread, contentWidth, height } = useLayout();
  // The clock fits the room it has: smaller on short or narrow screens, never tiny.
  const clock = Math.round(Math.max(120, Math.min(240, (spread ? contentWidth / 2 : contentWidth) * 0.55, height * 0.28)));
  const [spun, setSpun] = useState(false);
  const [settled, setSettled] = useState(false);

  const settle = () => {
    tick();
    setSettled(true);
  };

  const headline = settled ? 'That was 47 minutes ago.' : 'You opened the app to answer this.';
  const headlineView = (
    <Animated.View key={headline} entering={FadeIn.duration(motion.base)} exiting={FadeOut.duration(motion.fast)}>
      <AppText variant="display" accessibilityLiveRegion="polite">{headline}</AppText>
    </Animated.View>
  );

  return (
    <Screen
      back={false}
      progress={progressFor('cold-open')}
      footer={
        settled ? (
          <Animated.View entering={FadeIn.duration(motion.base)}>
            <Button label="Every time." onPress={() => router.push('/(onboarding)/pick-apps')} />
          </Animated.View>
        ) : (
          <View style={{ height: sizes.button }} />
        )
      }
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={settled ? headline : `${headline} Tap to see when.`}
        accessibilityState={{ disabled: spun }}
        disabled={spun}
        onPress={() => setSpun(true)}
        style={{ flexGrow: 1, flexDirection: spread ? 'row' : 'column', alignItems: spread ? 'center' : 'stretch', gap: spread ? spacing.xxl : spacing.xl }}
      >
        <View style={{ flex: spread ? 1 : undefined, gap: spacing.xl }}>
          <NotificationBanner sender="maya" text="you free sat?" />
          {spread && headlineView}
        </View>
        <View style={{ flex: 1, minHeight: clock, justifyContent: 'center', alignItems: 'center' }}>
          {spun && (
            <Animated.View entering={FadeIn.duration(motion.fast)}>
              <ClockFace size={clock} spun={spun} minutes={MINUTES_LATER} onSettled={settle} />
            </Animated.View>
          )}
        </View>
        {!spread && headlineView}
      </Pressable>
    </Screen>
  );
}
