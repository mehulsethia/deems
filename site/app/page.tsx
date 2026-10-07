import Image from 'next/image';
import { Calculator } from '@/components/Calculator';
import { ColdOpen } from '@/components/ColdOpen';
import { DeemsMark } from '@/components/DeemsMark';
import { Faq } from '@/components/Faq';
import { Pricing } from '@/components/Pricing';
import { Hero } from '@/components/Hero';
import { Exit, Eye, LockSmall, NoServer, Page } from '@/components/Icons';
import { Refunded } from '@/components/Refunded';
import { Reveal } from '@/components/Reveal';
import { StoreButtons, TrialNote } from '@/components/StoreButtons';
import { Tour } from '@/components/Tour';
import { PLATFORMS } from '@/lib/platforms';
import { contactHref, site } from '@/lib/site';

const FAQ = [
  {
    q: 'What is DeeMs, exactly?',
    a: 'An app that opens the real Instagram, Threads and Facebook websites with the feed, Reels and Explore hidden. Messages, group chats and your friends’ stories work as normal.',
  },
  {
    q: 'Does DeeMs see my password or my messages?',
    a: 'No. You sign in on the platform’s own page, and DeeMs never reads, stores or sends your password, cookies or messages. We don’t run servers that hold your data.',
  },
  {
    q: 'Can I still see a post a friend sends me?',
    a: 'Yes. A post or reel shared in a chat opens on its own. When you close it, you’re back in your messages, not the feed.',
  },
  {
    q: 'Is this made by Instagram or Meta?',
    a: 'No. DeeMs is independent and not affiliated with Meta. You use your normal accounts, under their normal rules.',
  },
  {
    q: 'What does it cost?',
    a: `$3.99 a month, or $14.99 a year (₹299 or ₹999 in India), billed by the App Store or Google Play in your local currency. Yearly saves 69% (72% in India) and starts with ${site.trialDays} days free; we remind you ${site.reminderDaysBefore} days before billing starts. Cancel any time in your store settings.`,
  },
  {
    q: 'Is it on Android?',
    a: site.playStoreUrl ? 'Yes, on Google Play.' : 'Soon. Use the Android link at the top of the page and we’ll email you when it’s out.',
  },
];

export default function Home() {
  return (
    <>
      <Hero />

      {/* Works with */}
      <section className="platforms">
        <Reveal className="wrap platforms-inner">
          <span className="label">Works with</span>
          {PLATFORMS.map((p) => (
            <span className="platform" key={p.name}>
              <Image src={p.src} alt="" width={32} height={32} />
              {p.name}
            </span>
          ))}
        </Reveal>
      </section>

      {/* Cold open */}
      <section className="section">
        <ColdOpen />
      </section>

      {/* Receipt */}
      <section className="section" id="receipt">
        <div className="wrap">
          <Reveal className="section-head center">
            <span className="eyebrow">Add it up</span>
            <h2 className="title">Here’s your receipt.</h2>
            <p className="lede">Two answers, both yours. Nothing projected, nothing multiplied.</p>
          </Reveal>
          <Reveal>
            <Calculator />
          </Reveal>
        </div>
      </section>

      {/* Tour */}
      <section className="section" id="how">
        <div className="wrap">
          <Reveal className="section-head">
            <span className="eyebrow">How it works</span>
            <h2 className="title">Set up in under a minute.</h2>
          </Reveal>
          <Tour />
        </div>
      </section>

      {/* Kept vs refunded */}
      <section className="section">
        <div className="wrap">
          <Reveal className="section-head center">
            <span className="eyebrow">What’s left</span>
            <h2 className="title">Messages. Your friends’ stories. That’s the whole app.</h2>
          </Reveal>
          <Refunded />
        </div>
      </section>

      {/* Privacy */}
      <section className="section" id="privacy">
        <div className="wrap">
          <Reveal className="section-head">
            <span className="eyebrow">Privacy</span>
            <h2 className="title">You sign in on their own page.</h2>
            <p className="lede">DeeMs never sees your password or your messages.</p>
          </Reveal>
          <div className="bento">
            <Reveal className="card span-4">
              <span className="icon">
                <Page />
              </span>
              <h3>Their sign-in page, not ours</h3>
              <p className="muted">You sign in on Instagram’s, Threads’ or Facebook’s own page, inside DeeMs.</p>
              <div className="address" aria-hidden>
                <span className="lock">
                  <LockSmall />
                </span>
                instagram.com<span className="dim">/accounts/login</span>
              </div>
            </Reveal>
            <Reveal className="card span-2" delay={0.08}>
              <span className="icon">
                <NoServer />
              </span>
              <h3>Nothing on our servers</h3>
              <p className="muted">Your messages and session stay on your phone.</p>
            </Reveal>
            <Reveal className="card span-3" delay={0.12}>
              <span className="icon">
                <Eye />
              </span>
              <h3>No analytics. No ads.</h3>
              <p className="muted">DeeMs doesn’t track what you do. There’s nothing to sell, so nothing is collected.</p>
            </Reveal>
            <Reveal className="card span-3" delay={0.16}>
              <span className="icon">
                <Exit />
              </span>
              <h3>Sign out any time</h3>
              <p className="muted">One tap in Settings signs you out and clears everything DeeMs kept on your phone.</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="section" id="pricing">
        <Reveal className="wrap">
          <Pricing />
        </Reveal>
      </section>

      {/* FAQ */}
      <section className="section" id="faq">
        <div className="wrap">
          <Reveal className="section-head center">
            <span className="eyebrow">FAQ</span>
            <h2 className="title">Fair questions.</h2>
          </Reveal>
          <Reveal>
            <Faq items={FAQ} />
          </Reveal>
          <p className="muted center" style={{ marginTop: 32, textAlign: 'center' }}>
            Something else? Email{' '}
            <a className="text-link" href={contactHref}>
              {site.contactEmail}
            </a>
            . We read every email.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="wrap">
          <Reveal className="final">
            <span className="final-mark">
              <DeemsMark size={48} />
            </span>
            <h2 className="display" style={{ fontSize: 'clamp(44px, 7.5vw, 96px)' }}>
              Keep the messages.
              <br />
              <span className="accent">Refund the rest.</span>
            </h2>
            <StoreButtons align="center" />
            <TrialNote />
          </Reveal>
        </div>
      </section>
    </>
  );
}
