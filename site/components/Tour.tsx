'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { PhoneFrame, SCREENS } from './PhoneFrame';
import { EASE } from './Reveal';

const STEPS = [
  { title: 'Pick your apps.', body: 'Instagram, Threads, Facebook. One, two or all three.', src: SCREENS.pickApps, alt: 'Choosing Instagram, Threads and Facebook in Deems.' },
  { title: 'Add it up.', body: 'Two questions, your own answers. They print as a receipt, nothing projected.', src: SCREENS.receipt, alt: 'The Deems receipt printing your time per day.' },
  { title: 'Refund the rest.', body: 'Feed, Reels and Explore get struck off. Messages stay.', src: SCREENS.refund, alt: 'The receipt with feed, Reels and Explore struck off and refunded.' },
  { title: 'Sign in on their own page.', body: 'You sign in on the platform’s own page inside Deems. We never see your password.', src: SCREENS.trust, alt: 'Deems explaining that you sign in on the platform’s own page.' },
  { title: 'Reply and leave.', body: 'Messages and your friends’ stories. That’s the whole app.', src: SCREENS.whatsLeft, alt: 'Deems with only messages and stories left.' },
];

export function Tour() {
  const [active, setActive] = useState(0);
  const step = STEPS[active];
  return (
    <div className="tour">
      <div className="tour-steps">
        {STEPS.map((s, i) => (
          <motion.div
            key={s.title}
            className={`tour-step${i === active ? ' active' : ''}`}
            onViewportEnter={() => setActive(i)}
            viewport={{ amount: 0.6 }}
          >
            <span className="num">0{i + 1} / 0{STEPS.length}</span>
            <h3 className="title" style={{ fontSize: 'clamp(34px, 4.6vw, 60px)' }}>
              {s.title}
            </h3>
            <p className="lede">{s.body}</p>
            <div className="phone-inline">
              <PhoneFrame src={s.src} alt={s.alt} />
            </div>
          </motion.div>
        ))}
      </div>
      <div className="tour-sticky" aria-hidden>
        <div className="tour-phone">
          {/* Sizer keeps the frame's height; screens cross-fade on top of it. */}
          <div style={{ visibility: 'hidden' }}>
            <PhoneFrame src={STEPS[0].src} alt="" />
          </div>
          <AnimatePresence initial={false}>
            <motion.div
              key={step.src}
              className="layer"
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.96 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <PhoneFrame src={step.src} alt={step.alt} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
