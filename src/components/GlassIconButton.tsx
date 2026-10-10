import type { ReactNode } from 'react';
import { Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import { select } from '@/motion/haptics';
import { usePressScale } from '@/motion/usePressScale';
import { colors, sizes } from '@/theme/tokens';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/** 44px frosted circle for back and close. Always sits inside the safe area (see Screen). */
export function GlassIconButton({ label, onPress, children }: { label: string; onPress: () => void; children: ReactNode }) {
  const press = usePressScale(0.92);
  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={6}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      onPress={() => {
        select();
        onPress();
      }}
      style={[{ width: sizes.touch, height: sizes.touch, borderRadius: sizes.touch / 2, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.glassFill, borderWidth: 1, borderColor: colors.glassBorder }, press.style]}
    >
      {children}
    </AnimatedPressable>
  );
}
