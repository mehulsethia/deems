import { useEffect } from 'react';
import { Image, Pressable, View } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withSpring } from 'react-native-reanimated';
import { metaLogos } from '@/brand/metaLogos';
import { select } from '@/motion/haptics';
import { usePressScale } from '@/motion/usePressScale';
import type { PlatformId } from '@/rules/types';
import { PLATFORM_META } from '@/state/platformMeta';
import { colors, platformBloom, radius, spacing, springs } from '@/theme/tokens';
import { AppText } from '../AppText';
import { TickIcon } from '../Icons';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/** Large glass toggle for one platform. Selected: the platform's colour blooms softly behind the tile and a tick draws in. */
export function AppTile({ id, selected, onToggle }: { id: PlatformId; selected: boolean; onToggle: () => void }) {
  const { label } = PLATFORM_META[id];
  const logo = metaLogos[id];
  const reduce = useReducedMotion();
  const press = usePressScale(0.98);
  const on = useSharedValue(selected ? 1 : 0);
  useEffect(() => {
    const to = selected ? 1 : 0;
    on.set(reduce ? to : withSpring(to, springs.sheet));
  }, [selected, reduce, on]);

  const bloom = useAnimatedStyle(() => ({ opacity: on.get() * 0.95, transform: [{ scale: 0.92 + on.get() * 0.08 }] }));
  const tickStyle = useAnimatedStyle(() => ({ opacity: on.get(), transform: [{ scale: 0.4 + on.get() * 0.6 }] }));

  return (
    <View>
      <Animated.View
        pointerEvents="none"
        style={[{ position: 'absolute', left: 6, right: 6, top: 12, bottom: -14, borderRadius: radius.tile, backgroundColor: platformBloom[id], shadowColor: platformBloom[id], shadowOpacity: 1, shadowRadius: 36, shadowOffset: { width: 0, height: 14 } }, bloom]}
      />
      <AnimatedPressable
        accessibilityRole="checkbox"
        accessibilityLabel={label}
        accessibilityState={{ checked: selected }}
        onPressIn={press.onPressIn}
        onPressOut={press.onPressOut}
        onPress={() => {
          select();
          onToggle();
        }}
        style={[
          {
            minHeight: 88,
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.md,
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
            borderRadius: radius.card,
            backgroundColor: colors.glassFill,
            borderWidth: 1,
            borderColor: selected ? colors.primary : colors.glassBorder,
            borderTopColor: selected ? colors.primary : colors.glassEdge,
          },
          press.style,
        ]}
      >
        {logo ? <Image source={logo} style={{ width: 40, height: 40 }} resizeMode="contain" accessibilityIgnoresInvertColors /> : null}
        <AppText variant="heading" style={{ flex: 1 }}>{label}</AppText>
        <View style={{ width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: selected ? colors.primary : colors.hairline, backgroundColor: selected ? colors.primary : colors.transparent }}>
          <Animated.View style={tickStyle}>
            <TickIcon color={colors.onPrimary} />
          </Animated.View>
        </View>
      </AnimatedPressable>
    </View>
  );
}
