import Link from 'next/link';
import { contactHref, earlyAccessHref, site } from '@/lib/site';
import { DeemsMark } from './DeemsMark';

export function Nav() {
  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <Link href="/" className="brand" aria-label="Deems, home">
          <DeemsMark size={28} />
          Deems
        </Link>
        <nav className="nav-links" aria-label="Main">
          <Link href="/#how">How it works</Link>
          <Link href="/#faq">Questions</Link>
          <a href={contactHref}>Contact</a>
          <a className="btn btn-primary btn-small" href={site.appStoreUrl || earlyAccessHref('iPhone')}>
            {site.appStoreUrl ? 'Get the app' : 'Get early access'}
          </a>
        </nav>
      </div>
    </header>
  );
}
