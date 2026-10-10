export interface Column {
  char: string;
  /** 0-9 when the character is a digit (it rolls); null for everything else (it stays put). */
  digit: number | null;
}

/** One column per character, so a readout like "1 h 05 min" can roll its digits and hold its units still. */
export const toColumns = (text: string): Column[] =>
  Array.from(text).map((char) => ({ char, digit: /^[0-9]$/.test(char) ? Number(char) : null }));
