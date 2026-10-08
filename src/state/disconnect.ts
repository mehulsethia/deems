import { Platform } from 'react-native';
import CookieManager from '@react-native-cookies/cookies';
import type { PlatformId } from '@/rules/types';
import { markSignedOutOf } from './platforms';

/**
 * The sites whose sign-in cookies belong to each platform. Both the bare and www hosts are listed because
 * iOS only clears a cookie when its domain matches the host exactly (".instagram.com" needs "instagram.com").
 * Threads is listed on its own so disconnecting it never signs you out of Instagram.
 */
const COOKIE_SITES: Record<PlatformId, string[]> = {
  instagram: ['https://instagram.com', 'https://www.instagram.com'],
  threads: ['https://threads.com', 'https://www.threads.com', 'https://threads.net', 'https://www.threads.net'],
  messenger: ['https://facebook.com', 'https://www.facebook.com', 'https://m.facebook.com'],
};

const EXPIRED = '1970-01-01T00:00:00.000Z';

/** Removes one platform's sign-in from this phone and marks it disconnected. Other platforms stay signed in. */
export async function disconnectPlatform(id: PlatformId): Promise<void> {
  const sites = COOKIE_SITES[id];
  for (const url of sites) {
    try {
      const cookies = await CookieManager.get(url, true);
      for (const name of Object.keys(cookies)) {
        if (Platform.OS === 'ios') {
          for (const site of sites) await CookieManager.clearByName(site, name, true).catch(() => false);
        } else {
          // Android has no delete-by-name; an expired copy replaces the cookie.
          const host = url.replace(/^https:\/\/(www\.|m\.)?/, '');
          await CookieManager.set(url, { name, value: '', domain: `.${host}`, path: '/', expires: EXPIRED }).catch(() => false);
          await CookieManager.set(url, { name, value: '', path: '/', expires: EXPIRED }).catch(() => false);
        }
      }
    } catch {
      // Unsupported on this platform (web build); the signed-in flag below still resets.
    }
  }
  if (Platform.OS === 'android') await CookieManager.flush().catch(() => {});
  markSignedOutOf(id);
}
