import { View } from 'react-native';
import { spacing } from '@/theme/tokens';
import { OnlyDMMark } from './OnlyDMMark';
import { Wordmark } from './Wordmark';

/** Mark plus wordmark, read as "OnlyDM". */
export function Logo({ size = 24 }: { size?: number }) {
  return (
    <View accessible accessibilityRole="header" accessibilityLabel="OnlyDM" style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
      <OnlyDMMark size={size} />
      <Wordmark variant="heading" />
    </View>
  );
}
