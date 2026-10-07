import { HeroCompare } from './HeroCompare';
import { PLATFORM_ORDER, PlatformLogo, platformName } from './PlatformLogo';
import { Reveal } from './Reveal';
import { androidCta, PrimaryButton } from './StoreButtons';
import { site } from '@/lib/site';

export function Hero() {
  return (
    <section className="section s-white hero">
      <div className="wrap hero-grid">
        <Reveal className="hero-copy">
          <span className="hero-eyebrow">
            FOR
            <span className="logos">
              {PLATFORM_ORDER.map((p) => (
                <PlatformLogo key={p} platform={p} size={20} alt={platformName(p)} />
              ))}
            </span>
          </span>
          <h1 className="display">
            Quit the <em>scroll.</em> Keep your <em>people.</em>
          </h1>
          <p className="lede">
            DeeMs opens Instagram, Threads and Facebook straight to your messages and your friends’ stories. No feed. No
            Reels. No Explore.
          </p>
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
