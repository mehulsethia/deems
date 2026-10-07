import { HeroCompare } from './HeroCompare';
import { PlatformIcons } from './PlatformIcons';
import { Reveal } from './Reveal';
import { androidCta, PrimaryButton } from './StoreButtons';
import { site } from '@/lib/site';

/** The main benefits, as chat bubbles. */
const BENEFITS = ['Opens on your messages', 'No feed, Reels or Explore', 'All three apps in one place', 'Sign in on their own page', 'Nothing stored on our servers'];

export function Hero() {
  return (
    <section className="section s-white hero">
      <div className="wrap hero-grid">
        <Reveal className="hero-copy">
          <div className="hero-eyebrow">
            <span aria-hidden>FOR</span>
            <PlatformIcons label="For" size={20} />
          </div>
          <h1 className="display">
            <span>
              Quit the <em>scroll.</em>
            </span>
            <span>
              Keep your <em>people.</em>
            </span>
          </h1>
          <p className="lede">
            <strong className="lede-lead">Only DMs, zero distractions.</strong> OnlyDM opens Instagram, Threads and Facebook
            straight to your messages. No feed. No Reels. No Explore.
          </p>
          <ul className="bubbles" aria-label="What you get">
            {BENEFITS.map((b, i) => (
              <li key={b} className={`bubble${i % 3 === 2 ? ' dark' : ''}`}>
                {b}
              </li>
            ))}
          </ul>
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
        <Reveal delay={0.1}>
          <HeroCompare />
        </Reveal>
      </div>
    </section>
  );
}
