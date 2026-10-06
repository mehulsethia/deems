import { View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { Easing, FadeIn, FadeInDown } from 'react-native-reanimated';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Logo } from '@/components/Logo';
import { Screen } from '@/components/Screen';
import { motion, spacing } from '@/theme/tokens';

const ease = Easing.out(Easing.cubic);

export default function Welcome() {
  const router = useRouter();
  return (
    <Screen
      back={false}
      scroll
      footer={<Button label="Get started" onPress={() => router.push('/(onboarding)/usage')} />}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing.lg, paddingVertical: spacing.lg }}>
        <Animated.View entering={FadeIn.duration(motion.slow).easing(ease)}>
          <Logo size={112} />
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(150).duration(motion.slow).easing(ease)} style={{ gap: spacing.md }}>
          <AppText variant="display" center>
            Just the people. None of the scroll.
          </AppText>
          <AppText muted center>
            Your Instagram messages and friends' stories, nothing else.
          </AppText>
        </Animated.View>
      </View>
    </Screen>
  );
}
