import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withSpring } from 'react-native-reanimated';
import { colors, sizes } from '@/theme/tokens';

/** Thin onboarding progress line, 0..1. */
export function ProgressLine({ value }: { value: number }) {
  const reduce = useReducedMotion();
  const p = useSharedValue(value);
  useEffect(() => {
    p.value = reduce ? value : withSpring(value, { damping: 20, stiffness: 140 });
  }, [value, reduce, p]);
  const fill = useAnimatedStyle(() => ({ width: `${Math.max(0, Math.min(1, p.value)) * 100}%` }));
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel="Setup progress"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(value * 100) }}
      style={{ height: sizes.progress, borderRadius: sizes.progress, backgroundColor: colors.hairline, overflow: 'hidden' }}
    >
      <Animated.View style={[{ height: sizes.progress, borderRadius: sizes.progress, backgroundColor: colors.primary }, fill]} />
    </View>
  );
}
