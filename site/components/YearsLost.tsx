'use client';

import { useId, useState, type CSSProperties } from 'react';
import { AGE, DAILY, daysPerYear, formatDaily, formatYears, LIFESPAN, WAKING_HOURS, yearsLost } from '@/lib/lifeMaths';

const pct = (v: number, min: number, max: number) => ((v - min) / (max - min)) * 100;

function Slider({
  label,
  value,
  readout,
  min,
  max,
  step,
  ticks,
  onChange,
}: {
  label: string;
  value: number;
  readout: string;
  min: number;
  max: number;
  step: number;
  ticks: string[];
  onChange: (v: number) => void;
}) {
  const id = useId();
  return (
    <div className="calc-field">
      <div className="calc-top">
        <label htmlFor={id}>{label}</label>
        <output htmlFor={id} className="calc-readout">
          {readout}
        </output>
      </div>
      <input
        id={id}
        type="range"
        className="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={readout}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ '--fill': `${pct(value, min, max)}%` } as CSSProperties}
      />
      <div className="calc-ticks" aria-hidden>
        {ticks.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
    </div>
  );
}

/** Two sliders, two answers. Results stay blurred until the visitor moves something. */
export function YearsLost() {
  const [hours, setHours] = useState<number>(DAILY.initial);
  const [age, setAge] = useState<number>(AGE.initial);
  const [touched, setTouched] = useState(false);
  const infoId = useId();

  const years = yearsLost(hours, age);
  const days = daysPerYear(hours);

  return (
    <div className="calc">
      <div className="calc-inputs">
        <Slider
          label="Your daily social media use"
          value={hours}
          readout={formatDaily(hours)}
          {...DAILY}
          ticks={['0h', '2h', '4h', '6h', '8h']}
          onChange={(v) => {
            setHours(v);
            setTouched(true);
          }}
        />
        <Slider
          label="Your current age"
          value={age}
          readout={String(age)}
          {...AGE}
          ticks={['16', '30', '45', '60', '75']}
          onChange={(v) => {
            setAge(v);
            setTouched(true);
          }}
        />
      </div>

      <div className={`calc-results${touched ? '' : ' locked'}`}>
        <div className="calc-cards" aria-hidden={!touched}>
          <div className="calc-card dark">
            <p className="calc-kicker">
              At this pace you will spend
              <span className="info">
                <button type="button" className="info-btn" aria-describedby={infoId} aria-label="How this is worked out">
                  i
                </button>
                <span role="tooltip" id={infoId} className="info-tip">
                  Your daily time as a share of {WAKING_HOURS} waking hours, from your age to {LIFESPAN}.
                </span>
              </span>
            </p>
            <p className="calc-big">
              {formatYears(years)}
              <small>years</small>
            </p>
            <p className="calc-kicker">of your waking life scrolling.</p>
          </div>
          <div className="calc-card">
            <p className="calc-kicker">Every year</p>
            <p className="calc-big">
              {days}
              <small>days</small>
            </p>
            <p className="calc-kicker">spent scrolling.</p>
            <div className="year-grid" aria-hidden>
              {Array.from({ length: 365 }, (_, i) => (
                <span key={i} className={i < days ? 'on' : undefined} />
              ))}
            </div>
            <p className="fine">Each square is a day of the year. The filled ones are yours.</p>
          </div>
        </div>
        {touched ? null : (
          <p className="calc-pill" aria-hidden>
            <span className="pulse" />
            Move a slider to see your numbers
          </p>
        )}
        <p className="sr-only" aria-live="polite">
          {touched ? `${formatYears(years)} years of your waking life, ${days} days every year.` : ''}
        </p>
      </div>
    </div>
  );
}
