'use client';

import { useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState, type JSX } from 'react';
import { OnlyDMMark } from './OnlyDMMark';
import { Wordmark } from './Wordmark';

/**
 * The hero phone, as a short story on a loop: the usual feed, then OnlyDM wipes in on its Instagram tab,
 * then Threads, then Facebook. The chat screens follow each site's real inbox layout with invented people.
 * Visitors can jump to any step; autoplay pauses while they do. Reduce Motion: no autoplay, opens on Instagram.
 */

type Step = 'feed' | 'instagram' | 'threads' | 'facebook';
const STEPS: { id: Step; label: string; ms: number }[] = [
  { id: 'feed', label: 'The usual way', ms: 2800 },
  { id: 'instagram', label: 'Instagram', ms: 3400 },
  { id: 'threads', label: 'Threads', ms: 3400 },
  { id: 'facebook', label: 'Facebook', ms: 3400 },
];
const PLATFORMS: Step[] = ['instagram', 'threads', 'facebook'];
const RESUME_AFTER_MS = 9000;

/* ---------- The usual way: a generic feed, drawn in greyscale ---------- */

const Bar = ({ w, h = 8, c }: { w: number | string; h?: number; c?: string }) => (
  <span className="f-bar" style={{ width: w, height: h, background: c, display: 'block' }} />
);

