import type { NavigationDecision, PlatformRules } from './types';

export interface ParsedUrl {
  protocol: string;
  host: string;
  path: string;
}

/** Resolves `.` and `..`, collapses `//`, always returns a leading slash. */
export function normalizePath(raw: string): string {
  const out: string[] = [];
  for (const seg of raw.replace(/\\/g, '/').split('/')) {
    if (seg === '' || seg === '.') continue;
    if (seg === '..') out.pop();
    else out.push(seg);
  }
  const trailing = raw.endsWith('/') && out.length > 0 ? '/' : '';
  return '/' + out.join('/') + trailing;
}

/** Minimal parser; React Native's URL implementation is not reliable enough to depend on. */
export function parseUrl(url: string): ParsedUrl | null {
  const m = /^([a-z][a-z0-9+.-]*):(?:\/\/([^/?#]*))?([^?#]*)/i.exec(url.trim());
  if (!m) return null;
  const protocol = m[1].toLowerCase();
  const authority = m[2] ?? '';
  const host = authority.replace(/^.*@/, '').replace(/:\d+$/, '').toLowerCase();
  const rawPath = m[3] ?? '';
  return { protocol, host, path: normalizePath(rawPath || '/') };
}

/** `/direct` matches `/direct`, `/direct/` and `/direct/t/1`, never `/directory`. */
export function pathMatches(path: string, prefixes: readonly string[]): boolean {
  const p = normalizePath(path).toLowerCase();
  return prefixes.some((prefix) => {
    const base = normalizePath(prefix).toLowerCase().replace(/\/$/, '');
    return p === base || p === base + '/' || p.startsWith(base + '/');
  });
}

export function hostMatches(host: string, list: readonly string[]): boolean {
  const h = host.toLowerCase();
  return list.some((entry) => h === entry.toLowerCase() || h.endsWith('.' + entry.toLowerCase()));
}

/** A specific post/reel, not the bare `/reels/` tab. */
export function isSharedContentPath(path: string, prefixes: readonly string[]): boolean {
  const p = normalizePath(path).toLowerCase().replace(/\/$/, '');
  return prefixes.some((prefix) => {
    const base = normalizePath(prefix).toLowerCase().replace(/\/$/, '');
    return p.startsWith(base + '/');
  });
}

export function isAllowedPath(pack: PlatformRules, path: string): boolean {
  return pathMatches(path, pack.allowedPathPrefixes);
}

/** True while the user is still on a sign-in / checkpoint page. */
export function isLoginPath(pack: PlatformRules, path: string): boolean {
  return pathMatches(path, pack.loginPathPrefixes);
}

const INERT_SCHEMES = new Set(['about', 'data', 'blob']);

/** What the web view should do with a top-level navigation to `url`. */
export function decideNavigation(pack: PlatformRules, url: string): NavigationDecision {
  const parsed = parseUrl(url);
  if (!parsed) return { action: 'block' };
  if (INERT_SCHEMES.has(parsed.protocol)) return { action: 'allow' };
  if (parsed.protocol !== 'https' && parsed.protocol !== 'http') return { action: 'block' };

  if (hostMatches(parsed.host, pack.externalHosts)) return { action: 'external', url };
  if (!pack.allowedHosts.map((h) => h.toLowerCase()).includes(parsed.host)) {
    return { action: 'external', url };
  }
  if (pathMatches(parsed.path, pack.allowedPathPrefixes)) return { action: 'allow' };
  if (isSharedContentPath(parsed.path, pack.sharedContentPathPrefixes)) return { action: 'shared', url };
  return { action: 'redirect', url: pack.startUrl };
}

/**
 * The paths a shared item may move between while it stays the same item. Instagram links the same media as
 * /p/ID, /reel/ID, /reels/ID or /tv/ID and redirects between them, so all of those are allowed; a shared story
 * may move between that person's story frames (/stories/name/...).
 */
export function lockedPathsFor(pack: PlatformRules, url: string): string[] {
  const path = normalizePath(parseUrl(url)?.path ?? '/');
  const segs = path.split('/').filter(Boolean);
  const prefix = segs.length >= 2 ? '/' + segs[0].toLowerCase() : '';
  const shared = pack.sharedContentPathPrefixes.map((p) => normalizePath(p).toLowerCase().replace(/\/$/, ''));
  if (!prefix || !shared.includes(prefix)) return [path];
  if (prefix === '/stories') return [`/stories/${segs[1]}`];
  return shared.filter((p) => p !== '/stories').map((p) => `${p}/${segs[1]}`);
}

/** Pack restricted to one shared item, for the shared-content modal. */
export function lockPackToUrl(pack: PlatformRules, url: string): PlatformRules {
  return {
    ...pack,
    startUrl: url,
    allowedPathPrefixes: lockedPathsFor(pack, url),
    loginPathPrefixes: [],
    sharedContentPathPrefixes: [],
  };
}
