'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { detectRegion, planSummary, TRIAL_DAYS, type Region } from '@/lib/pricing';
import { site } from '@/lib/site';
import { Tick } from './Icons';
import { EASE } from './Reveal';
import { androidCta, PrimaryButton } from './StoreButtons';

/** Plans with the launch prices (₹ in India), the yearly saving, and the trial timeline. */
export function Pricing() {
  const [region, setRegion] = useState<Region>('default');
  // Region comes from the browser, so it's resolved after hydration (the static page renders US prices).
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setRegion(detectRegion()), []);
  const s = planSummary(region);
  const [plan, setPlan] = useState<'yearly' | 'monthly'>('yearly');

  return (
    <div className="pricing">
      <div className="pricing-copy">
        <span className="label">Pricing</span>
        <h2 className="title">
          Try it for <em>{TRIAL_DAYS} days.</em>
        </h2>
        <ol className="timeline">
          <li>
            <b>Today</b>
            <span>Your messages, nothing else</span>
          </li>
          <li>
            <b>Day {TRIAL_DAYS - site.reminderDaysBefore}</b>
            <span>We remind you</span>
          </li>
          <li>
            <b>Day {TRIAL_DAYS}</b>
            <span>Billing starts unless you cancel</span>
          </li>
        </ol>
      </div>

      <div className="plans-wrap">
        <div className="plans" role="radiogroup" aria-label="Plans">
          <motion.button
            type="button"
            role="radio"
            aria-checked={plan === 'yearly'}
            className={`plan${plan === 'yearly' ? ' on' : ''}`}
            onClick={() => setPlan('yearly')}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            <span className="plan-pill">{TRIAL_DAYS} days free</span>
            <span className="plan-name">Yearly</span>
            <span className="plan-price">
              {s.yearlyPerMonth}
              <small>/month</small>
            </span>
            <span className="plan-sub">{s.yearly} billed yearly</span>
            <span className="plan-save">Save {s.savePercent}%</span>
          </motion.button>
          <motion.button
            type="button"
            role="radio"
            aria-checked={plan === 'monthly'}
            className={`plan${plan === 'monthly' ? ' on' : ''}`}
            onClick={() => setPlan('monthly')}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            <span className="plan-name">Monthly</span>
            <span className="plan-price">
              {s.monthly}
              <small>/month</small>
            </span>
            <span className="plan-sub">Billed monthly</span>
          </motion.button>
        </div>

        <p className="saving">
          <span className="tick">
            <Tick />
          </span>
          Yearly saves you {s.saveAmount} a year
        </p>

        <div className="cta-row">
          <PrimaryButton />
          <a className="text-link" href={androidCta.href}>
            {androidCta.label}
          </a>
        </div>
        <p className="fine">
          {plan === 'yearly'
            ? `No payment due now. Then ${s.yearly} a year, unless you cancel before day ${TRIAL_DAYS}.`
            : `${s.monthly} a month. Cancel any time.`}{' '}
          Billed by the App Store or Google Play, in your local currency.
        </p>
      </div>
    </div>
  );
}
