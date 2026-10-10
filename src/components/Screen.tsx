import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { Easing, FadeInDown, useReducedMotion } from 'react-native-reanimated';
import { colors, EASE, motion, sizes, spacing } from '@/theme/tokens';
import { useLayout } from '@/theme/useLayout';
import { Backdrop } from './Backdrop';
import { GlassIconButton } from './GlassIconButton';
import { BackIcon } from './Icons';
import { ProgressLine } from './ProgressLine';

interface Props {
  /** Main content (headline and copy). */
  children: ReactNode;
  /** Visual (receipt, illustration, control). Beside the main content on wide screens, stacked otherwise. */
  pane?: ReactNode;
  /** Pane above the main content in one column and on the left in two (default), or below / on the right. */
  paneFirst?: boolean;
  /** Show a back affordance (hidden automatically when there is nothing to go back to). */
  back?: boolean;
  /** Onboarding progress, 0..1; omitted on screens outside onboarding. */
  progress?: number;
  /** Primary action, pinned at the bottom within thumb reach. */
  footer?: ReactNode;
  /** Small print under the primary action. Pinned on tall screens; scrolls with the content on short ones. */
  footerNote?: ReactNode;
  /** Shown on the left of the header when there is no back button (for example the mark). */
  headerLeft?: ReactNode;
  /** Extra control on the right of the header (for example a close button). */
  headerRight?: ReactNode;
  /** Vertically centre the content when it is shorter than the screen. */
  centred?: boolean;
  /** Draw the glow inside this screen. Needed for modals, which are presented outside the root Backdrop. */
  ownBackdrop?: boolean;
}

/**
 * Dark page, safe-area aware on every edge (notches, Dynamic Island, iPhone Duo's side status bar),
 * 24px gutters, always scrollable so nothing clips on small screens or at 130% text.
 * One centred column on phones; two panes split on the centre line when there is width to spare.
 */
export function Screen({ children, pane, paneFirst = true, back = true, progress, footer, footerNote, headerLeft, headerRight, centred = false, ownBackdrop = false }: Props) {
  const { contentWidth, spread, short } = useLayout();
  const router = useRouter();
  // Insets come from the root provider, not a native SafeAreaView: inside a full-screen modal the native view can
  // report a zero top inset, which put the close button and header under the status bar.
  const insets = useSafeAreaInsets();
  const showBack = back && router.canGoBack();
  const noteInScroll = short && footerNote;
  const reduce = useReducedMotion();
  const enter = (delay: number) => (reduce ? undefined : FadeInDown.delay(delay).duration(motion.slow).easing(Easing.bezier(...EASE)));

  const body = spread && pane ? (
    <View style={styles.spread}>
      <View style={styles.pane}>{paneFirst ? pane : children}</View>
      <View style={styles.pane}>{paneFirst ? children : pane}</View>
    </View>
  ) : (
    <View style={[styles.stack, centred && styles.centred]}>
      {paneFirst && pane}
      {children}
      {!paneFirst && pane}
    </View>
  );

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom, paddingLeft: insets.left, paddingRight: insets.right }]}>
      {ownBackdrop ? <Backdrop /> : null}
      <View style={[styles.column, { width: contentWidth }]}>
        {progress !== undefined && (
          <View style={{ paddingTop: spacing.sm }}>
            <ProgressLine value={progress} />
          </View>
        )}
        <View style={styles.header}>
          {showBack ? (
            <GlassIconButton label="Go back" onPress={() => router.back()}>
              <BackIcon color={colors.text} />
            </GlassIconButton>
          ) : (
            headerLeft ?? <View />
          )}
          {headerRight}
        </View>
        <ScrollView style={styles.body} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Animated.View entering={enter(80)} style={{ flexGrow: 1 }}>
            {body}
          </Animated.View>
          {noteInScroll ? <View style={styles.note}>{footerNote}</View> : null}
        </ScrollView>
        {footer || (footerNote && !noteInScroll) ? (
          <Animated.View entering={enter(220)} style={styles.footer}>
            {footer}
            {!noteInScroll ? footerNote : null}
          </Animated.View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', backgroundColor: 'transparent' },
  column: { flex: 1, maxWidth: '100%', paddingHorizontal: sizes.gutter },
  header: { minHeight: 52, paddingTop: spacing.xs, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  body: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: spacing.lg },
  stack: { flexGrow: 1, gap: spacing.xl },
  centred: { justifyContent: 'center' },
  // The gutter sits on the centre line: on a foldable held sideways that is where the hinge is.
  spread: { flexGrow: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.xxl },
  pane: { flex: 1, minWidth: 0, gap: spacing.lg },
  note: { paddingTop: spacing.lg, gap: spacing.sm },
  footer: { paddingTop: spacing.md, paddingBottom: spacing.md, gap: spacing.sm },
});
