import Svg, { Circle, Path } from 'react-native-svg';
import { avatarTints } from '@/theme/tokens';
import { useTheme } from '@/theme/ThemeProvider';

/** Drawn avatar (head and shoulders) for the illustrated mock screens; never a photo. */
export function Avatar({ size = 44, tint = 0, ring = false }: { size?: number; tint?: number; ring?: boolean }) {
  const { colors } = useTheme();
  const bg = avatarTints[tint % avatarTints.length];
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" accessible={false}>
      <Circle cx={24} cy={24} r={ring ? 21 : 24} fill={bg} />
      <Circle cx={24} cy={19} r={7} fill={colors.card} opacity={0.9} />
      <Path d="M10 40c1-8 7-12 14-12s13 4 14 12a21 21 0 01-28 0z" fill={colors.card} opacity={0.9} />
      {ring && <Circle cx={24} cy={24} r={22.5} fill="none" stroke={colors.accent} strokeWidth={2} />}
    </Svg>
  );
}
