# Light Glass Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reskin the OnlyDM app to a light, airy "glass" look with a soft animated glow, spring/word/number motion, and fix the layout overlaps on the paywall, sign-in sheet and reveal screens.

**Architecture:** Semantic colour/type tokens in `src/theme/tokens.ts` flip to a light palette so existing call sites keep working. A handful of new primitives (`Backdrop`, `GlassCard`, `GlassIconButton`, `AnimatedHeadline`, `RollingNumber`) plus rewrites of `Button`, `Screen`, `AppTile`, `ProgressLine` carry the new look. Screens are then touched only for layout bugs, headline swaps and illustrations. No new native dependencies.

**Tech Stack:** Expo 57, React Native 0.86, expo-router, react-native-reanimated 4.5, react-native-svg 15, expo-haptics, Jest (node env, logic-only tests).

**Spec:** [docs/superpowers/specs/2026-10-10-light-glass-redesign-design.md](../specs/2026-10-10-light-glass-redesign-design.md)

## Global Constraints

- Light theme only. Base white `#FFFFFF`, ink `#0A0A0A`. No dark mode, no system switching.
- No new native dependencies (no `expo-blur`). SVG gradients only. No dev-client rebuild for JS work.
- Platform logos remain the only saturated colour in the UI. Glow and bloom colours live in `atmosphere` / `platformBloom`, never in `colors`.
- Every `colors` value stays greyscale hex (or `rgba(...)`); the `tokens.test.ts` greyscale rule still passes.
- All text pairs ≥ 4.5:1 and graphics ≥ 3:1 (existing contrast tests extended, not weakened).
- All motion honours `useReducedMotion()`.
- Headline weight Inter SemiBold (`Inter_600SemiBold`, already loaded). No new fonts.
- Radius: `card` 22, `tile` 28. Easing `Easing.bezier(0.22, 1, 0.36, 1)`.
- Copy, flow order, onboarding logic, purchases and rules/WebView behaviour do not change.
- Run `npm run typecheck` and `npm test` before every commit; both must pass.
- Commit trailer: `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.

## Review Focus

- 130% Dynamic Type on iPhone SE: pinned footer and headline must not clip or overlap (Screen scrolls; footer stays inside bottom inset).
- Reduce Motion on: headlines, rolling numbers, Backdrop drift and press springs must not animate (static fallback), and the flow must still complete.
- `RollingNumber` given `0`, a negative, a value with a decimal or unit text ("43 DAYS", "1 h 05 min"): non-digit characters render statically, no crash, no layout jump while digits roll.
- `AnimatedHeadline` given empty string, multiple spaces, a very long word, or text that changes (cold-open swaps its headline): no empty-word flicker, re-animates on change, wraps correctly.
- Disabled "Next" on pick-apps: label readable (≥ 4.5:1) and visibly different from enabled.
- Paywall in `__DEV__` false: no "Dev mode" text; with plans failing to load, the close button is still reachable.

---

## File Structure

| File | Responsibility |
|---|---|
| `src/theme/tokens.ts` (modify) | Light colours, glass tokens, `atmosphere`, `platformBloom`, type weights, radius, springs |
| `__tests__/tokens.test.ts` (modify) | Contrast pairs for the light palette |
| `src/motion/words.ts` (create) | Pure `splitWords(text)` |
| `src/motion/digits.ts` (create) | Pure `toColumns(text)` for rolling numbers |
| `__tests__/motion.test.ts` (create) | Tests for the two helpers |
| `scripts/make-grain.js` (create) | One-off generator for `assets/grain.png` |
| `assets/grain.png` (create) | 128px tileable noise |
| `src/components/Backdrop.tsx` (create) | Animated blurred glow + grain, rendered once at root |
| `src/components/GlassCard.tsx` (create; replaces `Card.tsx`) | Frosted card with optional bloom |
| `src/components/GlassIconButton.tsx` (create) | 44px glass circle for back/close |
| `src/components/AnimatedHeadline.tsx` (create) | Word-by-word headline |
| `src/components/RollingNumber.tsx` (create) | Digit-roll readout |
| `src/motion/usePressScale.ts` (create) | Spring press scale hook |
| `src/components/Button.tsx`, `Screen.tsx`, `ProgressLine.tsx`, `onboarding/AppTile.tsx` (modify) | New look and motion |
| `app/_layout.tsx`, `app/(onboarding)/_layout.tsx`, `app/(main)/_layout.tsx`, `app.json` (modify) | Backdrop at root, transparent stacks, light status bar |
| `app/*` screens, `components/onboarding/*` (modify) | Headline swaps, layout fixes, illustrations |

---

### Task 1: Light tokens and contrast tests

**Files:**
- Modify: `src/theme/tokens.ts`
- Modify: `__tests__/tokens.test.ts`

**Interfaces:**
- Produces: `colors.glassFill`, `colors.glassEdge`, `colors.glassBorder`, `colors.disabledFill`, `colors.disabledText` (strings); `atmosphere: { tint, blue, violet, pink }`; `platformBloom: Record<PlatformId, string>`; `springs: { press, sheet }`; `easing: EasingFunction`-compatible bezier params `[0.22, 1, 0.36, 1]` as `EASE`; `radius.tile`.

- [ ] **Step 1: Update the tests first (they must fail against dark tokens)**

In `__tests__/tokens.test.ts` replace the two contrast `pairs` arrays and the palette rules with:

```ts
describe('brand contrast: text pairs the app uses (4.5:1)', () => {
  const pairs: [string, string, string][] = [
    ['text on background', colors.text, colors.background],
    ['text on surface', colors.text, colors.surface],
    ['muted text on background', colors.textMuted, colors.background],
    ['muted text on surface', colors.textMuted, colors.surface],
    ['primary button label', colors.onPrimary, colors.primary],
    ['secondary button label', colors.text, colors.background],
    ['links on background', colors.primaryOnDark, colors.background],
    ['links on surface', colors.primaryOnDark, colors.surface],
    ['removed text on background', colors.removedOnDark, colors.background],
    ['removed text on surface', colors.removedOnDark, colors.surface],
    ['disabled button label', colors.disabledText, colors.disabledFill],
    ['receipt text', colors.onPaper, colors.paper],
    ['receipt MESSAGES value', colors.paperKept, colors.paper],
    ['REFUNDED stamp label', colors.onRemoved, colors.removedText],
    ['secondary text on white', colors.textMutedOnLight, colors.paper],
    ['secondary text on light', colors.textMutedOnLight, colors.lightSurface],
  ];
  it.each(pairs)('%s', (_name, fg, bg) => {
    expect(contrast(fg, bg)).toBeGreaterThanOrEqual(BODY);
  });
});

describe('brand contrast: graphics and outlines (3:1)', () => {
  const pairs: [string, string, string][] = [
    ['selected fill or outline on background', colors.primary, colors.background],
    ['selected fill or outline on surface', colors.primary, colors.surface],
    ['strike-through on receipt', colors.removed, colors.paper],
    ['clock centre dot', colors.removed, colors.surface],
  ];
  it.each(pairs)('%s', (_name, fg, bg) => {
    expect(contrast(fg, bg)).toBeGreaterThanOrEqual(GRAPHIC);
  });
});

describe('palette rules', () => {
  const grey = (hex: string) => hex.slice(1, 3) === hex.slice(3, 5) && hex.slice(3, 5) === hex.slice(5, 7);

  it('keeps every UI colour greyscale, like the site', () => {
    for (const [name, value] of Object.entries(colors)) {
      if (value.startsWith('#')) expect([name, grey(value)]).toEqual([name, true]);
    }
  });

  it('keeps brand and glow colour out of UI colours', () => {
    const ui = JSON.stringify(colors).toUpperCase();
    for (const c of [palette.markBlue, palette.markMagenta, ...Object.values(atmosphere), ...Object.values(platformBloom)]) {
      expect(ui).not.toContain(c.toUpperCase());
    }
  });

  it('keeps no old palette values', () => {
    const all = JSON.stringify({ colors, palette }).toUpperCase();
    for (const old of ['#C6FF3D', '#FF5A36', '#5B93FF', '#FF5C9F', '#D81B72', '#0B4FD6', '#17191E', '#B4B9C2']) expect(all).not.toContain(old);
  });

  it('is a light theme', () => {
    expect(colors.background).toBe('#FFFFFF');
    expect(colors.text).toBe('#0A0A0A');
  });
});
```

Change the import line to `import { atmosphere, colors, palette, platformBloom } from '../src/theme/tokens';`.

- [ ] **Step 2: Run to verify it fails**

Run: `npx jest __tests__/tokens.test.ts`
Expected: FAIL (`atmosphere` / `disabledText` undefined, background not white).

- [ ] **Step 3: Rewrite the tokens**

In `src/theme/tokens.ts`:

1. Header comment: replace "dark-first … No coloured gradients, glows or tinted shadows." with "Light glass: white base, near-black ink. Soft pastel glow lives only in `atmosphere` (backdrop) and `platformBloom` (selected tiles); UI colours stay greyscale."
2. In `palette` add `slate: '#595959',` after `graphite`.
3. Replace the whole `colors` object with:

```ts
export const colors = {
  // Light surfaces
  background: palette.white,
  surface: palette.white,
  hairline: palette.line,

  // Frosted glass (cards, icon buttons)
  glassFill: 'rgba(255,255,255,0.72)',
  /** 1px highlight along the top edge of glass. */
  glassEdge: 'rgba(255,255,255,0.95)',
  glassBorder: 'rgba(10,10,10,0.07)',

  // Text on light
  text: palette.black,
  /** Secondary text (grey, 5.3:1 on white). */
  textMuted: palette.grey,

  /** Primary action, selected state, progress: near-black on white. */
  primary: palette.black,
  onPrimary: palette.white,
  /** Links and thin accents. Name kept from the dark theme so call sites do not change. */
  primaryOnDark: palette.black,

  /** Disabled primary button: pale fill, readable label. */
  disabledFill: palette.line,
  disabledText: palette.slate,

  /** Struck-off and removed items: grey. */
  removed: palette.grey,
  removedOnDark: palette.grey,
  removedText: palette.black,
  onRemoved: palette.white,

  /** Secondary button: glass pill, ink label. */
  inverse: palette.black,
  onInverse: palette.white,

  // Receipt paper (lifted with a shadow on the light screen)
  paper: palette.white,
  onPaper: palette.black,
  paperKept: palette.black,

  lightSurface: palette.paper,
  textOnLight: palette.black,
  textMutedOnLight: palette.grey,

  scrim: 'rgba(10,10,10,0.35)',
  shadow: '#000000',
  transparent: 'transparent',
} as const;

