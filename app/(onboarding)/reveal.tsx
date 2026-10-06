import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { Easing, FadeIn, SlideInDown, useReducedMotion } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { BackIcon } from '@/components/Icons';
import { PlatformWebView } from '@/components/PlatformWebView';
import { FEATURES } from '@/config/features';
import { getPack } from '@/rules/store';
import { getActivePlatform } from '@/state/platforms';
import { markOnboardingComplete } from '@/state/progress';
import { colors, motion, radius, sizes, spacing } from '@/theme/tokens';
import { useLayout } from '@/theme/useLayout';

const SHEET_DELAY = 800;

/** The real inbox, full screen, with a bottom sheet rising over it. */
export default function Reveal() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const insets = useSafeAreaInsets();
  const { webWidth } = useLayout();
  const pack = getPack(getActivePlatform());

  const keep = () => {
    if (FEATURES.paywall) {
      router.push('/paywall');
    } else {
      markOnboardingComplete();
      router.replace('/(main)/inbox');
    }
  };

  const entering = reduce
    ? FadeIn.delay(SHEET_DELAY).duration(motion.base)
    : SlideInDown.delay(SHEET_DELAY).duration(motion.slow).easing(Easing.out(Easing.cubic));

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top }}>
      <View style={{ flex: 1 }} pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <PlatformWebView pack={pack} />
      </View>

      {router.canGoBack() && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => router.back()}
          hitSlop={8}
          style={{ position: 'absolute', top: insets.top + spacing.sm, left: spacing.md, width: sizes.touch, height: sizes.touch, alignItems: 'center', justifyContent: 'center', borderRadius: radius.pill, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.hairline }}
        >
          <BackIcon color={colors.paper} />
        </Pressable>
      )}

      <Animated.View
        entering={entering}
        accessibilityViewIsModal
        style={{ position: 'absolute', bottom: 0, alignSelf: 'center', width: webWidth, maxWidth: '100%', backgroundColor: colors.surface, borderTopLeftRadius: radius.card, borderTopRightRadius: radius.card, borderWidth: 1, borderColor: colors.hairline, paddingHorizontal: sizes.gutter, paddingTop: spacing.md, paddingBottom: insets.bottom + spacing.md, gap: spacing.md }}
      >
        <View style={{ alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: colors.hairline }} />
        <AppText variant="title">That's everything. Nothing else is coming.</AppText>
        <AppText muted>Feed, Reels and Explore are hidden. Messages and stories work.</AppText>
        <Button label="Keep it this way" onPress={keep} />
      </Animated.View>
    </View>
  );
}
