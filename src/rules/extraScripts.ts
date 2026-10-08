import type { PlatformId } from './types';

/**
 * Threads, beyond what CSS can do:
 * - Sign-in: "Continue with Instagram" needs the Instagram app, so it's hidden and the
 *   username-and-password form is opened straight away.
 * - Bottom bars (the Messages / + / profile tab bar, the "better in the app" banner) are hidden, so there's
 *   no way to post or reach a profile. A bar with a text box (the message composer) is never touched.
 * Matches on visible English text and layout, so it keeps working if class names change.
 */
const THREADS_SCRIPT = `(function () {
  if (window.__onlydmThreads) return;
  window.__onlydmThreads = true;
  var clicked = false;

  function text(el) { return (el.textContent || '').replace(/\\s+/g, ' ').trim(); }
  function control(el) { return el.closest('a,button,[role="button"],[role="link"]') || el; }

  function signIn() {
    if (location.pathname.indexOf('/login') !== 0) return;
    var els = document.querySelectorAll('a,button,[role="button"],[role="link"],span,div');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (el.children.length > 3) continue;
      var t = text(el);
      if (t === 'Continue with Instagram') control(el).style.setProperty('display', 'none', 'important');
      if (!clicked && t === 'Log in with username instead') { clicked = true; control(el).click(); }
    }
  }

  function hideBottomBars() {
    var vh = window.innerHeight, vw = window.innerWidth;
    var els = document.body ? document.body.querySelectorAll('*') : [];
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (el.getAttribute('data-onlydm-hidden')) continue;
      var pos = getComputedStyle(el).position;
      if (pos !== 'fixed' && pos !== 'sticky') continue;
      var r = el.getBoundingClientRect();
      if (r.height < 30 || r.height > 180 || r.width < vw * 0.8 || r.bottom < vh - 4) continue;
      if (el.querySelector('input,textarea,[contenteditable="true"],[role="textbox"]')) continue;
      el.setAttribute('data-onlydm-hidden', '1');
      el.style.setProperty('display', 'none', 'important');
      closeGap(r.height);
    }
  }

  // The page keeps room for the bar it no longer shows: padding, or an empty spacer of the same height.
  function closeGap(h) {
    var els = document.body.querySelectorAll('*');
    for (var i = 0; i < els.length; i++) {
      var el = els[i], cs = getComputedStyle(el);
      var pb = parseFloat(cs.paddingBottom), mb = parseFloat(cs.marginBottom);
      if (pb >= h - 12 && pb <= h + 12) el.style.setProperty('padding-bottom', '0', 'important');
      if (mb >= h - 12 && mb <= h + 12) el.style.setProperty('margin-bottom', '0', 'important');
      if (!el.children.length && !text(el)) {
        var r = el.getBoundingClientRect();
        if (r.height >= h - 12 && r.height <= h + 12 && r.width > window.innerWidth * 0.8) el.style.setProperty('display', 'none', 'important');
      }
    }
  }

  function run() { try { signIn(); hideBottomBars(); } catch (e) {} }
  var timer = null;
  function schedule() { clearTimeout(timer); timer = setTimeout(run, 120); }
  document.addEventListener('DOMContentLoaded', schedule);
  window.addEventListener('load', schedule);
  new MutationObserver(schedule).observe(document, { childList: true, subtree: true });
  schedule();
})();
true;
`;

/**
 * Facebook:
 * - Light mode, like Instagram and Threads. Facebook follows the phone's dark setting (and OnlyDM runs dark),
 *   so the page is told the phone prefers light.
 * - The top bar is hidden by the pack CSS, but the page keeps its space; the offsets above the chat list are
 *   removed so it starts at the top.
 */
