import { Pressable } from 'react-native';
import { colors, sizes, spacing } from '@/theme/tokens';
import { AppText } from './AppText';
import { BackIcon } from './Icons';

/** Shown while a story plays, so there is always a way back to messages. */
export function StoriesBackBar({ onBack }: { onBack: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Back to messages"
      onPress={onBack}
      style={{ minHeight: sizes.touch, flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.md }}
    >
      <BackIcon size={20} color={colors.text} />
      <AppText variant="bodyMedium">Back to messages</AppText>
    </Pressable>
  );
}
