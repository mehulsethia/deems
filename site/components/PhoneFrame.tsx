import Image from 'next/image';

/** A real screenshot of the Deems app (site/public/screens) in an iPhone-style frame. */
export const SCREENS = {
  pickApps: '/screens/03-pick-apps.jpg',
  receipt: '/screens/06-receipt.jpg',
  year: '/screens/07-year.jpg',
  refund: '/screens/08-refund.jpg',
  whatsLeft: '/screens/10-whats-left-peeled.jpg',
  trust: '/screens/11-trust.jpg',
} as const;

function StatusIcons() {
  return (
    <span className="phone-status-icons" aria-hidden>
      <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor">
        <rect x="0" y="7" width="3" height="4" rx="1" />
        <rect x="4.5" y="5" width="3" height="6" rx="1" />
        <rect x="9" y="2.5" width="3" height="8.5" rx="1" />
        <rect x="13.5" y="0" width="3" height="11" rx="1" />
      </svg>
      <svg width="15" height="11" viewBox="0 0 15 11" fill="currentColor">
        <path d="M7.5 2.2c2 0 3.9.8 5.3 2.1l1.2-1.2A9.2 9.2 0 007.5.5 9.2 9.2 0 001 3.1l1.2 1.2a7.6 7.6 0 015.3-2.1zm0 3.3c1.1 0 2.2.4 3 1.2l1.2-1.2a6 6 0 00-8.4 0l1.2 1.2c.8-.8 1.9-1.2 3-1.2zm0 3.3c.4 0 .7.1 1 .4L7.5 10.5 6.5 9.2c.3-.3.6-.4 1-.4z" />
      </svg>
      <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
        <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="currentColor" opacity="0.4" />
        <rect x="2" y="2" width="18" height="8" rx="2" fill="currentColor" />
        <path d="M23 4v4c.8-.3 1.3-1.1 1.3-2S23.8 4.3 23 4z" fill="currentColor" opacity="0.5" />
      </svg>
    </span>
  );
}

export function PhoneFrame({ src, alt, priority = false }: { src: string; alt: string; priority?: boolean }) {
  return (
    <div className="phone">
      <div className="phone-screen">
        <div className="phone-island" aria-hidden />
        <div className="phone-status" aria-hidden>
          <span>9:41</span>
          <StatusIcons />
        </div>
        <Image src={src} alt={alt} width={1170} height={2532} priority={priority} sizes="(max-width: 720px) 60vw, 340px" />
      </div>
    </div>
  );
}
