import { useEffect } from 'react';
import { Image, StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { atmosphere, colors } from '@/theme/tokens';

const GRAIN = require('../../assets/grain.png');

interface BlobSpec {
  color: string;
  /** Anchor as a fraction of the screen. */
  x: number;
  y: number;
  /** Diameter as a fraction of the larger screen side. */
  size: number;
  /** Drift distance in px and loop length in ms (different per blob so they never line up). */
  dx: number;
  dy: number;
  ms: number;
  opacity: number;
}

const BLOBS: BlobSpec[] = [
  { color: atmosphere.blue, x: 0.1, y: 0.08, size: 0.9, dx: 40, dy: 30, ms: 24000, opacity: 0.75 },
  { color: atmosphere.violet, x: 0.95, y: 0.4, size: 0.85, dx: -50, dy: 40, ms: 28000, opacity: 0.6 },
  { color: atmosphere.pink, x: 0.2, y: 0.95, size: 0.9, dx: 45, dy: -35, ms: 32000, opacity: 0.6 },
];

function Blob({ spec, width, height, still }: { spec: BlobSpec; width: number; height: number; still: boolean }) {
  const t = useSharedValue(0);
  useEffect(() => {
    if (still) return;
    t.value = withRepeat(withTiming(1, { duration: spec.ms, easing: Easing.inOut(Easing.sin) }), -1, true);
  }, [still, spec.ms, t]);
  const d = Math.max(width, height) * spec.size;
  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: spec.dx * t.value }, { translateY: spec.dy * t.value }],
  }));
  return (
    <Animated.View
      style={[{ position: 'absolute', left: spec.x * width - d / 2, top: spec.y * height - d / 2, width: d, height: d, opacity: spec.opacity }, style]}
    >
      <Svg width={d} height={d}>
        <Defs>
          <RadialGradient id="g" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={spec.color} stopOpacity={1} />
            <Stop offset="100%" stopColor={spec.color} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx={d / 2} cy={d / 2} r={d / 2} fill="url(#g)" />
      </Svg>
    </Animated.View>
  );
}

/** White page with a slow, soft pastel glow and 3% grain (stops the gradient banding). Rendered once at the root. */
export function Backdrop() {
  const { width, height } = useWindowDimensions();
  const still = useReducedMotion();
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: colors.background }]} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <View style={[StyleSheet.absoluteFill, { backgroundColor: atmosphere.tint, opacity: 0.6 }]} />
      {BLOBS.map((b) => (
        <Blob key={b.color} spec={b} width={width} height={height} still={still} />
      ))}
      <Image source={GRAIN} resizeMode="cover" style={[StyleSheet.absoluteFill, { opacity: 0.03 }]} />
    </View>
  );
}
