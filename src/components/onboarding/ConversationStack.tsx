import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { colors, motion, spacing } from '@/theme/tokens';
import { AppText } from '../AppText';
import { GlassCard } from '../GlassCard';

/**
 * A stack of glass conversation rows, then Feed, Reels and Explore struck out. Invented first names and plain
 * initials: no platform's interface is copied.
 */

const ROWS = [
  { initial: 'A', name: 'Aria', line: 'see you at 7!' },
  { initial: 'R', name: 'Rohan', line: 'sounds good 👍' },
  { initial: 'Z', name: 'Zoe', line: "what's the plan?" },
];

export const REMOVED_TABS = ['Feed', 'Reels', 'Explore'] as const;

/** Strike that draws itself across a removed tab. */
function Struck({ label, index }: { label: string; index: number }) {
  const reduce = useReducedMotion();
  const progress = useSharedValue(reduce ? 1 : 0);
  useEffect(() => {
    if (reduce) return;
    progress.set(withDelay(700 + index * 280, withTiming(1, { duration: motion.base })));
  }, [index, progress, reduce]);
  const line = useAnimatedStyle(() => ({ transform: [{ scaleX: progress.get() }] }));
  return (
    <View>
      <AppText variant="label" tone="removedOnDark" maxFontSizeMultiplier={1}>
        {label}
      </AppText>
      <Animated.View
        style={[{ position: 'absolute', left: -2, right: -2, top: '50%', height: 2, backgroundColor: colors.removedOnDark, transformOrigin: 'left' }, line]}
      />
    </View>
  );
}

export function ConversationStack() {
  const reduce = useReducedMotion();
  return (
    <View style={{ gap: spacing.xl }}>
      <View
        accessible
        accessibilityRole="image"
        accessibilityLabel="Your conversations. Feed, Reels and Explore are gone."
        style={{ paddingTop: spacing.sm }}
      >
        {ROWS.map((r, i) => (
          <Animated.View
            key={r.name}
            entering={reduce ? undefined : FadeInDown.delay(i * 140).duration(motion.slow)}
            style={{ marginTop: i === 0 ? 0 : -spacing.sm, transform: [{ scale: 1 - i * 0.03 }], opacity: 1 - i * 0.12, zIndex: ROWS.length - i }}
          >
            <GlassCard style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md + 2 }}>
              <View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: colors.lightSurface, alignItems: 'center', justifyContent: 'center' }}>
                <AppText variant="bodyMedium">{r.initial}</AppText>
              </View>
              <View style={{ flex: 1 }}>
                <AppText variant="bodyMedium">{r.name}</AppText>
                <AppText variant="small" muted>{r.line}</AppText>
              </View>
            </GlassCard>
          </Animated.View>
        ))}
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        {REMOVED_TABS.map((label, i) => (
          <Struck key={label} label={label} index={i} />
        ))}
        <AppText variant="label" tone="primaryOnDark" maxFontSizeMultiplier={1}>
          Messages
        </AppText>
      </View>
    </View>
  );
}
