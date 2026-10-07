import type { Metadata } from 'next';
import { contactHref, site } from '@/lib/site';

export const metadata: Metadata = { title: 'Terms of Use', description: 'The terms for using DeeMs.' };

const ext = { rel: 'noopener noreferrer', className: 'text-link' } as const;

export default function Terms() {
  const { operator, updated, governingLaw } = site.legal;
  return (
    <article className="wrap legal">
      <span className="label">Effective {updated}</span>
      <h1 className="title" style={{ marginTop: 12 }}>
        Terms of Use
      </h1>

      <h2>The agreement</h2>
      <p>
        DeeMs is provided by {operator} (“DeeMs”, “we”, “us”). On iPhone, DeeMs is licensed to you under Apple’s{' '}
        <a href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/" {...ext}>
          Standard End User License Agreement
        </a>
        , which these terms supplement. On Android, Google Play’s terms apply alongside these. By using DeeMs you agree to
        both.
      </p>

      <h2>Subscriptions</h2>
      <p>DeeMs is a paid app with auto-renewable subscriptions, billed and managed by Apple or Google through your store account:</p>
      <ul>
        <li>Monthly: $3.99 a month (₹299 in India).</li>
        <li>Yearly: $14.99 a year (₹999 in India), with a {site.trialDays}-day free trial for new subscribers.</li>
        <li>
          Prices are shown in your local currency before you buy and may differ by country. With a free trial you are
          charged when it ends, unless you cancel before.
        </li>
        <li>
          All plans renew automatically until cancelled: on iPhone in Settings › your name › Subscriptions, on Android in
          Google Play › Payments and subscriptions. Cancellation takes effect at the end of the current billing period.
          Deleting the app does not cancel a subscription.
        </li>
        <li>
          A subscription unlocks DeeMs on any device signed in to the same Apple ID or Google account. Use Restore
          Purchases in the app after a reinstall.
        </li>
        <li>
          Refunds are handled by Apple through{' '}
          <a href="https://reportaproblem.apple.com/" {...ext}>
            reportaproblem.apple.com
          </a>{' '}
          and by Google under{' '}
          <a href="https://support.google.com/googleplay/answer/2479637" {...ext}>
            Google Play’s refund policy
          </a>
          .
        </li>
      </ul>

      <h2>Instagram, Threads and Facebook</h2>
      <p>
        DeeMs is not affiliated with, endorsed by, or sponsored by Instagram, Threads, Facebook or Meta Platforms, Inc. You
        need your own accounts, and your use of them inside DeeMs remains governed by their own terms. DeeMs shows their
        websites with the feed, Reels and Explore hidden; they may change their sites in ways that affect DeeMs at any time.
      </p>

      <h2>Using DeeMs</h2>
      <p>
        You must be at least 13, and old enough to use these platforms where you live. Don’t use DeeMs to break the law or
        another service’s rules, or to copy, resell, reverse engineer or disrupt the app. The DeeMs name, logo and app
        belong to us; content on the platforms belongs to its owners.
      </p>

      <h2>No warranty</h2>
      <p>
        DeeMs is provided as is, without warranty of any kind. We are not liable for anything Instagram, Threads or Facebook
        do to your account, for messages you send or receive, or for interruptions caused by changes to their websites. As
        far as the law allows, our total liability to you is limited to what you paid for DeeMs in the 12 months before a
        claim. Nothing here limits rights you have under consumer law that can’t be excluded.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these terms. We’ll change the date at the top and tell you in the app about important changes before
        they apply.
      </p>

      {governingLaw ? (
        <>
          <h2>Governing law</h2>
          <p>These terms are governed by {governingLaw}, without affecting mandatory consumer protections where you live.</p>
        </>
      ) : null}

      <h2>Contact</h2>
      <p>
        Questions: <a className="text-link" href={contactHref}>{site.contactEmail}</a>
      </p>
    </article>
  );
}
