import { Pressable, StyleSheet, type PressableProps } from 'react-native';
import Animated from 'react-native-reanimated';
import { tick } from '@/motion/haptics';
import { usePressScale } from '@/motion/usePressScale';
import { colors, radius, sizes, spacing } from '@/theme/tokens';
import { AppText } from './AppText';
import { LinearGradient } from './LinearGradient';

interface Props extends Omit<PressableProps, 'children' | 'style'> {
  label: string;
  /** primary: dark pill. secondary: glass pill. ghost: text only. */
  variant?: 'primary' | 'secondary' | 'ghost';
  style?: PressableProps['style'];
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({ label, variant = 'primary', disabled, style, onPress, ...rest }: Props) {
  const press = usePressScale();
  const primary = variant === 'primary';
  const bg = disabled && primary ? colors.disabledFill : primary ? colors.primary : variant === 'secondary' ? colors.glassFill : colors.transparent;
  const border = variant === 'secondary' ? colors.glassBorder : colors.transparent;
  const tone = disabled && primary ? 'disabledText' : primary ? 'onPrimary' : 'text';
  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      onPress={(e) => {
        tick();
        onPress?.(e);
      }}
      style={[
        styles.base,
        { backgroundColor: bg, borderColor: border },
        primary && !disabled && styles.lift,
        press.style,
        typeof style === 'function' ? undefined : style,
      ]}
      {...rest}
    >
      {primary && !disabled ? <LinearGradient /> : null}
      <AppText variant="button" tone={tone} center>
        {label}
      </AppText>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: sizes.button,
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  lift: {
    shadowColor: colors.shadow,
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
});
