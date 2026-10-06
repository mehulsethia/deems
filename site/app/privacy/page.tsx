import type { Metadata } from 'next';
import { contactHref, site } from '@/lib/site';

export const metadata: Metadata = { title: 'Privacy Policy', description: 'What Deems collects: almost nothing, and nothing that identifies you.' };

const ext = { rel: 'noopener noreferrer', className: 'text-link' } as const;

export default function Privacy() {
  const { operator, updated } = site.legal;
  return (
    <article className="wrap legal">
      <span className="label">Effective {updated}</span>
      <h1 className="title" style={{ marginTop: 12 }}>
        Privacy Policy
      </h1>

      <div className="card summary">
        <p style={{ marginTop: 0 }}>
          <strong>The short version.</strong>
        </p>
        <ul>
          <li>Deems never sees your password and never reads, stores or sends your messages.</li>
          <li>Deems has no accounts, no servers holding your data, no analytics and no ads.</li>
          <li>What the app keeps stays on your phone, and one tap in Settings deletes it.</li>
          <li>Payments go through Apple or Google. We never see your card.</li>
        </ul>
      </div>

      <h2>What Deems is</h2>
      <p>
        Deems is an app for iPhone and Android that opens the official Instagram, Threads and Facebook websites in a focused
        window showing your messages and friends’ stories, with the feed, Reels and Explore hidden. You sign in directly with
        each platform, on its own page. Deems is operated by {operator} (“Deems”, “we”, “us”) and is not affiliated with Meta.
      </p>

      <h2>What we never collect</h2>
      <p>
        Your passwords, your messages, your photos, voice notes and stories, and your contacts. Deems has no accounts and no
        login of its own. Your sign-in happens directly between you and the platform inside the app, and that session stays
        on your device. It never passes through or gets stored on our servers, because there is no server holding it. You
        can also end a session from the platform’s own “Where you’re logged in” settings.
      </p>

      <h2>What we do collect</h2>
      <p>Nothing that identifies you. Specifically:</p>
      <ul>
        <li>
          <strong>No usage analytics.</strong> The app and this website send no analytics or tracking events, to us or to
          anyone else.
        </li>
        <li>
          <strong>No email address.</strong> The app never asks for one. If you email us (including to ask for early
          access), we receive your email address and message, use them only to reply, and delete them on request.
        </li>
      </ul>

      <h2>What stays on your phone</h2>
      <p>To work, the app keeps a few small things in local storage on your device. They never leave it:</p>
      <ul>
        <li>Which apps you picked, and which ones you’re signed in to.</li>
        <li>Your two setup answers (time spent in these apps a day, and how much of that is talking), used only to draw your receipt.</li>
        <li>Where you are in setup, and which account you last looked at.</li>
        <li>The platforms’ own sign-in cookies, stored by your phone’s web view. Deems doesn’t read them.</li>
      </ul>
      <p>
        <strong>Settings › Sign out and clear data</strong> deletes all of it. Deleting the app does the same.
      </p>

      <h2>Purchases</h2>
      <p>
        Deems offers auto-renewable subscriptions, bought through Apple (App Store) or Google (Google Play) and billed to
        your store account. We never see your payment details. RevenueCat verifies your subscription status using an
        anonymous identifier generated on your phone, plus the store’s purchase receipt. We use that status only to unlock
        the app.
      </p>

      <h2>Trial reminder</h2>
      <p>
        If you start a free trial and allow notifications, the app schedules one reminder on your phone, two days before
        billing starts. It is a local notification: no notification token, no server and nothing sent to us. Turn it off
        in your phone’s notification settings.
      </p>

      <h2>This website</h2>
      <p>
        This site sets no cookies and runs no analytics. Fonts are served from this site. Our web host may keep standard
        server logs (such as IP address and time of request) for security, for a short period.
      </p>

      <h2>Third parties</h2>
      <ul>
        <li>
          <strong>Meta Platforms:</strong> your Instagram, Threads and Facebook sessions inside the app are governed by{' '}
          <a href="https://www.facebook.com/privacy/policy" {...ext}>
            Meta’s privacy policy
          </a>
          .
        </li>
        <li>
          <strong>Apple</strong> and <strong>Google:</strong> process subscription payments under{' '}
          <a href="https://www.apple.com/legal/privacy/" {...ext}>
            Apple’s privacy policy
          </a>{' '}
          and{' '}
          <a href="https://policies.google.com/privacy" {...ext}>
            Google’s privacy policy
          </a>
          .
        </li>
        <li>
          <strong>RevenueCat:</strong> checks subscription status under{' '}
          <a href="https://www.revenuecat.com/privacy" {...ext}>
            RevenueCat’s privacy policy
          </a>
          .
        </li>
        <li>
          <strong>Web host:</strong> serves this website.
        </li>
      </ul>

      <h2>Children</h2>
      <p>
        Deems is not meant for children under 13, or under the minimum age to use Instagram, Threads or Facebook where you
        live. We don’t knowingly collect anything from children.
      </p>

      <h2>Changes</h2>
      <p>
        If this policy changes, we’ll update the date at the top. If a change affects what we collect, we’ll say so in the
        app before it takes effect.
      </p>

      <h2>Contact</h2>
      <p>
        Questions or requests: <a className="text-link" href={contactHref}>{site.contactEmail}</a>
      </p>
    </article>
  );
}
