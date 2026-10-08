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
  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
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
  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
})();
true;
`;

/** Extra page scripts per platform, run after the rules script. */
export const EXTRA_SCRIPTS: Partial<Record<PlatformId, string>> = {
  threads: THREADS_SCRIPT,
  messenger: FACEBOOK_SCRIPT,
};

/** Rules script plus the platform's extras, each isolated so one failing never stops the other. */
export function withExtras(id: PlatformId, rulesScript: string): string {
  const extra = EXTRA_SCRIPTS[id];
  return extra ? `try {\n${rulesScript}\n} catch (e) {}\n${extra}` : rulesScript;
}
