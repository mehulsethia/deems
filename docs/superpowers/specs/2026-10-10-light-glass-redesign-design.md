# OnlyDM "Light Glass" redesign: design spec

Date: 2026-10-10. Status: draft for review.

## Goal

The app should feel premium, calm and pleasant to open, with onboarding that is smooth and attractive. Today it reads as a flat template: black screens, grey boxes, one white button, heavy headlines, empty middles, no motion, and several layout overlaps. The redesign moves it to a light, airy "glass" look that matches the landing page (white, near-black ink, Inter, 20px radius).

Out of scope: onboarding logic, flow order, copy, purchases, rules/WebView behaviour.

## Decisions already made

- Light theme only, white base like the landing page (not dark, not system-switching).
- Approach 1: token-first reskin using SVG gradients. No new native dependency, no dev-client rebuild. Real blur (`expo-blur`) can be added later inside `GlassCard` only.
- Platform logos remain the only saturated colour. A selected app blooms softly behind its tile.
- The receipt becomes a lifted paper slip (soft shadow plus faint paper texture) so it stays distinct on the white screen.

## 1. Tokens ([src/theme/tokens.ts](../../../src/theme/tokens.ts))

Keep semantic names so the ~40 call sites keep working; change values and add a few.

- `background` #FFFFFF; `backgroundTint` #F7F8FB (used under the glow). `text` #0A0A0A, `textMuted` #6B6B6B (stays AA on white).
- `primary` near-black #0A0A0A, `onPrimary` white. Primary button is a dark pill, the inverse of today.
- `surface` becomes translucent white `rgba(255,255,255,0.72)`; `hairline` `rgba(10,10,10,0.08)`; add `glassEdge` `rgba(255,255,255,0.9)` (inner top highlight) and `shadowSoft` `rgba(20,24,40,0.08)`.
- Glow palette (backdrop only, never UI): `glowBlue` #BFD4FF, `glowViolet` #D9C9FF, `glowPink` #FFCFE3, at 55-70% opacity. These echo the three logo dots.
- Per-platform bloom colours come from the Meta logos (Instagram magenta/orange, Threads grey-black, Facebook/Messenger blue).
- Type: keep Inter and its loaded weights. Headlines drop from ExtraBold/Black to SemiBold (600) with tighter tracking, so hierarchy comes from weight contrast (headline 600, body 400, labels 500) and not size alone. Add one large `display` size for hero numbers. Bricolage stays wordmark-only; Nunito stays for chat text.
- Radius `card` 16 → 22; add `radius.tile` 28. Motion tokens gain spring presets (`springPress`, `springSheet`) and the site easing `cubic-bezier(0.22, 1, 0.36, 1)`.

## 2. Primitives (new or rewritten, all in `src/components`)

| Component | Behaviour |
|---|---|
| `Backdrop` | Full-screen layer behind every screen. Three blurred `react-native-svg` radial gradients (blue, violet, pink) drifting on slow, offset Reanimated loops (20-30s). A tiled grain PNG at 3% opacity on top to prevent banding. Respects reduce-motion (static glow). Rendered once in the root layout, not per screen, so transitions slide over a stable background. |
| `GlassCard` (replaces `Card`) | Translucent white fill, 1px hairline, 1px white top highlight, soft large-radius shadow. Optional `bloom` colour prop. |
| `Button` | Variants: `primary` (dark pill), `secondary` (glass pill), `ghost`. Press = spring scale to 0.97 plus `tick()`. Disabled = same fill at lower contrast with a visible label (fixes the muddy grey). Optional subtle sheen on primary. |
| `AnimatedHeadline` | Splits text into words; each fades and rises 8px with a 40ms stagger. Reduce-motion: plain fade. Used in place of `AppText variant="display/title"` on onboarding screens. |
| `RollingNumber` | Digit-wheel roll to a target value for all time readouts (total time, talking time, year). Tabular figures. |
| `AppTile` | Glass tile. On select: spring scale, `select()` haptic, tick draws in, and a soft blurred bloom in the platform colour fades in behind it. |
| `ProgressLine` | Rounded 3px track, gradient fill, spring-eased. |
| `Screen` | Transparent background (Backdrop shows through). Header fixed: back and close buttons become 44px glass circles inside the safe area. Adds an `entering` stagger for children (headline, pane, footer). |

