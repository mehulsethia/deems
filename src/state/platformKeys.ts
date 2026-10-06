import type { PlatformId } from '@/rules/types';

/** Instagram keeps its original key so existing installs stay signed in. Pure: no storage import. */
export const signedInKey = (id: PlatformId): string => (id === 'instagram' ? 'signedIn' : `signedIn:${id}`);
