import Image from 'next/image';

export type Platform = 'instagram' | 'threads' | 'facebook';

/**
 * Official logos, copied unmodified from assets/brand/meta and the Threads brand pack.
 * Threads has a black and a white file; Instagram and Facebook read on both.
 */
const LOGOS: Record<Platform, { name: string; light: string; dark: string; w: number; h: number }> = {
  instagram: { name: 'Instagram', light: '/brand/meta/instagram.png', dark: '/brand/meta/instagram.png', w: 240, h: 240 },
  threads: { name: 'Threads', light: '/brand/meta/threads-black.svg', dark: '/brand/meta/threads-white.svg', w: 977, h: 1082 },
  facebook: { name: 'Facebook', light: '/brand/meta/facebook.png', dark: '/brand/meta/facebook.png', w: 240, h: 240 },
};

export const PLATFORM_ORDER: Platform[] = ['instagram', 'threads', 'facebook'];

export const platformName = (p: Platform) => LOGOS[p].name;

/** `on` is the background the logo sits on. Pass `alt` when the logo is the only label. */
export function PlatformLogo({
  platform,
  size,
  on = 'light',
  alt = '',
  className,
}: {
  platform: Platform;
  size: number;
  on?: 'light' | 'dark';
  alt?: string;
  className?: string;
}) {
  const l = LOGOS[platform];
  return (
    <Image
      src={on === 'light' ? l.light : l.dark}
      alt={alt}
      width={Math.round((size * l.w) / l.h)}
      height={size}
      className={className}
    />
  );
}
