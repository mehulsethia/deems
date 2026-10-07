import { useEffect, useState } from 'react';
import { Text, View, type TextStyle } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';
import { colors, motion, radius, spacing } from '@/theme/tokens';
import { AppText } from '../AppText';

/**
 * Instagram's messages inbox in dark mode, redrawn: notes along the top, then the message list. No stories,
 * because the inbox doesn't have them. Invented people and drawn avatars; no real photos or accounts.
 * Feed, Reels and Explore are struck out underneath.
 */

const IG = {
  bg: '#0C1014',
  text: '#F5F5F5',
  secondary: '#A8A8A8',
  field: '#25292E',
  note: '#2C3036',
  button: '#25292E',
} as const;

const SKINS = ['#F2C9A8', '#C68A62', '#8D5A3B', '#EBC1A0', '#A86E4C', '#E0B08E'];
const BACKDROPS = ['#3A4048', '#4A4F57', '#30353C', '#555B63', '#41464E', '#383D44'];
const SHIRTS = ['#6B6B6B', '#A3A3A3', '#262626', '#D4D4D4', '#3D3D3D', '#8A8A8A'];
const HAIR = ['#2B1D14', '#4A2E1C', '#111111', '#7A4A24', '#1E1A17', '#3B2618'];

export const REMOVED_TABS = ['Feed', 'Reels', 'Explore'] as const;

const t = (size: number, weight: TextStyle['fontWeight'] = '400', color: string = IG.text): TextStyle => ({
  fontSize: size,
  fontWeight: weight,
  color,
});

/** A drawn head-and-shoulders avatar. */
function Avatar({ size, seed }: { size: number; seed: number }) {
  const i = seed % SKINS.length;
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" accessible={false}>
      <Circle cx={24} cy={24} r={24} fill={BACKDROPS[i]} />
      <Path d="M10 44c1.8-8 7-12 14-12s12.2 4 14 12a24 24 0 01-28 0z" fill={SHIRTS[i]} />
      <Circle cx={24} cy={21} r={8.5} fill={SKINS[i]} />
      <Path d="M15.5 19.5a8.5 8.5 0 0117 0c-2.6-3.1-5.6-4.4-8.5-4.4s-5.9 1.3-8.5 4.4z" fill={HAIR[i]} />
    </Svg>
  );
}

/** Three overlapping faces for a group chat. */
function GroupAvatar({ size }: { size: number }) {
  const s = Math.round(size * 0.58);
  return (
    <View style={{ width: size, height: size }}>
      <View style={{ position: 'absolute', left: 0, top: size * 0.08 }}><Avatar size={s} seed={1} /></View>
      <View style={{ position: 'absolute', right: 0, top: size * 0.08 }}><Avatar size={s} seed={2} /></View>
      <View style={{ position: 'absolute', left: (size - s) / 2, bottom: 0, borderRadius: s / 2, borderWidth: 2, borderColor: IG.bg }}>
        <Avatar size={s - 4} seed={3} />
      </View>
    </View>
  );
}

