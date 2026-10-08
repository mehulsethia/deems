import { decideNavigation, isSharedContentPath, normalizePath, parseUrl } from './matching';
import { getPack, PLATFORM_IDS } from './store';
import type { PlatformId, PlatformRules } from './types';

/** Short-video paths. A shared one opens on its own, with swiping to the next one switched off. */
export const REEL_PATH_PREFIXES = ['/reel', '/reels', '/tv'] as const;

export function isReelUrl(url: string): boolean {
  const parsed = parseUrl(url);
  return !!parsed && isSharedContentPath(parsed.path, REEL_PATH_PREFIXES);
}

const LINK_SHIMS = ['l.facebook.com', 'lm.facebook.com', 'l.instagram.com', 'l.threads.com'];

/** Meta wraps outbound links as `l.facebook.com/l.php?u=<real url>`; returns the real one. */
export function unwrapLinkShim(url: string): string {
  const parsed = parseUrl(url);
  if (!parsed || !LINK_SHIMS.includes(parsed.host)) return url;
  const m = /[?&]u=([^&#]+)/.exec(url);
  if (!m) return url;
  try {
    return decodeURIComponent(m[1]);
  } catch {
    return url;
  }
}

/**
 * The pack that can show `url` as shared content, trying `preferred` first. Lets an Instagram reel
 * sent in a Facebook chat open in the locked viewer instead of a browser.
 */
export function sharedPackFor(url: string, preferred?: PlatformId): PlatformRules | null {
  const order = preferred ? [preferred, ...PLATFORM_IDS.filter((id) => id !== preferred)] : [...PLATFORM_IDS];
  for (const id of order) {
    const pack = getPack(id);
    if (decideNavigation(pack, url).action === 'shared') return pack;
  }
  return null;
}

const MEDIA_HOSTS = ['cdninstagram.com', 'fbcdn.net'];

/** A photo or video file sent in a chat (served from Meta's media servers). */
export function isMediaUrl(url: string): boolean {
  const parsed = parseUrl(url);
  return !!parsed && parsed.protocol === 'https' && MEDIA_HOSTS.some((h) => parsed.host === h || parsed.host.endsWith('.' + h));
}

export const isStoryUrl = (url: string): boolean => {
  const parsed = parseUrl(url);
  return !!parsed && isSharedContentPath(parsed.path, ['/stories']);
};

/** How much swiping the shared viewer allows: none for reels and stories (taps still work), normal for posts. */
export type SwipeLock = 'vertical' | 'all' | 'none';
export const swipeLockFor = (url: string): SwipeLock => (isStoryUrl(url) ? 'all' : isReelUrl(url) ? 'vertical' : 'none');

/** Runs the rules script, then the lock, so an error in one never stops the other. */
export function withLock(rulesScript: string, allowedPaths: string[], swipe: SwipeLock): string {
  return `try {\n${rulesScript}\n} catch (e) {}\n${lockScript(allowedPaths, swipe)}`;
}

/**
 * Runs after the rules script in the shared viewer. Moving to any other item is ignored without reloading.
 * For reels, vertical swipes, wheel and arrow keys do nothing, so the next reel never loads; for stories, no
 * swipe does anything. Taps (play, pause, sound, like, next frame) still work.
 */
export function lockScript(allowedPaths: string[], swipe: SwipeLock): string {
  const allowed = allowedPaths.map((p) => normalizePath(p).toLowerCase().replace(/\/$/, ''));
  return `(function () {
  if (window.__onlydmLock) return;
  window.__onlydmLock = true;
  var ALLOWED = ${JSON.stringify(allowed)};
  var SWIPE = ${JSON.stringify(swipe)};
  var STYLE_ID = 'onlydm-lock';
  var CSS = 'html,body{overflow:hidden!important;overscroll-behavior:none!important}' +
    '*{scroll-snap-type:none!important;overscroll-behavior:none!important}';
  function same(url) {
    try {
      var p = new URL(String(url), location.href).pathname.toLowerCase().replace(/\\/$/, '');
      return ALLOWED.some(function (a) { return p === a || p.indexOf(a + '/') === 0; });
    } catch (e) { return true; }
  }
  ['pushState', 'replaceState'].forEach(function (name) {
    var orig = history[name];
    history[name] = function (state, title, url) {
      if (url != null && !same(url)) return;
      return orig.apply(history, arguments);
    };
  });
  if (SWIPE === 'none') return;
  function ensureStyle() {
    var root = document.head || document.documentElement;
    if (!root || document.getElementById(STYLE_ID)) return;
    var s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent = CSS;
    root.appendChild(s);
  }
  document.addEventListener('DOMContentLoaded', ensureStyle);
  ensureStyle();
  setInterval(ensureStyle, 1000);
  var x = 0, y = 0;
  document.addEventListener('touchstart', function (e) {
    var t = e.touches[0]; if (t) { x = t.clientX; y = t.clientY; }
  }, { passive: true, capture: true });
  document.addEventListener('touchmove', function (e) {
    var t = e.touches[0];
    if (!t) return;
    // Comments, share and other sheets scroll as normal; only the item itself is held in place.
    if (e.target && e.target.closest && e.target.closest('[role="dialog"]')) return;
    if (SWIPE === 'all' || Math.abs(t.clientY - y) >= Math.abs(t.clientX - x)) e.preventDefault();
  }, { passive: false, capture: true });
  document.addEventListener('wheel', function (e) { e.preventDefault(); }, { passive: false, capture: true });
  document.addEventListener('keydown', function (e) {
    if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' ', 'j', 'k'].indexOf(e.key) !== -1) { e.preventDefault(); e.stopPropagation(); }
  }, true);
})();
true;
`;
}
