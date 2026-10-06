import Link from 'next/link';
import { contactHref, site } from '@/lib/site';
import { DeemsMark } from './DeemsMark';

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div style={{ display: 'grid', gap: 8 }}>
            <span className="brand">
              <DeemsMark size={24} />
              Deems
            </span>
            <span className="muted">{site.tagline}</span>
          </div>
          <nav aria-label="Footer">
            <Link href="/privacy/">Privacy</Link>
            <Link href="/terms/">Terms</Link>
            <a href={contactHref}>{site.contactEmail}</a>
          </nav>
        </div>
        <p className="fine">
          Not affiliated with Meta. Instagram, Threads and Facebook are trademarks of Meta Platforms, Inc. Deems shows their
          own websites, with the feed, Reels and Explore hidden.
        </p>
        <p className="fine">© {new Date().getFullYear()} Deems</p>
      </div>
    </footer>
  );
}
