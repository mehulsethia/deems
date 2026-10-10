import { useState } from 'react';
import { useRouter } from 'expo-router';
import { AnimatedHeadline } from '@/components/AnimatedHeadline';
import { Button } from '@/components/Button';
import { DurationSlider } from '@/components/onboarding/DurationSlider';
import { GlassCard } from '@/components/GlassCard';
import { Screen } from '@/components/Screen';
import { clampTalking, clampTotal, TOTAL_RANGE } from '@/onboarding/maths';
import { progressFor } from '@/state/onboardingSteps';
import { spacing } from '@/theme/tokens';
import { readProgress, saveTalking, saveTotal } from '@/state/progress';

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
    <Screen
      progress={progressFor('total-time')}
      paneFirst={false}
      centred
      pane={
        <GlassCard style={{ paddingVertical: spacing.xl }}>
        <DurationSlider
          label="Time a day on these apps"
          min={TOTAL_RANGE.min}
          max={TOTAL_RANGE.max}
          step={TOTAL_RANGE.step}
          value={total}
          onChange={setTotal}
        />
        </GlassCard>
      }
      footer={<Button label="Next" onPress={next} />}
    >
      <AnimatedHeadline>How long do these apps get from you a day?</AnimatedHeadline>
    </Screen>
  );
}
