import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { hasSocialProof, socialProof } from '@/config/socialProof';
import { spacing } from '@/theme/tokens';

export default function Connect() {
  const router = useRouter();
  return (
    <Screen scroll footer={<Button label="Sign in on instagram.com" onPress={() => router.push('/(onboarding)/login')} />}>
      <View style={{ gap: spacing.lg, paddingBottom: spacing.lg }}>
        <AppText variant="title">Connect your Instagram</AppText>
        <AppText>
          You'll sign in on Instagram's own page, shown inside Hearth. Hearth never sees your password, and it
          doesn't read or store your messages. Your session stays on this device.
        </AppText>

        {hasSocialProof() && (
          <View style={{ gap: spacing.md }}>
            {socialProof.userCount ? (
              <AppText variant="bodyMedium">{socialProof.userCount.toLocaleString()} people use Hearth</AppText>
            ) : null}
            {socialProof.testimonials.map((t) => (
              <Card key={t.attribution + t.quote} style={{ gap: spacing.sm }}>
                <AppText>“{t.quote}”</AppText>
                <AppText variant="small" muted>{t.attribution}</AppText>
              </Card>
            ))}
          </View>
        )}
      </View>
    </Screen>
  );
}
