import { founder } from '@/content/founder';
import { proof, rating } from '@/content/proof';
import { PLATFORM_ORDER, PlatformLogo, platformName } from './PlatformLogo';
import { Reveal } from './Reveal';
import { AndroidButton, PrimaryButton, TrialNote } from './StoreButtons';

const Check = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M4 10.5l4 4 8-9" />
  </svg>
);

const Dash = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
    <path d="M5 10h10" />
  </svg>
);

/* ---------- Sound familiar? (black) ---------- */

export function SoundFamiliar() {
  return (
    <section className="section s-black">
      <div className="wrap">
        <Reveal className="section-head">
          <h2 className="title">
            Sound <em>familiar?</em>
          </h2>
        </Reveal>
        <Reveal>
          <p className="quote">“I’ll just reply to this one message.”</p>
        </Reveal>
        <Reveal className="duo glow">
          <div className="duo-card dim">
            <span className="label">The usual way</span>
            <p className="big">Open. Scroll. Forget why you came.</p>
            <p>The inbox sits behind the feed. Every reply starts with a detour.</p>
          </div>
          <div className="duo-card bright">
            <span className="label">The DeeMs way</span>
            <p className="big">Open. Reply. Get on with your day.</p>
            <p>It opens on your messages. There is nothing else to open.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- You've tried quitting (white) ---------- */

const TRIES = [
  { title: 'Screen time limit', line: 'You tapped Ignore Limit.' },
  { title: 'Deleting the app', line: 'You reinstalled it for one message.' },
  { title: 'Logging out', line: 'You logged back in by Friday.' },
];

export function TriedQuitting() {
  return (
    <section className="section s-white">
      <div className="wrap">
        <Reveal className="section-head">
          <h2 className="title">
            You’ve tried <em>quitting.</em>
          </h2>
          <p className="lede">It never lasts, because your friends are in there.</p>
        </Reveal>
        <Reveal className="tries">
          {TRIES.map((t) => (
            <div className="try" key={t.title}>
              <h3>{t.title}</h3>
              <p>{t.line}</p>
            </div>
          ))}
        </Reveal>
        <Reveal>
          <p className="closer">
            Blockers shut out everything, including the people you care about. DeeMs only removes the part that wastes your
            time.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- What stays (paper) ---------- */

const KEPT = [
  'Messages and group chats',
  'Your friends’ and family’s stories',
  'Voice notes, photos and videos',
  'Posts someone sends you, one at a time',
];
const GONE = ['Feed', 'Reels', 'Explore', 'Suggested posts'];

export function WhatStays() {
  return (
    <section className="section s-paper">
      <div className="wrap">
        <Reveal className="section-head">
          <h2 className="title">
            Miss the feed. Not your <em>family.</em>
          </h2>
        </Reveal>
        <Reveal className="stays">
          <div className="stays-col">
            <h3 className="label">Still here</h3>
            <ul>
              {KEPT.map((k) => (
                <li key={k}>
                  <Check />
                  {k}
                </li>
              ))}
            </ul>
          </div>
          <div className="stays-col gone">
            <h3 className="label">Gone</h3>
            <ul>
              {GONE.map((g) => (
                <li key={g}>
                  <Dash />
                  <span>
                    <span className="sr-only">Removed: </span>
                    {g}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- How it works (white) ---------- */

function MiniPhone({ children }: { children: React.ReactNode }) {
  return (
    <div className="mini" aria-hidden>
      <div className="mini-screen">{children}</div>
    </div>
  );
}

export function HowItWorks() {
  return (
    <section className="section s-white" id="how">
      <div className="wrap">
        <Reveal className="section-head">
          <span className="label">How it works</span>
          <h2 className="title">
            Set up in under a <em>minute.</em>
          </h2>
        </Reveal>
        <div className="steps">
          <Reveal className="step">
            <MiniPhone>
              {PLATFORM_ORDER.map((p) => (
                <div className="toggle-row" key={p}>
                  <PlatformLogo platform={p} size={28} />
                  <span className="grow">{platformName(p)}</span>
                  <span className="toggle" />
                </div>
              ))}
            </MiniPhone>
            <span className="step-num">01</span>
            <h3>Pick your apps</h3>
          </Reveal>
          <Reveal className="step" delay={0.08}>
            <MiniPhone>
              <div className="mini-address">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 11V8a5 5 0 0110 0v3h1a1 1 0 011 1v8a1 1 0 01-1 1H6a1 1 0 01-1-1v-8a1 1 0 011-1zm2 0h6V8a3 3 0 00-6 0z" />
                </svg>
                instagram.com<span className="dim">/accounts/login</span>
              </div>
              <div className="mini-field">Username or email</div>
              <div className="mini-field">Password</div>
              <div className="mini-button">Log in</div>
            </MiniPhone>
            <span className="step-num">02</span>
            <h3>Sign in on their page</h3>
            <p>You sign in on Instagram’s, Threads’ or Facebook’s own page, inside DeeMs.</p>
          </Reveal>
          <Reveal className="step" delay={0.16}>
            <MiniPhone>
              {[
                { n: 'Maya', m: 'you free sat?', p: 'instagram' as const },
                { n: 'Mum', m: 'call me when you’re free', p: 'facebook' as const },
                { n: 'Sam', m: 'voice message 0:14', p: 'threads' as const },
              ].map((c, i) => (
                <div className="chat" key={c.n}>
                  <span className="chat-av">
                    <span className="avatar" style={{ width: 38, height: 38, fontSize: 14, background: ['#171717', '#3d3d3d', '#6b6b6b'][i] }}>
                      {c.n[0]}
                    </span>
                    <span className="chat-badge">
                      <PlatformLogo platform={c.p} size={14} />
                    </span>
                  </span>
                  <span className="chat-body">
                    <span className="chat-name">{c.n}</span>
                    <span className="chat-msg">{c.m}</span>
                  </span>
                </div>
              ))}
            </MiniPhone>
            <span className="step-num">03</span>
            <h3>Reply and leave</h3>
            <p>Your inbox opens. The feed doesn’t.</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- Privacy (black) ---------- */

const POINTS = [
  { t: 'Their sign-in page, not ours', b: 'You sign in on Instagram’s, Threads’ or Facebook’s own page, inside DeeMs.' },
  { t: 'Nothing stored on our servers', b: 'Your messages and session stay on your phone.' },
  { t: 'No analytics, no ads', b: 'DeeMs doesn’t track what you do. There’s nothing to sell, so nothing is collected.' },
  { t: 'Sign out any time in Settings', b: 'One tap in Settings signs you out and clears everything DeeMs kept on your phone.' },
];

export function Privacy() {
  return (
    <section className="section s-black" id="privacy">
      <div className="wrap">
        <Reveal className="section-head">
          <span className="label">Privacy</span>
          <h2 className="title">
            Your messages are <em>yours.</em>
          </h2>
        </Reveal>
        <Reveal className="points">
          {POINTS.map((p, i) => (
            <div className="point" key={p.t}>
              <span className="n">0{i + 1}</span>
              <h3>{p.t}</h3>
              <p>{p.b}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Social proof (renders only with real quotes) ---------- */

export function Proof() {
  if (proof.length === 0) return null;
  return (
    <section className="section s-paper">
      <div className="wrap">
        <Reveal className="section-head">
          <h2 className="title">
            People who quit the <em>scroll.</em>
          </h2>
          {rating ? (
            <p className="label">
              {rating.score} on the {rating.source} · {rating.count}
            </p>
          ) : null}
        </Reveal>
        <Reveal className="proofs">
          {proof.slice(0, 3).map((q) => (
            <figure className="proof" key={q.name + q.quote}>
              <blockquote>“{q.quote}”</blockquote>
              <figcaption className="muted">
                {q.name}
                {q.detail ? `, ${q.detail}` : ''}
              </figcaption>
            </figure>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Founder note (renders only with content) ---------- */

export function Founder() {
  if (!founder || founder.paragraphs.length === 0) return null;
  return (
    <section className="section s-white">
      <Reveal className="wrap founder">
        <span className="label">A note from the founder</span>
        {founder.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
        <div>
          <p className="signature">{founder.name}</p>
          {founder.role ? <p className="fine">{founder.role}</p> : null}
        </div>
      </Reveal>
    </section>
  );
}

/* ---------- Closing (black, tall) ---------- */

export function Closing() {
  return (
    <section className="section s-black closing">
      <div className="wrap">
        <Reveal className="closing-inner glow">
          <h2 className="display">
            Keep the <em>people.</em>
            <br />
            Lose the <em>scroll.</em>
          </h2>
          <p className="lede">Make room for what you meant to do today.</p>
          <div className="cta-row" style={{ justifyContent: 'center' }}>
            <PrimaryButton />
            <AndroidButton />
          </div>
          <TrialNote />
        </Reveal>
      </div>
    </section>
  );
}