/** Backdrop glow (blue, violet, pink: the three logo dots). Never used for UI elements. */
export const atmosphere = {
  tint: '#F7F8FB',
  blue: '#BFD4FF',
  violet: '#D9C9FF',
  pink: '#FFCFE3',
} as const;

/** Soft halo behind a selected platform tile. */
export const platformBloom = {
  instagram: '#F7A8C8',
  threads: '#C9CCD6',
  messenger: '#A9C8FF',
} as const;
```

4. Type: `headline` helper default `fontFamily: string = fonts.headline` stays, but change the `fonts` entries `headline: 'Inter_600SemiBold'`, `headlineHeavy: 'Inter_700Bold'`. Change `headline()` tracking to `-0.03 * fontSize` and line height `1.1`. Replace `display: headline(40, fonts.headlineHeavy)` with `display: headline(42, fonts.headline)`. Replace `readout` with `{ fontFamily: fonts.headline, fontSize: 56, lineHeight: 62, letterSpacing: -2, fontVariant: TABULAR }`.
5. `radius = { card: 22, tile: 28, pill: 999 }`.
6. Append:

```ts
/** Site easing, as bezier control points for Easing.bezier. */
export const EASE = [0.22, 1, 0.36, 1] as const;

export const springs = {
  press: { damping: 18, stiffness: 320, mass: 0.6 },
  sheet: { damping: 22, stiffness: 180, mass: 1 },
} as const;
```

- [ ] **Step 4: Run tests and typecheck**

Run: `npx jest __tests__/tokens.test.ts && npm run typecheck`
Expected: PASS. If a contrast pair fails, adjust only the hex that fails (grey values), not the threshold.

- [ ] **Step 5: Fix fallout from the flipped palette**

Run: `grep -rn "removedOnDark\|primaryOnDark\|colors.inverse\|colors.scrim\|colors.lightSurface" app src | grep -v tokens.ts`
Review each hit: anything that assumed white-on-dark (e.g. a white tick on a dark circle) now reads dark-on-white, which is intended; only change a hit if it would put the same colour on the same colour.

- [ ] **Step 6: Commit**

```bash
git add src/theme/tokens.ts __tests__/tokens.test.ts
git commit -m "Light glass tokens: white base, glass fills, glow and bloom palettes" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Pure motion helpers (words, digit columns)

**Files:**
- Create: `src/motion/words.ts`, `src/motion/digits.ts`
- Test: `__tests__/motion.test.ts`

**Interfaces:**
- Produces: `splitWords(text: string): string[]`; `toColumns(text: string): { char: string; digit: number | null }[]`.

- [ ] **Step 1: Write the failing tests**

