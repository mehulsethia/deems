import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { Text, View, type LayoutChangeEvent } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { formatDaysCaps, formatDuration, spokenDuration, type Breakdown } from '@/onboarding/maths';
import { receiptFit, type ReceiptFit } from '@/onboarding/receiptFit';
import { thud, tick } from '@/motion/haptics';
import { colors, fonts, motion, spacing, type ColorName } from '@/theme/tokens';
import { AppText } from '../AppText';

export interface ReceiptProps {
  b: Breakdown;
  date: Date;
  /** Show the PER YEAR line. */
  showYear?: boolean;
  /** Text for the year value, so the parent can count it up. Defaults to the final figure. */
  yearText?: string;
  /** Lines already on the paper when mounted; the rest print one by one. */
  printedAtStart?: number;
  /** Slide the paper up on mount. */
  slideIn?: boolean;
  /** Strike FEED and PER YEAR in magenta, then land the REFUNDED stamp. */
  refunded?: boolean;
  /** Mounted already refunded (no animation). */
  refundedAtStart?: boolean;
  onPrinted?: () => void;
  onStamped?: () => void;
}

/** Receipt type size, fitted to the paper width (see receiptFit). */
const FitContext = createContext<ReceiptFit>(receiptFit(342));
const fitStyle = (f: ReceiptFit) => ({ fontSize: f.fontSize, lineHeight: f.lineHeight, letterSpacing: f.letterSpacing });

const TOOTH = 10;
const EDGE = 6;
const STRIKE_MS = 260;
const STAMP_SPACE = 48;

export const receiptDate = (d: Date) =>
  d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();

/** One sentence for screen readers. */
export function receiptSummary(b: Breakdown, date: Date, showYear: boolean, refunded: boolean): string {
  const year = showYear && b.days > 0 ? ` That is ${b.days} ${b.days === 1 ? 'day' : 'days'} a year.` : '';
  const refund = refunded ? ' Everything except messages is struck off and refunded.' : '';
  return (
    `Receipt for ${date.toLocaleDateString()}: ${spokenDuration(b.talking)} of messages and ` +
    `${spokenDuration(b.other)} of feed, reels and explore, ${spokenDuration(b.total)} a day in total.${year}${refund}`
  );
}

/** Perforated edge: a row of teeth, pointing up (top) or down (bottom). */
function Perforation({ width, flip }: { width: number; flip?: boolean }) {
  if (width <= 0) return <View style={{ height: EDGE }} />;
  const n = Math.ceil(width / TOOTH);
  let d = `M0 ${EDGE}`;
  for (let i = 0; i < n; i++) d += ` L${i * TOOTH + TOOTH / 2} 0 L${(i + 1) * TOOTH} ${EDGE}`;
  d += ' Z';
  return (
    <Svg width={width} height={EDGE} style={flip ? { transform: [{ scaleY: -1 }] } : undefined}>
      <Path d={d} fill={colors.paper} />
    </Svg>
  );
}

function Divider() {
  return (
    <View style={{ flexDirection: 'row', overflow: 'hidden', height: 1, marginVertical: spacing.sm }}>
      {Array.from({ length: 80 }, (_, i) => (
        <View key={i} style={{ width: 5, height: 1, marginRight: 4, backgroundColor: colors.onPaper }} />
      ))}
    </View>
  );
}

/** One magenta line through a span of text; grows left to right. */
function Strike({ on, delay, instant, box }: { on: boolean; delay: number; instant: boolean; box?: { x: number; y: number; width: number; height: number } }) {
  const w = useSharedValue(on && instant ? 1 : 0);
  useEffect(() => {
    if (!on) return;
    w.value = instant ? 1 : withDelay(delay, withTiming(1, { duration: STRIKE_MS, easing: Easing.out(Easing.cubic) }));
  }, [on, delay, instant, w]);
  const full = box ? box.width + 8 : 0;
  const style = useAnimatedStyle(() => (box ? { width: w.value * full } : { width: `${w.value * 100}%` }));
  const place = box ? { left: box.x - 4, top: box.y + box.height / 2 - 1 } : { left: -4, top: '50%' as const, marginTop: -1 };
  return <Animated.View pointerEvents="none" style={[{ position: 'absolute', height: 2, backgroundColor: colors.removed }, place, style]} />;
}