function Icon({ d, size = 22, color = IG.text }: { d: string; size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessible={false}>
      <Path d={d} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

const NOTES = [
  { note: 'Your turn…', name: 'Your note', seed: 0, mine: true },
  { note: 'coffee later?', by: 'Aria', name: 'Aria', seed: 1 },
  { note: 'weekend plans', by: 'Dev', name: 'Dev', seed: 2 },
  { note: 'new playlist', by: 'Kai', name: 'Kai', seed: 3 },
];

const CHATS: { name: string; line: string; time: string; seed?: number; group?: boolean }[] = [
  { name: 'Aria, Dev and Kai', line: 'Aria: see you at 7!', time: '2h', group: true },
  { name: 'Rohan Mehta', line: 'You: sounds good 👍', time: '2h', seed: 4 },
  { name: 'Zoe Taylor', line: 'You: what’s the plan?', time: '3h', seed: 5 },
  { name: 'Ishaan Rao', line: 'You: on my way', time: '3h', seed: 2 },
  { name: 'Mia Brooks', line: 'You: thank you!', time: '6h', seed: 1 },
];

/** Strike that draws itself across a removed tab. */
function Struck({ label, index }: { label: string; index: number }) {
  const reduce = useReducedMotion();
  const progress = useSharedValue(reduce ? 1 : 0);
  useEffect(() => {
    if (reduce) return;
    progress.value = withDelay(500 + index * 280, withTiming(1, { duration: motion.base }));
  }, [index, progress, reduce]);
  const line = useAnimatedStyle(() => ({ transform: [{ scaleX: progress.value }] }));
  return (
    <View>
      <AppText variant="label" tone="removedOnDark" maxFontSizeMultiplier={1}>
        {label}
      </AppText>
      <Animated.View
        style={[
          { position: 'absolute', left: -2, right: -2, top: '50%', height: 2, backgroundColor: colors.removedOnDark, transformOrigin: 'left' },
          line,
        ]}
      />
    </View>
  );
}

export function InstagramInbox() {
  // As many notes as fit the card, never a cut-off one.
  const [fit, setFit] = useState(NOTES.length);
  return (
    <View style={{ gap: spacing.md }}>
      <View
        accessible
        accessibilityRole="image"
        accessibilityLabel="Instagram's messages inbox: your friends' notes along the top and your conversations below. Feed, Reels and Explore are gone."
        onLayout={(e) => setFit(Math.max(3, Math.min(NOTES.length, Math.floor((e.nativeEvent.layout.width - 16) / 76))))}
        style={{ borderRadius: radius.card, backgroundColor: IG.bg, borderWidth: 1, borderColor: colors.hairline, overflow: 'hidden', paddingBottom: 6 }}
      >
        {/* Header */}
        <View style={{ height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 14 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text maxFontSizeMultiplier={1} style={t(17, '700')}>sam.rivera</Text>
            <Icon d="M7 10l5 5 5-5" size={16} />
          </View>
          <View style={{ position: 'absolute', right: 14 }}>
            <Icon d="M4 20h4L19 9l-4-4L4 16zM14 6l4 4" size={22} />
          </View>
        </View>

        {/* Search */}
        <View style={{ marginHorizontal: 12, marginBottom: 10, height: 38, borderRadius: 12, backgroundColor: IG.field, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12 }}>
          <Svg width={16} height={16} viewBox="0 0 24 24" accessible={false}>
            <Circle cx={10.5} cy={10.5} r={7} fill="none" stroke={IG.secondary} strokeWidth={2.2} />
            <Path d="M16 16l5 5" stroke={IG.secondary} strokeWidth={2.2} strokeLinecap="round" />
          </Svg>
          <Text maxFontSizeMultiplier={1} style={t(15, '400', IG.secondary)}>Search</Text>
        </View>

        {/* Notes */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 8, paddingBottom: 8 }}>
          {NOTES.slice(0, fit).map((n) => (
            <View key={n.name} style={{ alignItems: 'center', width: 74 }}>
              <View style={{ backgroundColor: IG.note, borderRadius: 12, paddingHorizontal: 7, paddingVertical: 5, marginBottom: -6, zIndex: 1, minWidth: 62, alignItems: 'center' }}>
                <Text maxFontSizeMultiplier={1} numberOfLines={1} style={t(10, n.mine ? '400' : '700', n.mine ? IG.secondary : IG.text)}>{n.note}</Text>
                {n.by ? <Text maxFontSizeMultiplier={1} style={t(8, '400', IG.secondary)}>— {n.by}</Text> : null}
              </View>
              <Avatar size={56} seed={n.seed} />
              <Text maxFontSizeMultiplier={1} numberOfLines={1} style={[t(11, n.mine ? '400' : '600', n.mine ? IG.secondary : IG.text), { marginTop: 4 }]}>{n.name}</Text>
            </View>
          ))}
        </View>

        {/* Messages */}
        <Text maxFontSizeMultiplier={1} style={[t(15, '700'), { paddingHorizontal: 14, paddingTop: 4, paddingBottom: 4 }]}>Messages</Text>
        {CHATS.map((c) => (
          <View key={c.name} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 7 }}>
            {c.group ? <GroupAvatar size={50} /> : <Avatar size={50} seed={c.seed ?? 0} />}
            <View style={{ flex: 1, gap: 2 }}>
              <Text maxFontSizeMultiplier={1} numberOfLines={1} style={t(14, '500')}>{c.name}</Text>
              <Text maxFontSizeMultiplier={1} numberOfLines={1} style={t(13, '400', IG.secondary)}>
                {c.line} · {c.time}
              </Text>
            </View>
          </View>
        ))}

        {/* Floating heart, as in the app */}
        <View style={{ position: 'absolute', right: 14, bottom: 14, width: 44, height: 44, borderRadius: 22, backgroundColor: IG.button, alignItems: 'center', justifyContent: 'center' }}>
          <Icon d="M12 20s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.6-7 10-7 10z" size={20} />
        </View>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        {REMOVED_TABS.map((label, i) => (
          <Struck key={label} label={label} index={i} />
        ))}
        <AppText variant="label" tone="primaryOnDark" maxFontSizeMultiplier={1}>
          Messages
        </AppText>
      </View>
    </View>
  );
}
