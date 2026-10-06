import Svg, { Path } from 'react-native-svg';
import { useTheme } from '@/theme/ThemeProvider';

/** Hearth mark: a pink flame inside a violet speech bubble. */
export function Logo({ size = 96 }: { size?: number }) {
  const { colors } = useTheme();
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" accessibilityLabel="Hearth logo" accessibilityRole="image">
      <Path
        d="M30 14 H70 A22 22 0 0 1 92 36 V52 A22 22 0 0 1 70 74 H46 L30 90 V74 A22 22 0 0 1 8 52 V36 A22 22 0 0 1 30 14 Z"
        fill="none"
        stroke={colors.primary}
        strokeWidth={6}
        strokeLinejoin="round"
      />
      <Path
        d="M50 26 C58 34 64 40 64 48 C64 56 58 62 50 62 C42 62 36 56 36 48 C36 43 39 40 42 37 C43 41 45 43 47 43 C47 36 48 31 50 26 Z"
        fill={colors.accent}
      />
    </Svg>
  );
}
