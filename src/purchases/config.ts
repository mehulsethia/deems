import { Platform } from 'react-native';

/** Public SDK keys from env (EXPO_PUBLIC_*). Absent keys mean dev mode: everything unlocked. */
const IOS_KEY = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY;
const ANDROID_KEY = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY;

export const revenueCatKey: string | undefined = (Platform.OS === 'ios' ? IOS_KEY : ANDROID_KEY) || undefined;

const APPLE_STANDARD_EULA = 'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/';

export const LEGAL = {
  terms: process.env.EXPO_PUBLIC_TERMS_URL || APPLE_STANDARD_EULA,
  /** Required by the App Store; set EXPO_PUBLIC_PRIVACY_URL before submitting. */
  privacy: process.env.EXPO_PUBLIC_PRIVACY_URL || '',
};

export const STORE = Platform.OS === 'ios' ? ('App Store' as const) : ('Google Play' as const);

export const MANAGE_SUBSCRIPTIONS_URL =
  Platform.OS === 'ios' ? 'https://apps.apple.com/account/subscriptions' : 'https://play.google.com/store/account/subscriptions';
