import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { DurationSlider } from '@/components/onboarding/DurationSlider';
import { Screen } from '@/components/Screen';
import { clampTalking, clampTotal, TALKING_RANGE, TOTAL_RANGE } from '@/onboarding/maths';
import { progressFor } from '@/state/onboardingSteps';
import { readProgress, saveTalking } from '@/state/progress';
import { spacing } from '@/theme/tokens';

export default function TalkingTime() {
  const router = useRouter();
  const [total] = useState(() => clampTotal(readProgress().totalMinutes ?? TOTAL_RANGE.initial));
  const [talking, setTalking] = useState(() => clampTalking(readProgress().talkingMinutes ?? TALKING_RANGE.initial, total));

  const next = () => {
    saveTalking(clampTalking(talking, total));
    router.push('/(onboarding)/receipt');
  };

  return (
    <Screen scroll progress={progressFor('talking-time')} footer={<Button label="Add it up" onPress={next} />}>
      <View style={{ flex: 1, gap: spacing.xxl, paddingBottom: spacing.lg }}>
        <AppText variant="title">How much of that is actually talking to someone?</AppText>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <DurationSlider
            label="Time a day talking to someone"
            min={TALKING_RANGE.min}
            max={total}
            step={TALKING_RANGE.step}
            value={talking}
            onChange={setTalking}
          />
        </View>
      </View>
    </Screen>
  );
}
