'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { PLATFORMS } from '@/lib/platforms';
import { DeemsMark } from './DeemsMark';
import { PhoneFrame, SCREENS } from './PhoneFrame';
import { EASE } from './Reveal';
import { StoreButtons, TrialNote } from './StoreButtons';

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 36 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, ease: EASE, delay },
});

/** Bobs gently forever (transform only, so Reduce Motion turns it off). */
const bob = (distance: number, duration: number, delay = 0) => ({
  animate: { y: [0, -distance, 0] },
  transition: { duration, ease: 'easeInOut' as const, repeat: Infinity, delay },
});

function FloatingIcon({ src, name, style, delay, d }: { src: string; name: string; style: React.CSSProperties; delay: number; d: number }) {
  return (
    <motion.div
      className="float-icon"
      style={style}
      initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 160, damping: 14, delay }}
    >
      <motion.div {...bob(10, d, delay)} style={{ display: 'grid', placeItems: 'center', width: '100%', height: '100%' }}>
        <Image src={src} alt={name} width={64} height={64} />
      </motion.div>
    </motion.div>
  );
}

function StruckChip({ label, style, delay }: { label: string; style: React.CSSProperties; delay: number }) {
  return (
    <motion.div
      className="struck-chip"
      style={style}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: [0, 1, 1, 0.55], y: 0 }}
      transition={{ duration: 2.2, times: [0, 0.2, 0.7, 1], delay }}
    >
      {label}
      <motion.span
        className="strike"
        aria-hidden
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5, ease: EASE, delay: delay + 0.9 }}
      />
    </motion.div>
  );
}

export function Hero() {
  const stage = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: stage, offset: ['start end', 'end start'] });
  const sideY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const centerY = useTransform(scrollYProgress, [0, 1], [20, -30]);

  return (
    <section className="hero">
      <div className="hero-grid-bg" aria-hidden />
      <div className="wrap hero-copy">
        <motion.div className="badge" {...rise(0)}>
          <span className="badge-logos">
            {PLATFORMS.map((p) => (
              <Image key={p.name} src={p.src} alt="" width={26} height={26} />
            ))}
          </span>
          For Instagram, Threads and Facebook
        </motion.div>

        <h1 className="display hero-title">
          <motion.span className="line" {...rise(0.08)}>
            Reply
            <span className="inline-mark" aria-hidden>
              <DeemsMark size={56} />
            </span>
            and
          </motion.span>
          <motion.span className="line" {...rise(0.18)}>
            leave.
          </motion.span>
        </h1>

        <motion.p className="lede" {...rise(0.3)}>
          Your messages and your friends’ stories from Instagram, Threads and Facebook. The feed, Reels and Explore stay
          hidden. Nothing else is coming.
        </motion.p>

        <motion.div style={{ display: 'grid', gap: 14, justifyItems: 'center' }} {...rise(0.4)}>
          <StoreButtons align="center" />
          <TrialNote />
        </motion.div>
      </div>

      <div className="stage" ref={stage}>
        {/* Outer layer: scroll parallax. Inner layer: entrance. Kept apart so the two never fight over y. */}
        <motion.div className="stage-phone left" style={{ y: sideY }}>
          <motion.div
            initial={{ opacity: 0, y: 120, rotate: 0 }}
            animate={{ opacity: 1, y: 0, rotate: -7 }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.55 }}
          >
            <PhoneFrame src={SCREENS.pickApps} alt="Deems setup: choose Instagram, Threads and Facebook." />
          </motion.div>
        </motion.div>
        <motion.div className="stage-phone center" style={{ y: centerY }}>
          <motion.div initial={{ opacity: 0, y: 140 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.45 }}>
            <motion.div {...bob(8, 6, 1.6)}>
              <PhoneFrame
                src={SCREENS.refund}
                priority
                alt="Deems receipt: messages kept, feed, Reels and Explore struck off and stamped refunded."
              />
            </motion.div>
          </motion.div>
        </motion.div>
        <motion.div className="stage-phone right" style={{ y: sideY }}>
          <motion.div
            initial={{ opacity: 0, y: 120, rotate: 0 }}
            animate={{ opacity: 1, y: 0, rotate: 7 }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.65 }}
          >
            <PhoneFrame src={SCREENS.whatsLeft} alt="What is left in Deems: messages and friends’ stories." />
          </motion.div>
        </motion.div>

        <FloatingIcon {...PLATFORMS[0]} style={{ left: '8%', top: '6%' }} delay={1.0} d={5.5} />
        <FloatingIcon {...PLATFORMS[1]} style={{ right: '9%', top: '2%' }} delay={1.15} d={6.5} />
        <FloatingIcon {...PLATFORMS[2]} style={{ right: '5%', top: '42%' }} delay={1.3} d={5} />

        <StruckChip label="Feed" style={{ left: '4%', top: '34%' }} delay={1.4} />
        <StruckChip label="Reels" style={{ left: '12%', top: '56%' }} delay={1.75} />
        <StruckChip label="Explore" style={{ right: '13%', top: '64%' }} delay={2.1} />

        <div className="stage-fade" aria-hidden />
      </div>
    </section>
  );
}
