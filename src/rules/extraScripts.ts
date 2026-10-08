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

/** Extra page scripts per platform, run after the rules script. */
export const EXTRA_SCRIPTS: Partial<Record<PlatformId, string>> = {
  threads: THREADS_SCRIPT,
};

/** Rules script plus the platform's extras, each isolated so one failing never stops the other. */
export function withExtras(id: PlatformId, rulesScript: string): string {
  const extra = EXTRA_SCRIPTS[id];
  return extra ? `try {\n${rulesScript}\n} catch (e) {}\n${extra}` : rulesScript;
}
