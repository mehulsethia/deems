import { Stack } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import { motion } from '@/theme/tokens';

export default function OnboardingLayout() {
  const { colors } = useTheme();
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
