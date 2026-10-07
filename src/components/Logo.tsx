import { View } from 'react-native';
import { spacing } from '@/theme/tokens';
import { DeemsMark } from './DeemsMark';
import { Wordmark } from './Wordmark';

/** Mark plus wordmark, read as "Deems". */
export function Logo({ size = 24 }: { size?: number }) {
  return (
    <View accessible accessibilityRole="header" accessibilityLabel="Deems" style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
      <DeemsMark size={size} />
      <Wordmark variant="heading" />
    </View>
  );
}
