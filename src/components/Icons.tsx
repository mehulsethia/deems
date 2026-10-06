import Svg, { Circle, Path, Rect } from 'react-native-svg';

export function CheckIcon({ size = 22, color, filled = true, ring }: { size?: number; color: string; filled?: boolean; ring: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessible={false}>
      <Circle cx={12} cy={12} r={11} fill={filled ? color : 'none'} stroke={ring} strokeWidth={1.5} />
      {filled && <Path d="M7 12.5l3.2 3.2L17 8.8" fill="none" stroke={ring} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />}
    </Svg>
  );
}

export function CrossIcon({ size = 22, color }: { size?: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessible={false}>
      <Circle cx={12} cy={12} r={11} fill="none" stroke={color} strokeWidth={1.5} />
      <Path d="M8 8l8 8M16 8l-8 8" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export function LockIcon({ size = 14, color }: { size?: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessible={false}>
      <Rect x={5} y={11} width={14} height={10} rx={2.5} fill={color} />
      <Path d="M8 11V8a4 4 0 018 0v3" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export function ReloadIcon({ size = 20, color }: { size?: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessible={false}>
      <Path d="M19 12a7 7 0 11-2.05-4.95" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M19 4v4.5h-4.5" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
