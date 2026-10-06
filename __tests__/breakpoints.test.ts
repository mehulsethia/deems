import { layoutFor } from '../src/theme/breakpoints';

/** Window sizes in points. */
const DEVICES = {
  smallAndroid: [320, 568],
  iphoneSE: [375, 667],
  android: [360, 800],
  iphone: [390, 844],
  proMax: [440, 956],
  pixel: [412, 915],
  duoFolded: [375, 812],
  duoOpen: [669, 951],
  duoOpenLandscape: [951, 669],
  phoneLandscape: [844, 390],
  ipadPortrait: [820, 1180],
  ipadLandscape: [1180, 820],
} as const;

const at = (k: keyof typeof DEVICES) => layoutFor(...(DEVICES[k] as unknown as [number, number]));

describe('layoutFor', () => {
  it('uses one column on every phone held upright, folded or not', () => {
    for (const k of ['smallAndroid', 'iphoneSE', 'android', 'iphone', 'proMax', 'pixel', 'duoFolded'] as const) {
      expect(at(k).spread).toBe(false);
      expect(at(k).contentWidth).toBe(DEVICES[k][0]);
    }
  });

  it('keeps unfolded iPhone Duo upright as one centred column', () => {
    expect(at('duoOpen')).toMatchObject({ spread: false, contentWidth: 560 });
  });

  it('splits into two panes when there is width to spare', () => {
    expect(at('duoOpenLandscape').spread).toBe(true);
    expect(at('phoneLandscape').spread).toBe(true);
    expect(at('ipadLandscape').spread).toBe(true);
    expect(at('ipadPortrait').spread).toBe(false);
  });

  it('flags short screens and narrow phones', () => {
    expect(at('phoneLandscape').short).toBe(true);
    expect(at('iphone').short).toBe(false);
    expect(at('smallAndroid').narrow).toBe(true);
    expect(at('iphoneSE').narrow).toBe(false);
  });

  it('scales headlines by the shorter side, within bounds', () => {
    expect(at('smallAndroid').headlineScale).toBe(0.86);
    expect(at('iphone').headlineScale).toBe(1);
    expect(at('phoneLandscape').headlineScale).toBe(1);
    expect(at('duoOpen').headlineScale).toBe(1.12);
  });

  it('never returns negative or NaN sizes', () => {
    const l = layoutFor(0, 0);
    expect(l.contentWidth).toBe(0);
    expect(Number.isFinite(l.headlineScale)).toBe(true);
  });
});
