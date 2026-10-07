'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { OnlyDMMark } from './OnlyDMMark';
import { PrimaryButton } from './StoreButtons';
import { Wordmark } from './Wordmark';

/** Transparent over the hero, solid once the page scrolls. */
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
        <Link href="/" className="brand" aria-label="OnlyDM, home">
          <OnlyDMMark size={28} />
          <Wordmark />
        </Link>
        <nav className="nav-links" aria-label="Main">
          <Link href="/#problem">Problem</Link>
          <Link href="/#solution">Solution</Link>
          <Link href="/#how">How it Works</Link>
          <Link href="/#faq">FAQ</Link>
          <PrimaryButton small />
        </nav>
      </div>
    </header>
  );
}
