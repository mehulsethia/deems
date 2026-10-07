/** A short note from the founder. The section stays hidden while this is null. */
export interface FounderNote {
  /** One string per paragraph. */
  paragraphs: string[];
  name: string;
  role?: string;
}

export const founder: FounderNote | null = null;
