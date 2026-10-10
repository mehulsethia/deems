import { useEffect } from 'react';
import { Stack, useSegments } from 'expo-router';
import { saveStep } from '@/state/progress';
import { isOnboardingStep } from '@/state/onboardingSteps';
import { motion } from '@/theme/tokens';

/** The receipt "stays" across these screens, so they cross-fade instead of sliding. */
const RECEIPT_SCREENS = ['receipt', 'year', 'refund'] as const;

export default function OnboardingLayout() {
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
        gestureEnabled: true,
        fullScreenGestureEnabled: true,
        animationDuration: motion.base,
        contentStyle: { backgroundColor: 'transparent' },
      }}
    >
      {RECEIPT_SCREENS.map((name) => (
        <Stack.Screen key={name} name={name} options={{ animation: 'fade' }} />
      ))}
      <Stack.Screen name="login" options={{ presentation: 'fullScreenModal' }} />
      <Stack.Screen name="reveal" options={{ animation: 'fade' }} />
    </Stack>
  );
}
