/**
 * Everything you might need to change before launch lives here.
 * Store links switch on through env vars, so the same build works before and after launch.
 */

/** The app's bundle identifier (iOS) and package name (Android). Must match app.json. */
export const APP_ID = 'com.onlydm.app';

/** Numeric App Store ID (App Store Connect › App Information › Apple ID), once the app is live. */
const appStoreId = process.env.NEXT_PUBLIC_APP_STORE_ID || '';
/** Set to "true" once the Android app is published on Google Play. */
const playLive = process.env.NEXT_PUBLIC_PLAY_STORE_LIVE === 'true';

export const site = {
  name: 'OnlyDM',
  domain: 'getonlydm.com',
  tagline: 'Reply and leave.',
  /** Used in titles and share previews. */
  headline: 'Quit the scroll. Keep your people.',
  description:
    'Only DMs, zero distractions. OnlyDM opens Instagram, Threads and Facebook straight to your messages. No feed, no Reels, no Explore.',
  /** Public URL of the site, used for share previews and canonical links. */
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://getonlydm.com').replace(/\/+$/, ''),
  /** App Store and Google Play listings. While unset, "Get OnlyDM" asks for early access by email. */
  appStoreUrl: appStoreId ? `https://apps.apple.com/app/onlydm/id${appStoreId}` : '',
  playStoreUrl: playLive ? `https://play.google.com/store/apps/details?id=${APP_ID}` : '',
  /** Support and legal questions. */
  contactEmail: 'sethiamehul14@gmail.com',
  /** Early-access sign-ups before launch. */
  earlyAccessEmail: 'sethiamehul14@gmail.com',
  /** Must match the free trial configured in App Store Connect / Google Play. */
  trialDays: 7,
  /** The reminder is scheduled this many days before billing starts (see the app's trial reminder). */
  reminderDaysBefore: 2,
  legal: {
    /** The person or company that operates OnlyDM, as it should appear in the policies. */
    operator: 'OnlyDM',
    updated: '6 October 2026',
    /** e.g. "the laws of India". Leave empty and the governing-law clause is left out of the terms. */
    governingLaw: '',
  },
} as const;

export const earlyAccessHref = (platform: string) =>
  `mailto:${site.earlyAccessEmail}?subject=${encodeURIComponent(`OnlyDM early access (${platform})`)}`;

export const contactHref = `mailto:${site.contactEmail}?subject=${encodeURIComponent('OnlyDM')}`;
