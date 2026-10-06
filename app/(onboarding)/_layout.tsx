import { useEffect } from 'react';
import { Stack, useSegments } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import { motion } from '@/theme/tokens';
import { saveStep } from '@/state/progress';
import { isOnboardingStep } from '@/state/onboardingSteps';

export default function OnboardingLayout() {
  const { colors } = useTheme();
  const segments = useSegments();
  const current = segments[segments.length - 1];

  // Persist progress so a relaunch resumes where the user left off.
  useEffect(() => {
    if (isOnboardingStep(current) && current !== 'login') saveStep(current);
  }, [current]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animationDuration: motion.base,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="login" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
