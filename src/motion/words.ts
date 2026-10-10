/** Words of a headline, for the word-by-word entrance. Whitespace-only text has no words. */
export const splitWords = (text: string): string[] => text.split(/\s+/).filter(Boolean);
