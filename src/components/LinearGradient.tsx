import { StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient as Grad, Rect, Stop } from 'react-native-svg';

/** Subtle white sheen across the top half of a dark button. */
export function LinearGradient() {
  return (
    <Svg style={StyleSheet.absoluteFill} pointerEvents="none" preserveAspectRatio="none" viewBox="0 0 1 1">
      <Defs>
        <Grad id="sheen" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.16} />
          <Stop offset="0.6" stopColor="#FFFFFF" stopOpacity={0} />
        </Grad>
      </Defs>
      <Rect x={0} y={0} width={1} height={1} fill="url(#sheen)" />
    </Svg>
  );
}
