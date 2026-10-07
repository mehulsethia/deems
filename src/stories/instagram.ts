/**
 * Story rings for the Instagram inbox. Instagram's web inbox does not mark who has a story, so this
 * script asks Instagram's own web API (with the session already in the web view) who does, rings
 * those people's avatars in the chat list, and opens their story when the avatar is tapped.
 * Only people already on screen get a ring; nothing is added to the page.
 *
 * Kept as a string: release builds compile JS to bytecode, so a function's source is not available.
 */
export const STORY_RINGS_SCRIPT = `(function () {
  var W = window;
  if (!/(^|\\.)instagram\\.com$/.test(location.host)) return;
  var RING = 'linear-gradient(45deg,#FEDA75,#FA7E1E,#D62976,#962FBF,#4F5BD5)';
  var SEEN = 'linear-gradient(#C7C7C7,#C7C7C7)';
  var USER = /^[A-Za-z0-9._]{1,30}$/;
  var MIN_SIZE = 32;

  function fileOf(src) {
    try { var p = new URL(src, location.href).pathname; return p.slice(p.lastIndexOf('/') + 1); } catch (e) { return ''; }
  }
  function viewerId() {
    var m = document.cookie.match(/(?:^|; )ds_user_id=(\\d+)/);
    return m ? m[1] : '';
  }
  function storyFor(img) {
    var s = W.__onlydmStories;
    if (!s) return null;
    var hit = s.byFile[fileOf(img.currentSrc || img.src)];
    if (hit) return hit;
    var alt = (img.getAttribute('alt') || '').split("'")[0];
    return s.byUser[alt] || null;
  }
  // The gap between ring and photo matches the page, so it works in Instagram's light and dark themes.
  function gap() {
    var bg = getComputedStyle(document.body || document.documentElement).backgroundColor;
    return !bg || bg === 'transparent' || bg === 'rgba(0, 0, 0, 0)' ? '#fff' : bg;
  }
  function ring(img, story) {
    var key = story.u + (story.n ? ':new' : ':seen');
    if (img.getAttribute('data-onlydm-story') === key) return;
    img.setAttribute('data-onlydm-story', key);
    img.setAttribute('data-onlydm-user', story.u);
    var st = img.style;
    st.setProperty('box-sizing', 'border-box', 'important');
    st.setProperty('padding', '2px', 'important');
    st.setProperty('border', '2.5px solid transparent', 'important');
    st.setProperty('border-radius', '50%', 'important');
    st.setProperty('background', 'linear-gradient(' + gap() + ',' + gap() + ') padding-box,' + (story.n ? RING : SEEN) + ' border-box', 'important');
  }
  function unring(img) {
    if (!img.hasAttribute('data-onlydm-story')) return;
    img.removeAttribute('data-onlydm-story');
    img.removeAttribute('data-onlydm-user');
    ['box-sizing', 'padding', 'border', 'border-radius', 'background'].forEach(function (p) { img.style.removeProperty(p); });
  }
  function inMessages() { return location.pathname.indexOf('/direct') === 0; }
  function decorate() {
    var imgs = document.querySelectorAll('img');
    var on = inMessages();
    for (var i = 0; i < imgs.length; i++) {
      var img = imgs[i];
      var story = on && img.getBoundingClientRect().width >= MIN_SIZE ? storyFor(img) : null;
      if (story) ring(img, story); else unring(img);
    }
  }
  function load() {
    W.__onlydmStoriesAt = Date.now();
    var headers = { 'X-IG-App-ID': '936619743392459', 'X-Requested-With': 'XMLHttpRequest' };
    try { var claim = sessionStorage.getItem('www-claim-v2'); if (claim) headers['X-IG-WWW-Claim'] = claim; } catch (e) {}
    fetch('/api/v1/feed/reels_tray/', { credentials: 'include', headers: headers })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        var me = viewerId();
        var out = { byFile: {}, byUser: {} };
        ((j && j.tray) || []).forEach(function (t) {
          var u = t && t.user;
          if (!u || !USER.test(u.username || '') || String(u.pk || u.pk_id || '') === me) return;
          var story = { u: u.username, n: (t.latest_reel_media || 0) > (t.seen || 0) };
          var f = fileOf(u.profile_pic_url || '');
          if (f) out.byFile[f] = story;
          out.byUser[u.username] = story;
        });
        W.__onlydmStories = out;
        decorate();
      })
      .catch(function () {});
  }

  if (!W.__onlydmStoriesInstalled) {
    W.__onlydmStoriesInstalled = true;
    // Capture phase, and by position: Instagram often lays a tappable row over the picture.
    document.addEventListener('click', function (e) {
      if (!inMessages()) return;
      var els = document.elementsFromPoint ? document.elementsFromPoint(e.clientX, e.clientY) : [e.target];
      for (var i = 0; i < els.length; i++) {
        var user = els[i].getAttribute && els[i].getAttribute('data-onlydm-user');
        if (user && USER.test(user)) {
          e.preventDefault();
          e.stopImmediatePropagation();
          location.href = '/stories/' + user + '/';
          return;
        }
      }
    }, true);
    var timer = null;
    new MutationObserver(function () {
      clearTimeout(timer);
      timer = setTimeout(decorate, 200);
    }).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] });
  }
  if (!W.__onlydmStories || Date.now() - (W.__onlydmStoriesAt || 0) > 30000) load(); else decorate();
})();
true;
`;
