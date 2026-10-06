/** Pure sizing for the receipt type so its longest row fits the paper on every phone. */

/** "FEED, REELS, EXPLORE" + a two-character gap + the longest value, "11 h 45 min". */
export const RECEIPT_ROW_CHARS = 33;
/** Geist Mono advance (0.6em) plus the +6% label tracking. */
const CHAR_EM = 0.66;
const MAX_FONT = 13;
const MIN_FONT = 10.5;

export interface ReceiptFit {
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  /** Horizontal padding inside the paper. */
  padX: number;
}

export function receiptFit(paperWidth: number): ReceiptFit {
  const padX = paperWidth < 340 ? 16 : 24;
  const avail = Math.max(0, paperWidth - padX * 2);
  const raw = avail / (RECEIPT_ROW_CHARS * CHAR_EM);
  const fontSize = Math.min(MAX_FONT, Math.max(MIN_FONT, Math.floor(raw * 2) / 2));
  return { fontSize, lineHeight: Math.round(fontSize * 1.54), letterSpacing: Math.round(fontSize * 0.06 * 100) / 100, padX };
}
