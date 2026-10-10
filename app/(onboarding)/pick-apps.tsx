import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { AnimatedHeadline } from '@/components/AnimatedHeadline';
import { Button } from '@/components/Button';
import { AppTile } from '@/components/onboarding/AppTile';
import { Screen } from '@/components/Screen';
import { select } from '@/motion/haptics';
import type { PlatformId } from '@/rules/types';
import { progressFor } from '@/state/onboardingSteps';
import { normalisePicked, PICK_ORDER } from '@/state/platformMeta';
import { readProgress, savePicked } from '@/state/progress';
import { spacing } from '@/theme/tokens';

export default function PickApps() {
  const router = useRouter();
  const [picked, setPicked] = useState<PlatformId[]>(() => readProgress().picked);

  const toggle = (id: PlatformId) => {
    select();
    setPicked((p) => normalisePicked(p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  };

  const next = () => {
    savePicked(picked);
    router.push('/(onboarding)/total-time');
  };

  return (
    <Screen
      centred
      progress={progressFor('pick-apps')}
      paneFirst={false}
      pane={
        <View style={{ gap: spacing.md }}>
          {PICK_ORDER.map((id) => (
            <AppTile key={id} id={id} selected={picked.includes(id)} onToggle={() => toggle(id)} />
          ))}
        </View>
      }
      footer={<Button label="Next" disabled={picked.length === 0} onPress={next} />}
    >
      <AnimatedHeadline>Where do your people message you?</AnimatedHeadline>
    </Screen>
  );
}
