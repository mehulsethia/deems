import { RECEIPT_ROW_CHARS, receiptFit } from '../src/onboarding/receiptFit';

const rowWidth = (w: number) => {
  const f = receiptFit(w);
  return RECEIPT_ROW_CHARS * f.fontSize * 0.66 + f.padX * 2;
};

describe('receiptFit', () => {
  it('keeps the design size on standard phones and up', () => {
    expect(receiptFit(342).fontSize).toBe(13); // 390pt phone
    expect(receiptFit(512).fontSize).toBe(13); // unfolded iPhone Duo column
  });

  it('shrinks on small phones so the longest row fits on one line', () => {
    for (const paper of [272, 312, 327]) expect(rowWidth(paper)).toBeLessThanOrEqual(paper);
    expect(receiptFit(272).fontSize).toBe(11); // 320pt phone
    expect(receiptFit(312).fontSize).toBe(12.5); // 360pt phone
  });

  it('never goes below the legibility floor', () => {
    expect(receiptFit(120).fontSize).toBe(10.5);
    expect(receiptFit(0).fontSize).toBe(10.5);
  });
});
