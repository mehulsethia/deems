import { Platform } from 'react-native';

/** The marketing site (site/ in this repo). Its /privacy/ and /terms/ pages are the app's legal pages. */
export const SITE_URL = (process.env.EXPO_PUBLIC_SITE_URL || 'https://getonlydm.com').replace(/\/+$/, '');

export const CONTACT_EMAIL = 'support@getonlydm.com';
export const CONTACT_URL = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('OnlyDM')}`;

/** Store help pages explaining how to cancel a subscription. */
export const HOW_TO_CANCEL_URL =
  Platform.OS === 'ios' ? 'https://support.apple.com/en-us/118428' : 'https://support.google.com/googleplay/answer/7018481';
