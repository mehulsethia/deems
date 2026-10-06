import { useEffect } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedProps,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { colors } from '@/theme/tokens';
import { DeemsMark, MARK_ASPECT, MARK_BUBBLE, MARK_DOT, MARK_DOTS, MARK_VIEWBOX, markColors, type MarkVariant } from './DeemsMark';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/** Each dot gets 400 ms; the three run in sequence and loop. */
const DOT_MS = 400;
const LOW = 0.3;

function Dot({ index, phase, cx, fill }: { index: number; phase: SharedValue<number>; cx: number; fill: string }) {
  const props = useAnimatedProps(() => {
    // Position inside this dot's 400 ms slot, 0..1, or outside it.
    const t = phase.value - index;
    const lit = t >= 0 && t < 1 ? Math.sin(Math.PI * t) : 0;
    return { opacity: LOW + (1 - LOW) * lit };
  });
  return <AnimatedCircle cx={cx} cy={MARK_DOT.cy} r={MARK_DOT.r} fill={fill} animatedProps={props} />;
}

interface Props {
  size?: number;
  variant?: MarkVariant;
  label?: string;
}

/** The mark with its three dots pulsing in sequence. Static mark under Reduce Motion. */
export function Loader({ size = 48, variant = 'onDark', label = 'Loading' }: Props) {
  const reduce = useReducedMotion();
  const phase = useSharedValue(0);

  useEffect(() => {
    if (reduce) return;
    phase.value = withRepeat(withTiming(MARK_DOTS.length, { duration: DOT_MS * MARK_DOTS.length, easing: Easing.linear }), -1, false);
    return () => cancelAnimation(phase);
  }, [reduce, phase]);

  if (reduce) return <DeemsMark size={size} variant={variant} label={label} />;

  const c = markColors(variant);
  return (
    <Svg width={size * MARK_ASPECT} height={size} viewBox={MARK_VIEWBOX} accessible accessibilityRole="progressbar" accessibilityLabel={label}>
      <Path d={MARK_BUBBLE} fill={c.bubble} />
      {MARK_DOTS.map((cx, i) => (
        <Dot key={cx} index={i} phase={phase} cx={cx} fill={c.dots[i]} />
      ))}
    </Svg>
  );
}

/** Full-screen wait: the loader centred on the background. */
export function FullScreenLoader({ label }: { label?: string }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
      <Loader size={56} label={label} />
    </View>
  );
}
