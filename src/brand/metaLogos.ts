import type { ImageSourcePropType } from 'react-native';
import type { PlatformId } from '@/rules/types';

/**
 * Official logos from Meta's brand resources, used unmodified.
 * Metro needs a static require for each file, and a require of a missing file breaks the build,
 * so each entry stays null until its file exists in assets/brand/meta/. While null, the tile shows
 * the app name in text instead.
 *
 * When the files are added:
 *   instagram: require('../../assets/brand/meta/instagram.png'),
 *   threads: require('../../assets/brand/meta/threads.png'),
 *   messenger: require('../../assets/brand/meta/facebook.png'),
 */
export const metaLogos: Record<PlatformId, ImageSourcePropType | null> = {
  instagram: null,
  threads: null,
  messenger: null,
};
