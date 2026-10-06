import bundled from '../src/rules/instagram.json';
import {
  decideNavigation,
  isAllowedPath,
  isLoginPath,
  isSharedContentPath,
  lockPackToUrl,
  normalizePath,
  parseUrl,
  pathMatches,
} from '../src/rules/matching';
import type { PlatformRules } from '../src/rules/types';

const pack = bundled as PlatformRules;

describe('normalizePath', () => {
  it('resolves dot segments and duplicate slashes', () => {
    expect(normalizePath('/direct/../explore/')).toBe('/explore/');
    expect(normalizePath('//direct///inbox')).toBe('/direct/inbox');
    expect(normalizePath('')).toBe('/');
  });
});

describe('parseUrl', () => {
  it('splits protocol, host, path and ignores query, hash, port and userinfo', () => {
    expect(parseUrl('https://User@WWW.Instagram.com:443/direct/inbox/?a=1#x')).toEqual({
      protocol: 'https',
      host: 'www.instagram.com',
      path: '/direct/inbox/',
    });
  });
  it('handles host-only and scheme-only urls', () => {
    expect(parseUrl('https://www.instagram.com')?.path).toBe('/');
    expect(parseUrl('about:blank')?.protocol).toBe('about');
  });
  it('returns null for garbage', () => {
    expect(parseUrl('not a url')).toBeNull();
  });
});

describe('pathMatches', () => {
  const prefixes = ['/direct', '/stories'];
  it('matches exact, trailing slash and children', () => {
    expect(pathMatches('/direct', prefixes)).toBe(true);
    expect(pathMatches('/direct/', prefixes)).toBe(true);
    expect(pathMatches('/direct/t/123/', prefixes)).toBe(true);
    expect(pathMatches('/stories/maya/123/', prefixes)).toBe(true);
  });
  it('does not match lookalikes or other paths', () => {
    expect(pathMatches('/directory', prefixes)).toBe(false);
    expect(pathMatches('/explore/', prefixes)).toBe(false);
    expect(pathMatches('/', prefixes)).toBe(false);
  });
  it('is case-insensitive and defeats traversal', () => {
    expect(pathMatches('/DIRECT/inbox', prefixes)).toBe(true);
    expect(pathMatches('/direct/../explore/', prefixes)).toBe(false);
  });
});

describe('shared content', () => {
  const prefixes = pack.sharedContentPathPrefixes;
  it('needs a segment after the prefix', () => {
    expect(isSharedContentPath('/p/Cabc123/', prefixes)).toBe(true);
    expect(isSharedContentPath('/reel/Cabc123/', prefixes)).toBe(true);
    expect(isSharedContentPath('/reels/Cabc123/', prefixes)).toBe(true);
  });
  it('does not treat the Reels tab as shared content', () => {
    expect(isSharedContentPath('/reels/', prefixes)).toBe(false);
    expect(isSharedContentPath('/reels', prefixes)).toBe(false);
  });
});

describe('bundled instagram pack', () => {
  it('allows the inbox, stories and sign-in paths', () => {
    for (const p of ['/direct/inbox/', '/direct/t/1/', '/stories/a/1/', '/accounts/login/', '/challenge/', '/two_factor/', '/auth/x']) {
      expect(isAllowedPath(pack, p)).toBe(true);
    }
  });
  it('does not allow feed, explore, reels or profiles', () => {
    for (const p of ['/', '/explore/', '/reels/', '/someuser/', '/p/abc/']) {
      expect(isAllowedPath(pack, p)).toBe(false);
    }
  });
  it('treats sign-in and checkpoint paths as login', () => {
    expect(isLoginPath(pack, '/accounts/login/')).toBe(true);
    expect(isLoginPath(pack, '/accounts/onetap/')).toBe(true);
    expect(isLoginPath(pack, '/challenge/abc')).toBe(true);
    expect(isLoginPath(pack, '/direct/inbox/')).toBe(false);
  });
});

describe('decideNavigation', () => {
  it('allows allowed paths on allowed hosts', () => {
    expect(decideNavigation(pack, 'https://www.instagram.com/direct/inbox/')).toEqual({ action: 'allow' });
    expect(decideNavigation(pack, 'https://instagram.com/direct/t/1/')).toEqual({ action: 'allow' });
  });
  it('redirects disallowed same-host paths to startUrl', () => {
    for (const u of ['https://www.instagram.com/', 'https://www.instagram.com/explore/', 'https://www.instagram.com/reels/', 'https://www.instagram.com/direct/../explore/']) {
      expect(decideNavigation(pack, u)).toEqual({ action: 'redirect', url: pack.startUrl });
    }
  });
  it('sends shared posts and reels to the modal', () => {
    expect(decideNavigation(pack, 'https://www.instagram.com/reel/Cabc/')).toEqual({
      action: 'shared',
      url: 'https://www.instagram.com/reel/Cabc/',
    });
  });
  it('opens other hosts externally', () => {
    expect(decideNavigation(pack, 'https://example.com/x')).toEqual({ action: 'external', url: 'https://example.com/x' });
    expect(decideNavigation(pack, 'https://help.instagram.com/')).toMatchObject({ action: 'external' });
    expect(decideNavigation(pack, 'https://l.instagram.com/?u=x')).toMatchObject({ action: 'external' });
    expect(decideNavigation(pack, 'https://www.instagram.com.evil.com/direct/')).toMatchObject({ action: 'external' });
  });
  it('allows inert schemes and blocks app-launch schemes', () => {
    expect(decideNavigation(pack, 'about:blank')).toEqual({ action: 'allow' });
    expect(decideNavigation(pack, 'instagram://mainfeed')).toEqual({ action: 'block' });
    expect(decideNavigation(pack, 'intent://x#Intent;end')).toEqual({ action: 'block' });
  });
});

describe('lockPackToUrl', () => {
  it('only allows the one path', () => {
    const locked = lockPackToUrl(pack, 'https://www.instagram.com/reel/Cabc/');
    expect(decideNavigation(locked, 'https://www.instagram.com/reel/Cabc/')).toEqual({ action: 'allow' });
    expect(decideNavigation(locked, 'https://www.instagram.com/direct/inbox/')).toMatchObject({ action: 'redirect' });
    expect(decideNavigation(locked, 'https://www.instagram.com/reel/Cother/')).toMatchObject({ action: 'redirect' });
  });
});
