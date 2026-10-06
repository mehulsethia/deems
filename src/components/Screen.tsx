import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/ThemeProvider';
import { useLayout } from '@/theme/useLayout';
import { AppText } from './AppText';

interface Props {
  children: ReactNode;
  /** Show a back affordance (hidden automatically when there is nothing to go back to). */
  back?: boolean;
  /** Body scrolls, so large Dynamic Type sizes never clip content. */
  scroll?: boolean;
  /** Pinned below the body (primary button). */
  footer?: ReactNode;
}

/** Cream page, safe-area aware, content centred at a max width on wide layouts. */
export function Screen({ children, back = true, scroll = false, footer }: Props) {
  const { colors } = useTheme();
  const { contentWidth } = useLayout();
  const router = useRouter();
  const showBack = back && router.canGoBack();
  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.column, { width: contentWidth }]}>
        <View style={styles.header}>
          {showBack && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              hitSlop={12}
              onPress={() => router.back()}
              style={styles.back}
            >
              <AppText variant="bodyMedium">‹ Back</AppText>
            </Pressable>
          )}
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
  root: { flex: 1, alignItems: 'center' },
  column: { flex: 1, maxWidth: '100%', paddingHorizontal: spacing.lg },
  header: { height: 48, justifyContent: 'center' },
  back: { alignSelf: 'flex-start', minHeight: 44, justifyContent: 'center' },
  body: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  footer: { paddingTop: spacing.md, paddingBottom: spacing.lg, gap: spacing.sm },
});