const FACEBOOK_SCRIPT = `(function () {
  if (window.__onlydmFacebook) return;
  window.__onlydmFacebook = true;

  var original = window.matchMedia ? window.matchMedia.bind(window) : null;
  if (original) {
    window.matchMedia = function (query) {
      var q = String(query);
      var dark = /prefers-color-scheme\\s*:\\s*dark/i.test(q);
      var light = /prefers-color-scheme\\s*:\\s*light/i.test(q);
      if (!dark && !light) return original(query);
      var noop = function () {};
      return { matches: light, media: q, onchange: null, addListener: noop, removeListener: noop,
        addEventListener: noop, removeEventListener: noop, dispatchEvent: function () { return false; } };
    };
  }
  try { document.documentElement.style.colorScheme = 'light'; } catch (e) {}

  // Facebook marks dark pages with a class (from the account's own dark mode setting too); swap it for light.
  function forceLight() {
    var dark = document.querySelectorAll('.__fb-dark-mode');
    for (var i = 0; i < dark.length; i++) {
      dark[i].classList.remove('__fb-dark-mode');
      dark[i].classList.add('__fb-light-mode');
    }
  }
  forceLight();
  new MutationObserver(forceLight).observe(document, { attributes: true, attributeFilter: ['class'], childList: true, subtree: true });

  function chatsHeading() {
    var els = document.querySelectorAll('h1,h2,[role="heading"],span');
    for (var i = 0; i < els.length; i++) {
      var t = (els[i].textContent || '').trim();
      if ((t === 'Chats' || els[i].getAttribute('aria-label') === 'Chats') && els[i].getBoundingClientRect().height > 0) return els[i];
    }
    return null;
  }

  // The chat list sits in a card. Space above the card goes; the card's own padding stays.
  function cardOf(el) {
    for (var n = el.parentElement; n && n !== document.body; n = n.parentElement) {
      var cs = getComputedStyle(n);
      if (parseFloat(cs.borderTopLeftRadius) > 0 || (cs.backgroundColor && cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent')) return n;
    }
    return el.parentElement;
  }

  function closeTopGap() {
    if (location.pathname.indexOf('/messages') !== 0) return;
    var target = chatsHeading();
    if (!target) return;
    var card = cardOf(target);
    var chain = [];
    for (var n = card; n && n !== document.body; n = n.parentElement) chain.unshift(n);
    for (var i = 0; i < chain.length; i++) {
      var el = chain[i], cs = getComputedStyle(el), isCard = el === card;
      if (!isCard && parseFloat(cs.paddingTop) > 0) el.style.setProperty('padding-top', '0', 'important');
      if (parseFloat(cs.marginTop) > 0) el.style.setProperty('margin-top', '0', 'important');
      if (cs.position !== 'static' && parseFloat(cs.top) > 0) el.style.setProperty('top', '0', 'important');
    }
  }

  var timer = null;
  function schedule() { clearTimeout(timer); timer = setTimeout(function () { try { closeTopGap(); } catch (e) {} }, 150); }
  document.addEventListener('DOMContentLoaded', schedule);
  new MutationObserver(schedule).observe(document, { childList: true, subtree: true });
})();
true;
`;

/**
 * Every platform: the chat list reaches the bottom of the screen.
 * With their own top and bottom bars hidden, the pages still size their lists for them, leaving an empty band
 * under the list. A list (or the card around it) that stops short of the bottom, with nothing but its own
 * background below, is stretched to the bottom. Anything that sits below it, like a message composer, is
 * left alone. Recomputed when the screen size changes (rotation, iPad split view).
 */
