import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { motion, radius } from '@/theme/tokens';

/** Horizontal bar that grows to `ratio` (0..1) of its track over 500ms. */
export function AnimatedBar({ ratio, color, track, delay = 0, height = 28 }: { ratio: number; color: string; track: string; delay?: number; height?: number }) {
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withDelay(delay, withTiming(Math.min(1, Math.max(0, ratio)), { duration: motion.slow, easing: Easing.out(Easing.cubic) }));
  }, [ratio, delay, progress]);
  const style = useAnimatedStyle(() => ({ width: `${progress.value * 100}%` }));
  return (
    <View style={{ height, borderRadius: radius.pill, backgroundColor: track, overflow: 'hidden' }} accessible={false}>
      <Animated.View style={[{ height, borderRadius: radius.pill, backgroundColor: color, minWidth: ratio > 0 ? height / 2 : 0 }, style]} />
    </View>
  );
}
