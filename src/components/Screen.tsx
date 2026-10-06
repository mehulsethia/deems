import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, sizes, spacing } from '@/theme/tokens';
import { useLayout } from '@/theme/useLayout';
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
  /** Extra control on the right of the header (for example a close button). */
  headerRight?: ReactNode;
  /** Vertically centre the content when it is shorter than the screen. */
  centred?: boolean;
}

/**
 * Dark page, safe-area aware on every edge (notches, Dynamic Island, iPhone Duo's side status bar),
 * 24px gutters, always scrollable so nothing clips on small screens or at 130% text.
 * One centred column on phones; two panes split on the centre line when there is width to spare.
 */
export function Screen({ children, pane, paneFirst = true, back = true, progress, footer, footerNote, headerRight, centred = false }: Props) {
  const { contentWidth, spread, short } = useLayout();
  const router = useRouter();
  const showBack = back && router.canGoBack();
  const noteInScroll = short && footerNote;

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
    <SafeAreaView style={styles.root} edges={['top', 'bottom', 'left', 'right']}>
      <View style={[styles.column, { width: contentWidth }]}>
        {progress !== undefined && (
          <View style={{ paddingTop: spacing.sm }}>
            <ProgressLine value={progress} />
          </View>
        )}
        <View style={styles.header}>
          {showBack ? (
            <Pressable accessibilityRole="button" accessibilityLabel="Go back" hitSlop={8} onPress={() => router.back()} style={styles.touch}>
              <BackIcon color={colors.paper} />
            </Pressable>
          ) : (
            <View />
          )}
          {headerRight}
        </View>
        <ScrollView style={styles.body} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {body}
          {noteInScroll ? <View style={styles.note}>{footerNote}</View> : null}
        </ScrollView>
        {footer || (footerNote && !noteInScroll) ? (
          <View style={styles.footer}>
            {footer}
            {!noteInScroll ? footerNote : null}
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', backgroundColor: colors.background },
  column: { flex: 1, maxWidth: '100%', paddingHorizontal: sizes.gutter },
  header: { minHeight: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  touch: { minWidth: sizes.touch, minHeight: sizes.touch, justifyContent: 'center' },
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
