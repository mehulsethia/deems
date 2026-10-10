import type { ImageSourcePropType } from 'react-native';
import type { PlatformId } from '@/rules/types';

/**
 * Official logos from Meta's brand resources (assets/Instagram Asset Pack, Threads-Brand-Resource-Center,
 * Facebook Brand Asset Pack), scaled down to 240px for the app and otherwise unmodified.
 * Threads uses the black logo because the tiles sit on a light surface.
 */
export const metaLogos: Record<PlatformId, ImageSourcePropType | null> = {
  instagram: require('../../assets/brand/meta/instagram.png'),
  threads: require('../../assets/brand/meta/threads.png'),
  messenger: require('../../assets/brand/meta/facebook.png'),
};