```ts
import { toColumns } from '../src/motion/digits';
import { splitWords } from '../src/motion/words';

describe('splitWords', () => {
  it('splits on whitespace and drops empties', () => {
    expect(splitWords('  Only   your DMs. ')).toEqual(['Only', 'your', 'DMs.']);
  });
  it('returns [] for empty or blank text', () => {
    expect(splitWords('')).toEqual([]);
    expect(splitWords('   ')).toEqual([]);
  });
  it('keeps a very long word whole', () => {
    const w = 'x'.repeat(80);
    expect(splitWords(`a ${w}`)).toEqual(['a', w]);
  });
});

describe('toColumns', () => {
  it('marks digits and leaves other characters static', () => {
    expect(toColumns('1 h 05')).toEqual([
      { char: '1', digit: 1 },
      { char: ' ', digit: null },
      { char: 'h', digit: null },
      { char: ' ', digit: null },
      { char: '0', digit: 0 },
      { char: '5', digit: 5 },
    ]);
  });
  it('handles zero, negatives and decimals without throwing', () => {
    expect(toColumns('0').map((c) => c.digit)).toEqual([0]);
    expect(toColumns('-2.5').map((c) => c.digit)).toEqual([null, 2, null, 5]);
  });
  it('returns [] for empty text', () => {
    expect(toColumns('')).toEqual([]);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx jest __tests__/motion.test.ts`
Expected: FAIL, modules not found.

- [ ] **Step 3: Implement**

`src/motion/words.ts`:

```ts
/** Words of a headline, for the word-by-word entrance. Whitespace-only text has no words. */
export const splitWords = (text: string): string[] => text.split(/\s+/).filter(Boolean);
```

`src/motion/digits.ts`:

```ts
export interface Column {
  char: string;
  /** 0-9 when the character is a digit (it rolls); null for everything else (it stays put). */
  digit: number | null;
}

/** One column per character, so a readout like "1 h 05 min" can roll its digits and hold its units still. */
export const toColumns = (text: string): Column[] =>
  Array.from(text).map((char) => ({ char, digit: /^[0-9]$/.test(char) ? Number(char) : null }));
```

- [ ] **Step 4: Run to verify it passes**

Run: `npx jest __tests__/motion.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/motion __tests__/motion.test.ts
git commit -m "Add pure helpers for word-by-word headlines and rolling digits" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Backdrop (glow + grain) wired at the root

**Files:**
- Create: `scripts/make-grain.js`, `assets/grain.png`, `src/components/Backdrop.tsx`
- Modify: `app/_layout.tsx`, `app/(onboarding)/_layout.tsx`, `app/(main)/_layout.tsx`, `app.json`, `src/components/Screen.tsx` (root background only)

**Interfaces:**
- Produces: `<Backdrop />` (no props), absolutely fills its parent, `pointerEvents="none"`.

- [ ] **Step 1: Generate the grain tile**

`scripts/make-grain.js` (pure Node, no dependencies; writes an 8-bit grey+alpha PNG of random noise):

```js
const fs = require('fs');
const zlib = require('zlib');

const SIZE = 128;
const raw = Buffer.alloc((SIZE * 2 + 1) * SIZE);
let seed = 7;
const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
for (let y = 0; y < SIZE; y++) {
  const row = y * (SIZE * 2 + 1);
  raw[row] = 0; // filter: none
  for (let x = 0; x < SIZE; x++) {
    raw[row + 1 + x * 2] = rand() < 0.5 ? 0 : 255; // grey
    raw[row + 2 + x * 2] = 255; // alpha: opacity is applied by the Image
  }
}

const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc = (buf) => {
  let c = 0xffffffff;
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const chunk = (type, data) => {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type), data]);
  const sum = Buffer.alloc(4);
  sum.writeUInt32BE(crc(body));
  return Buffer.concat([len, body, sum]);
};
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(SIZE, 0);
ihdr.writeUInt32BE(SIZE, 4);
ihdr[8] = 8; // bit depth
ihdr[9] = 4; // colour type: grey + alpha
const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', ihdr),
  chunk('IDAT', zlib.deflateSync(raw)),
  chunk('IEND', Buffer.alloc(0)),
]);
fs.writeFileSync(process.argv[2] ?? 'assets/grain.png', png);
```

Run: `node scripts/make-grain.js assets/grain.png && file assets/grain.png`
Expected: `PNG image data, 128 x 128, 8-bit gray+alpha`.

- [ ] **Step 2: Create `Backdrop`**

`src/components/Backdrop.tsx`:

```ts
import { useEffect } from 'react';
import { Image, StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { atmosphere, colors } from '@/theme/tokens';

const GRAIN = require('../../assets/grain.png');

interface BlobSpec {
  color: string;
  /** Anchor as a fraction of the screen. */
  x: number;
  y: number;
  /** Diameter as a fraction of the larger screen side. */
  size: number;
  /** Drift distance in px and loop length in ms (different per blob so they never line up). */
  dx: number;
  dy: number;
  ms: number;
  opacity: number;
}

const BLOBS: BlobSpec[] = [
  { color: atmosphere.blue, x: 0.1, y: 0.08, size: 0.9, dx: 40, dy: 30, ms: 24000, opacity: 0.75 },
  { color: atmosphere.violet, x: 0.95, y: 0.4, size: 0.85, dx: -50, dy: 40, ms: 28000, opacity: 0.6 },
  { color: atmosphere.pink, x: 0.2, y: 0.95, size: 0.9, dx: 45, dy: -35, ms: 32000, opacity: 0.6 },
];

function Blob({ spec, width, height, still }: { spec: BlobSpec; width: number; height: number; still: boolean }) {
  const t = useSharedValue(0);
  useEffect(() => {
    if (still) return;
    t.value = withRepeat(withTiming(1, { duration: spec.ms, easing: Easing.inOut(Easing.sin) }), -1, true);
  }, [still, spec.ms, t]);
  const d = Math.max(width, height) * spec.size;
  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: spec.dx * t.value }, { translateY: spec.dy * t.value }],
  }));
  return (
    <Animated.View
      style={[{ position: 'absolute', left: spec.x * width - d / 2, top: spec.y * height - d / 2, width: d, height: d, opacity: spec.opacity }, style]}
    >
      <Svg width={d} height={d}>
        <Defs>
          <RadialGradient id="g" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={spec.color} stopOpacity={1} />
            <Stop offset="100%" stopColor={spec.color} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx={d / 2} cy={d / 2} r={d / 2} fill="url(#g)" />
      </Svg>
    </Animated.View>
  );
}