Haptics (existing `tick`, `thud`, `select`) fire on: button press, tile toggle, slider detents, number landing, reveal, purchase success. Add `success()` (notification feedback) for the reveal and purchase.

## 3. Navigation and motion

- Onboarding stack: slide with depth (outgoing screen scales to 0.96 and dims slightly; incoming slides in). The receipt screens keep their cross-fade.
- Paywall and sign-in sheet: spring sheet presentation with a rounded top and grabber.
- Main to paywall: fade-up.
- All motion honours `useReducedMotion`.

## 4. Per-screen pass

- **cold-open, total-time, talking-time, whats-left, trust, reveal**: fill the empty middle with a hero element (clock, big rolling number, glass illustration) and anchor text and button at top and bottom.
- **ClockFace**: fix the overlapping hands (distinct hour and minute lengths and widths, visible centre cap).
- **InstagramInbox illustration**: replace the near-copy of Instagram's inbox with a neutral, abstract glass "stack of conversations" (avatars, bars). This removes the App Store review risk.
- **Receipt**: lifted paper slip with shadow and texture; mono type unchanged.
- **pick-apps**: glass tiles with blooms; "Next" uses the new disabled style.
- **Paywall**: logo and close button inside the safe area, no overlap with the clock. The "Dev mode" line renders only when `__DEV__`.
- **Sign-in sheet / WebView host**: close button and URL bar sit below the status bar (safe-area top inset), with a glass header.
- **Inbox**: back button moved so it no longer covers the page title ("Messages"); the title and tab bar respect safe-area insets.
- **Settings, legal**: glass cards and the new type; no structural change.

## 5. Layout robustness (point 5)

- Every screen's top bar, footer and pinned elements use `useSafeAreaInsets` (bottom inset plus a minimum 16px gap above the home indicator).
- Content scrolls when it cannot fit (already true in `Screen`); verify at 130% Dynamic Type and on iPhone SE and Pro Max sizes.
- Absolute-positioned elements (paywall badge, close buttons, WebView progress) get explicit inset handling.

## 6. Testing and verification

- Unit tests (jest): word-splitting for `AnimatedHeadline`, digit-sequence logic for `RollingNumber`, token contrast checks (extend [tokens.test.ts](../../../__tests__/tokens.test.ts): text and muted on white, primary button, disabled label, all ≥ WCAG AA).
- `npm run typecheck` and `npm test` must pass.
- Manual device/simulator pass over every screen at iPhone SE, iPhone 16 Pro Max, and iPad, with Dynamic Type 130%, Reduce Motion on, and a first-run walk through onboarding to the paywall and the inbox. Screenshots recorded before declaring done.
- Store review screenshots in `store/review-screenshots` are regenerated afterwards (separate follow-up).

## 7. Risks

- SVG blur performance on older devices: mitigate with a small number of layers, `useNativeDriver`-equivalent Reanimated transforms (animate translate/opacity, not blur radius), and a static fallback under reduce-motion or low-end detection.
- Light-on-light legibility of glass cards: mitigated by the hairline edge, soft shadow and AA-checked tokens.
- The landing page's hero demo uses the old dark in-phone UI. Not touched here; align later if wanted.

## 8. Delivery order

1. Tokens + `Backdrop` + `GlassCard` + `Button` + `Screen` (whole app is reskinned).
2. Motion primitives (`AnimatedHeadline`, `RollingNumber`, tile bloom, navigation depth).
3. Layout-bug fixes (paywall, sign-in sheet, inbox, dev text).
4. Per-screen illustrations and empty-middle work.
5. Verification pass.
