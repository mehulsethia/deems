import { HeroCompare } from './HeroCompare';
import { PlatformIcons } from './PlatformIcons';
import { Reveal } from './Reveal';
import { androidCta, PrimaryButton } from './StoreButtons';
import { site } from '@/lib/site';

/** The main benefits, as chat bubbles floating around the phone. */
const BENEFITS = [
  { text: 'Opens on your messages', pos: 'b1' },
  { text: 'No feed, Reels or Explore', pos: 'b2' },
  { text: 'All three apps in one place', pos: 'b3', dark: true },
  { text: 'Sign in on their own page', pos: 'b4' },
  { text: 'Nothing stored on our servers', pos: 'b5' },
];

export function Hero() {
  return (
    <section className="section s-white hero">
      <div className="wrap hero-grid">
        <Reveal className="hero-copy">
          <h1 className="display">
            <span>
              Quit the <em>scroll.</em>
            </span>
            <span>
              Keep your <em>people.</em>
            </span>
          </h1>
          <div className="lede hero-lede">
            <p>
              <strong className="lede-lead">Only DMs, zero distractions.</strong> OnlyDM{' '}
              <span className="nowrap">
                opens <PlatformIcons inline size={16} label="" />
              </span>{' '}
              straight to your messages.
            </p>
            <p className="lede-no">No feed. No Reels. No Explore.</p>
          </div>
          <div className="cta-row">
            <PrimaryButton />
            <a className="btn btn-secondary" href="#how">
              See how it works
            </a>
          </div>
          <p className="hero-note">
            Free for {site.trialDays} days on yearly.{' '}
            <a className="text-link" href={androidCta.href}>
              {androidCta.label}
            </a>
          </p>
        </Reveal>
        <Reveal delay={0.1} className="hero-visual">
          <div className="ripples" aria-hidden>
            <span />
            <span />
            <span />
          </div>
          <HeroCompare />
          <ul className="badges" aria-label="What you get">
            {BENEFITS.map((b) => (
              <li key={b.text} className={`bubble badge ${b.pos}${b.dark ? ' dark' : ''}`}>
                {b.text}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
