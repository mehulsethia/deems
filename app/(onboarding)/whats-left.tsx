import { useRouter } from 'expo-router';
import { AppText } from '@/components/AppText';
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
      <AppText variant="title">Only your DMs. That's the whole app.</AppText>
    </Screen>
  );
}
