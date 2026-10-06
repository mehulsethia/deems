import { View } from 'react-native';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/ThemeProvider';
import { AppText } from './AppText';
import { Card } from './Card';

const rows: { label: string; app: string; hearth: string; kept: boolean }[] = [
  { label: 'Messages and group chats', app: 'Yes', hearth: 'Yes', kept: true },
  { label: "Friends' stories", app: 'Yes', hearth: 'Yes', kept: true },
  { label: 'Feed', app: 'Always there', hearth: 'Hidden', kept: false },
  { label: 'Reels', app: 'Always there', hearth: 'Hidden', kept: false },
  { label: 'Explore and suggestions', app: 'Always there', hearth: 'Hidden', kept: false },
];

/** Supporting content: what the Instagram app shows versus what Hearth shows. */
export function ComparisonTable() {
  const { colors } = useTheme();
  return (
    <Card style={{ padding: 0, overflow: 'hidden' }} accessible={false}>
      <View style={{ flexDirection: 'row', padding: spacing.md, backgroundColor: colors.background }}>
        <View style={{ flex: 2 }} />
        <AppText variant="small" muted style={{ flex: 1.3, textAlign: 'center' }}>Instagram app</AppText>
        <AppText variant="small" accent style={{ flex: 1.3, textAlign: 'center' }}>Hearth</AppText>
      </View>
      {rows.map((r) => (
        <View
          key={r.label}
          accessible
          accessibilityLabel={`${r.label}. Instagram app: ${r.app}. Hearth: ${r.hearth}.`}
          style={{ flexDirection: 'row', alignItems: 'center', padding: spacing.md, borderTopWidth: 1, borderTopColor: colors.border }}
        >
          <AppText variant="small" style={{ flex: 2 }}>{r.label}</AppText>
          <AppText variant="small" muted style={{ flex: 1.3, textAlign: 'center' }}>{r.app}</AppText>
          <AppText variant="small" style={{ flex: 1.3, textAlign: 'center', color: r.kept ? colors.text : colors.primary }}>{r.hearth}</AppText>
        </View>
      ))}
    </Card>
  );
}
