/** Friends' stories for the Instagram tab, read from the signed-in web session. */

export interface StoryItem {
  username: string;
  avatar: string;
  /** True when there is a story the user has not watched yet. */
  unseen: boolean;
}

const USERNAME = /^[A-Za-z0-9._]{1,30}$/;
const AVATAR_HOSTS = ['cdninstagram.com', 'fbcdn.net'];

function isAvatarUrl(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const m = /^https:\/\/([^/?#]+)\//i.exec(value);
  if (!m) return false;
  const host = m[1].toLowerCase();
  return AVATAR_HOSTS.some((h) => host === h || host.endsWith('.' + h));
}

/** Keeps only well-formed entries; the page is not trusted to send clean data. */
export function parseStories(raw: unknown): StoryItem[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const out: StoryItem[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const { username, avatar, unseen } = item as Record<string, unknown>;
    if (typeof username !== 'string' || !USERNAME.test(username) || seen.has(username)) continue;
    if (!isAvatarUrl(avatar)) continue;
    seen.add(username);
    out.push({ username, avatar, unseen: unseen === true });
    if (out.length >= 50) break;
  }
  // Unwatched first, otherwise Instagram's order.
  return [...out.filter((s) => s.unseen), ...out.filter((s) => !s.unseen)];
}

export const storyUrl = (username: string): string => `https://www.instagram.com/stories/${username}/`;

/**
 * Asks Instagram's own web API for the story tray, using the session already in the web view,
 * and posts `{ type: 'stories', items }` back. Posts an empty list on any failure.
 */
export const STORIES_SCRIPT = `(function () {
  function send(items) {
    try { window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'stories', items: items })); } catch (e) {}
  }
  if (!/(^|\\.)instagram\\.com$/.test(location.host)) return;
  var headers = { 'X-IG-App-ID': '936619743392459', 'X-Requested-With': 'XMLHttpRequest' };
  try { var claim = sessionStorage.getItem('www-claim-v2'); if (claim) headers['X-IG-WWW-Claim'] = claim; } catch (e) {}
  fetch('/api/v1/feed/reels_tray/', { credentials: 'include', headers: headers })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (j) {
      var tray = (j && j.tray) || [];
      send(tray.map(function (t) {
        var u = (t && t.user) || {};
        return { username: u.username, avatar: u.profile_pic_url, unseen: (t.latest_reel_media || 0) > (t.seen || 0) };
      }));
    })
    .catch(function () { send([]); });
})();
true;
`;