/** White page with a slow, soft pastel glow and 3% grain (stops the gradient banding). Rendered once at the root. */
export function Backdrop() {
  const { width, height } = useWindowDimensions();
  const still = useReducedMotion();
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: colors.background }]} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <View style={[StyleSheet.absoluteFill, { backgroundColor: atmosphere.tint, opacity: 0.6 }]} />
      {BLOBS.map((b) => (
        <Blob key={b.color} spec={b} width={width} height={height} still={still} />
      ))}
      <Image source={GRAIN} resizeMode="repeat" style={[StyleSheet.absoluteFill, { opacity: 0.03 }]} />
    </View>
  );
}
```

Note: `<RadialGradient id="g">` is reused with the same id in three separate `Svg`s; each `Svg` has its own `Defs`, so ids do not collide.

- [ ] **Step 3: Wire it in**

`app/_layout.tsx`: import `{ View }` from react-native and `{ Backdrop }`; change `<StatusBar style="light" />` to `<StatusBar style="dark" />`; wrap so the backdrop sits under the stack, and make the stack transparent:

```tsx
<GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
  <PaymentsProvider>
    <StatusBar style="dark" />
    <Backdrop />
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' } }}>
```

(`Backdrop` is `absoluteFill`, rendered before the `Stack`, so the stack paints over it.)

In `app/(onboarding)/_layout.tsx` and `app/(main)/_layout.tsx` change `contentStyle: { backgroundColor: colors.background }` to `{ backgroundColor: 'transparent' }` and drop the now-unused `colors` import if nothing else uses it.

In `src/components/Screen.tsx` change `styles.root` `backgroundColor: colors.background` to `'transparent'`.

`app.json`: set `"userInterfaceStyle": "light"`. Native splash/icon backgrounds (`#0A0A0A` at lines 24, 41, 43, 59) are baked at build time; leave them for Task 11 (needs a native rebuild and a dark-mark splash image).

- [ ] **Step 4: Typecheck and look**

Run: `npm run typecheck`
Expected: PASS.
Run the app (see Task 11 Step 1 for the command) and confirm the glow is visible and slowly moving on the cold-open screen. If the glow looks too strong or too weak, tune only the `opacity` values in `BLOBS`.

- [ ] **Step 5: Commit**

```bash
git add scripts assets/grain.png src/components/Backdrop.tsx app src/components/Screen.tsx app.json
git commit -m "Add animated pastel Backdrop with grain at the root" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Spring press hook and Button

**Files:**
- Create: `src/motion/usePressScale.ts`
- Modify: `src/components/Button.tsx`

**Interfaces:**
- Produces: `usePressScale(to?: number)` → `{ style, onPressIn, onPressOut }` where `style` is an Animated style to spread on an `Animated.View`/`Animated.createAnimatedComponent(Pressable)`.

- [ ] **Step 1: Implement the hook**

`src/motion/usePressScale.ts`:

```ts
import { useAnimatedStyle, useReducedMotion, useSharedValue, withSpring } from 'react-native-reanimated';
import { springs } from '@/theme/tokens';

/** Spring scale-down while pressed. No-op under Reduce Motion. */
export function usePressScale(to = 0.97) {
  const reduce = useReducedMotion();
  const s = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));
  return {
    style,
    onPressIn: () => {
      if (!reduce) s.value = withSpring(to, springs.press);
    },
    onPressOut: () => {
      if (!reduce) s.value = withSpring(1, springs.press);
    },
  };
}
```

- [ ] **Step 2: Rewrite Button**

Replace `src/components/Button.tsx` with:

```tsx
import { Pressable, StyleSheet, type PressableProps } from 'react-native';
import Animated from 'react-native-reanimated';
import { LinearGradient } from './LinearGradient';
import { tick } from '@/motion/haptics';
import { usePressScale } from '@/motion/usePressScale';
import { colors, radius, sizes, spacing } from '@/theme/tokens';
import { AppText } from './AppText';

interface Props extends Omit<PressableProps, 'children'> {
  label: string;
  /** primary: dark pill. secondary: glass pill. ghost: text only. */
  variant?: 'primary' | 'secondary' | 'ghost';
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({ label, variant = 'primary', disabled, style, onPress, ...rest }: Props) {
  const press = usePressScale();
  const primary = variant === 'primary';
  const bg = disabled && primary ? colors.disabledFill : primary ? colors.primary : variant === 'secondary' ? colors.glassFill : colors.transparent;
  const border = variant === 'secondary' ? colors.glassBorder : colors.transparent;
  const tone = disabled && primary ? 'disabledText' : primary ? 'onPrimary' : 'text';
  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      onPress={(e) => {
        tick();
        onPress?.(e);
      }}
      style={[
        styles.base,
        { backgroundColor: bg, borderColor: border },
        primary && !disabled && styles.lift,
        press.style,
        typeof style === 'function' ? undefined : style,
      ]}
      {...rest}
    >
      {primary && !disabled ? <LinearGradient /> : null}
      <AppText variant="button" tone={tone} center>
        {label}
      </AppText>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: sizes.button,
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  lift: {
    shadowColor: colors.shadow,
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
});
```

Create `src/components/LinearGradient.tsx` (a faint top-to-bottom sheen using svg; no new dependency):

```tsx
import { StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient as Grad, Rect, Stop } from 'react-native-svg';

/** Subtle white sheen across the top half of a dark button. */
export function LinearGradient() {
  return (
    <Svg style={StyleSheet.absoluteFill} pointerEvents="none" preserveAspectRatio="none" viewBox="0 0 1 1">
      <Defs>
        <Grad id="sheen" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.16} />
          <Stop offset="0.6" stopColor="#FFFFFF" stopOpacity={0} />
        </Grad>
      </Defs>
      <Rect x={0} y={0} width={1} height={1} fill="url(#sheen)" />
    </Svg>
  );
}
```

The `tone` prop of `AppText` is a `ColorName`; `disabledText` is one after Task 1. `style` as a function is dropped (no call site uses the function form; confirm with `grep -rn "style={(" app src | grep Button`).

- [ ] **Step 3: Verify**

Run: `npm run typecheck && npm test`
Expected: PASS. Then on the simulator: pick-apps "Next" disabled looks pale with a readable grey label; enabled is dark with a sheen; pressing springs.

- [ ] **Step 4: Commit**

```bash
git add src/motion/usePressScale.ts src/components/Button.tsx src/components/LinearGradient.tsx
git commit -m "Spring-press Button with haptic, readable disabled state" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 5: GlassCard, GlassIconButton, ProgressLine, Screen

**Files:**
- Create: `src/components/GlassCard.tsx`, `src/components/GlassIconButton.tsx`
- Delete: `src/components/Card.tsx` (unused; `grep -rn "components/Card" app src` returns nothing)
- Modify: `src/components/ProgressLine.tsx`, `src/components/Screen.tsx`

**Interfaces:**
- Produces: `GlassCard({ bloom?: string, style, ...ViewProps })`; `GlassIconButton({ label, onPress, children })` (44px circle).
- Consumes: `colors.glassFill|glassEdge|glassBorder`, `radius.card`.

