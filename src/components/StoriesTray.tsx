import { Image, Pressable, ScrollView, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import type { StoryItem } from '@/stories/instagram';
import { colors, sizes, spacing } from '@/theme/tokens';
import { AppText } from './AppText';
import { BackIcon } from './Icons';

const SIZE = 60;
const RING = ['#FEDA75', '#FA7E1E', '#D62976', '#962FBF', '#4F5BD5'];

function Ring({ unseen }: { unseen: boolean }) {
  return (
    <Svg width={SIZE} height={SIZE} style={{ position: 'absolute' }} accessible={false}>
      <Defs>
        <LinearGradient id="storyRing" x1="0" y1="1" x2="1" y2="0">
          {RING.map((c, i) => (
            <Stop key={c} offset={i / (RING.length - 1)} stopColor={c} />
          ))}
        </LinearGradient>
      </Defs>
      <Circle
        cx={SIZE / 2}
        cy={SIZE / 2}
        r={SIZE / 2 - 1.5}
        fill="none"
        stroke={unseen ? 'url(#storyRing)' : colors.hairline}
        strokeWidth={unseen ? 2.5 : 1.5}
      />
    </Svg>
  );
}

/** Friends with an active story. Tapping one opens it in the Instagram view. */
export function StoriesTray({ items, onOpen }: { items: StoryItem[]; onOpen: (username: string) => void }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      accessibilityLabel="Stories"
      style={{ flexGrow: 0, borderBottomWidth: 1, borderBottomColor: colors.hairline }}
      contentContainerStyle={{ gap: spacing.md, paddingHorizontal: spacing.md, paddingVertical: spacing.sm }}
    >
      {items.map((s) => (
        <Pressable
          key={s.username}
          accessibilityRole="button"
          accessibilityLabel={`${s.username}'s story${s.unseen ? '' : ', watched'}`}
          onPress={() => onOpen(s.username)}
          style={({ pressed }) => ({ width: SIZE + 8, alignItems: 'center', gap: 4, opacity: pressed ? 0.6 : 1 })}
        >
          <View style={{ width: SIZE, height: SIZE, alignItems: 'center', justifyContent: 'center' }}>
            <Ring unseen={s.unseen} />
            <Image
              source={{ uri: s.avatar }}
              style={{ width: SIZE - 8, height: SIZE - 8, borderRadius: (SIZE - 8) / 2, backgroundColor: colors.surface }}
            />
          </View>
          <AppText variant="caption" tone={s.unseen ? 'text' : 'textMuted'} numberOfLines={1} maxFontSizeMultiplier={1.1}>
            {s.username}
          </AppText>
        </Pressable>
      ))}
    </ScrollView>
  );
}

/** Shown while a story plays, so there is always a way back to messages. */
export function StoriesBackBar({ onBack }: { onBack: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Back to messages"
      onPress={onBack}
      style={{ minHeight: sizes.touch, flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.md }}
    >
      <BackIcon size={20} color={colors.text} />
      <AppText variant="bodyMedium">Back to messages</AppText>
    </Pressable>
  );
}