export const FILL_SCRIPT = `(function () {
  if (window.__onlydmFill) return;
  window.__onlydmFill = true;
  var MAX_GAP = 320;

  function clips(el) {
    var cs = getComputedStyle(el);
    return /(auto|scroll|hidden)/.test(cs.overflowY) && el.scrollHeight > el.clientHeight + 1;
  }

  // Empty below: what shows under the element is the element itself, something that contains it, or the page.
  function emptyBelow(el, r, vh) {
    var xs = [r.left + r.width * 0.25, r.left + r.width * 0.5, r.left + r.width * 0.75];
    var ys = [r.bottom + 2, (r.bottom + vh) / 2, vh - 2];
    for (var i = 0; i < xs.length; i++) {
      for (var j = 0; j < ys.length; j++) {
        var hit = document.elementFromPoint(xs[i], ys[j]);
        if (hit && hit !== document.body && hit !== document.documentElement && !hit.contains(el)) return false;
      }
    }
    return true;
  }

  function fill() {
    if (!document.body) return;
    var vh = window.innerHeight, vw = window.innerWidth;
    var els = document.body.querySelectorAll('div,ul,section,main');
    var plan = [];
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var r = el.getBoundingClientRect();
      if (r.width < vw * 0.6 || r.height < 80 || r.top >= vh) continue;
      var gap = vh - r.bottom;
      if (gap < 3 || gap > MAX_GAP) continue;
      if (!clips(el) || !emptyBelow(el, r, vh)) continue;
      // Stretch the list and every box around it that ends at the same place.
      for (var n = el; n && n !== document.body; n = n.parentElement) {
        var nr = n.getBoundingClientRect();
        if (vh - nr.bottom < 3) break;
        plan.push([n, nr.height + (vh - nr.bottom)]);
      }
    }
    for (var k = 0; k < plan.length; k++) {
      var t = plan[k][0];
      // Keep the page's own inline sizes so they can be put back when the screen size changes.
      if (!t.hasAttribute('data-onlydm-fill')) {
        t.setAttribute('data-onlydm-fill', JSON.stringify([t.style.getPropertyValue('height'), t.style.getPropertyPriority('height'), t.style.getPropertyValue('max-height'), t.style.getPropertyPriority('max-height')]));
      }
      t.style.setProperty('height', plan[k][1] + 'px', 'important');
      t.style.setProperty('max-height', 'none', 'important');
    }
  }

  function reset() {
    var done = document.querySelectorAll('[data-onlydm-fill]');
    for (var i = 0; i < done.length; i++) {
      var was = ['', '', '', ''];
      try { was = JSON.parse(done[i].getAttribute('data-onlydm-fill')) || was; } catch (e) {}
      done[i].removeAttribute('data-onlydm-fill');
      if (was[0]) done[i].style.setProperty('height', was[0], was[1]); else done[i].style.removeProperty('height');
      if (was[2]) done[i].style.setProperty('max-height', was[2], was[3]); else done[i].style.removeProperty('max-height');
    }
  }

  var timer = null;
  function schedule(delay) { clearTimeout(timer); timer = setTimeout(function () { try { fill(); } catch (e) {} }, delay || 200); }
  var lastW = window.innerWidth, lastH = window.innerHeight;
  window.addEventListener('resize', function () {
    // The keyboard changes the height too; only a real size change (rotation, split view) starts over.
    if (Math.abs(window.innerWidth - lastW) < 2 && Math.abs(window.innerHeight - lastH) < 160) return;
    lastW = window.innerWidth; lastH = window.innerHeight;
    reset(); schedule(250);
  });
  document.addEventListener('DOMContentLoaded', function () { schedule(); });
  window.addEventListener('load', function () { schedule(); });
  new MutationObserver(function () { schedule(); }).observe(document, { childList: true, subtree: true });
  schedule();
})();
true;
`;

/** Extra page scripts per platform, run after the rules script. */
export const EXTRA_SCRIPTS: Partial<Record<PlatformId, string>> = {
  threads: THREADS_SCRIPT,
  messenger: FACEBOOK_SCRIPT,
};

/** Rules script plus the platform's extras and the fill script, each isolated so one failing never stops the others. */
export function withExtras(id: PlatformId, rulesScript: string): string {
  const parts = [rulesScript, EXTRA_SCRIPTS[id], FILL_SCRIPT].filter(Boolean) as string[];
  return parts.map((part) => `try {\n${part}\n} catch (e) {}`).join('\n') + '\ntrue;';
}