- [ ] **Step 1: GlassCard**

```tsx
import { View, type ViewProps } from 'react-native';
import { colors, radius, spacing } from '@/theme/tokens';

interface Props extends ViewProps {
  /** Soft coloured halo behind the card (a platform's colour when selected). */
  bloom?: string;
}

/** Frosted card: translucent white, faint border, a white highlight along the top edge, soft shadow. */
export function GlassCard({ bloom, style, children, ...rest }: Props) {
  return (
    <View style={{ borderRadius: radius.card }}>
      {bloom ? (
        <View
          pointerEvents="none"
          style={{ position: 'absolute', left: 8, right: 8, top: 10, bottom: -6, borderRadius: radius.card, backgroundColor: bloom, opacity: 0.55, shadowColor: bloom, shadowOpacity: 1, shadowRadius: 28, shadowOffset: { width: 0, height: 10 } }}
        />
      ) : null}
      <View
        style={[
          {
            borderRadius: radius.card,
            backgroundColor: colors.glassFill,
            borderWidth: 1,
            borderColor: colors.glassBorder,
            borderTopColor: colors.glassEdge,
            padding: spacing.md,
            shadowColor: colors.shadow,
            shadowOpacity: 0.06,
            shadowRadius: 24,
            shadowOffset: { width: 0, height: 10 },
            elevation: 2,
          },
          style,
        ]}
        {...rest}
      >
        {children}
      </View>
    </View>
  );
}
```

- [ ] **Step 2: GlassIconButton**

```tsx
import type { ReactNode } from 'react';
import { Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import { select } from '@/motion/haptics';
import { usePressScale } from '@/motion/usePressScale';
import { colors, sizes } from '@/theme/tokens';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/** 44px frosted circle for back and close. Always sits inside the safe area (see Screen). */
export function GlassIconButton({ label, onPress, children }: { label: string; onPress: () => void; children: ReactNode }) {
  const press = usePressScale(0.92);
  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={6}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      onPress={() => {
        select();
        onPress();
      }}
      style={[{ width: sizes.touch, height: sizes.touch, borderRadius: sizes.touch / 2, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.glassFill, borderWidth: 1, borderColor: colors.glassBorder }, press.style]}
    >
      {children}
    </AnimatedPressable>
  );
}
```

- [ ] **Step 3: ProgressLine**

In `src/components/ProgressLine.tsx`: replace the spring-free timing with a spring, round it, and use a 3px track. Replace the withTiming line with `withSpring(value, { damping: 20, stiffness: 140 })` (import `withSpring`; keep `useReducedMotion` guard). Replace the container style with `{ height: 3, borderRadius: 2, backgroundColor: colors.hairline, overflow: 'hidden' }` and the fill with `{ height: 3, borderRadius: 2, backgroundColor: colors.primary }`. Set `sizes.progress` to `3` in tokens.

- [ ] **Step 4: Screen**

In `src/components/Screen.tsx`:

1. Imports: remove `Pressable`; add `GlassIconButton`; add `Animated, { FadeInDown }` from reanimated and `useReducedMotion`; add `motion, EASE` from tokens (and `Easing`).
2. Back button: replace the `Pressable … </Pressable>` with
   `<GlassIconButton label="Go back" onPress={() => router.back()}><BackIcon color={colors.text} /></GlassIconButton>`.
3. Entrance stagger: wrap `body` and the `footer` container in `Animated.View`s:

```tsx
const reduce = useReducedMotion();
const enter = (delay: number) => (reduce ? undefined : FadeInDown.delay(delay).duration(motion.slow).easing(Easing.bezier(...EASE)));
…
<ScrollView …>
  <Animated.View entering={enter(80)} style={{ flexGrow: 1 }}>{body}</Animated.View>
  …
</ScrollView>
{footer || … ? <Animated.View entering={enter(220)} style={styles.footer}>…</Animated.View> : null}
```

(`body` already has `flexGrow: 1` via `styles.stack`; the wrapper's `flexGrow: 1` keeps `centred` working.)

4. Header gets a stable min height so the glass buttons never touch the status bar: keep `minHeight: 52` and add `paddingTop: spacing.xs`. Safe-area is handled by `SafeAreaView edges=['top',…]`; the bug reproduction and any extra inset fix is Task 9.
5. Footer bottom spacing: `styles.footer.paddingBottom = spacing.md` stays; add `paddingBottom: Math.max(insets.bottom ? 0 : spacing.md, spacing.md)` is NOT needed because `SafeAreaView` already applies the bottom inset. Do not add more.

- [ ] **Step 5: Verify and commit**

Run: `npm run typecheck && npm test` → PASS. On the simulator walk cold-open → pick-apps and confirm glass back button, soft entrance, no clipped content.

```bash
git add -A src/components
git commit -m "Glass card and icon button; staged Screen entrance; springy progress" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 6: AnimatedHeadline and RollingNumber, applied to screens

**Files:**
- Create: `src/components/AnimatedHeadline.tsx`, `src/components/RollingNumber.tsx`
- Modify: `app/(onboarding)/{cold-open,pick-apps,total-time,talking-time,receipt,year,refund,whats-left,trust}.tsx`, `app/paywall.tsx`, `src/components/onboarding/DurationSlider.tsx`

**Interfaces:**
- Consumes: `splitWords`, `toColumns`.
- Produces: `AnimatedHeadline({ children: string, variant?: 'display'|'title'|'heading', delay?: number })`; `RollingNumber({ text: string, style?: TextStyle })`.

- [ ] **Step 1: AnimatedHeadline**

```tsx
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
}

const STAGGER = 40;

