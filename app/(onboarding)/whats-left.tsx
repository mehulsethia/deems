import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useReducedMotion } from 'react-native-reanimated';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { MockApp, PEELABLE } from '@/components/onboarding/MockApp';
import { Screen } from '@/components/Screen';
import { tick } from '@/motion/haptics';
import { progressFor } from '@/state/onboardingSteps';
import { spacing } from '@/theme/tokens';

export default function WhatsLeft() {
  const router = useRouter();
  const reduce = useReducedMotion();
  // Reduce Motion shows the final state straight away.
  const [peeled, setPeeled] = useState(reduce ? PEELABLE : 0);

  const peel = () => {
    tick();
    setPeeled((p) => Math.min(PEELABLE, p + 1));
  };

  return (
    <Screen scroll progress={progressFor('whats-left')} footer={<Button label="Connect my accounts" onPress={() => router.push('/(onboarding)/trust')} />}>
      <View style={{ gap: spacing.xl, paddingBottom: spacing.lg }}>
        <AppText variant="title">Messages. Your friends' stories. That's the whole app.</AppText>
        <MockApp peeled={peeled} onPeel={peel} />
      </View>
    </Screen>
  );
}
