import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { DurationSlider } from '@/components/onboarding/DurationSlider';
import { Screen } from '@/components/Screen';
import { clampTalking, clampTotal, TOTAL_RANGE } from '@/onboarding/maths';
import { progressFor } from '@/state/onboardingSteps';
import { readProgress, saveTalking, saveTotal } from '@/state/progress';
import { spacing } from '@/theme/tokens';

export default function TotalTime() {
  const router = useRouter();
  const [total, setTotal] = useState(() => clampTotal(readProgress().totalMinutes ?? TOTAL_RANGE.initial));

  const next = () => {
    saveTotal(total);
    // A lower total caps an earlier talking answer.
    const talking = readProgress().talkingMinutes;
    if (talking !== null) saveTalking(clampTalking(talking, total));
    router.push('/(onboarding)/talking-time');
  };

  return (
    <Screen scroll progress={progressFor('total-time')} footer={<Button label="Next" onPress={next} />}>
      <View style={{ flex: 1, gap: spacing.xxl, paddingBottom: spacing.lg }}>
        <AppText variant="title">How long do these apps get from you a day?</AppText>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <DurationSlider
            label="Time a day on these apps"
            min={TOTAL_RANGE.min}
            max={TOTAL_RANGE.max}
            step={TOTAL_RANGE.step}
            value={total}
            onChange={setTotal}
          />
        </View>
      </View>
    </Screen>
  );
}
