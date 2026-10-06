import { Redirect, Stack } from 'expo-router';
import { FEATURES } from '@/config/features';
import { usePayments } from '@/purchases/PaymentsProvider';
import { colors } from '@/theme/tokens';

export default function MainLayout() {
  const { ready, isPro } = usePayments();

  // Entitlement "pro" gates the inbox once the paywall is switched on.
  if (FEATURES.paywall && ready && !isPro) return <Redirect href="/paywall" />;
  if (FEATURES.paywall && !ready) return null;

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
      <Stack.Screen name="post" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
