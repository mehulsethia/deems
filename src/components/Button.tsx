import { Pressable, StyleSheet, type PressableProps } from 'react-native';
import { colors, radius, sizes, spacing } from '@/theme/tokens';
import { AppText } from './AppText';

interface Props extends Omit<PressableProps, 'children'> {
  label: string;
  /** primary: blue pill, white label. secondary: white pill, ink label. ghost: text only. */
  variant?: 'primary' | 'secondary' | 'ghost';
}

const look = {
  primary: { bg: colors.primary, fg: 'onPrimary', border: colors.primary },
  secondary: { bg: colors.inverse, fg: 'onInverse', border: colors.inverse },
  ghost: { bg: colors.transparent, fg: 'text', border: colors.transparent },
} as const;

export function Button({ label, variant = 'primary', disabled, style, ...rest }: Props) {
  const l = look[variant];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      style={(state) => [
        styles.base,
        { backgroundColor: l.bg, borderColor: l.border, opacity: disabled ? 0.4 : state.pressed ? 0.8 : 1 },
        typeof style === 'function' ? style(state) : style,
      ]}
      {...rest}
    >
      <AppText variant="button" tone={l.fg} center>
        {label}
      </AppText>
    </Pressable>
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
  },
});
