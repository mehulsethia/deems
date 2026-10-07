# OnlyDM website

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
| `NEXT_PUBLIC_SITE_URL` | Optional. Defaults to `https://getonlydm.com` (share previews, canonical link). |
| `NEXT_PUBLIC_APP_STORE_ID` | The numeric App Store ID. Once set, "Get OnlyDM" and the QR go to `https://apps.apple.com/app/onlydm/id<ID>`. Until then they open an early-access email to sethiamehul14@gmail.com. |
| `NEXT_PUBLIC_PLAY_STORE_LIVE` | Set to `true` once the Android app is on Google Play. The Android link then goes to `https://play.google.com/store/apps/details?id=com.onlydm.app`. |

Then check `lib/site.ts`:

- `legal.operator`: the person or company that runs OnlyDM, as it should appear in the policies.
- `legal.governingLaw`: e.g. `the laws of India`. While empty, the terms leave that clause out.
- `trialDays`: must match the free trial set in App Store Connect and Google Play.

In the app, set `EXPO_PUBLIC_SITE_URL` to the same domain so Settings and the paywall link to these pages.

## Deploy

Vercel: import the repo and set **Root Directory** to `site`. Any static host works too: upload `site/out`.

## Pricing

Launch prices live in `lib/pricing.ts`: $3.99 a month and $14.99 a year (base price), ₹299 and ₹999 in India,
with a 7-day free trial on yearly. Visitors in India (by time zone or an `-IN` language) see rupees. The saving is
computed from those numbers. They must match what's set in App Store Connect and the Google Play Console.

## Notes

- `public/platforms/` holds the official Instagram, Threads and Facebook logos from the brand packs in `../assets`,
  scaled down and otherwise unmodified. Don't recolour or redraw them.
- Animations use Motion (`motion/react`) and respect the visitor's Reduce Motion setting (`MotionProvider`).

- Brand colours are CSS variables at the top of `app/globals.css` (same values as the app's tokens).
- The receipt maths in `lib/maths.ts` is a copy of the app's `src/onboarding/maths.ts`. Keep them in step.
- Favicons and `site.webmanifest` in `public/` come from `assets/onlydm-brand/favicon`.
- No cookies, analytics or third-party requests: fonts are bundled. The privacy policy says so; keep it true.
