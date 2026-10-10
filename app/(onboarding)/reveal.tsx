import { ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, SlideInDown, useReducedMotion } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { GlassIconButton } from '@/components/GlassIconButton';
import { BackIcon } from '@/components/Icons';
import { PlatformWebView } from '@/components/PlatformWebView';
import { FEATURES } from '@/config/features';
import { success } from '@/motion/haptics';
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
  const { width, height, contentWidth } = useLayout();
  // Full width on phones; a centred sheet on wide screens.
  const sheetWidth = width < 700 ? width : contentWidth + sizes.gutter * 2;
  const pack = getPack(getActivePlatform());

  const keep = () => {
    success();
    if (FEATURES.paywall) {
      router.push('/paywall');
    } else {
      markOnboardingComplete();
      router.replace('/(main)/inbox');
    }
  };

  const entering = reduce
    ? FadeIn.delay(SHEET_DELAY).duration(motion.base)
    : SlideInDown.delay(SHEET_DELAY).springify().damping(22).stiffness(180);

  return (
    <View style={{ flex: 1, backgroundColor: 'transparent', paddingTop: insets.top, paddingLeft: insets.left, paddingRight: insets.right }}>
      {router.canGoBack() && (
        <View style={{ height: 56, justifyContent: 'center', paddingHorizontal: spacing.md }}>
          <GlassIconButton label="Go back" onPress={() => router.back()}>
            <BackIcon color={colors.text} />
          </GlassIconButton>
        </View>
      )}
      <View style={{ flex: 1 }} pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <PlatformWebView pack={pack} />
      </View>

      <Animated.View
        entering={entering}
        accessibilityViewIsModal
        style={{ position: 'absolute', bottom: 0, alignSelf: 'center', width: sheetWidth, maxWidth: '100%', maxHeight: height * 0.85, backgroundColor: colors.surface, borderTopLeftRadius: radius.card, borderTopRightRadius: radius.card, borderWidth: 1, borderColor: colors.hairline, shadowColor: colors.shadow, shadowOpacity: 0.12, shadowRadius: 30, paddingLeft: sizes.gutter + insets.left, paddingRight: sizes.gutter + insets.right, paddingTop: spacing.md, paddingBottom: insets.bottom + spacing.md, gap: spacing.md }}
      >
        <View style={{ alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: colors.hairline }} />
        {/* Scrolls if the sheet runs out of room (landscape phones, 130% text). */}
        <ScrollView style={{ flexShrink: 1 }} contentContainerStyle={{ gap: spacing.md }} showsVerticalScrollIndicator={false}>
          <AppText variant="title">Only DMs from here.</AppText>
          <AppText muted>That's everything. Feed, Reels and Explore are hidden, and nothing else is coming. Your messages work as normal.</AppText>
        </ScrollView>
        <Button label="Keep it this way" onPress={keep} />
      </Animated.View>
    </View>
  );
}
