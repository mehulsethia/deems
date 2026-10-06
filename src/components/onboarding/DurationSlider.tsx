import { useRef, useState } from 'react';
import { View, type LayoutChangeEvent } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { formatReadout, snap, spokenDuration } from '@/onboarding/maths';
import { tick } from '@/motion/haptics';
import { colors, MAX_FONT_SCALE, sizes, spacing, typeScale } from '@/theme/tokens';
import { AppText } from '../AppText';

interface Props {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (minutes: number) => void;
}

const THUMB = 28;
const TRACK = 4;

/** Large mono readout over a wide slider. Light haptic on each step; adjustable for screen readers. */
export function DurationSlider({ label, min, max, step, value, onChange }: Props) {
  const [width, setWidth] = useState(0);
  const last = useRef(value);
  const span = Math.max(step, max - min);
  const ratio = Math.min(1, Math.max(0, (value - min) / span));

  const set = (next: number) => {
    const v = snap(next, step, min, max);
    if (v === last.current) return;
    last.current = v;
    tick();
    onChange(v);
  };
  const fromX = (x: number) => {
    if (width <= 0) return;
    const usable = Math.max(1, width - THUMB);
    set(min + ((x - THUMB / 2) / usable) * span);
  };

  const pan = Gesture.Pan()
    .runOnJS(true)
    .minDistance(0)
    .onBegin((e) => fromX(e.x))
    .onUpdate((e) => fromX(e.x));

  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);
  last.current = value;

  return (
    <View style={{ gap: spacing.lg }}>
      <AppText
        variant="readout"
        center
        maxFontSizeMultiplier={MAX_FONT_SCALE}
        adjustsFontSizeToFit
        numberOfLines={1}
        accessibilityElementsHidden
        importantForAccessibility="no"
        style={{ fontSize: typeScale.readout.fontSize }}
      >
        {formatReadout(value)}
      </AppText>
      <GestureDetector gesture={pan}>
        <View
          onLayout={onLayout}
          accessible
          accessibilityRole="adjustable"
          accessibilityLabel={label}
          accessibilityValue={{ text: spokenDuration(value) }}
          accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
          onAccessibilityAction={(e) => set(value + (e.nativeEvent.actionName === 'increment' ? step : -step))}
          style={{ height: sizes.button, justifyContent: 'center' }}
        >
          <View style={{ height: TRACK, marginHorizontal: THUMB / 2, borderRadius: TRACK / 2, backgroundColor: colors.hairline }}>
            <View style={{ width: `${ratio * 100}%`, height: TRACK, borderRadius: TRACK / 2, backgroundColor: colors.keep }} />
          </View>
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: ratio * Math.max(0, width - THUMB),
              width: THUMB,
              height: THUMB,
              borderRadius: THUMB / 2,
              backgroundColor: colors.keep,
              borderWidth: 4,
              borderColor: colors.background,
            }}
          />
        </View>
      </GestureDetector>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <AppText variant="label" muted>{formatReadout(min)}</AppText>
        <AppText variant="label" muted>{formatReadout(max)}</AppText>
      </View>
    </View>
  );
}
