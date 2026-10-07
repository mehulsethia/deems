import { Platform } from 'react-native';
import { SITE_URL } from '@/config/links';

/** Public SDK keys from env (EXPO_PUBLIC_*). Absent keys mean dev mode: everything unlocked. */
const IOS_KEY = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY;
const ANDROID_KEY = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY;

export const revenueCatKey: string | undefined = (Platform.OS === 'ios' ? IOS_KEY : ANDROID_KEY) || undefined;

const APPLE_STANDARD_EULA = 'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/';

/** The marketing site (getonlydm.com) hosts the legal pages; explicit URLs override it. */
export const LEGAL = {
  /** Our terms (which supplement Apple's standard EULA), or the EULA itself until the site is live. */
  terms: process.env.EXPO_PUBLIC_TERMS_URL || (SITE_URL ? `${SITE_URL}/terms/` : APPLE_STANDARD_EULA),
  /** Required by the App Store. Comes from EXPO_PUBLIC_SITE_URL or EXPO_PUBLIC_PRIVACY_URL. */
  privacy: process.env.EXPO_PUBLIC_PRIVACY_URL || (SITE_URL ? `${SITE_URL}/privacy/` : ''),
};

export const STORE = Platform.OS === 'ios' ? ('App Store' as const) : ('Google Play' as const);

export const MANAGE_SUBSCRIPTIONS_URL =
  Platform.OS === 'ios' ? 'https://apps.apple.com/account/subscriptions' : 'https://play.google.com/store/account/subscriptions';
