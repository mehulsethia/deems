import { useMemo } from 'react';
import { breakdown, clampTotal, TOTAL_RANGE, TALKING_RANGE } from './maths';
import { readProgress } from '@/state/progress';

/** The user's saved answers as a breakdown, read once per mount. */
export function useBreakdown() {
  return useMemo(() => {
    const p = readProgress();
    return breakdown(clampTotal(p.totalMinutes ?? TOTAL_RANGE.initial), p.talkingMinutes ?? TALKING_RANGE.initial);
  }, []);
}

/** Today's date, fixed for the life of the screen. */
export const useToday = () => useMemo(() => new Date(), []);
