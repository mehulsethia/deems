'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { contactHref, earlyAccessHref, site } from '@/lib/site';
import { DeemsMark } from './DeemsMark';

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <header className={`nav${scrolled ? ' scrolled' : ''}`}>
      <div className="wrap nav-inner">
        <Link href="/" className="brand" aria-label="Deems, home">
          <DeemsMark size={28} />
          Deems
        </Link>
        <nav className="nav-links" aria-label="Main">
          <Link href="/#how">How it works</Link>
          <Link href="/#privacy">Privacy</Link>
          <Link href="/#faq">FAQ</Link>
          <a href={contactHref}>Contact</a>
          <a className="btn btn-primary btn-small" href={site.appStoreUrl || earlyAccessHref('iPhone')}>
            {site.appStoreUrl ? 'Get the app' : 'Get early access'}
          </a>
        </nav>
      </div>
    </header>
  );
}
