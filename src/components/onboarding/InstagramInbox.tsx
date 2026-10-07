import { useEffect, useState } from 'react';
import { Text, View, type TextStyle } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { colors, motion, radius, spacing } from '@/theme/tokens';
import { AppText } from '../AppText';

/**
 * Instagram's messages inbox, redrawn: the real layout and colours, with invented people and drawn avatars.
 * No real photos or accounts. Feed, Reels and Explore are struck out underneath.
 */

const IG = {
  bg: '#FFFFFF',
  text: '#000000',
  secondary: '#737373',
  hairline: '#DBDBDB',
  field: '#EFEFEF',
  unread: '#0095F6',
} as const;

const RING = ['#FEDA75', '#FA7E1E', '#D62976', '#962FBF', '#4F5BD5'];
const SKINS = ['#F2C9A8', '#C68A62', '#8D5A3B', '#EBC1A0', '#A86E4C'];
const BACKDROPS = ['#F5F5F5', '#E5E5E5', '#EDEDED', '#F0F0F0', '#E8E8E8'];
const HAIR = ['#2B1D14', '#4A2E1C', '#111111', '#7A4A24', '#1E1A17'];

export const REMOVED_TABS = ['Feed', 'Reels', 'Explore'] as const;

const t = (size: number, weight: TextStyle['fontWeight'] = '400', color: string = IG.text): TextStyle => ({
  fontSize: size,
  fontWeight: weight,
  color,
});

function IgAvatar({ size, seed, ring }: { size: number; seed: number; ring?: boolean }) {
  const id = `ring${seed}`;
  const inner = ring ? 19.5 : 24;
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" accessible={false}>
      {ring && (
        <>
          <Defs>
            <LinearGradient id={id} x1="0" y1="1" x2="1" y2="0">
              {RING.map((c, i) => (
                <Stop key={c} offset={i / (RING.length - 1)} stopColor={c} />
              ))}
            </LinearGradient>
          </Defs>
          <Circle cx={24} cy={24} r={23} fill="none" stroke={`url(#${id})`} strokeWidth={2} />
        </>
      )}
      <Circle cx={24} cy={24} r={inner} fill={BACKDROPS[seed % BACKDROPS.length]} />
      <Path
        d={ring ? 'M13 39c1.4-6 5.6-9 11-9s9.6 3 11 9a19.5 19.5 0 01-22 0z' : 'M11 42c1.6-7.5 6.6-11 13-11s11.4 3.5 13 11a24 24 0 01-26 0z'}
        fill={['#3D3D3D', '#6B6B6B', '#171717', '#A3A3A3', '#262626'][seed % 5]}
      />
      <Circle cx={24} cy={21} r={ring ? 6.5 : 8} fill={SKINS[seed % SKINS.length]} />
      <Path
        d={ring ? 'M17.5 20.5a6.5 6.5 0 0113 0c-2-2.4-4.4-3.4-6.5-3.4s-4.5 1-6.5 3.4z' : 'M16 20a8 8 0 0116 0c-2.5-3-5.4-4.2-8-4.2s-5.5 1.2-8 4.2z'}
        fill={HAIR[seed % HAIR.length]}
      />
    </Svg>
  );
}

function Icon({ d, size = 24, stroke = 2 }: { d: string; size?: number; stroke?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessible={false}>
      <Path d={d} fill="none" stroke={IG.text} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

const STORIES = [
  { name: 'Your note', seed: 0, ring: false },
  { name: 'maya', seed: 1, ring: true },
  { name: 'jo.park', seed: 2, ring: true },
  { name: 'sam', seed: 3, ring: true },
  { name: 'priya', seed: 4, ring: true },
];

const CHATS = [
  { name: 'maya', line: '2 new messages', time: '3m', unread: true, seed: 1, ring: true },
  { name: 'Jo Park', line: 'haha same', time: '1h', unread: true, seed: 2, ring: true },
  { name: 'Sam Okafor', line: 'You: see you sat', time: '2h', unread: false, seed: 3, ring: true },
  { name: 'Priya', line: 'Liked a message', time: '1d', unread: false, seed: 4, ring: false },
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
  // As many story bubbles as fit the card, never a cut-off one.
  const [fit, setFit] = useState(STORIES.length);
  return (
    <View style={{ gap: spacing.md }}>
      <View
        accessible
        accessibilityRole="image"
        accessibilityLabel="Instagram messages inbox, with friends’ stories along the top. Feed, Reels and Explore are gone."
        onLayout={(e) => setFit(Math.max(3, Math.min(STORIES.length, Math.floor((e.nativeEvent.layout.width - 20) / 60))))}
        style={{ borderRadius: radius.card, backgroundColor: IG.bg, overflow: 'hidden', paddingBottom: 6 }}
      >
        {/* Header */}
        <View style={{ height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12 }}>
          <Icon d="M19 12H5M11 18l-6-6 6-6" />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text maxFontSizeMultiplier={1} style={t(17, '700')}>you.and.yours</Text>
            <Icon d="M7 10l5 5 5-5" size={16} />
          </View>
          <Icon d="M12 20h8M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" size={22} />
        </View>

        {/* Tabs */}
        <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: IG.hairline }}>
          {['Primary', 'General', 'Requests'].map((tab, i) => (
            <View key={tab} style={{ flex: 1, alignItems: 'center', paddingVertical: 10, borderBottomWidth: i === 0 ? 1 : 0, borderBottomColor: IG.text, marginBottom: -1 }}>
              <Text maxFontSizeMultiplier={1} style={t(14, '600', i === 0 ? IG.text : IG.secondary)}>{tab}</Text>
            </View>
          ))}
        </View>

        {/* Search */}
        <View style={{ margin: 12, height: 36, borderRadius: 10, backgroundColor: IG.field, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12 }}>
          <Svg width={16} height={16} viewBox="0 0 24 24" accessible={false}>
            <Circle cx={10.5} cy={10.5} r={7} fill="none" stroke={IG.secondary} strokeWidth={2.2} />
            <Path d="M16 16l5 5" stroke={IG.secondary} strokeWidth={2.2} strokeLinecap="round" />
          </Svg>
          <Text maxFontSizeMultiplier={1} style={t(15, '400', IG.secondary)}>Search</Text>
        </View>

        {/* Notes and stories */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, paddingBottom: 8 }}>
          {STORIES.slice(0, fit).map((s) => (
            <View key={s.name} style={{ alignItems: 'center', gap: 4, width: 60 }}>
              <IgAvatar size={56} seed={s.seed} ring={s.ring} />
              <Text maxFontSizeMultiplier={1} numberOfLines={1} style={t(11, '400', s.ring ? IG.text : IG.secondary)}>{s.name}</Text>
            </View>
          ))}
        </View>

        {/* Conversations */}
        {CHATS.map((c) => (
          <View key={c.name} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 12, paddingVertical: 7 }}>
            <IgAvatar size={52} seed={c.seed} ring={c.ring} />
            <View style={{ flex: 1, gap: 2 }}>
              <Text maxFontSizeMultiplier={1} numberOfLines={1} style={t(14, c.unread ? '600' : '400')}>{c.name}</Text>
              <Text maxFontSizeMultiplier={1} numberOfLines={1} style={t(13, c.unread ? '600' : '400', c.unread ? IG.text : IG.secondary)}>
                {c.line} <Text style={{ color: IG.secondary, fontWeight: '400' }}>· {c.time}</Text>
              </Text>
            </View>
            {c.unread && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: IG.unread }} />}
          </View>
        ))}
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
