import { View } from 'react-native';
import { Href, useRouter } from 'expo-router';
import { spacing } from '@/theme/tokens';
import { AppText } from './AppText';
import { Button } from './Button';
import { Screen } from './Screen';

interface Props {
  title: string;
  note: string;
  next?: { label: string; href: Href };
}

/** Navigation-skeleton stand-in; each screen is replaced in its own milestone. */
export function PlaceholderScreen({ title, note, next }: Props) {
  const router = useRouter();
  return (
    <Screen>
      <View style={{ flex: 1, justifyContent: 'center', gap: spacing.md }}>
        <AppText variant="title">{title}</AppText>
        <AppText muted>{note}</AppText>
      </View>
      {next && (
        <View style={{ paddingBottom: spacing.lg }}>
          <Button label={next.label} onPress={() => router.push(next.href)} />
        </View>
      )}
    </Screen>
  );
}
