import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { Easing, SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { PlatformWebView } from '@/components/PlatformWebView';
import { FEATURES } from '@/config/features';
import { getActivePack } from '@/rules/store';
import { markOnboardingComplete } from '@/state/progress';
import { motion, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/ThemeProvider';
import { useLayout } from '@/theme/useLayout';

/** The real inbox, visible behind a bottom sheet. */
export default function Reveal() {
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { webWidth } = useLayout();
  const pack = getActivePack();

  const keep = () => {
    if (FEATURES.paywall) {
      router.push('/paywall');
    } else {
      markOnboardingComplete();
      router.replace('/(main)/inbox');
    }
  };

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
          hitSlop={12}
          style={{ position: 'absolute', top: insets.top + spacing.sm, left: spacing.md, minHeight: 44, justifyContent: 'center', paddingHorizontal: spacing.md, borderRadius: radius.pill, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border }}
        >
          <AppText variant="bodyMedium">‹ Back</AppText>
        </Pressable>
      )}

      <Animated.View
        entering={SlideInDown.delay(400).duration(motion.slow).easing(Easing.out(Easing.cubic))}
        style={{ position: 'absolute', bottom: 0, alignSelf: 'center', width: webWidth, maxWidth: '100%', backgroundColor: colors.card, borderTopLeftRadius: radius.card, borderTopRightRadius: radius.card, borderWidth: 1, borderColor: colors.border, padding: spacing.lg, paddingBottom: insets.bottom + spacing.lg, gap: spacing.md }}
      >
        <View style={{ alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border }} />
        <AppText variant="title">Your messages are still here.</AppText>
        <AppText muted>Feed, reels and explore are hidden. Everything else stays exactly as it was.</AppText>
        <Button label="Keep it like this" onPress={keep} />
      </Animated.View>
    </View>
  );
}
