'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useId, useState } from 'react';
import { EASE } from './Reveal';

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();
  return (
    <div className="faq">
      {items.map((f, i) => {
        const isOpen = open === i;
        const id = `${base}-${i}`;
        return (
          <div className={`faq-item${isOpen ? ' open' : ''}`} key={f.q}>
            <button className="faq-q" aria-expanded={isOpen} aria-controls={id} onClick={() => setOpen(isOpen ? null : i)}>
              {f.q}
              <span className="faq-plus" aria-hidden>
                <svg width="14" height="14" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M7 1v12M1 7h12" />
                </svg>
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  id={id}
                  className="faq-a"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                >
                  <p>{f.a}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
