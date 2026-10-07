import { Faq } from '@/components/Faq';
import { Hero } from '@/components/Hero';
import { GetApp } from '@/components/GetApp';
import { Reveal } from '@/components/Reveal';
import { YearsLost } from '@/components/YearsLost';
import { Closing, Founder, HowItWorks, Privacy, Proof, SoundFamiliar, TriedQuitting, WhatStays } from '@/components/Sections';
import { contactHref, site } from '@/lib/site';

const FAQ = [
  {
    q: 'What is OnlyDM, exactly?',
    a: 'An app that opens the real Instagram, Threads and Facebook websites with the feed, Reels and Explore hidden. Messages, group chats and your friends’ stories work as normal.',
  },
  {
    q: 'Does OnlyDM see my password or my messages?',
    a: 'No. You sign in on the platform’s own page, and OnlyDM never reads, stores or sends your password, cookies or messages. We don’t run servers that hold your data.',
  },
  {
    q: 'Can I still see a post a friend sends me?',
    a: 'Yes. A post or reel shared in a chat opens on its own. When you close it, you’re back in your messages, not the feed.',
  },
  {
    q: 'Is this made by Instagram or Meta?',
    a: 'No. OnlyDM is independent and not affiliated with Meta. You use your normal accounts, under their normal rules.',
  },
  {
    q: 'What does it cost?',
    a: `You see the price in the app before you subscribe, in your local currency, billed by the App Store or Google Play. The yearly plan starts with ${site.trialDays} days free, and we remind you ${site.reminderDaysBefore} days before billing starts. Cancel any time in your store settings.`,
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
      <SoundFamiliar />

      <section className="section s-paper" id="years">
        <div className="wrap">
          <Reveal className="section-head">
            <h2 className="title">
              Years of your life <em>lost</em> to scrolling.
            </h2>
            <p className="lede">Move the sliders. See where the time goes.</p>
          </Reveal>
          <Reveal>
            <YearsLost />
          </Reveal>
        </div>
      </section>
      <TriedQuitting />
      <WhatStays />
      <HowItWorks />
      <Privacy />

      <GetApp />

      <Proof />
      <Founder />

      <section className="section s-paper" id="faq">
        <div className="wrap">
          <Reveal className="section-head">
            <span className="label">Questions</span>
            <h2 className="title">
              Fair <em>questions.</em>
            </h2>
          </Reveal>
          <Reveal>
            <Faq items={FAQ} />
          </Reveal>
          <p className="muted" style={{ marginTop: 32 }}>
            Something else? Email{' '}
            <a className="text-link" href={contactHref}>
              {site.contactEmail}
            </a>
            . We read every email.
          </p>
        </div>
      </section>

      <Closing />
    </>
  );
}
