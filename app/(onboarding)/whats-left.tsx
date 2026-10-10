import { useRouter } from 'expo-router';
import { AnimatedHeadline } from '@/components/AnimatedHeadline';
import { Button } from '@/components/Button';
import { InstagramInbox } from '@/components/onboarding/InstagramInbox';
import { Screen } from '@/components/Screen';
import { progressFor } from '@/state/onboardingSteps';

export default function WhatsLeft() {
  const router = useRouter();
  return (
    <Screen
      progress={progressFor('whats-left')}
      paneFirst={false}
      pane={<InstagramInbox />}
      footer={<Button label="Connect my accounts" onPress={() => router.push('/(onboarding)/trust')} />}
    >
      <AnimatedHeadline>{"Only your DMs. That's the whole app."}</AnimatedHeadline>
    </Screen>
  );
}
