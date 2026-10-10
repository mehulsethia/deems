import { useEffect } from 'react';
import { Text, View, type TextStyle } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withSpring } from 'react-native-reanimated';
import { toColumns } from '@/motion/digits';
import { colors, typeScale } from '@/theme/tokens';

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

function Digit({ digit, lineHeight, style, delay }: { digit: number; lineHeight: number; style: TextStyle; delay: number }) {
  const reduce = useReducedMotion();
  const y = useSharedValue(reduce ? -digit * lineHeight : 0);
  useEffect(() => {
    y.value = reduce ? -digit * lineHeight : withDelay(delay, withSpring(-digit * lineHeight, { damping: 18, stiffness: 120 }));
  }, [digit, lineHeight, delay, reduce, y]);
  const strip = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));
  return (
    <View style={{ height: lineHeight, overflow: 'hidden' }}>
      <Animated.View style={strip}>
        {DIGITS.map((d) => (
          <Text key={d} style={[style, { height: lineHeight, lineHeight }]}>{d}</Text>
        ))}
      </Animated.View>
    </View>
  );
}

/** Readout whose digits roll to their value; units and spaces hold still. Tabular, so nothing jumps. */
export function RollingNumber({ text, style }: { text: string; style?: TextStyle }) {
  const base: TextStyle = { ...typeScale.readout, color: colors.text, ...style };
  const lineHeight = base.lineHeight ?? 62;
  const cols = toColumns(text);
  return (
    <View accessible accessibilityLabel={text} style={{ flexDirection: 'row', justifyContent: 'center' }}>
      {cols.map((c, i) =>
        c.digit === null ? (
          <Text key={i} importantForAccessibility="no" style={[base, { height: lineHeight }]}>{c.char}</Text>
        ) : (
          <Digit key={i} digit={c.digit} lineHeight={lineHeight} style={base} delay={i * 30} />
        ),
      )}
    </View>
  );
}
