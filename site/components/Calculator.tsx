'use client';

import { useId, useState } from 'react';
import { breakdown, formatDaysCaps, formatDuration, mostlyTalking, TALKING_RANGE, TOTAL_RANGE } from '@/lib/maths';

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

/** The app's receipt, live: two answers in, one honest number out. */
export function Calculator() {
  const [total, setTotal] = useState<number>(TOTAL_RANGE.initial);
  const [talking, setTalking] = useState<number>(TALKING_RANGE.initial);
  const b = breakdown(total, talking);
  const talker = mostlyTalking(b);
  const days = formatDaysCaps(b.days);

  const setTotalAndCap = (v: number) => {
    setTotal(v);
    setTalking((t) => Math.min(t, v));
  };

  return (
    <div className="calc">
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

      <div className="receipt-wrap">
        <div
          className="receipt"
          role="img"
          aria-label={
            `Receipt: ${formatDuration(b.talking)} of messages and ${formatDuration(b.other)} of feed, reels and explore, ` +
            `${formatDuration(b.total)} a day.` +
            (!talker && days ? ` ${b.days} days a year, struck off and refunded.` : '')
          }
        >
          <div className="receipt-row">
            <strong>DEEMS</strong>
            <span>PER DAY</span>
          </div>
          <hr />
          <div className="receipt-row">
            <span>MESSAGES</span>
            <span className="kept">{formatDuration(b.talking)}</span>
          </div>
          <div className={`receipt-row${talker ? '' : ' struck'}`}>
            <span>FEED, REELS, EXPLORE</span>
            <span>{formatDuration(b.other)}</span>
          </div>
          <hr />
          <div className="receipt-row">
            <span>TOTAL PER DAY</span>
            <span>{formatDuration(b.total)}</span>
          </div>
          {!talker && days ? (
            <>
              <div className="receipt-row struck">
                <span>PER YEAR</span>
                <span>{days}</span>
              </div>
              <div className="receipt-space" />
              <div className="stamp" aria-hidden>
                REFUNDED
              </div>
            </>
          ) : null}
        </div>

        <div className="verdict" aria-live="polite">
          {talker ? (
            <p className="heading">You&rsquo;re already mostly here to talk. Deems keeps it that way.</p>
          ) : (
            <>
              <p className="heading">
                {b.percent}% of your time here isn&rsquo;t with anyone. That&rsquo;s {b.days} full days a year.
              </p>
              <p className="working">{formatDuration(b.other)} a day x 365 days</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
