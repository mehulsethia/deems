import Image from 'next/image';

/**
 * Instagram, Threads and Facebook as interactive icons, using the official files in public/brand/meta.
 * Each has its own hover: Instagram's gradient glow, Facebook blue with a bounce, Threads inverting
 * with a radar pulse. Focusable, with a tooltip and an accessible name.
 */
const ICONS = [
  {
    id: 'instagram',
    name: 'Instagram',
    rest: { light: '/brand/meta/instagram.png', dark: '/brand/meta/instagram.png', w: 240, h: 240 },
    hover: { light: '/brand/meta/instagram-white.svg', dark: '/brand/meta/instagram-white.svg', w: 1, h: 1 },
  },
  {
    id: 'threads',
    name: 'Threads',
    rest: { light: '/brand/meta/threads-black.svg', dark: '/brand/meta/threads-white.svg', w: 977, h: 1082 },
    hover: { light: '/brand/meta/threads-white.svg', dark: '/brand/meta/threads-black.svg', w: 977, h: 1082 },
  },
  {
    id: 'facebook',
    name: 'Facebook',
    rest: { light: '/brand/meta/facebook.png', dark: '/brand/meta/facebook.png', w: 240, h: 240 },
    hover: { light: '/brand/meta/facebook.png', dark: '/brand/meta/facebook.png', w: 240, h: 240 },
  },
] as const;

export function PlatformIcons({
  on = 'light',
  size = 22,
  label = 'Works with',
  inline = false,
}: {
  on?: 'light' | 'dark';
  size?: number;
  label?: string;
  /** Sits inside a sentence: smaller chips, aligned to the text. */
  inline?: boolean;
}) {
  return (
    // Spans with list roles, so the row can also sit inside a sentence.
    <span role="list" className={`social-icons on-${on}${inline ? ' inline' : ''}`} aria-label={`${label} Instagram, Threads and Facebook`.trim()}>
      {ICONS.map((icon) => {
        const w = (img: { w: number; h: number }) => Math.round((size * img.w) / img.h);
        return (
          <span role="listitem" key={icon.id}>
            <span className={`social-icon ${icon.id}`} tabIndex={0} role="img" aria-label={icon.name} data-tip={icon.name}>
              <Image className="si-rest" src={icon.rest[on]} alt="" width={w(icon.rest)} height={size} />
              <Image className="si-hover" src={icon.hover[on]} alt="" width={w(icon.hover)} height={size} />
            </span>
          </span>
        );
      })}
    </span>
  );
}
