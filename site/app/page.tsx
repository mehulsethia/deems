import { Calculator } from '@/components/Calculator';
import { Cross, Exit, Eye, NoServer, Page, Tick } from '@/components/Icons';
import { Phone } from '@/components/Phone';
import { StoreButtons, TrialNote } from '@/components/StoreButtons';
import { contactHref, site } from '@/lib/site';

const KEPT = ['Messages and group chats', 'Your friends’ stories', 'Voice notes, photos and videos in chats', 'Posts a friend sends you, one at a time'];
const GONE = ['Feed', 'Reels', 'Explore'];

const STEPS = [
  { title: 'Pick your apps', body: 'Instagram, Threads, Facebook. One, two or all three.' },
  { title: 'Sign in on their page', body: 'Their own sign-in page, inside Deems. Not ours.' },
  { title: 'Reply and leave', body: 'Your inbox opens. The feed, Reels and Explore don’t.' },
];

const TRUST = [
  { Icon: Page, title: 'Their sign-in page, not ours', body: 'You sign in on Instagram’s, Threads’ or Facebook’s own page. Deems never sees your password.' },
  { Icon: NoServer, title: 'Nothing is stored on our servers', body: 'Deems doesn’t read, store or send your messages. Your session stays on your phone.' },
  { Icon: Eye, title: 'No analytics. No ads.', body: 'Deems doesn’t track what you do. There is nothing to sell, so nothing is collected.' },
  { Icon: Exit, title: 'Sign out any time in Settings', body: 'One tap signs you out and clears everything Deems kept on your phone.' },
];

const FAQ = [
  {
    q: 'What is Deems, exactly?',
    a: 'An app that opens the real Instagram, Threads and Facebook websites with the feed, Reels and Explore hidden. Messages, group chats and your friends’ stories work as normal.',
  },
  {
    q: 'Does Deems see my password or my messages?',
    a: 'No. You sign in on the platform’s own page, and Deems never reads, stores or sends your password, cookies or messages. We don’t run servers that hold your data.',
  },
  {
    q: 'Can I still see a post a friend sends me?',
    a: 'Yes. A post or reel shared in a chat opens on its own. When you close it, you’re back in your messages, not the feed.',
  },
  {
    q: 'Is this made by Instagram or Meta?',
    a: 'No. Deems is independent and not affiliated with Meta. You use your normal accounts, under their normal rules.',
  },
  {
    q: 'What does it cost?',
    a: `It’s free for ${site.trialDays} days, then a subscription billed by the App Store or Google Play. We remind you ${site.reminderDaysBefore} days before billing starts, and you can cancel any time in your store settings.`,
  },
  {
    q: 'Is it on Android?',
    a: site.playStoreUrl ? 'Yes, on Google Play.' : 'Soon. Use the Android link at the top of the page and we’ll email you when it’s out.',
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <span className="label">For Instagram, Threads and Facebook</span>
            <h1 className="display">Reply and leave.</h1>
            <p className="lede">Your messages and your friends’ stories. No feed, no Reels, no Explore. Nothing else is coming.</p>
            <div style={{ display: 'grid', gap: 12 }}>
              <StoreButtons />
              <TrialNote />
            </div>
          </div>
          <Phone />
        </div>
      </section>

      {/* Cold open */}
      <section className="section">
        <div className="wrap coldopen">
          <div className="banner" role="img" aria-label="Message from maya: you free sat?">
            <div className="avatar">m</div>
            <div className="banner-body">
              <div className="banner-top">
                <strong>maya</strong>
                <span className="label">now</span>
              </div>
              <span className="muted">you free sat?</span>
            </div>
          </div>
          <div style={{ display: 'grid', gap: 16 }}>
            <h2 className="title">You opened the app to answer this.</h2>
            <p className="title accent" style={{ margin: 0 }}>
              That was 47 minutes ago.
            </p>
            <p className="lede">Every time.</p>
          </div>
        </div>
      </section>

      {/* Receipt */}
      <section className="section" id="receipt">
        <div className="wrap">
          <div className="section-head">
            <span className="label">Add it up</span>
            <h2 className="title">Here’s your receipt.</h2>
            <p className="lede">Two answers, both yours. Nothing projected, nothing multiplied.</p>
          </div>
          <Calculator />
        </div>
      </section>

      {/* What's left */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <span className="label">What’s left</span>
            <h2 className="title">Messages. Your friends’ stories. That’s the whole app.</h2>
          </div>
          <div className="split">
            <div className="card">
              <h3 className="heading">Kept</h3>
              <ul className="list">
                {KEPT.map((k) => (
                  <li key={k}>
                    <span className="tick">
                      <Tick />
                    </span>
                    {k}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card">
              <h3 className="heading">Refunded</h3>
              <ul className="list removed">
                {GONE.map((g) => (
                  <li key={g}>
                    <span className="cross cut">
                      <Cross />
                    </span>
                    <s>{g}</s>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section" id="how">
        <div className="wrap">
          <div className="section-head">
            <span className="label">How it works</span>
            <h2 className="title">Under a minute to set up.</h2>
          </div>
          <div className="steps">
            {STEPS.map((s, i) => (
              <div className="card step" key={s.title}>
                <span className="label">Step {i + 1}</span>
                <h3 className="heading">{s.title}</h3>
                <p className="muted" style={{ margin: 0 }}>
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <span className="label">Privacy</span>
            <h2 className="title">You sign in on their own page.</h2>
            <p className="lede">Deems never sees your password or your messages.</p>
          </div>
          <div className="trust">
            {TRUST.map(({ Icon, title, body }) => (
              <div className="card trust-row" key={title}>
                <span className="icon">
                  <Icon />
                </span>
                <div>
                  <h3>{title}</h3>
                  <p className="muted">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="section">
        <div className="wrap price">
          <div style={{ display: 'grid', gap: 20 }}>
            <span className="label">Pricing</span>
            <h2 className="title">Try it for {site.trialDays} days.</h2>
            <p className="lede">After that, it’s billed by the App Store or Google Play. Cancel any time in your store settings.</p>
          </div>
          <div className="card" style={{ display: 'grid', gap: 24 }}>
            <ol className="timeline">
              <li>
                <span>
                  <b>Today</b> - your messages, nothing else
                </span>
              </li>
              <li>
                <span>
                  <b>Day {site.trialDays - site.reminderDaysBefore}</b> - we remind you
                </span>
              </li>
              <li>
                <span>
                  <b>Day {site.trialDays}</b> - billing starts unless you cancel
                </span>
              </li>
            </ol>
            <StoreButtons />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" id="faq">
        <div className="wrap">
          <div className="section-head">
            <span className="label">Questions</span>
            <h2 className="title">Fair questions.</h2>
          </div>
          <div className="faq">
            {FAQ.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
          <p className="muted" style={{ marginTop: 32 }}>
            Something else? Email{' '}
            <a className="text-link" href={contactHref}>
              {site.contactEmail}
            </a>
            . We read every email.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section">
        <div className="wrap final">
          <h2 className="display" style={{ fontSize: 'clamp(40px, 7vw, 84px)' }}>
            Keep the messages. Refund the rest.
          </h2>
          <StoreButtons align="center" />
          <TrialNote />
        </div>
      </section>
    </>
  );
}
