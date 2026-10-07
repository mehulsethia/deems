/**
 * In-app Terms of Use, Privacy Policy and How to cancel.
 * Same substance as the website's /terms/ and /privacy/ (site/app/...). Keep the two in step.
 */
import { CONTACT_EMAIL } from '@/config/links';

export const LEGAL_EFFECTIVE = '6 October 2026';

export type LegalDocId = 'terms' | 'privacy' | 'cancel';

export interface LegalLink {
  label: string;
  url: string;
}

export interface LegalSection {
  heading?: string;
  paragraphs?: string[];
  bullets?: string[];
  links?: LegalLink[];
}

export interface LegalDoc {
  title: string;
  /** "Effective …" line; omitted for help pages. */
  effective?: string;
  summary?: string[];
  sections: LegalSection[];
}

const contact: LegalSection = {
  heading: 'Contact',
  paragraphs: [`Questions or requests: ${CONTACT_EMAIL}`],
  links: [{ label: `Email ${CONTACT_EMAIL}`, url: `mailto:${CONTACT_EMAIL}?subject=OnlyDM` }],
};

export const LEGAL_DOCS: Record<LegalDocId, LegalDoc> = {
  privacy: {
    title: 'Privacy Policy',
    effective: LEGAL_EFFECTIVE,
    summary: [
      'OnlyDM never sees your password and never reads, stores or sends your messages.',
      'No accounts, no servers holding your data, no analytics and no ads.',
      'What the app keeps stays on your phone, and one tap in Settings deletes it.',
      'Payments go through Apple or Google. We never see your card.',
    ],
    sections: [
      {
        heading: 'What OnlyDM is',
        paragraphs: [
          'OnlyDM opens the official Instagram, Threads and Facebook websites in a focused window showing your messages and friends’ stories, with the feed, Reels and Explore hidden. You sign in directly with each platform, on its own page. OnlyDM is not affiliated with Meta.',
        ],
      },
      {
        heading: 'What we never collect',
        paragraphs: [
          'Your passwords, messages, photos, voice notes, stories and contacts. OnlyDM has no accounts and no login of its own. Your sign-in happens directly between you and the platform inside the app, and that session stays on your device. It never passes through or gets stored on our servers, because there is no server holding it. You can also end a session from the platform’s own “Where you’re logged in” settings.',
        ],
      },
      {
        heading: 'What we do collect',
        paragraphs: ['Nothing that identifies you.'],
        bullets: [
          'No usage analytics: the app sends no analytics or tracking events, to us or anyone else.',
          'No email address: the app never asks for one. If you email us, we use your address only to reply, and delete it on request.',
        ],
      },
      {
        heading: 'What stays on your phone',
        paragraphs: ['To work, the app keeps a few small things in local storage on your device. They never leave it:'],
        bullets: [
          'Which apps you picked, and which ones you’re signed in to.',
          'Your two setup answers, used only to draw your receipt.',
          'Where you are in setup, and which account you last looked at.',
          'The platforms’ own sign-in cookies, stored by your phone’s web view. OnlyDM doesn’t read them.',
        ],
      },
      { paragraphs: ['Settings › Sign out and clear data deletes all of it. Deleting the app does the same.'] },
      {
        heading: 'Purchases',
        paragraphs: [
          'OnlyDM offers auto-renewable subscriptions, bought through Apple or Google and billed to your store account. We never see your payment details. RevenueCat verifies your subscription status using an anonymous identifier generated on your phone, plus the store’s purchase receipt. We use that status only to unlock the app.',
        ],
      },
      {
        heading: 'Trial reminder',
        paragraphs: [
          'If you start a free trial and allow notifications, the app schedules one reminder on your phone, two days before billing starts. It is a local notification: no notification token, no server and nothing sent to us.',
        ],
      },
      {
        heading: 'Third parties',
        bullets: [
          'Meta Platforms: your Instagram, Threads and Facebook sessions inside the app are governed by Meta’s privacy policy.',
          'Apple and Google: process subscription payments under their privacy policies.',
          'RevenueCat: checks subscription status under its privacy policy.',
        ],
        links: [
          { label: 'Meta’s privacy policy', url: 'https://www.facebook.com/privacy/policy' },
          { label: 'Apple’s privacy policy', url: 'https://www.apple.com/legal/privacy/' },
          { label: 'Google’s privacy policy', url: 'https://policies.google.com/privacy' },
          { label: 'RevenueCat’s privacy policy', url: 'https://www.revenuecat.com/privacy' },
        ],
      },
      {
        heading: 'Children',
        paragraphs: [
          'OnlyDM is not meant for children under 13, or under the minimum age to use Instagram, Threads or Facebook where you live.',
        ],
      },
      {
        heading: 'Changes',
        paragraphs: ['If this policy changes, we’ll update the date at the top, and say so in the app before a change to what we collect takes effect.'],
      },
      contact,
    ],
  },

  terms: {
    title: 'Terms of Use',
    effective: LEGAL_EFFECTIVE,
    sections: [
      {
        heading: 'The agreement',
        paragraphs: [
          'On iPhone, OnlyDM is licensed to you under Apple’s Standard End User License Agreement, which these terms supplement. On Android, Google Play’s terms apply alongside these. By using OnlyDM you agree to both.',
        ],
        links: [{ label: 'Apple’s Standard EULA', url: 'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/' }],
      },
      {
        heading: 'Subscriptions',
        paragraphs: ['OnlyDM is a paid app with auto-renewable subscriptions, billed and managed by Apple or Google through your store account.'],
        bullets: [
          'Monthly: $3.99 a month (₹299 in India).',
          'Yearly: $14.99 a year (₹999 in India), with a 7-day free trial for new subscribers.',
          'Prices are shown in your local currency before you buy and may differ by country.',
          'With a free trial you are charged when it ends, unless you cancel before.',
          'All plans renew automatically until cancelled. Cancellation takes effect at the end of the current billing period. Deleting the app does not cancel a subscription.',
          'A subscription unlocks OnlyDM on any device signed in to the same Apple ID or Google account. Use Restore purchases after a reinstall.',
          'Refunds are handled by Apple or Google under their policies.',
        ],
        links: [
          { label: 'Request a refund from Apple', url: 'https://reportaproblem.apple.com/' },
          { label: 'Google Play refund policy', url: 'https://support.google.com/googleplay/answer/2479637' },
        ],
      },
      {
        heading: 'Instagram, Threads and Facebook',
        paragraphs: [
          'OnlyDM is not affiliated with, endorsed by, or sponsored by Instagram, Threads, Facebook or Meta Platforms, Inc. You need your own accounts, and your use of them inside OnlyDM remains governed by their own terms. OnlyDM shows their websites with the feed, Reels and Explore hidden; they may change their sites in ways that affect OnlyDM at any time.',
        ],
      },
      {
        heading: 'Using OnlyDM',
        paragraphs: [
          'You must be at least 13, and old enough to use these platforms where you live. Don’t use OnlyDM to break the law or another service’s rules, or to copy, resell, reverse engineer or disrupt the app.',
        ],
      },
      {
        heading: 'No warranty',
        paragraphs: [
          'OnlyDM is provided as is, without warranty of any kind. We are not liable for anything Instagram, Threads or Facebook do to your account, for messages you send or receive, or for interruptions caused by changes to their websites. As far as the law allows, our total liability is limited to what you paid for OnlyDM in the 12 months before a claim. Nothing here limits consumer rights that can’t be excluded.',
        ],
      },
      {
        heading: 'Changes',
        paragraphs: ['We may update these terms. We’ll change the date at the top and tell you in the app about important changes before they apply.'],
      },
      contact,
    ],
  },

  cancel: {
    title: 'How to cancel',
    summary: [
      'Cancel any time. You keep OnlyDM until the end of the period you’ve paid for.',
      'Cancel a free trial before it ends and you won’t be charged.',
      'Deleting the app does not cancel your subscription.',
    ],
    sections: [
      {
        heading: 'On iPhone',
        bullets: [
          'Open the Settings app.',
          'Tap your name, then Subscriptions.',
          'Tap OnlyDM, then Cancel Subscription.',
        ],
      },
      {
        heading: 'On Android',
        bullets: [
          'Open the Google Play Store.',
          'Tap your profile picture, then Payments & subscriptions › Subscriptions.',
          'Tap OnlyDM, then Cancel subscription.',
        ],
      },
      {
        heading: 'Refunds',
        paragraphs: ['Refunds are handled by Apple or Google, not by us.'],
        links: [
          { label: 'Request a refund from Apple', url: 'https://reportaproblem.apple.com/' },
          { label: 'Google Play refund policy', url: 'https://support.google.com/googleplay/answer/2479637' },
        ],
      },
      contact,
    ],
  },
};

export const isLegalDocId = (v: unknown): v is LegalDocId => v === 'terms' || v === 'privacy' || v === 'cancel';
