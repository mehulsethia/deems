import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { AnimatedBar } from '@/components/AnimatedBar';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { comparison, formatMinutes } from '@/onboarding/projection';
import { readProgress } from '@/state/progress';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/ThemeProvider';

export default function Comparison() {
  const router = useRouter();
  const { colors } = useTheme();
  const p = readProgress();
  const c = comparison({ hoursPerDay: p.usageHours ?? 0, messagingMinutesPerDay: p.messagingMinutes ?? 0 });

  return (
    <Screen scroll footer={<Button label="Continue" onPress={() => router.push('/(onboarding)/what-stays')} />}>
      <View style={{ gap: spacing.lg, paddingBottom: spacing.lg }}>
        <AppText variant="title">Your day, with and without the scroll</AppText>
        <Card style={{ gap: spacing.lg }}>
          <View style={{ gap: spacing.sm }} accessible accessibilityLabel={`Now: ${formatMinutes(c.nowMinutes)} a day`}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <AppText variant="bodyMedium">Now</AppText>
              <AppText variant="bodyMedium">{formatMinutes(c.nowMinutes)} / day</AppText>
            </View>
            <AnimatedBar ratio={c.nowMinutes === 0 ? 0 : 1} color={colors.muted} track={colors.border} />
          </View>
          <View style={{ gap: spacing.sm }} accessible accessibilityLabel={`Messaging only: ${formatMinutes(c.messagingMinutes)} a day`}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <AppText variant="bodyMedium">Messaging only</AppText>
              <AppText variant="bodyMedium" accent>{formatMinutes(c.messagingMinutes)} / day</AppText>
            </View>
            <AnimatedBar ratio={c.messagingRatio} color={colors.accent} track={colors.border} delay={250} />
          </View>
        </Card>
        {c.savedMinutesPerDay > 0 && (
          <AppText muted>That's {formatMinutes(c.savedMinutesPerDay)} back every day.</AppText>
        )}
      </View>
    </Screen>
  );
}
