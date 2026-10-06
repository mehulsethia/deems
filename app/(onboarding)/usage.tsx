import { useState } from 'react';
import { View } from 'react-native';
import Slider from '@react-native-community/slider';
import { useRouter } from 'expo-router';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { formatMinutes, formatNumber, sanitize } from '@/onboarding/projection';
import { readProgress, saveUsage } from '@/state/progress';
import { fonts, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/ThemeProvider';

function SliderRow(props: {
  question: string;
  valueText: string;
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
}) {
  const { colors } = useTheme();
  return (
    <Card style={{ gap: spacing.sm }}>
      <AppText variant="bodyMedium">{props.question}</AppText>
      <AppText variant="display" accessibilityRole="text" style={{ fontFamily: fonts.heading }}>
        {props.valueText}
      </AppText>
      <Slider
        accessibilityLabel={props.label}
        accessibilityValue={{ text: props.valueText }}
        style={{ height: 44 }}
        minimumValue={props.min}
        maximumValue={props.max}
        step={props.step}
        value={props.value}
        onValueChange={props.onChange}
        minimumTrackTintColor={colors.primary}
        maximumTrackTintColor={colors.border}
        thumbTintColor={colors.accent}
      />
    </Card>
  );
}

export default function Usage() {
  const router = useRouter();
  const saved = readProgress();
  const [hours, setHours] = useState(saved.usageHours ?? 2);
  const [minutes, setMinutes] = useState(saved.messagingMinutes ?? 15);

  const clean = sanitize({ hoursPerDay: hours, messagingMinutesPerDay: minutes });
  const maxMinutes = Math.max(5, Math.min(240, clean.hoursPerDay * 60));

  const next = () => {
    saveUsage(clean.hoursPerDay, clean.messagingMinutesPerDay);
    router.push('/(onboarding)/calculating');
  };

  return (
    <Screen scroll footer={<Button label="Continue" onPress={next} />}>
      <View style={{ gap: spacing.lg, paddingBottom: spacing.lg }}>
        <AppText variant="title">Be honest. Nobody's watching.</AppText>
        <SliderRow
          question="How many hours a day are you on Instagram?"
          label="Hours per day on Instagram"
          valueText={`${formatNumber(hours)} ${hours === 1 ? 'hour' : 'hours'}`}
          min={0.5}
          max={12}
          step={0.5}
          value={hours}
          onChange={(v) => {
            setHours(v);
            setMinutes((m) => Math.min(m, v * 60));
          }}
        />
        <SliderRow
          question="How much of that is actually messaging people?"
          label="Minutes per day spent messaging"
          valueText={formatMinutes(Math.min(minutes, maxMinutes))}
          min={0}
          max={maxMinutes}
          step={5}
          value={Math.min(minutes, maxMinutes)}
          onChange={setMinutes}
        />
      </View>
    </Screen>
  );
}
