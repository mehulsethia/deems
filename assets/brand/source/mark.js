// Geometry of the Deems mark (100x100 artboard). The app icon, splash and src/components/Logo.tsx use these shapes.
// Deems mark: a lowercase "d" whose bowl is a speech bubble. 100x100 artboard.
const LIME = '#C6FF3D', BG = '#0B0B0C';
const STEM = 'M58 20 A10 10 0 0 1 78 20 V88 H58 Z';
const BOWL = { cx: 44, cy: 61, r: 27, hole: 11 };
const TAIL = 'M23 75 L15 89 L33 84 Z';
const mark = (fg = LIME, hole = BG) => `
  <path d="${STEM}" fill="${fg}"/>
  <circle cx="${BOWL.cx}" cy="${BOWL.cy}" r="${BOWL.r}" fill="${fg}"/>
  <path d="${TAIL}" fill="${fg}" stroke="${fg}" stroke-width="3" stroke-linejoin="round"/>
  <circle cx="${BOWL.cx}" cy="${BOWL.cy}" r="${BOWL.hole}" fill="${hole}"/>`;
module.exports = { mark, LIME, BG, STEM, BOWL, TAIL };
