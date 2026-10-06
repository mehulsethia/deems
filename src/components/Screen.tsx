import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, sizes, spacing } from '@/theme/tokens';
import { useLayout } from '@/theme/useLayout';
import { BackIcon } from './Icons';
import { ProgressLine } from './ProgressLine';

interface Props {
  children: ReactNode;
  /** Show a back affordance (hidden automatically when there is nothing to go back to). */
  back?: boolean;
  /** Onboarding progress, 0..1; omitted on screens outside onboarding. */
  progress?: number;
  /** Body scrolls, so large Dynamic Type sizes never clip content. */
  scroll?: boolean;
  /** Pinned at the bottom, within thumb reach (primary button). */
  footer?: ReactNode;
  /** Extra control on the right of the header (for example a close button). */
  headerRight?: ReactNode;
}

/** Dark page, safe-area aware, 24px gutters, content centred at a max width on wide layouts. */
export function Screen({ children, back = true, progress, scroll = false, footer, headerRight }: Props) {
  const { contentWidth } = useLayout();
  const router = useRouter();
  const showBack = back && router.canGoBack();
  return (
    <SafeAreaView style={styles.root}>
      {progress !== undefined && (
        <View style={{ width: contentWidth, maxWidth: '100%', paddingHorizontal: sizes.gutter, paddingTop: spacing.sm }}>
          <ProgressLine value={progress} />
        </View>
      )}
      <View style={[styles.column, { width: contentWidth }]}>
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
        {scroll ? (
          <ScrollView style={styles.body} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
        ) : (
          <View style={styles.body}>{children}</View>
        )}
        {footer ? <View style={styles.footer}>{footer}</View> : null}
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
  scrollContent: { flexGrow: 1 },
  footer: { paddingTop: spacing.md, paddingBottom: spacing.md, gap: spacing.sm },
});
