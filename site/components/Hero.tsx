import { HeroDemo } from './HeroDemo';
import { PlatformIcons } from './PlatformIcons';
import { Reveal } from './Reveal';
import { androidCta, PrimaryButton } from './StoreButtons';
import { site } from '@/lib/site';

/** The main benefits, as chat bubbles under the phone: a row of three, then two. */
const BENEFITS = [
  'Opens on your messages',
  'No feed, Reels or Explore',
  'All three apps in one place',
  'Sign in on their own page',
  'Nothing stored on our servers',
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
            <a className="link-arrow" href="#how">
              See how it works
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M12 5v14M6 13l6 6 6-6" />
              </svg>
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
          <HeroDemo />
          <div className="badges" role="list" aria-label="What you get">
            {[BENEFITS.slice(0, 3), BENEFITS.slice(3)].map((row) => (
              <div className="badges-row" key={row[0]}>
                {row.map((b) => (
                  <span role="listitem" className="bubble badge" key={b}>
                    {b}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