type LineBox = { x: number; y: number; width: number; height: number };

/** Receipt text that can be struck through, one stroke per printed line, so wrapped text is fully crossed out. */
function StruckText({ text, struck, delay, instant, tabular, tone = 'onPaper' }: { text: string; struck: boolean; delay: number; instant: boolean; tabular?: boolean; tone?: ColorName }) {
  const fit = useContext(FitContext);
  const [lines, setLines] = useState<LineBox[] | null>(null);
  return (
    <View>
      <AppText
        variant="receipt"
        tone={tone}
        onTextLayout={(e) => setLines(e.nativeEvent.lines.map((l) => ({ x: l.x, y: l.y, width: l.width, height: l.height })))}
        style={[fitStyle(fit), { opacity: struck ? 0.55 : 1 }, tabular && { fontVariant: ['tabular-nums'] }]}
      >
        {text}
      </AppText>
      {lines && lines.length > 0 ? (
        lines.map((l, i) => <Strike key={i} on={struck} delay={delay + i * 120} instant={instant} box={l} />)
      ) : (
        <Strike on={struck} delay={delay} instant={instant} />
      )}
    </View>
  );
}

function Line({ visible, instant, children }: { visible: boolean; instant: boolean; children: ReactNode }) {
  const o = useSharedValue(visible ? 1 : 0);
  useEffect(() => {
    o.value = instant ? (visible ? 1 : 0) : withTiming(visible ? 1 : 0, { duration: motion.fast });
  }, [visible, instant, o]);
  const style = useAnimatedStyle(() => ({ opacity: o.value, transform: [{ translateY: (1 - o.value) * -4 }] }));
  return <Animated.View style={style}>{children}</Animated.View>;
}

function Row({ left, right, struck, strikeDelay, instant, valueTone }: { left: string; right: string; struck: boolean; strikeDelay: number; instant: boolean; valueTone?: ColorName }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: spacing.md, paddingVertical: 2 }}>
      <View style={{ flexShrink: 1 }}>
        <StruckText text={left} struck={struck} delay={strikeDelay} instant={instant} />
      </View>
      <StruckText text={right} struck={struck} delay={strikeDelay} instant={instant} tabular tone={valueTone} />
    </View>
  );
}

type StampMode = 'off' | 'static' | 'fade' | 'land';

function Stamp({ mode, delay, onLanded }: { mode: StampMode; delay: number; onLanded?: () => void }) {
  const p = useSharedValue(mode === 'static' ? 1 : 0);
  useEffect(() => {
    if (mode === 'off' || mode === 'static') return;
    p.value =
      mode === 'fade'
        ? withDelay(delay, withTiming(1, { duration: motion.base }))
        : withDelay(delay, withSpring(1, { damping: 14, stiffness: 260 }));
    // Land on a fixed beat (the spring is visually settled by then).
    const t = setTimeout(() => {
      thud();
      onLanded?.();
    }, delay + (mode === 'fade' ? motion.base : 220));
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);
  const scaleFrom = mode === 'land' ? 1.8 : 1;
  const style = useAnimatedStyle(() => ({
    opacity: Math.min(1, p.value * 1.5),
    transform: [{ rotate: '-7deg' }, { scale: scaleFrom - (scaleFrom - 1) * p.value }],
  }));
  if (mode === 'off') return null;
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          right: spacing.lg,
          bottom: spacing.md,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.xs,
          borderRadius: 6,
          borderWidth: 2,
          borderColor: colors.removedText,
          backgroundColor: colors.removedText,
        },
        style,
      ]}
    >
      <AppText variant="label" tone="onRemoved" maxFontSizeMultiplier={1} style={{ fontSize: 16, lineHeight: 22 }}>REFUNDED</AppText>
    </Animated.View>
  );
}

