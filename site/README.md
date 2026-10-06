# Deems website

One-page marketing site plus `/privacy/` and `/terms/`. A separate Next.js project with its own
dependencies; it shares nothing with the app except the brand colours and copy.

## Run

```bash
cd site
npm install
npm run dev        # http://localhost:3000
npm run build      # static export to site/out
```

## Before launch

Set these as environment variables on your host (or in `site/.env.local`):

| Variable | What it does |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Your domain, e.g. `https://deems.app` (used for share previews). |
| `NEXT_PUBLIC_APP_STORE_URL` | App Store listing. Until set, the main button is "Get early access" (email). |
| `NEXT_PUBLIC_PLAY_STORE_URL` | Google Play listing. Until set, Android shows "Get on the list" (email). |

Then check `lib/site.ts`:

- `legal.operator`: the person or company that runs Deems, as it should appear in the policies.
- `legal.governingLaw`: e.g. `the laws of India`. While empty, the terms leave that clause out.
- `trialDays`: must match the free trial set in App Store Connect and Google Play.

In the app, set `EXPO_PUBLIC_SITE_URL` to the same domain so Settings and the paywall link to these pages.

## Deploy

Vercel: import the repo and set **Root Directory** to `site`. Any static host works too: upload `site/out`.

## Notes

- `public/screens/` are real screenshots of the Deems app (its web build, 1170×2532). Retake them when the app's UI
  changes: build the app for web, walk the onboarding at 390×844 @3x and save as JPEG.
- `public/platforms/` holds the official Instagram, Threads and Facebook logos from the brand packs in `../assets`,
  scaled down and otherwise unmodified. Don't recolour or redraw them.
- Animations use Motion (`motion/react`) and respect the visitor's Reduce Motion setting (`MotionProvider`).

- Brand colours are CSS variables at the top of `app/globals.css` (same values as the app's tokens).
- The receipt maths in `lib/maths.ts` is a copy of the app's `src/onboarding/maths.ts`. Keep them in step.
- Favicons and `site.webmanifest` in `public/` come from `assets/deems-brand/favicon`.
- No cookies, analytics or third-party requests: fonts are bundled. The privacy policy says so; keep it true.