function TabIcon({ d }: { d: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6b6b6b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

function FeedBlock() {
  return (
    <>
      <div className="f-post">
        <div className="f-head">
          <span className="f-dot" />
          <Bar w={92} />
        </div>
        <div className="f-img" style={{ height: 170 }} />
        <Bar w="70%" />
      </div>
      <div className="f-row">
        <span>Suggested for you</span>
        <span style={{ fontWeight: 400 }}>See all</span>
      </div>
      <div className="f-suggest">
        <span className="f-card" />
        <span className="f-card" />
        <span className="f-card" />
      </div>
      <div className="f-video" style={{ height: 210 }}>
        <svg width="46" height="46" viewBox="0 0 46 46" aria-hidden>
          <circle cx="23" cy="23" r="22" fill="rgba(255,255,255,0.85)" />
          <path d="M19 15l12 8-12 8z" fill="#3d3d3d" />
        </svg>
      </div>
      <div className="f-post">
        <div className="f-head">
          <span className="f-dot" />
          <Bar w={70} />
          <span className="f-ad">Ad</span>
        </div>
        <div className="f-img" style={{ height: 130 }} />
      </div>
    </>
  );
}

function Feed() {
  return (
    <div className="feed">
      <div className="feed-scroll">
        <FeedBlock />
        <FeedBlock />
      </div>
      <div className="feed-tabbar">
        <TabIcon d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z" />
        <TabIcon d="M11 4a7 7 0 100 14 7 7 0 000-14zM21 21l-4.5-4.5" />
        <TabIcon d="M4 4h16v16H4zM12 8v8M8 12h8" />
        <TabIcon d="M4 5h16v14H4zM10 9l5 3-5 3z" />
        <TabIcon d="M12 12a4 4 0 100-8 4 4 0 000 8zM4 21c1-4 4-6 8-6s7 2 8 6" />
      </div>
    </div>
  );
}

/* ---------- Shared bits ---------- */

const SHADES = ['#d4d4d4', '#bdbdbd', '#a3a3a3', '#c8c8c8', '#b0b0b0', '#dadada'];

function Face({ name, size, i, online }: { name: string; size: number; i: number; online?: boolean }) {
  return (
    <span className="dm-face" style={{ width: size, height: size, background: SHADES[i % SHADES.length], fontSize: size * 0.38 }}>
      {name.replace(/[^A-Za-z]/g, '').charAt(0).toUpperCase()}
      {online ? <span className="dm-online" /> : null}
    </span>
  );
}

const Icon = ({ d, size = 18 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={d} />
  </svg>
);
const COMPOSE = 'M12 20h8M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z';
const SEARCH = 'M11 4a7 7 0 100 14 7 7 0 000-14zM21 21l-4.5-4.5';

/* ---------- Instagram (light), after the real messages inbox ---------- */

const IG_CHATS = [
  { name: 'Riya Kapoor', msg: 'You: Hello', time: '5m' },
  { name: 'Arjun Mehta', msg: '4+ new messages', time: '19h', unread: true },
  { name: 'Dominic', msg: '2 new messages', time: '1d', unread: true },
  { name: 'Tara', msg: 'Tara sent an attachment.', time: '1w' },
  { name: 'Kabir', msg: 'Kabir sent an attachment.', time: '2w' },
];

function InstagramScreen() {
  return (
    <div className="dm-screen ig">
      <div className="ig-head">
        <span className="ig-user">
          sam.rivera <Icon d="M7 10l5 5 5-5" size={14} />
        </span>
        <Icon d={COMPOSE} />
      </div>
      <div className="ig-tabs">
        <span className="on">Primary</span>
        <span>General</span>
        <span>Request (1)</span>
      </div>
      <div className="dm-search">
        <Icon d={SEARCH} size={14} /> Search
      </div>
      <div className="ig-note">
        <span className="ig-bubble">What’s new…</span>
        <Face name="Sam" size={50} i={2} />
        <span className="ig-note-label">Your note</span>
      </div>
      {IG_CHATS.map((c, i) => (
        <div className={`dm-row${c.unread ? ' unread' : ''}`} key={c.name}>
          <Face name={c.name} size={40} i={i} />
          <span className="dm-text">
            <span className="dm-name">{c.name}</span>
            <span className="dm-msg">
              {c.msg} · {c.time}
            </span>
          </span>
          {c.unread ? <span className="ig-dot" /> : null}
        </div>
      ))}
    </div>
  );
}

/* ---------- Threads (light), after the real messages page ---------- */

const TH_CHATS = [
  { name: 'lena.draws', msg: 'Okay', time: '2d' },
  { name: 'milo_.k', msg: 'Have you seen this', time: '3d' },
  { name: 'sana.writes', msg: 'You sent a post', time: '3d' },
  { name: 'theo.r', msg: 'Good morning ☀️ see you at 10', time: '1w' },
  { name: 'june.wav', msg: 'You sent a post', time: '1w' },
];

function ThreadsScreen() {
  return (
    <div className="dm-screen th">
      <div className="th-head">
        <span className="th-title">Messages</span>
        <Icon d={COMPOSE} size={20} />
      </div>
      <div className="dm-search">
        <Icon d={SEARCH} size={14} /> Search
      </div>
      <div className="th-pills">
        <span className="on">Inbox</span>
        <span>Requests</span>
      </div>
      {TH_CHATS.map((c, i) => (
        <div className="dm-row" key={c.name}>
          <Face name={c.name} size={40} i={i + 2} />
          <span className="dm-text">
            <span className="dm-name">{c.name}</span>
            <span className="dm-msg">
              {c.msg} · {c.time}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}

/* ---------- Facebook (light), after the real Chats page ---------- */

const FB_CHATS = [
  { name: 'Noah Fischer', msg: 'Are we still on for Sunday?', time: '1h' },
  { name: 'Priya Nair', msg: 'You: Happy birthday!! 🎉', time: '1h' },
  { name: 'Dev, Aria and Kai', msg: 'You: What’s up w you guys?', time: '1h', online: true },
  { name: 'Leo Martins', msg: 'Hello', time: '1d', reply: true },
  { name: 'Ana Costa', msg: 'Messages and calls are secured…', time: '7w', online: true },
];

function FacebookScreen() {
  return (
    <div className="dm-screen fb">
      <div className="fb-head">
        <span className="fb-title">Chats</span>
        <span className="fb-actions">
          <span className="fb-circle">
            <Icon d="M5 12h.01M12 12h.01M19 12h.01" size={16} />
          </span>
          <span className="fb-circle">
            <Icon d={COMPOSE} size={15} />
          </span>
        </span>
      </div>
      <div className="dm-search fb-search">
        <Icon d={SEARCH} size={14} /> Search Messenger
      </div>
      <div className="fb-pills">
        <span className="on">All</span>
        <span>Unread</span>
        <span>Groups</span>
        <span>Communities</span>
      </div>
      {FB_CHATS.map((c, i) => (
        <div className="dm-row" key={c.name}>
          <Face name={c.name} size={40} i={i + 1} online={c.online} />
          <span className="dm-text">
            <span className="dm-name">{c.name}</span>
            <span className="dm-msg">
              {c.msg} · {c.time}
              {c.reply ? <span className="fb-reply"> · Reply?</span> : null}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}

const SCREENS: Record<Exclude<Step, 'feed'>, () => JSX.Element> = {
  instagram: InstagramScreen,
  threads: ThreadsScreen,
  facebook: FacebookScreen,
};

/* ---------- OnlyDM chrome around the screens ---------- */

function OnlyDMApp({ active }: { active: Step }) {
  const index = Math.max(0, PLATFORMS.indexOf(active));
  return (
    <div className="dm-app">
      <div className="dm-bar">
        <span className="brand">
          <OnlyDMMark size={18} on="dark" />
          <Wordmark />
        </span>
        <span className="dm-settings">Settings</span>
      </div>
      <div className="dm-tabs">
        {PLATFORMS.map((p, i) => (
          <span key={p} className={`dm-tab${i === index ? ' on' : ''}`}>
            {p === 'instagram' ? 'Instagram' : p === 'threads' ? 'Threads' : 'Facebook'}
          </span>
        ))}
      </div>
      <div className="dm-stage">
        {PLATFORMS.map((p, i) => {
          const Screen = SCREENS[p as Exclude<Step, 'feed'>];
          return (
            <div key={p} className="dm-slide" style={{ transform: `translateX(${(i - index) * 100}%)` }}>
              <Screen />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatusBar() {
  return (
    <div className="statusbar" aria-hidden>
      <span>9:41</span>
      <svg width="54" height="12" viewBox="0 0 54 12" fill="currentColor">
        <rect x="0" y="8" width="3" height="4" rx="1" />
        <rect x="5" y="5" width="3" height="7" rx="1" />
        <rect x="10" y="2" width="3" height="10" rx="1" />
        <rect x="27" y="1" width="22" height="10" rx="3" fill="none" stroke="currentColor" />
        <rect x="29" y="3" width="15" height="6" rx="1.5" />
        <rect x="50" y="4" width="2" height="4" rx="1" />
      </svg>
    </div>
  );
}

export function HeroDemo() {
  const reduce = useReducedMotion();
  const [picked, setPicked] = useState<Step>('feed');
  const [touched, setTouched] = useState(false);
  // Bumped on every choice so the timer restarts even when the same step is chosen again.
  const [nonce, setNonce] = useState(0);
  const hold = useRef(false);
  // Reduce Motion: no autoplay; open on Instagram until the visitor picks a step.
  const step: Step = reduce && !touched ? 'instagram' : picked;

  useEffect(() => {
    if (reduce) return;
    const current = STEPS.findIndex((s) => s.id === picked);
    const delay = STEPS[current].ms + (hold.current ? RESUME_AFTER_MS : 0);
    const t = setTimeout(() => {
      hold.current = false;
      setPicked(STEPS[(current + 1) % STEPS.length].id);
    }, delay);
    return () => clearTimeout(t);
  }, [picked, reduce, nonce]);

  const choose = (id: Step) => {
    hold.current = true;
    setTouched(true);
    setPicked(id);
    setNonce((n) => n + 1);
  };

  const onApp = step !== 'feed';
  return (
    <div className="compare-wrap demo-wrap">
      <div className="demo-steps" role="group" aria-label="See it in action">
        {STEPS.map((s) => (
          <button key={s.id} type="button" className={`demo-step${s.id === step ? ' on' : ''}`} aria-pressed={s.id === step} onClick={() => choose(s.id)}>
            {s.label}
          </button>
        ))}
      </div>
      <div className="phone" aria-hidden>
        <div className="phone-screen">
          <span className="phone-notch" />
          <StatusBar />
          <Feed />
          <div className={`demo-app${onApp ? ' in' : ''}`}>
            <OnlyDMApp active={step} />
          </div>
        </div>
      </div>
      <p className="sr-only" aria-live="polite">
        {onApp ? `OnlyDM showing your ${STEPS.find((s) => s.id === step)?.label} messages.` : 'The usual feed.'}
      </p>
    </div>
  );
}
