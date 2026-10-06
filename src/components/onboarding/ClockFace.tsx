import { useEffect } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import { colors } from '@/theme/tokens';

/** Start at 10:13; spinning adds `minutes` to the clock. */
const START = { h: 10, m: 13 };
const SPIN_MS = 900;
const SETTLE_MS = 350;
const minuteAngle = (m: number) => m * 6;
const hourAngle = (h: number, m: number) => (h % 12) * 30 + m * 0.5;

interface Props {
  size?: number;
  /** When true, the hands spin forward `minutes` and settle. */
  spun: boolean;
  minutes: number;
  onSettled?: () => void;
}

export function ClockFace({ size = 200, spun, minutes, onSettled }: Props) {
  const reduce = useReducedMotion();
  const mAngle = useSharedValue(minuteAngle(START.m));
  const hAngle = useSharedValue(hourAngle(START.h, START.m));

  useEffect(() => {
    if (!spun) return;
    const mTo = minuteAngle(START.m + minutes);
    const hTo = hourAngle(START.h, START.m + minutes);
    if (reduce) {
      mAngle.value = mTo;
      hAngle.value = hTo;
      onSettled?.();
      return;
    }
    const fast = { duration: SPIN_MS, easing: Easing.out(Easing.cubic) };
    hAngle.value = withTiming(hTo, fast);
    mAngle.value = withSequence(withTiming(mTo + 8, fast), withSpring(mTo, { damping: 12, stiffness: 200 }));
    // Settle on a fixed beat rather than waiting for the spring to come fully to rest.
    const t = setTimeout(() => onSettled?.(), SPIN_MS + SETTLE_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spun]);

  const c = size / 2;
  const hand = (length: number, width: number) => ({
    position: 'absolute' as const,
    left: c - width / 2,
    top: c - length,
    width,
    height: length,
    borderRadius: width / 2,
    transformOrigin: 'bottom' as const,
  });
  const minuteStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${mAngle.value}deg` }] }));
  const hourStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${hAngle.value}deg` }] }));

  return (
    <View style={{ width: size, height: size }} accessible={false} importantForAccessibility="no-hide-descendants">
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle cx={c} cy={c} r={c - 2} fill={colors.surface} stroke={colors.hairline} strokeWidth={2} />
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i * Math.PI) / 6;
          const outer = c - 12;
          const inner = i % 3 === 0 ? c - 28 : c - 20;
          return (
            <Line
              key={i}
              x1={c + Math.sin(a) * inner}
              y1={c - Math.cos(a) * inner}
              x2={c + Math.sin(a) * outer}
              y2={c - Math.cos(a) * outer}
              stroke={i % 3 === 0 ? colors.paper : colors.muted}
              strokeWidth={i % 3 === 0 ? 3 : 2}
              strokeLinecap="round"
            />
          );
        })}
      </Svg>
      <Animated.View style={[hand(size * 0.26, 6), { backgroundColor: colors.paper }, hourStyle]} />
      <Animated.View style={[hand(size * 0.38, 4), { backgroundColor: colors.paper }, minuteStyle]} />
      <View style={{ position: 'absolute', left: c - 6, top: c - 6, width: 12, height: 12, borderRadius: 6, backgroundColor: colors.cut }} />
    </View>
  );
}
