import { View } from 'react-native';
import { Gesture, GestureDetector, Directions } from 'react-native-gesture-handler';
import Animated, { FadeIn, FadeOut, Keyframe, LinearTransition, useReducedMotion } from 'react-native-reanimated';
import { colors, fonts, motion, radius, spacing } from '@/theme/tokens';
import { useLayout } from '@/theme/useLayout';
import { AppText } from '../AppText';
import { Avatar } from '../Avatar';

/** Our own drawing: invented app, invented names, drawn avatars. No real photos or real app UI copy. */

export const MOCK_TABS = ['Feed', 'Reels', 'Explore', 'Messages'] as const;
export const PEELABLE = 3;
const FRIENDS = ['maya', 'jo', 'sam', 'priya', 'leo'];

const peelOut = new Keyframe({
  0: { opacity: 1, transform: [{ translateX: 0 }, { translateY: 0 }, { rotate: '0deg' }] },
  100: { opacity: 0, transform: [{ translateX: -260 }, { translateY: -40 }, { rotate: '-16deg' }] },
}).duration(420);

const Bar = ({ w, h = 8, tone = colors.hairline }: { w: number | `${number}%`; h?: number; tone?: string }) => (
  <View style={{ width: w, height: h, borderRadius: h / 2, backgroundColor: tone }} />
);

function Feed() {
  return (
    <View style={{ gap: spacing.md }}>
      {[0, 1].map((i) => (
        <View key={i} style={{ gap: spacing.sm }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <Avatar size={24} tint={i + 2} />
            <Bar w={80} />
          </View>
          <View style={{ height: 96, borderRadius: 10, backgroundColor: colors.hairline }} />
        </View>
      ))}
    </View>
  );
}

function Reels() {
  return (
    <View style={{ flex: 1, borderRadius: 10, backgroundColor: colors.hairline, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: 0, height: 0, borderLeftWidth: 22, borderTopWidth: 14, borderBottomWidth: 14, borderLeftColor: colors.muted, borderTopColor: colors.transparent, borderBottomColor: colors.transparent }} />
    </View>
  );
}

function Explore() {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
      {Array.from({ length: 9 }, (_, i) => (
        <View key={i} style={{ width: '31.5%', aspectRatio: 1, borderRadius: 6, backgroundColor: colors.hairline }} />
      ))}
    </View>
  );
}

function Messages() {
  return (
    <View style={{ gap: spacing.md }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {FRIENDS.map((name, i) => (
          <View key={name} style={{ alignItems: 'center', gap: 4 }}>
            <Avatar size={44} tint={i} ring />
            <AppText variant="caption" muted maxFontSizeMultiplier={1}>{name}</AppText>
          </View>
        ))}
      </View>
      {FRIENDS.slice(0, 3).map((name, i) => (
        <View key={name} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
          <Avatar size={36} tint={i} />
          <View style={{ flex: 1, gap: 6 }}>
            <AppText variant="small" maxFontSizeMultiplier={1}>{name}</AppText>
            <Bar w={i === 0 ? '70%' : i === 1 ? '50%' : '60%'} h={6} />
          </View>
        </View>
      ))}
    </View>
  );
}

const PANELS = { Feed, Reels, Explore, Messages } as const;

interface Props {
  /** How many of Feed, Reels, Explore have peeled away (0..3). */
  peeled: number;
  onPeel: () => void;
}

export function MockApp({ peeled, onPeel }: Props) {
  const reduce = useReducedMotion();
  const { height } = useLayout();
  // Shorter on small or landscape screens so the headline and button still fit.
  const panelHeight = Math.round(Math.max(200, Math.min(320, height * 0.36)));
  const tabs = MOCK_TABS.slice(peeled);
  const current = tabs[0];
  const Panel = PANELS[current];
  const done = peeled >= PEELABLE;

  const fling = Gesture.Fling().direction(Directions.LEFT).runOnJS(true).onEnd(() => !done && onPeel());
  const tap = Gesture.Tap().runOnJS(true).onEnd(() => !done && onPeel());

  return (
    <GestureDetector gesture={Gesture.Exclusive(fling, tap)}>
      <View
        accessible
        accessibilityRole={done ? 'image' : 'button'}
        accessibilityLabel={done ? 'A drawn app with only Messages and a row of friends’ stories left.' : `A drawn app. Remove ${current}.`}
        accessibilityActions={done ? undefined : [{ name: 'activate' }]}
        onAccessibilityAction={() => !done && onPeel()}
        style={{ borderRadius: radius.card, borderWidth: 1, borderColor: colors.hairline, backgroundColor: colors.surface, overflow: 'hidden' }}
      >
        <View style={{ paddingHorizontal: spacing.md, paddingTop: spacing.md }}>
          <AppText variant="heading" maxFontSizeMultiplier={1} style={{ fontSize: 18 }}>glimmer</AppText>
        </View>
        <View style={{ height: panelHeight, padding: spacing.md }}>
          <Animated.View
            key={current}
            entering={FadeIn.duration(motion.base)}
            exiting={reduce ? FadeOut.duration(motion.fast) : peelOut}
            style={{ flex: 1 }}
          >
            <Panel />
          </Animated.View>
        </View>
        <View style={{ flexDirection: 'row', borderTopWidth: 1, borderTopColor: colors.hairline, paddingVertical: spacing.sm }}>
          {tabs.map((t, i) => {
            const next = i === 0 && !done;
            return (
              <Animated.View
                key={t}
                layout={reduce ? undefined : LinearTransition.duration(motion.base)}
                exiting={FadeOut.duration(motion.fast)}
                style={{ flex: 1, alignItems: 'center', paddingVertical: spacing.sm }}
              >
                <View>
                  <AppText
                    variant="label"
                    tone={next ? 'cut' : t === 'Messages' ? 'keep' : 'muted'}
                    maxFontSizeMultiplier={1}
                    style={{ fontFamily: fonts.monoMedium }}
                  >
                    {t}
                  </AppText>
                  {next && <View style={{ position: 'absolute', left: -2, right: -2, top: '50%', height: 2, backgroundColor: colors.cut }} />}
                </View>
              </Animated.View>
            );
          })}
        </View>
      </View>
    </GestureDetector>
  );
}
