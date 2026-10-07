import { View } from 'react-native';
import Animated, { Easing, FadeIn, SlideInUp, useReducedMotion } from 'react-native-reanimated';
import { colors, fonts, motion, radius, spacing } from '@/theme/tokens';
import { AppText } from '../AppText';

/** A generic message banner (not a copy of any OS or app). Drops in from the top after `delay`. */
export function NotificationBanner({ sender, text, delay = 600 }: { sender: string; text: string; delay?: number }) {
  const reduce = useReducedMotion();
  const entering = reduce
    ? FadeIn.delay(delay).duration(motion.base)
    : SlideInUp.delay(delay).duration(motion.slow).easing(Easing.out(Easing.back(1.4)));
  return (
    <Animated.View
      entering={entering}
      accessible
      accessibilityRole="alert"
      accessibilityLabel={`Message from ${sender}: ${text}`}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        padding: spacing.md,
        borderRadius: radius.card,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.hairline,
      }}
    >
      <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}>
        <AppText variant="bodyMedium" tone="onPrimary">{sender.charAt(0)}</AppText>
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <AppText variant="chat" style={{ fontFamily: fonts.chatBold }}>{sender}</AppText>
          <AppText variant="label" muted>now</AppText>
        </View>
        <AppText variant="chat" muted>{text}</AppText>
      </View>
    </Animated.View>
  );
}
