import { View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { AppText } from '../AppText';
import { Avatar } from '../Avatar';
import { CheckIcon, CrossIcon } from '../Icons';
import { avatarTints, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/ThemeProvider';

/** Phone-shaped frame for the drawn illustrations. All names are invented. */
function Frame({ label, children }: { label: string; children: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={label}
      style={{
        backgroundColor: colors.card,
        borderRadius: radius.card,
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing.md,
        gap: spacing.md,
        alignSelf: 'stretch',
      }}
    >
      {children}
    </View>
  );
}

const chats = [
  { name: 'Maya', line: 'see you at 7?', tint: 0, unread: true },
  { name: 'Sunday dinner crew', line: 'Oriel: bringing dessert', tint: 1, unread: true, group: true },
  { name: 'Dev', line: 'sent a voice note', tint: 2, unread: false },
  { name: 'Noor', line: 'ha! that photo', tint: 3, unread: false },
];

export function MockInbox() {
  const { colors } = useTheme();
  return (
    <Frame label="Illustration of an inbox with chats from Maya, the Sunday dinner crew group, Dev and Noor">
      <AppText variant="heading">Messages</AppText>
      {chats.map((c) => (
        <View key={c.name} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
          <View>
            <Avatar tint={c.tint} />
            {c.group && (
              <View style={{ position: 'absolute', right: -4, bottom: -4 }}>
                <Avatar size={22} tint={(c.tint + 2) % avatarTints.length} />
              </View>
            )}
          </View>
          <View style={{ flex: 1 }}>
            <AppText variant="bodyMedium" numberOfLines={1}>{c.name}</AppText>
            <AppText variant="small" muted numberOfLines={1}>{c.line}</AppText>
          </View>
          {c.unread && <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: colors.accent }} />}
        </View>
      ))}
    </Frame>
  );
}

const people = ['Maya', 'Dev', 'Noor', 'Oriel', 'Sam'];

export function MockStories() {
  const { colors } = useTheme();
  return (
    <Frame label="Illustration of a row of friends' stories above a drawn story with a sun and hills">
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {people.map((n, i) => (
          <View key={n} style={{ alignItems: 'center', gap: 4 }}>
            <Avatar size={46} tint={i} ring />
            <AppText variant="caption" muted>{n}</AppText>
          </View>
        ))}
      </View>
      <Svg width="100%" height={150} viewBox="0 0 300 150" preserveAspectRatio="xMidYMid slice" accessible={false}>
        <Rect width={300} height={150} rx={radius.card} fill={avatarTints[3]} />
        <Circle cx={220} cy={46} r={22} fill={colors.accent} />
        <Path d="M0 150V105c40-30 80-30 120-5s90 15 180-15v65z" fill={colors.primary} />
        <Path d="M0 150v-25c50-18 100-10 150 5s100 5 150-8v28z" fill={colors.card} opacity={0.5} />
      </Svg>
    </Frame>
  );
}

export function MockGone() {
  const { colors } = useTheme();
  const gone = ['Feed', 'Reels', 'Explore'];
  const kept = ['Messages', 'Stories'];
  return (
    <Frame label="Illustration: Feed, Reels and Explore crossed out; Messages and Stories kept">
      {gone.map((g) => (
        <View key={g} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
          <CrossIcon color={colors.muted} />
          <AppText variant="bodyMedium" muted style={{ textDecorationLine: 'line-through' }}>{g}</AppText>
        </View>
      ))}
      <View style={{ height: 1, backgroundColor: colors.border }} />
      {kept.map((k) => (
        <View key={k} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
          <CheckIcon color={colors.primary} ring={colors.onPrimary} />
          <AppText variant="bodyMedium">{k}</AppText>
        </View>
      ))}
    </Frame>
  );
}
