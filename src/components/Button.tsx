import { Pressable, StyleSheet, type PressableProps } from 'react-native';
import { fonts, radius, spacing, typeScale } from '@/theme/tokens';
import { useTheme } from '@/theme/ThemeProvider';
import { AppText } from './AppText';

interface Props extends Omit<PressableProps, 'children'> {
  label: string;
  variant?: 'primary' | 'accent' | 'ghost';
}

export function Button({ label, variant = 'primary', disabled, style, ...rest }: Props) {
  const { colors } = useTheme();
  const bg = variant === 'primary' ? colors.primary : variant === 'accent' ? colors.accent : 'transparent';
  const fg = variant === 'primary' ? colors.onPrimary : variant === 'accent' ? colors.onAccent : colors.text;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      style={(state) => [
        styles.base,
        { backgroundColor: bg, opacity: disabled ? 0.5 : state.pressed ? 0.85 : 1 },
        typeof style === 'function' ? style(state) : style,
      ]}
      {...rest}
    >
      <AppText style={{ color: fg, fontFamily: fonts.bodySemi, fontSize: typeScale.body.fontSize }}>{label}</AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