/** Paper receipt: Geist Mono, perforated top and bottom, slight drop shadow. Read as one sentence. */
export function Receipt({
  b,
  date,
  showYear = false,
  yearText,
  printedAtStart = 0,
  slideIn = false,
  refunded = false,
  refundedAtStart = false,
  onPrinted,
  onStamped,
}: ReceiptProps) {
  const reduce = useReducedMotion();
  const [width, setWidth] = useState(0);
  const count = showYear ? 7 : 6;
  const [printed, setPrinted] = useState(reduce ? count : Math.min(printedAtStart, count));
  const reported = useRef(false);

  // Slide up.
  const y = useSharedValue(slideIn && !reduce ? 48 : 0);
  const fade = useSharedValue(slideIn ? 0 : 1);
  useEffect(() => {
    if (!slideIn) return;
    fade.value = withTiming(1, { duration: motion.base });
    if (!reduce) y.value = withTiming(0, { duration: motion.slow, easing: Easing.out(Easing.cubic) });
  }, [slideIn, reduce, y, fade]);
  const paperStyle = useAnimatedStyle(() => ({ opacity: fade.value, transform: [{ translateY: y.value }] }));

  // Print one line every 250 ms, light haptic per line.
  useEffect(() => {
    if (reduce) setPrinted(count);
  }, [reduce, count]);
  useEffect(() => {
    if (printed >= count) {
      if (!reported.current) {
        reported.current = true;
        onPrinted?.();
      }
      return;
    }
    const first = printed === printedAtStart && slideIn;
    const t = setTimeout(() => {
      tick();
      setPrinted((p) => p + 1);
    }, first ? motion.slow : motion.printLine);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [printed, count]);

  const instant = reduce || refundedAtStart;
  const struck = refunded || refundedAtStart;
  const days = yearText ?? formatDaysCaps(b.days) ?? '';
  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);
  const fit = receiptFit(width || 342);
  const shown = (i: number) => i < printed;

  return (
    <FitContext.Provider value={fit}>
      <Animated.View
        accessible
        accessibilityRole="text"
        accessibilityLabel={receiptSummary(b, date, showYear, struck)}
        onLayout={onLayout}
        style={[{ shadowColor: colors.shadow, shadowOpacity: 0.45, shadowRadius: 18, shadowOffset: { width: 0, height: 10 } }, paperStyle]}
      >
        <Perforation width={width} />
        <View style={{ backgroundColor: colors.paper, paddingHorizontal: fit.padX, paddingVertical: spacing.md }}>
          <Line visible={shown(0)} instant={reduce}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md }}>
              <AppText variant="receipt" tone="onPaper" accessibilityLabel="Deems" style={[fitStyle(fit), { fontFamily: fonts.monoBold }]}>
                D<Text style={{ color: colors.textMutedOnLight }}>EE</Text>MS
              </AppText>
              <AppText variant="receipt" tone="onPaper" style={fitStyle(fit)}>{receiptDate(date)}</AppText>
            </View>
          </Line>
          <Line visible={shown(1)} instant={reduce}>
            <Divider />
          </Line>
          <Line visible={shown(2)} instant={reduce}>
            <Row left="MESSAGES" right={formatDuration(b.talking)} struck={false} strikeDelay={0} instant={instant} valueTone="paperKept" />
          </Line>
          <Line visible={shown(3)} instant={reduce}>
            <Row left="FEED, REELS, EXPLORE" right={formatDuration(b.other)} struck={struck} strikeDelay={200} instant={instant} />
          </Line>
          <Line visible={shown(4)} instant={reduce}>
            <Divider />
          </Line>
          <Line visible={shown(5)} instant={reduce}>
            <Row left="TOTAL PER DAY" right={formatDuration(b.total)} struck={false} strikeDelay={0} instant={instant} />
          </Line>
          {showYear && (
            <Line visible={shown(6)} instant={reduce}>
              <Row left="PER YEAR" right={days} struck={struck} strikeDelay={200 + STRIKE_MS + 120} instant={instant} />
            </Line>
          )}
          {/* Room for the stamp, kept on the year screen too so the paper does not change height. */}
          {showYear && <View style={{ height: STAMP_SPACE }} />}
          <Stamp mode={refundedAtStart ? 'static' : !refunded ? 'off' : reduce ? 'fade' : 'land'} delay={reduce ? 0 : 200 + STRIKE_MS * 2 + 360} onLanded={onStamped} />
        </View>
        <Perforation width={width} flip />
      </Animated.View>
    </FitContext.Provider>
  );
}
