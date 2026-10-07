/**
 * Real quotes from real people, with their permission. The section stays hidden while this is empty.
 * Never add placeholder or invented quotes.
 */
export interface ProofQuote {
  quote: string;
  name: string;
  /** e.g. "Student, Mumbai". Optional. */
  detail?: string;
}

export const proof: ProofQuote[] = [];

/** Optional store rating line, e.g. { score: '4.8', source: 'App Store', count: '120 ratings' }. */
export const rating: { score: string; source: string; count: string } | null = null;
