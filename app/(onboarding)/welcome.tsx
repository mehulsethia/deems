import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Logo } from '@/components/Logo';
import { Screen } from '@/components/Screen';
import { spacing } from '@/theme/tokens';

export default function Welcome() {
  const router = useRouter();
  return (
    <Screen back={false}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing.lg }}>
        <Logo size={112} />
        <AppText variant="display" center>
          Just the people. None of the scroll.
        </AppText>
        <AppText muted center>
          Your Instagram messages and friends' stories, nothing else.
        </AppText>
      </View>
      <View style={{ paddingBottom: spacing.lg }}>
        <Button label="Get started" onPress={() => router.push('/(onboarding)/usage')} />
      </View>
    </Screen>
  );
}
