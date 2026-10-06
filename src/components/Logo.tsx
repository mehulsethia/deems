import { View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { colors, spacing } from '@/theme/tokens';
import { AppText } from './AppText';

/**
 * Deems mark: a lowercase "d" whose bowl is a speech bubble.
 * Same geometry as the app icon (assets/brand/source/mark.js).
 */
export function Mark({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="10 8 72 84" accessible={false}>
      <Path d="M58 20 A10 10 0 0 1 78 20 V88 H58 Z" fill={colors.keep} />
      <Circle cx={44} cy={61} r={27} fill={colors.keep} />
      <Path d="M23 75 L15 89 L33 84 Z" fill={colors.keep} stroke={colors.keep} strokeWidth={3} strokeLinejoin="round" />
      <Circle cx={44} cy={61} r={11} fill={colors.background} />
    </Svg>
  );
}

/** Mark plus wordmark. */
export function Logo({ size = 24 }: { size?: number }) {
  return (
    <View accessible accessibilityRole="header" accessibilityLabel="Deems" style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
      <Mark size={size} />
      <AppText variant="heading">Deems</AppText>
    </View>
  );
}
