import { Image, Pressable, View } from 'react-native';
import { metaLogos } from '@/brand/metaLogos';
import type { PlatformId } from '@/rules/types';
import { PLATFORM_META } from '@/state/platformMeta';
import { colors, radius, spacing } from '@/theme/tokens';
import { AppText } from '../AppText';
import { TickIcon } from '../Icons';

/** Large toggle tile for one platform. Selected: blue outline and tick. */
export function AppTile({ id, selected, onToggle }: { id: PlatformId; selected: boolean; onToggle: () => void }) {
  const { label } = PLATFORM_META[id];
  const logo = metaLogos[id];
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      accessibilityState={{ checked: selected }}
      onPress={onToggle}
      style={({ pressed }) => ({
        minHeight: 88,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderRadius: radius.card,
        backgroundColor: colors.surface,
        borderWidth: 2,
        borderColor: selected ? colors.primary : colors.hairline,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      {logo ? <Image source={logo} style={{ width: 40, height: 40 }} resizeMode="contain" accessibilityIgnoresInvertColors /> : null}
      <AppText variant="heading" style={{ flex: 1 }}>{label}</AppText>
      <View
        style={{
          width: 28,
          height: 28,
          borderRadius: 14,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 2,
          borderColor: selected ? colors.primary : colors.hairline,
          backgroundColor: selected ? colors.primary : colors.transparent,
        }}
      >
        {selected && <TickIcon color={colors.onPrimary} />}
      </View>
    </Pressable>
  );
}
