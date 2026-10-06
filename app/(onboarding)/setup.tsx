import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Checklist } from '@/components/Checklist';
import { Screen } from '@/components/Screen';
import { spacing } from '@/theme/tokens';

const items = ['Feed hidden', 'Reels hidden', 'Explore hidden', 'Messages kept', 'Stories kept'];

export default function Setup() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const done = useCallback(() => setReady(true), []);
  return (
    <Screen scroll footer={<Button label="Continue" disabled={!ready} onPress={() => router.push('/(onboarding)/reveal')} />}>
      <View style={{ flex: 1, justifyContent: 'center', gap: spacing.xl, paddingBottom: spacing.lg }}>
        <AppText variant="title">Setting up your Hearth</AppText>
        <Checklist items={items} stepMs={600} onDone={done} />
      </View>
    </Screen>
  );
}
