'use client';

import { useReducedMotion } from 'motion/react';
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { DeemsMark } from './DeemsMark';
import { PLATFORM_ORDER, PlatformLogo, platformName, type Platform } from './PlatformLogo';
import { Wordmark } from './Wordmark';

/** Divider sweep: 20% to 80% and back, until the visitor takes over. */
const SWEEP_MIN = 20;
const SWEEP_MAX = 80;
const PERIOD_MS = 9000;
const clamp = (v: number) => Math.min(96, Math.max(4, v));

/* ---------- The usual way: our own greyscale drawing of a generic feed ---------- */

const Bar = ({ w, h = 8, c }: { w: number | string; h?: number; c?: string }) => (
  <span className="f-bar" style={{ width: w, height: h, background: c, display: 'block' }} />
);

function TabIcon({ d }: { d: string }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#6b6b6b"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
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
          <span style={{ marginLeft: 'auto' }}>
            <Bar w={18} h={4} />
          </span>
        </div>
        <div className="f-img" style={{ height: 170 }} />
        <div className="f-head">
          <Bar w={22} h={10} />
          <Bar w={22} h={10} />
          <Bar w={22} h={10} />
        </div>
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
        <span style={{ position: 'absolute', left: 10, bottom: 10 }}>
          <Bar w={64} c="rgba(255,255,255,0.7)" />
        </span>
      </div>
      <div className="f-post">
        <div className="f-head">
          <span className="f-dot" />
          <Bar w={70} />
          <span className="f-ad">Ad</span>
        </div>
        <div className="f-img" style={{ height: 130 }} />
        <Bar w="100%" h={30} c="#e2e2e2" />
      </div>
      <div className="f-post">
        <div className="f-head">
          <span className="f-dot" />
          <Bar w={110} />
        </div>
        <div
          className="f-img"
          style={{
            height: 150,
            background: 'linear-gradient(20deg,#c9c9c9,#7d7d7d)',
          }}
        />
        <Bar w="55%" />
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

/* ---------- DeeMs: calm inbox, invented people, drawn initials ---------- */

const GREYS = ['#3d3d3d', '#262626', '#6b6b6b', '#3d3d3d', '#262626'];

export function Initials({ name, size, shade }: { name: string; size: number; shade: number }) {
  return (
    <span className="avatar" style={{ width: size, height: size, background: GREYS[shade % GREYS.length], fontSize: size * 0.4 }}>
      {name[0]}
    </span>
  );
}

const CHATS: { name: string; msg: string; time: string; platform: Platform; unread?: boolean }[] = [
  { name: 'Mum', msg: 'call me when you’re free', time: '2m', platform: 'facebook', unread: true },
  { name: 'Maya', msg: 'you free sat?', time: '9m', platform: 'instagram', unread: true },
  { name: 'Family group', msg: 'Dad sent a photo', time: '1h', platform: 'facebook' },
  { name: 'Sam', msg: 'voice message 0:14', time: '3h', platform: 'threads' },
  { name: 'Priya', msg: 'haha okay deal', time: '1d', platform: 'instagram' },
  { name: 'Jo', msg: 'see you there', time: '2d', platform: 'instagram' },
];

/** The DeeMs app, as it looks: dark chrome, platform tabs, chats. Nothing else. */
function App() {
  return (
    <div className="app">
      <div className="app-bar">
        <span className="brand">
          <DeemsMark size={20} on="dark" />
          <Wordmark />
        </span>
        <span className="settings">Settings</span>
      </div>
      <div className="app-tabs">
        {PLATFORM_ORDER.map((p, i) => (
          <span className={`app-tab${i === 0 ? ' on' : ''}`} key={p}>
            <PlatformLogo platform={p} size={14} on={i === 0 ? 'light' : 'dark'} />
            {platformName(p)}
          </span>
        ))}
      </div>
      <div className="chats">
        {CHATS.map((c, i) => (
          <div className={`chat${c.unread ? ' unread' : ''}`} key={c.name}>
            <span className="chat-av">
              <Initials name={c.name} size={44} shade={i} />
              <span className="chat-badge">
                <PlatformLogo platform={c.platform} size={13} />
              </span>
            </span>
            <span className="chat-body">
              <span className="chat-name">
                <span className="n">{c.name}</span>
                <time>{c.time}</time>
              </span>
              <span className="chat-msg">{c.msg}</span>
            </span>
            {c.unread ? <span className="dot-unread" /> : null}
          </div>
        ))}
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

/* ---------- The comparison ---------- */

export function HeroCompare() {
  const reduce = useReducedMotion();
  const [manual, setManual] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const handle = useRef<HTMLButtonElement>(null);
  const pos = useRef(50);
  const dragging = useRef(false);

  // Written straight to the DOM so the sweep doesn't re-render the drawing every frame.
  const apply = useCallback((p: number) => {
    pos.current = p;
    root.current?.style.setProperty('--pos', `${p}%`);
    handle.current?.setAttribute('aria-valuenow', String(Math.round(p)));
  }, []);

  useEffect(() => {
    if (manual) return;
    if (reduce) {
      apply(50);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const mid = (SWEEP_MIN + SWEEP_MAX) / 2;
    const amp = (SWEEP_MAX - SWEEP_MIN) / 2;
    const tick = (t: number) => {
      apply(mid + amp * Math.sin(((t - start) / PERIOD_MS) * 2 * Math.PI));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce, manual, apply]);

  const fromPointer = (e: PointerEvent) => {
    const r = root.current?.getBoundingClientRect();
    if (r) apply(clamp(((e.clientX - r.left) / r.width) * 100));
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    setManual(true);
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    fromPointer(e);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (dragging.current) fromPointer(e);
  };
  const stop = () => {
    dragging.current = false;
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const steps: Record<string, number> = {
      ArrowLeft: -5,
      ArrowDown: -5,
      ArrowRight: 5,
      ArrowUp: 5,
      PageDown: -20,
      PageUp: 20,
    };
    let next: number | null = null;
    if (e.key in steps) next = pos.current + steps[e.key];
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = 100;
    if (next === null) return;
    e.preventDefault();
    setManual(true);
    apply(clamp(next));
  };

  return (
    <div className="compare-wrap">
      <div className="compare-labels" aria-hidden>
        <span>← The usual way</span>
        <span>DeeMs →</span>
      </div>
      <div className="phone">
        <div className="phone-screen">
          <span className="phone-notch" aria-hidden />
          <StatusBar />
          <div
            ref={root}
            className="compare"
            style={{ ['--pos' as string]: '50%' }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={stop}
            onPointerCancel={stop}
          >
            <div className="compare-layer deems" aria-hidden>
              <App />
            </div>
            <div className="compare-layer" style={{ clipPath: 'inset(0 calc(100% - var(--pos)) 0 0)' }} aria-hidden>
              <Feed />
            </div>
            <div className="compare-divider" style={{ left: 'var(--pos)' }}>
              <button
                ref={handle}
                type="button"
                className="compare-handle"
                role="slider"
                aria-label="Compare the usual feed with the DeeMs inbox"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={50}
                aria-valuetext="Left: the usual way. Right: DeeMs."
                onKeyDown={onKeyDown}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="#0a0a0a"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M7 5L2 10l5 5M13 5l5 5-5 5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
