'use client';

import { AnimatePresence, motion, useInView } from 'motion/react';
import { useEffect, useId, useRef, useState } from 'react';
import { breakdown, formatDaysCaps, formatDuration, mostlyTalking, TALKING_RANGE, TOTAL_RANGE } from '@/lib/maths';
import { EASE } from './Reveal';

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  const id = useId();
  const fill = max > min ? ((value - min) / (max - min)) * 100 : 0;
  return (
    <div className="control">
      <label htmlFor={id}>{label}</label>
      <output htmlFor={id} className="readout" aria-live="polite">
        {formatDuration(value)}
      </output>
      <input
        id={id}
        className="range"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={formatDuration(value)}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ ['--fill' as string]: `${fill}%` }}
      />
      <div className="range-ends label" aria-hidden>
        <span>{formatDuration(min)}</span>
        <span>{formatDuration(max)}</span>
      </div>
    </div>
  );
}

/** Seconds until the last line has printed. */
const PRINT = 0.25 + 6 * 0.22;

/** One printed line: appears in sequence when the receipt first comes into view. */
function Line({ i, show, children }: { i: number; show: boolean; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={show ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.3, delay: 0.25 + i * 0.22 }}
    >
      {children}
    </motion.div>
  );
}

function Strike({ show, delay }: { show: boolean; delay: number }) {
  return (
    <motion.span
      className="strike"
      aria-hidden
      initial={{ scaleX: 0 }}
      animate={{ scaleX: show ? 1 : 0 }}
      transition={{ duration: 0.45, ease: EASE, delay }}
    />
  );
}

/** The app's receipt, live: two answers in, one honest number out. */
export function Calculator() {
  const [total, setTotal] = useState<number>(TOTAL_RANGE.initial);
  const [talking, setTalking] = useState<number>(TALKING_RANGE.initial);
  const ref = useRef<HTMLDivElement>(null);
  const printed = useInView(ref, { once: true, margin: '0px 0px -20% 0px' });

  const b = breakdown(total, talking);
  const talker = mostlyTalking(b);
  const days = formatDaysCaps(b.days);
  const refunded = printed && !talker && !!days;
  // Strikes and stamp wait for the first print to finish; after that they react straight away.
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    if (!printed) return;
    const t = setTimeout(() => setSettled(true), (PRINT + 1.2) * 1000);
    return () => clearTimeout(t);
  }, [printed]);
  const after = settled ? 0 : PRINT;

  const setTotalAndCap = (v: number) => {
    setTotal(v);
    setTalking((t) => Math.min(t, v));
  };

  return (
    <div className="calc-card">
      <div className="controls">
        <Slider
          label="How long do these apps get from you a day?"
          value={total}
          min={TOTAL_RANGE.min}
          max={TOTAL_RANGE.max}
          step={TOTAL_RANGE.step}
          onChange={setTotalAndCap}
        />
        <Slider
          label="How much of that is actually talking to someone?"
          value={Math.min(talking, total)}
          min={TALKING_RANGE.min}
          max={total}
          step={TALKING_RANGE.step}
          onChange={setTalking}
        />
      </div>

      <div className="receipt-wrap" ref={ref}>
        <motion.div
          className="receipt"
          role="img"
          aria-label={
            `Receipt: ${formatDuration(b.talking)} of messages and ${formatDuration(b.other)} of feed, reels and explore, ` +
            `${formatDuration(b.total)} a day.` +
            (!talker && days ? ` ${b.days} days a year, struck off and refunded.` : '')
          }
          initial={{ opacity: 0, y: 60 }}
          animate={printed ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <Line i={0} show={printed}>
            <div className="receipt-row">
              <strong>DEEMS</strong>
              <span>PER DAY</span>
            </div>
          </Line>
          <Line i={1} show={printed}>
            <hr />
          </Line>
          <Line i={2} show={printed}>
            <div className="receipt-row">
              <span>MESSAGES</span>
              <span className="kept">{formatDuration(b.talking)}</span>
            </div>
          </Line>
          <Line i={3} show={printed}>
            <div className={`receipt-row${refunded ? ' struck' : ''}`}>
              <span>FEED, REELS, EXPLORE</span>
              <span>{formatDuration(b.other)}</span>
              <Strike show={refunded} delay={after} />
            </div>
          </Line>
          <Line i={4} show={printed}>
            <hr />
          </Line>
          <Line i={5} show={printed}>
            <div className="receipt-row">
              <span>TOTAL PER DAY</span>
              <span>{formatDuration(b.total)}</span>
            </div>
          </Line>
          <Line i={6} show={printed}>
            <div className={`receipt-row${refunded ? ' struck' : ''}`} style={{ visibility: days ? 'visible' : 'hidden' }}>
              <span>PER YEAR</span>
              <span>{days ?? '—'}</span>
              <Strike show={refunded} delay={settled ? 0 : after + 0.3} />
            </div>
          </Line>
          <div className="receipt-space" />
          <AnimatePresence>
            {refunded ? (
              <motion.div
                key="stamp"
                className="stamp"
                aria-hidden
                initial={{ opacity: 0, scale: 1.9, rotate: -14 }}
                animate={{ opacity: 1, scale: 1, rotate: -7 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: 'spring', stiffness: 320, damping: 16, delay: settled ? 0.15 : after + 0.75 }}
              >
                REFUNDED
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>

        <div className="verdict" aria-live="polite">
          {talker ? (
            <p className="heading">You’re already mostly here to talk. Deems keeps it that way.</p>
          ) : (
            <>
              <p className="heading">
                {b.percent}% of your time here isn’t with anyone. That’s {b.days} full days a year.
              </p>
              <p className="working">{formatDuration(b.other)} a day x 365 days</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
