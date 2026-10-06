import type { PlatformId } from '@/rules/types';

/** User-facing names for each platform. The Messenger pack is the Facebook inbox, so users see "Facebook". */
export interface PlatformMeta {
  label: string;
  domain: string;
  helpUrl: string;
}

export const PLATFORM_META: Record<PlatformId, PlatformMeta> = {
  instagram: { label: 'Instagram', domain: 'instagram.com', helpUrl: 'https://help.instagram.com/' },
  threads: { label: 'Threads', domain: 'threads.com', helpUrl: 'https://help.instagram.com/' },
  messenger: { label: 'Facebook', domain: 'facebook.com', helpUrl: 'https://www.facebook.com/help/' },
};

/** Tile order on the "pick apps" screen; also the sign-in order. */
export const PICK_ORDER: readonly PlatformId[] = ['instagram', 'threads', 'messenger'];

export const platformLabel = (id: PlatformId) => PLATFORM_META[id].label;

/** Keeps only known ids, de-duplicated, in pick order. */
export function normalisePicked(ids: readonly string[]): PlatformId[] {
  return PICK_ORDER.filter((id) => ids.includes(id));
}
