/**
 * Everything you might need to change before launch lives here.
 * Store links come from env vars so the same build works before and after launch.
 */
export const site = {
  name: 'DeeMs',
  tagline: 'Reply and leave.',
  description:
    'Your Instagram, Threads and Facebook messages and your friends’ stories. Without the feed, Reels or Explore.',
  /** Public URL of the site, used for social previews. */
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  /** App Store and Google Play listings. While unset, the buttons become "Get early access" (email). */
  appStoreUrl: process.env.NEXT_PUBLIC_APP_STORE_URL || '',
  playStoreUrl: process.env.NEXT_PUBLIC_PLAY_STORE_URL || '',
  contactEmail: 'sethiamehul14@gmail.com',
  /** Must match the free trial configured in App Store Connect / Google Play. */
  trialDays: 7,
  /** The reminder is scheduled this many days before billing starts (see the app's trial reminder). */
  reminderDaysBefore: 2,
  legal: {
    /** The person or company that operates DeeMs, as it should appear in the policies. */
    operator: 'DeeMs',
    updated: '6 October 2026',
    /** e.g. "the laws of India". Leave empty and the governing-law clause is left out of the terms. */
    governingLaw: '',
  },
} as const;

export const earlyAccessHref = (platform: string) =>
  `mailto:${site.contactEmail}?subject=${encodeURIComponent(`DeeMs early access (${platform})`)}`;

export const contactHref = `mailto:${site.contactEmail}?subject=${encodeURIComponent('DeeMs')}`;
