import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { Fraunces_400Regular, Fraunces_600SemiBold } from '@expo-google-fonts/fraunces';
import {
  InstrumentSans_400Regular,
  InstrumentSans_500Medium,
  InstrumentSans_600SemiBold,
} from '@expo-google-fonts/instrument-sans';
import { PaymentsProvider } from '@/purchases/PaymentsProvider';
import { ThemeProvider, useTheme } from '@/theme/ThemeProvider';

SplashScreen.preventAutoHideAsync();

function Navigator() {
  const { scheme, colors } = useTheme();
  return (
    <>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(main)" options={{ gestureEnabled: false }} />
        <Stack.Screen name="paywall" options={{ presentation: 'modal' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Fraunces_400Regular,
    Fraunces_600SemiBold,
    InstrumentSans_400Regular,
    InstrumentSans_500Medium,
    InstrumentSans_600SemiBold,
  });

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <ThemeProvider>
      <PaymentsProvider>
        <Navigator />
      </PaymentsProvider>
    </ThemeProvider>
  );
}
