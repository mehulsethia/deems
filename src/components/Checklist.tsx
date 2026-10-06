import { useEffect, useState } from 'react';
import { View } from 'react-native';
import Animated, { Easing, FadeInDown } from 'react-native-reanimated';
import { motion, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/ThemeProvider';
import { AppText } from './AppText';
import { CheckIcon } from './Icons';

interface Props {
  items: string[];
  /** Time between items ticking over. */
  stepMs?: number;
  onDone?: () => void;
}

/** Items appear one by one and tick off; calm 400ms ease-out per row. */
export function Checklist({ items, stepMs = 700, onDone }: Props) {
  const { colors } = useTheme();
  const [done, setDone] = useState(0);

  useEffect(() => {
    if (done >= items.length) {
      const t = setTimeout(() => onDone?.(), 300);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setDone((d) => d + 1), stepMs);
    return () => clearTimeout(t);
  }, [done, items.length, stepMs, onDone]);

  return (
    <View style={{ gap: spacing.md }} accessibilityLiveRegion="polite">
      {items.map((label, i) => {
        const ticked = i < done;
        return (
          <Animated.View
            key={label}
            entering={FadeInDown.delay(i * (stepMs / 2)).duration(motion.base).easing(Easing.out(Easing.cubic))}
            accessible
            accessibilityLabel={ticked ? `${label}, done` : label}
            style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}
          >
            <CheckIcon color={ticked ? colors.primary : colors.border} filled={ticked} ring={ticked ? colors.onPrimary : colors.muted} />
            <AppText variant="bodyMedium" muted={!ticked} style={{ flex: 1 }}>
              {label}
            </AppText>
          </Animated.View>
        );
      })}
    </View>
  );
}
