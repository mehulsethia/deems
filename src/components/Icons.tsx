import Svg, { Circle, Path, Rect } from 'react-native-svg';

/** Simple line icons. Decorative: hidden from screen readers; the control carries the label. */

export function TickIcon({ size = 14, color }: { size?: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessible={false}>
      <Path d="M4.5 12.5l5 5L19.5 7" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function BackIcon({ size = 24, color }: { size?: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessible={false}>
      <Path d="M15 5l-7 7 7 7" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function CloseIcon({ size = 22, color }: { size?: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessible={false}>
      <Path d="M6 6l12 12M18 6L6 18" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export function ChevronIcon({ size = 18, color }: { size?: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessible={false}>
      <Path d="M9 5l7 7-7 7" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
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

/** A browser page with a lock: "their sign-in page". */
export function PageIcon({ size = 22, color }: { size?: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessible={false}>
      <Rect x={3} y={4} width={18} height={16} rx={3} fill="none" stroke={color} strokeWidth={1.8} />
      <Path d="M3 9h18" stroke={color} strokeWidth={1.8} />
      <Rect x={9.5} y={13} width={5} height={4} rx={1} fill={color} />
      <Path d="M10.5 13v-1a1.5 1.5 0 013 0v1" fill="none" stroke={color} strokeWidth={1.4} />
    </Svg>
  );
}

/** A server with a slash: "nothing stored". */
export function NoServerIcon({ size = 22, color }: { size?: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessible={false}>
      <Rect x={4} y={4} width={16} height={6.5} rx={2} fill="none" stroke={color} strokeWidth={1.8} />
      <Rect x={4} y={13.5} width={16} height={6.5} rx={2} fill="none" stroke={color} strokeWidth={1.8} />
      <Circle cx={7.5} cy={7.25} r={1} fill={color} />
      <Circle cx={7.5} cy={16.75} r={1} fill={color} />
      <Path d="M3 21L21 3" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

/** A door with an arrow out: "sign out any time". */
export function ExitIcon({ size = 22, color }: { size?: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessible={false}>
      <Path d="M14 4H6a2 2 0 00-2 2v12a2 2 0 002 2h8" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M10 12h10M16.5 8.5L20 12l-3.5 3.5" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
