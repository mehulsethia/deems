import Link from 'next/link';
import { contactHref, site } from '@/lib/site';
import { OnlyDMMark } from './OnlyDMMark';
import { Wordmark } from './Wordmark';

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div style={{ display: 'grid', gap: 10 }}>
            <span className="brand">
              <OnlyDMMark size={26} on="dark" />
              <Wordmark />
            </span>
            <span className="muted">{site.tagline}</span>
          </div>
          <nav aria-label="Footer">
            <Link href="/privacy/">Privacy</Link>
            <Link href="/terms/">Terms</Link>
            <a href={contactHref}>{site.contactEmail}</a>
          </nav>
        </div>
        <p className="fine">Not affiliated with Meta. Instagram, Threads and Facebook are trademarks of Meta Platforms, Inc.</p>
        <p className="fine">© {new Date().getFullYear()} OnlyDM. All rights reserved.</p>
      </div>
    </footer>
  );
}