/** Headline whose words fade and rise in one after another. Re-runs when the text changes (key on text). */
export function AnimatedHeadline({ children, variant = 'title', delay = 0 }: Props) {
  const reduce = useReducedMotion();
  const words = splitWords(children);
  return (
    <View accessible accessibilityRole="header" accessibilityLabel={children} style={{ flexDirection: 'row', flexWrap: 'wrap' }} key={children}>
      {words.map((w, i) => (
        <Animated.View
          key={`${i}-${w}`}
          importantForAccessibility="no"
          entering={reduce ? undefined : FadeInDown.delay(delay + i * STAGGER).duration(motion.slow).easing(Easing.bezier(...EASE)).withInitialValues({ transform: [{ translateY: 8 }] })}
        >
          <AppText variant={variant} accessible={false}>
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </AppText>
        </Animated.View>
      ))}
    </View>
  );
}
```

- [ ] **Step 2: RollingNumber**

```tsx
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
```

Digit columns need equal width: `typeScale.readout` has `tabular-nums`, so every digit is the same width.

- [ ] **Step 3: Use them**

- `DurationSlider.tsx`: replace the `<AppText variant="readout" …>{formatReadout(value)}</AppText>` block with `<RollingNumber text={formatReadout(value)} style={{ fontSize: readoutSize, lineHeight: Math.round(readoutSize * 1.17) }} />`. Keep the `accessibilityElementsHidden` wrapper behaviour by wrapping in `<View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">`.
- Swap `<AppText variant="title">…</AppText>` for `<AnimatedHeadline>…</AnimatedHeadline>` in `pick-apps`, `total-time`, `talking-time`, `receipt` (`{line}`), `year`, `refund`, `whats-left`, `trust`, `paywall`. For template strings, pass a single string (`{`That's ${b.days} full days a year. Not talking to a single person.`}`), because `children` must be a `string`.
- `cold-open.tsx`: in `headlineView` replace the inner `<AppText variant="display" accessibilityLiveRegion="polite">{headline}</AppText>` with `<AnimatedHeadline variant="display">{headline}</AnimatedHeadline>` and drop the surrounding `FadeIn/FadeOut` wrapper (keep a plain `<View key={headline}>`); the component re-animates when `headline` changes.
- `year.tsx`: render the big figure with `RollingNumber` (the count-up already drives `shown`; keep the receipt's `yearText`). No other change.

- [ ] **Step 4: Verify and commit**

Run: `npm run typecheck && npm test` → PASS. Simulator: headlines animate word by word; slider readout digits roll; with Reduce Motion on in iOS settings everything appears instantly.

```bash
git add src app
git commit -m "Word-by-word headlines and rolling number readouts" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Platform tiles with bloom

**Files:**
- Modify: `src/components/onboarding/AppTile.tsx`

- [ ] **Step 1: Rewrite AppTile on GlassCard**

```tsx
import { Image, Pressable, View } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { metaLogos } from '@/brand/metaLogos';
import { select } from '@/motion/haptics';
import { usePressScale } from '@/motion/usePressScale';
import type { PlatformId } from '@/rules/types';
import { PLATFORM_META } from '@/state/platformMeta';
import { colors, platformBloom, radius, spacing, springs } from '@/theme/tokens';
import { AppText } from '../AppText';
import { TickIcon } from '../Icons';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/** Large glass toggle for one platform. Selected: the platform's colour blooms softly behind the tile and a tick draws in. */
export function AppTile({ id, selected, onToggle }: { id: PlatformId; selected: boolean; onToggle: () => void }) {
  const { label } = PLATFORM_META[id];
  const logo = metaLogos[id];
  const reduce = useReducedMotion();
  const press = usePressScale(0.98);
  const on = useSharedValue(selected ? 1 : 0);
  on.value = reduce ? (selected ? 1 : 0) : withSpring(selected ? 1 : 0, springs.sheet);

  const bloom = useAnimatedStyle(() => ({ opacity: on.value * 0.7, transform: [{ scale: 0.92 + on.value * 0.08 }] }));
  const tick = useAnimatedStyle(() => ({ opacity: on.value, transform: [{ scale: 0.4 + on.value * 0.6 }] }));

  return (
    <View>
      <Animated.View
        pointerEvents="none"
        style={[{ position: 'absolute', left: 10, right: 10, top: 14, bottom: -8, borderRadius: radius.tile, backgroundColor: platformBloom[id], shadowColor: platformBloom[id], shadowOpacity: 1, shadowRadius: 30, shadowOffset: { width: 0, height: 12 } }, bloom]}
      />
      <AnimatedPressable
        accessibilityRole="checkbox"
        accessibilityLabel={label}
        accessibilityState={{ checked: selected }}
        onPressIn={press.onPressIn}
        onPressOut={press.onPressOut}
        onPress={() => {
          select();
          onToggle();
        }}
        style={[
          {
            minHeight: 88,
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.md,
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
            borderRadius: radius.card,
            backgroundColor: colors.glassFill,
            borderWidth: 1,
            borderColor: selected ? colors.primary : colors.glassBorder,
            borderTopColor: selected ? colors.primary : colors.glassEdge,
          },
          press.style,
        ]}
      >
        {logo ? <Image source={logo} style={{ width: 40, height: 40 }} resizeMode="contain" accessibilityIgnoresInvertColors /> : null}
        <AppText variant="heading" style={{ flex: 1 }}>{label}</AppText>
        <View style={{ width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: selected ? colors.primary : colors.hairline, backgroundColor: selected ? colors.primary : colors.transparent }}>
          <Animated.View style={tick}>
            <TickIcon color={colors.onPrimary} />
          </Animated.View>
        </View>
      </AnimatedPressable>
    </View>
  );
}
```

Setting `on.value` during render is how reanimated drives a prop-derived value without an effect; if the lint rule `react-hooks` objects, move it into `useEffect(() => { on.value = … }, [selected, reduce])`.

- [ ] **Step 2: Verify and commit**

Run: `npm run typecheck`. Simulator: pick-apps — tapping a tile springs it, haptic fires, a pink (Instagram), grey (Threads) or blue (Facebook) halo blooms behind it, tick scales in.

```bash
git add src/components/onboarding/AppTile.tsx
git commit -m "Platform tiles: glass with a blooming halo in the platform colour" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 8: Navigation and sheet motion

**Files:**
- Modify: `app/(onboarding)/_layout.tsx`, `app/_layout.tsx`, `src/motion/haptics.ts`, `app/(onboarding)/reveal.tsx`, `app/paywall.tsx`

- [ ] **Step 1: Stack transitions**

The native stack's iOS push already has a depth parallax (the outgoing screen shifts and dims), so use it rather than a JS stack. In `app/(onboarding)/_layout.tsx` set `animation: 'default'` and `animationDuration: 380` in `screenOptions` (keep `fade` for receipt screens and `reveal`). In `app/_layout.tsx`: `paywall` → `{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }`; `legal/[doc]` the same. In the onboarding layout the `login` screen is also `slide_from_bottom`.

- [ ] **Step 2: Success haptic**

Append to `src/motion/haptics.ts`:

```ts
export const success = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
};
```

Call `success()` in `reveal.tsx` `keep()` before navigating, and in `paywall.tsx` `buy()` right after `purchase` returns `'purchased'`. Add `tick()` when the receipt prints its last line is already covered by existing `thud/tick` in `Receipt`.

- [ ] **Step 3: Sheet on reveal**

In `reveal.tsx` replace `SlideInDown.delay(SHEET_DELAY).duration(motion.slow).easing(Easing.out(Easing.cubic))` with `SlideInDown.delay(SHEET_DELAY).springify().damping(22).stiffness(180)`; sheet background `colors.glassFill` → use `colors.surface` (opaque white) because the page behind is a live WebView and glass would show it; border `colors.hairline`; add `shadowColor: colors.shadow, shadowOpacity: 0.12, shadowRadius: 30`.

- [ ] **Step 4: Verify and commit**

Run: `npm run typecheck && npm test` → PASS. Simulator: screens push with iOS depth; paywall and sign-in rise from the bottom; success haptic on keep.

```bash
git add app src/motion
git commit -m "Depth transitions, rising sheets, success haptic" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 9: Layout bugs (sign-in sheet, paywall, reveal back button, dev text)

**Files:**
- Modify: `app/(onboarding)/login.tsx`, `app/paywall.tsx`, `app/(onboarding)/reveal.tsx`, `app/(main)/inbox.tsx` (only if reproduction shows an issue)

The store screenshots are staged without a status bar, so reproduce on a real simulator before fixing anything.

- [ ] **Step 1: Reproduce with screenshots**

Run: `xcrun simctl boot "iPhone 16 Pro" 2>/dev/null; npx expo run:ios --device "iPhone 16 Pro"` (first build is slow). Then, at each of: sign-in sheet, paywall, reveal, inbox: `xcrun simctl io booted screenshot /private/tmp/claude-501/shots/<name>.png` and read the image. Record which of these actually overlap the status bar/clock or each other:
(a) login close button + URL bar, (b) paywall mark + close, (c) reveal back button over the page title ("Messages" shown as "ssages").
Expected cause for (c): in `reveal.tsx` the back button is `position: 'absolute'` over the WebView at `top: insets.top + spacing.sm`, covering the page header. For (a)/(b): check `useSafeAreaInsets()` returns a non-zero `top` inside the `fullScreenModal`; if it returns `0`, the cause is the modal's safe-area context, fixed in Step 2.

- [ ] **Step 2: Fix (c) reveal back button by moving it into a real header row**

In `reveal.tsx` delete the absolute-positioned back `Pressable`. Above the `PlatformWebView` container add:

```tsx
{router.canGoBack() && (
  <View style={{ height: 52, justifyContent: 'center', paddingHorizontal: spacing.md }}>
    <GlassIconButton label="Go back" onPress={() => router.back()}>
      <BackIcon color={colors.text} />
    </GlassIconButton>
  </View>
)}
```

The WebView container stays `flex: 1` below it, so the page title is never covered. Remove the unused `Pressable`/`radius` imports.

- [ ] **Step 3: Fix (a)/(b) if insets are 0 in the modal**

If Step 1 shows `insets.top === 0` inside `fullScreenModal`, wrap each modal screen's content in its own provider so insets are measured inside the modal: in `login.tsx` and `Screen.tsx` (used by paywall) add `import { SafeAreaProvider } from 'react-native-safe-area-context'` and wrap the returned tree in `<SafeAreaProvider>…</SafeAreaProvider>`. Re-screenshot. If insets were already non-zero, the overlap comes from the new header being too short: raise `Screen`'s `header.minHeight` to 56 and `login`'s top bar `paddingVertical` to `spacing.sm + 2`. Only keep the change that the screenshot proves necessary.

Restyle the login top bar to glass: close → `GlassIconButton`, the address pill `backgroundColor: colors.glassFill`, `borderColor: colors.glassBorder`; remove the `borderBottomWidth` lines in favour of `shadow` (hairline stays as `colors.hairline` is light now).

- [ ] **Step 4: Hide "Dev mode" in production**

In `paywall.tsx` change `{mode === 'dev' && (` (the caption block) to `{__DEV__ && mode === 'dev' && (` and change the `Continue (dev mode)` button's condition to `mode === 'dev' && __DEV__ ? … : …Subscribe` — wait: in a production build with `mode === 'dev'` (no store keys) the Subscribe button would call `purchase` against nothing. Keep behaviour the same as today in that case: only the **caption** is gated by `__DEV__`; the button label becomes `Continue` when `!__DEV__`:

```tsx
<Button label={__DEV__ ? 'Continue (dev mode)' : 'Continue'} onPress={finish} />
```

- [ ] **Step 5: Re-screenshot and commit**

Re-take the four screenshots; confirm no overlaps at iPhone 16 Pro and iPhone SE (3rd gen) and with Dynamic Type at the largest app-supported size (`xcrun simctl ui booted content_size extra-extra-extra-large`).

```bash
git add app src
git commit -m "Fix sign-in, paywall and reveal overlaps; hide dev text outside dev" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 10: Illustrations and empty middles

**Files:**
- Modify: `src/components/onboarding/ClockFace.tsx`, `app/(onboarding)/cold-open.tsx`, `app/(onboarding)/trust.tsx`, `app/(onboarding)/total-time.tsx`, `app/(onboarding)/talking-time.tsx`
- Create: `src/components/onboarding/ConversationStack.tsx`
- Modify: `app/(onboarding)/whats-left.tsx`
- Delete: `src/components/onboarding/InstagramInbox.tsx` (only after `grep -rn InstagramInbox app src __tests__` shows no other use; if `REMOVED_TABS` is imported elsewhere, move it into `ConversationStack.tsx`)

- [ ] **Step 1: ClockFace hands**

In `ClockFace.tsx`: hour hand `hand(size * 0.24, 7)`, minute hand `hand(size * 0.38, 4)`; hour hand colour `colors.text`, minute hand colour `colors.textMuted` (so they never merge when they overlap); the centre cap becomes a 14px `colors.text` dot with a 6px `colors.background` inner dot; face fill `colors.glassFill` with `colors.glassBorder` stroke and a soft shadow wrapper. Add `strokeLinecap="round"` ticks (already).

- [ ] **Step 2: Cold-open middle**

Show the clock from the start (static at 10:13) instead of mounting it on tap: in `cold-open.tsx` remove the `{spun && (` conditional around `ClockFace` so it always renders and `spun` only starts the spin; keep the entrance via `Animated.View entering={FadeIn.delay(300)}`. This fills the empty half of the screen.

- [ ] **Step 3: Trust rows**

In `trust.tsx` wrap the three rows in one `GlassCard` with `gap: spacing.md`, and give each icon container `backgroundColor: colors.lightSurface` with no border. Align the card to fill the middle (`flexGrow: 1, justifyContent: 'center'` on the pane wrapper).

- [ ] **Step 4: Slider screens**

In `total-time.tsx` and `talking-time.tsx` wrap `DurationSlider` in a `GlassCard style={{ paddingVertical: spacing.xl }}` so the readout and track sit in a visible glass panel in the middle of the screen. The slider thumb gets `borderColor: colors.surface` and a shadow (`shadowOpacity: 0.2, shadowRadius: 8`).

- [ ] **Step 5: ConversationStack replaces the Instagram copy**

`src/components/onboarding/ConversationStack.tsx`: a neutral stack of three overlapping glass conversation rows (avatar circle with an initial, a name bar, a two-line preview bar) at slight vertical offsets, with the three struck-through labels ("Feed", "Reels", "Explore") underneath using the existing `Struck` animation, and the word "Messages" in `colors.text`. Props: none. Drawn with `GlassCard`, `View`s and the existing initials only; no Instagram chrome (no Search field, notes, heart button or "Your note"). Move `Struck` and `REMOVED_TABS` from `InstagramInbox.tsx` unchanged (update colours: strike line `colors.removedOnDark`). Rows:

```tsx
const ROWS = [
  { initial: 'A', name: 'Aria', line: 'see you at 7!' },
  { initial: 'R', name: 'Rohan', line: 'sounds good 👍' },
  { initial: 'Z', name: 'Zoe', line: "what's the plan?" },
];
```

Each row: `GlassCard` (`flexDirection: 'row', alignItems: 'center', gap: spacing.md`) containing a 44px circle `backgroundColor: colors.lightSurface` with the initial in `AppText variant="bodyMedium"`, then a column with `AppText variant="bodyMedium"` (name) and `AppText variant="small" muted` (line). Rows 2 and 3 get `marginTop: -spacing.sm` and `transform: [{ scale: 0.97 }]`/`0.94` with `opacity` 0.85/0.7 for depth, entering with `FadeInDown.delay(index * 120)`. `accessibilityLabel` on the wrapper: "Your conversations. Feed, Reels and Explore are gone."

Use it in `whats-left.tsx` (`pane={<ConversationStack />}`), delete `InstagramInbox.tsx`.

- [ ] **Step 6: Verify and commit**

Run: `npm run typecheck && npm test` → PASS. Simulator: walk every onboarding screen; no screen has an empty half; clock hands distinguishable when overlapping at 10:13 → 11:00.

```bash
git add -A app src
git commit -m "Fill empty middles; clearer clock; neutral conversation stack replaces Instagram mock" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 11: Receipt, paywall, settings polish, native colours, final verification

**Files:**
- Modify: `src/components/onboarding/Receipt.tsx`, `src/components/onboarding/NotificationBanner.tsx`, `app/paywall.tsx`, `app/(main)/settings.tsx`, `app/legal/[doc].tsx`, `app/(main)/inbox.tsx`, `app.json`

- [ ] **Step 1: Receipt as a lifted paper slip**

In `Receipt.tsx` the outer paper container (the one with `backgroundColor: colors.paper`, around line 256) gets `shadowColor: colors.shadow, shadowOpacity: 0.14, shadowRadius: 24, shadowOffset: { width: 0, height: 14 }, elevation: 6`. The perforated-edge `Path` fill stays `colors.paper`; add the same shadow to the wrapper holding both teeth and body so the whole slip lifts as one. A 1px `colors.glassBorder` outline on the body keeps its edge visible on white.

- [ ] **Step 2: NotificationBanner, paywall cards, settings**

- `NotificationBanner`: container `backgroundColor: colors.glassFill`, `borderColor: colors.glassBorder`, add the `GlassCard` shadow values.
- `paywall.tsx` `PlanCard`: replace the `Pressable` container styles with `backgroundColor: on ? colors.surface : colors.glassFill`, `borderWidth: on ? 2 : 1`, `borderColor: on ? colors.primary : colors.glassBorder`, plus a card shadow when `on`. The "days free" pill keeps `colors.primary` / `onPrimary`. `MiniReceipt` gains the receipt shadow. Add `select()` haptic when a plan is tapped.
- `settings.tsx` and `legal/[doc].tsx`: grep each for `colors.surface`/`colors.hairline` boxed rows and swap boxed containers for `GlassCard`; no logic changes.
- `inbox.tsx`: `PAGE_BACKGROUND` stays `#FFFFFF`; the header and tab pills use `colors.glassFill`/`colors.glassBorder` for the unselected tab; `Screen`-less root `backgroundColor` becomes `'transparent'`.

- [ ] **Step 3: Native splash and icon colours**

View `assets/splash-icon.png` (Read the image). If the mark is white-on-transparent it will vanish on white: replace it with `assets/onlydm-brand/png/onlydm-mark-dark-1024.png` (the dark mark; confirm by viewing). In `app.json` change every `"backgroundColor": "#0A0A0A"` (splash, android adaptive icon background, any web background) to `"#FFFFFF"`. This needs a native rebuild (`npx expo prebuild` is not required for `app.json` splash edits with the dev client; run `npx expo run:ios` again) and does not change JS behaviour.

- [ ] **Step 4: Full verification**

Run: `npm run typecheck && npm run lint && npm test`
Expected: all PASS (lint warnings that existed before are fine; no new errors).

Walk the full flow on iPhone 16 Pro and iPhone SE (3rd gen) simulators, with screenshots in `/private/tmp/claude-501/shots/`: cold-open → pick-apps (select 2, see blooms) → total-time → talking-time → receipt → year → refund → whats-left → trust → login sheet → reveal → paywall → inbox → settings. Check each: nothing clipped top or bottom, back/close fully inside the safe area, no overlap with the status bar, text readable on the glow, motion smooth. Repeat once with Reduce Motion on (`Settings > Accessibility > Motion` in the simulator) and once at the largest Dynamic Type. Fix anything found with a focused follow-up commit; then:

```bash
git add -A app src app.json assets
git commit -m "Receipt slip, glass paywall and settings, light native splash" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

- [ ] **Step 5: Report**

Attach the final screenshots to the report; state plainly anything not verified (for example Android, iPad, or Reduce Motion if not run).

---

## Self-Review (done)

- **Spec coverage:** §1 tokens → T1; §2 primitives → T3-T7 (Backdrop T3, Button T4, GlassCard/Screen/ProgressLine/IconButton T5, headline/number T6, tiles T7); §3 navigation → T8; §4 per-screen → T9-T11 (dev text, reveal back button, sign-in, paywall, clock, Instagram mock, receipt, empty middles); §5 safe-area → T5/T9; §6 testing → T1, T2, T11; §7 risks → reduce-motion fallbacks in every motion task, perf via transform-only drift in T3; §8 order matches.
- **Placeholders:** none; the only conditional steps (T9 Step 3, T11 Step 3) are explicitly gated on what a screenshot shows.
- **Type consistency:** `usePressScale` returns `{style,onPressIn,onPressOut}` (T4) and is used identically in T5, T7. `GlassIconButton` props `label/onPress/children` (T5) match T9 use. `toColumns`/`splitWords` (T2) match T6. `colors.disabledFill|disabledText|glassFill|glassEdge|glassBorder`, `atmosphere`, `platformBloom`, `springs`, `EASE` (T1) are the names used later.
- **Known deviation from spec:** the native stack's own iOS push provides the depth effect; no custom JS stack is built (called out in T8).
