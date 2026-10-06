import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useReducedMotion } from 'react-native-reanimated';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { MockApp, PEELABLE } from '@/components/onboarding/MockApp';
import { Screen } from '@/components/Screen';
import { tick } from '@/motion/haptics';
import { progressFor } from '@/state/onboardingSteps';

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
    <Screen
      progress={progressFor('whats-left')}
      paneFirst={false}
      pane={<MockApp peeled={peeled} onPeel={peel} />}
      footer={<Button label="Connect my accounts" onPress={() => router.push('/(onboarding)/trust')} />}
    >
      <AppText variant="title">Messages. Your friends' stories. That's the whole app.</AppText>
    </Screen>
  );
}
