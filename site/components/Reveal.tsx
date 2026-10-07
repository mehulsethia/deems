'use client';

import { motion, MotionConfig, type HTMLMotionProps } from 'motion/react';
import type { ReactNode } from 'react';

/** Honour the visitor's Reduce Motion setting everywhere. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

export const EASE = [0.22, 1, 0.36, 1] as const;

/** Fades its children up 16px the first time they scroll into view. Once. */
export function Reveal({ children, delay = 0, y = 16, ...rest }: { children: ReactNode; delay?: number; y?: number } & HTMLMotionProps<'div'>) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.7, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
