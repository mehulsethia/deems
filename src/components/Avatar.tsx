import Svg, { Circle, Path } from 'react-native-svg';
import { avatarTints, colors } from '@/theme/tokens';

/** Drawn avatar (head and shoulders) for the illustrations; never a photo. */
export function Avatar({ size = 44, tint = 0, ring = false }: { size?: number; tint?: number; ring?: boolean }) {
  const bg = avatarTints[tint % avatarTints.length];
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" accessible={false}>
      <Circle cx={24} cy={24} r={ring ? 19.5 : 24} fill={bg} />
      <Circle cx={24} cy={19} r={6.5} fill={colors.ink} opacity={0.85} />
      <Path d="M12 38c1-7 6-10.5 12-10.5S35 31 36 38a19.5 19.5 0 01-24 0z" fill={colors.ink} opacity={0.85} />
      {ring && <Circle cx={24} cy={24} r={22.5} fill="none" stroke={colors.keep} strokeWidth={2} />}
    </Svg>
  );
}
