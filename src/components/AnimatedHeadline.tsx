import { View } from 'react-native';
import Animated, { Easing, FadeInDown, useReducedMotion } from 'react-native-reanimated';
import { splitWords } from '@/motion/words';
import { EASE, motion, type TypeVariant } from '@/theme/tokens';
import { AppText } from './AppText';

interface Props {
  children: string;
  variant?: Extract<TypeVariant, 'display' | 'title' | 'heading'>;
  /** ms before the first word. */
  delay?: number;
  /** Announce the headline when it appears (results that show up after an animation). */
  live?: boolean;
}

const STAGGER = 40;

/** Headline whose words fade and rise in one after another. Keyed on its text, so it replays when the text changes. */
export function AnimatedHeadline({ children, variant = 'title', delay = 0, live = false }: Props) {
  const reduce = useReducedMotion();
  const words = splitWords(children);
  return (
    <View key={children} accessible accessibilityRole="header" accessibilityLabel={children} accessibilityLiveRegion={live ? 'polite' : undefined} style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
      {words.map((w, i) => (
        <Animated.View
          key={`${i}-${w}`}
          importantForAccessibility="no"
          entering={reduce ? undefined : FadeInDown.delay(delay + i * STAGGER).duration(motion.slow).easing(Easing.bezier(...EASE))}
        >
          <AppText variant={variant}>
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </AppText>
        </Animated.View>
      ))}
    </View>
  );
}
