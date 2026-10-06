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

const MINUTES_LATER = 47;

export default function ColdOpen() {
  const router = useRouter();
  const [spun, setSpun] = useState(false);
  const [settled, setSettled] = useState(false);

  const settle = () => {
    tick();
    setSettled(true);
  };

  const headline = settled ? 'That was 47 minutes ago.' : 'You opened the app to answer this.';

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
        style={{ flex: 1, gap: spacing.xl }}
      >
        <NotificationBanner sender="maya" text="you free sat?" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {spun && (
            <Animated.View entering={FadeIn.duration(motion.fast)}>
              <ClockFace spun={spun} minutes={MINUTES_LATER} onSettled={settle} />
            </Animated.View>
          )}
        </View>
        <Animated.View key={headline} entering={FadeIn.duration(motion.base)} exiting={FadeOut.duration(motion.fast)}>
          <AppText variant="display" accessibilityLiveRegion="polite">{headline}</AppText>
        </Animated.View>
      </Pressable>
    </Screen>
  );
}
