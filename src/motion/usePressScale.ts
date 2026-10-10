import { useAnimatedStyle, useReducedMotion, useSharedValue, withSpring } from 'react-native-reanimated';
import { springs } from '@/theme/tokens';

/** Spring scale-down while pressed. No-op under Reduce Motion. */
export function usePressScale(to = 0.97) {
  const reduce = useReducedMotion();
  const s = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));
  return {
    style,
    onPressIn: () => {
      if (!reduce) s.set(withSpring(to, springs.press));
    },
    onPressOut: () => {
      if (!reduce) s.set(withSpring(1, springs.press));
    },
  };
}
