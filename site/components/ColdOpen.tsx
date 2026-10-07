'use client';

import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { EASE } from './Reveal';

/** Start at 10:13; the spin adds 47 minutes. */
const START_MIN = 13;
const START_HOUR_ANGLE = 10 * 30 + START_MIN * 0.5;
const LATER = 47;

function Clock({ spun }: { spun: boolean }) {
  const minuteFrom = START_MIN * 6;
  const minuteTo = (START_MIN + LATER) * 6;
  const hourTo = START_HOUR_ANGLE + LATER * 0.5;
  const ticks = Array.from({ length: 12 }, (_, i) => i);
  return (
    <svg className="clock" viewBox="0 0 200 200" aria-hidden>
      <circle cx="100" cy="100" r="96" fill="#17191E" stroke="#2A2D34" strokeWidth="2" />
      {ticks.map((i) => {
        const a = (i * Math.PI) / 6;
        const major = i % 3 === 0;
        const r1 = major ? 72 : 80;
        return (
          <line
            key={i}
            x1={(100 + Math.sin(a) * r1).toFixed(3)}
            y1={(100 - Math.cos(a) * r1).toFixed(3)}
            x2={(100 + Math.sin(a) * 88).toFixed(3)}
            y2={(100 - Math.cos(a) * 88).toFixed(3)}
            stroke={major ? '#FFFFFF' : '#B4B9C2'}
            strokeWidth={major ? 3 : 2}
            strokeLinecap="round"
          />
        );
      })}
      <motion.line
        x1="100"
        y1="100"
        x2="100"
        y2="52"
        stroke="#FFFFFF"
        strokeWidth="6"
        strokeLinecap="round"
        style={{ originX: '100px', originY: '100px' }}
        initial={{ rotate: START_HOUR_ANGLE }}
        animate={{ rotate: spun ? hourTo : START_HOUR_ANGLE }}
        transition={{ duration: 1.1, ease: EASE }}
      />
      <motion.line
        x1="100"
        y1="100"
        x2="100"
        y2="30"
        stroke="#FFFFFF"
        strokeWidth="4"
        strokeLinecap="round"
        style={{ originX: '100px', originY: '100px' }}
        initial={{ rotate: minuteFrom }}
        animate={{ rotate: spun ? minuteTo : minuteFrom }}
        transition={{ type: 'spring', stiffness: 60, damping: 11, mass: 1 }}
      />
      <circle cx="100" cy="100" r="6" fill="#E4257A" />
    </svg>
  );
}

/** "You opened the app to answer this." ... the clock spins forward ... "That was 47 minutes ago." */
export function ColdOpen() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -25% 0px' });
  const reduce = useReducedMotion();
  const [spun, setSpun] = useState(false);

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setSpun(true), reduce ? 0 : 1600);
    return () => clearTimeout(t);
  }, [inView, reduce]);

  const headline = spun ? 'That was 47 minutes ago.' : 'You opened the app to answer this.';

  return (
    <div className="wrap coldopen" ref={ref}>
      <div className="coldopen-visual">
        <motion.div
          className="banner"
          role="img"
          aria-label="Message from maya: you free sat?"
          initial={{ opacity: 0, y: -60, scale: 0.96 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : undefined}
          transition={{ type: 'spring', stiffness: 220, damping: 20, delay: 0.3 }}
        >
          <div className="avatar">m</div>
          <div className="banner-body">
            <div className="banner-top">
              <strong>maya</strong>
              <span className="label">now</span>
            </div>
            <span className="muted">you free sat?</span>
          </div>
        </motion.div>
        <Clock spun={spun} />
      </div>
      <div style={{ display: 'grid', gap: 24 }}>
        <span className="eyebrow">Sound familiar</span>
        <div className="swap">
          <AnimatePresence mode="wait" initial={false}>
            <motion.h2
              key={headline}
              className={`title${spun ? ' accent' : ''}`}
              initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -24, filter: 'blur(8px)' }}
              transition={{ duration: 0.55, ease: EASE }}
              aria-live="polite"
            >
              {headline}
            </motion.h2>
          </AnimatePresence>
        </div>
        <motion.p
          className="lede"
          initial={{ opacity: 0 }}
          animate={spun ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          Every time.
        </motion.p>
      </div>
    </div>
  );
}
