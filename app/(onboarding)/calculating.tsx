import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Checklist } from '@/components/Checklist';
import { Screen } from '@/components/Screen';
import { formatMinutes, formatNumber, HORIZON_YEARS, sanitize, scrollMinutesPerDay } from '@/onboarding/projection';
import { readProgress } from '@/state/progress';
import { spacing } from '@/theme/tokens';

export default function Calculating() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const p = readProgress();
  const input = sanitize({ hoursPerDay: p.usageHours ?? 0, messagingMinutesPerDay: p.messagingMinutes ?? 0 });
  const items = [
    `${formatNumber(input.hoursPerDay)} ${input.hoursPerDay === 1 ? 'hour' : 'hours'} a day on Instagram`,
    `${formatMinutes(input.messagingMinutesPerDay)} of that is messaging`,
    `The other ${formatMinutes(scrollMinutesPerDay(input))} is scrolling`,
    `Looking ${HORIZON_YEARS} years ahead`,
  ];
  const done = useCallback(() => setReady(true), []);

  return (
    <Screen scroll footer={<Button label="See the number" disabled={!ready} onPress={() => router.push('/(onboarding)/projection')} />}>
      <View style={{ flex: 1, justifyContent: 'center', gap: spacing.xl, paddingBottom: spacing.lg }}>
        <AppText variant="title">Doing the maths</AppText>
        <Checklist items={items} onDone={done} />
      </View>
    </Screen>
  );
}
