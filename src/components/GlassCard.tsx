import { View, type ViewProps } from 'react-native';
import { colors, radius, spacing } from '@/theme/tokens';

interface Props extends ViewProps {
  /** Soft coloured halo behind the card (a platform's colour when selected). */
  bloom?: string;
}

/** Frosted card: translucent white, faint border, a white highlight along the top edge, soft shadow. */
export function GlassCard({ bloom, style, children, ...rest }: Props) {
  return (
    <View style={{ borderRadius: radius.card }}>
      {bloom ? (
        <View
          pointerEvents="none"
          style={{ position: 'absolute', left: 8, right: 8, top: 10, bottom: -6, borderRadius: radius.card, backgroundColor: bloom, opacity: 0.55, shadowColor: bloom, shadowOpacity: 1, shadowRadius: 28, shadowOffset: { width: 0, height: 10 } }}
        />
      ) : null}
      <View
        style={[
          {
            borderRadius: radius.card,
            backgroundColor: colors.glassFill,
            borderWidth: 1,
            borderColor: colors.glassBorder,
            borderTopColor: colors.glassEdge,
            padding: spacing.md,
            shadowColor: colors.shadow,
            shadowOpacity: 0.06,
            shadowRadius: 24,
            shadowOffset: { width: 0, height: 10 },
            elevation: 2,
          },
          style,
        ]}
        {...rest}
      >
        {children}
      </View>
    </View>
  );
}
