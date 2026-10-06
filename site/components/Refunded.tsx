'use client';

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { Tick } from './Icons';
import { EASE } from './Reveal';

const KEPT = ['Messages and group chats', 'Your friends’ stories', 'Voice notes, photos and videos in chats', 'Posts a friend sends you, one at a time'];
const GONE = ['Feed', 'Reels', 'Explore'];

/** Kept on the left; Feed, Reels and Explore get struck off one by one as the card comes into view. */
export function Refunded() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -20% 0px' });
  return (
    <div className="split" ref={ref}>
      <div className="card">
        <h3 className="heading">Kept</h3>
        <ul className="list">
          {KEPT.map((k, i) => (
            <motion.li
              key={k}
              initial={{ opacity: 0, x: -16 }}
              animate={inView ? { opacity: 1, x: 0 } : undefined}
              transition={{ duration: 0.5, ease: EASE, delay: 0.1 + i * 0.1 }}
            >
              <span className="tick">
                <Tick />
              </span>
              {k}
            </motion.li>
          ))}
        </ul>
      </div>
      <div className="card">
        <h3 className="heading">Refunded</h3>
        <ul className="list removed">
          {GONE.map((g, i) => (
            <li key={g}>
              <span className="word">
                {g}
                <motion.span
                  className="strike"
                  aria-hidden
                  initial={{ scaleX: 0 }}
                  animate={inView ? { scaleX: 1 } : undefined}
                  transition={{ duration: 0.5, ease: EASE, delay: 0.5 + i * 0.35 }}
                />
              </span>
              <span className="sr-only"> (removed)</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
