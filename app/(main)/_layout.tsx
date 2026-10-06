import { Redirect, Stack } from 'expo-router';
import { FullScreenLoader } from '@/components/Loader';
import { FEATURES } from '@/config/features';
import { usePayments } from '@/purchases/PaymentsProvider';
import { colors } from '@/theme/tokens';

export default function MainLayout() {
  const { ready, isPro } = usePayments();

  // Entitlement "pro" gates the inbox once the paywall is switched on.
  if (FEATURES.paywall && ready && !isPro) return <Redirect href="/paywall" />;
  if (FEATURES.paywall && !ready) return <FullScreenLoader />;

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
      <Stack.Screen name="post" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
