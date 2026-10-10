import { toColumns } from '../src/motion/digits';
import { splitWords } from '../src/motion/words';

describe('splitWords', () => {
  it('splits on whitespace and drops empties', () => {
    expect(splitWords('  Only   your DMs. ')).toEqual(['Only', 'your', 'DMs.']);
  });
  it('returns [] for empty or blank text', () => {
    expect(splitWords('')).toEqual([]);
    expect(splitWords('   ')).toEqual([]);
  });
  it('keeps a very long word whole', () => {
    const w = 'x'.repeat(80);
    expect(splitWords(`a ${w}`)).toEqual(['a', w]);
  });
});

describe('toColumns', () => {
  it('marks digits and leaves other characters static', () => {
    expect(toColumns('1 h 05')).toEqual([
      { char: '1', digit: 1 },
      { char: ' ', digit: null },
      { char: 'h', digit: null },
      { char: ' ', digit: null },
      { char: '0', digit: 0 },
      { char: '5', digit: 5 },
    ]);
  });
  it('handles zero, negatives and decimals without throwing', () => {
    expect(toColumns('0').map((c) => c.digit)).toEqual([0]);
    expect(toColumns('-2.5').map((c) => c.digit)).toEqual([null, 2, null, 5]);
  });
  it('returns [] for empty text', () => {
    expect(toColumns('')).toEqual([]);
  });
});
