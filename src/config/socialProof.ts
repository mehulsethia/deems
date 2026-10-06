/**
 * Real, verifiable social proof only: no invented testimonials, ratings, laurels or user counts.
 * Nothing renders while this returns an empty array.
 */
export interface Testimonial {
  quote: string;
  attribution: string;
}

export function socialProof(): Testimonial[] {
  // Hook: return real, attributable quotes here once they exist.
  return [];
}
