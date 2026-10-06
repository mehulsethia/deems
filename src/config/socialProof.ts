/**
 * Real social proof only. Leave both empty until supplied from real data;
 * the connect screen hides the block when there is nothing here.
 */
export interface Testimonial {
  quote: string;
  attribution: string;
}

export interface SocialProof {
  testimonials: Testimonial[];
  /** A verified user count, or null. */
  userCount: number | null;
}

export const socialProof: SocialProof = {
  testimonials: [],
  userCount: null,
};

export const hasSocialProof = (s: SocialProof = socialProof) => s.testimonials.length > 0 || (s.userCount ?? 0) > 0;
