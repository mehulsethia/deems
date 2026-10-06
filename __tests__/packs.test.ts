import { bundledPacks, PLATFORM_IDS } from '../src/rules/store';
import { decideNavigation, isAllowedPath, isLoginPath, parseUrl } from '../src/rules/matching';
import { signedInKey } from '../src/state/platformKeys';

describe.each(PLATFORM_IDS)('bundled pack: %s', (id) => {
  const pack = bundledPacks[id];

  it('has a matching id and a positive integer version', () => {
    expect(pack.id).toBe(id);
    expect(Number.isInteger(pack.version) && pack.version > 0).toBe(true);
  });

  it('starts and logs in on allowed hosts and paths', () => {
    for (const url of [pack.startUrl, pack.loginUrl]) {
      const p = parseUrl(url)!;
      expect(pack.allowedHosts).toContain(p.host);
      expect(isAllowedPath(pack, p.path)).toBe(true);
      expect(decideNavigation(pack, url)).toEqual({ action: 'allow' });
    }
  });

  it('login paths are a subset of allowed paths', () => {
    for (const prefix of pack.loginPathPrefixes) expect(isAllowedPath(pack, prefix)).toBe(true);
  });

  it('the start page is not a login page', () => {
    expect(isLoginPath(pack, parseUrl(pack.startUrl)!.path)).toBe(false);
  });

  it('sends the site root to the start url', () => {
    const host = pack.allowedHosts[0];
    expect(decideNavigation(pack, `https://${host}/`)).toEqual({ action: 'redirect', url: pack.startUrl });
  });

  it('uses only attribute/aria selectors, no class names', () => {
    expect(pack.css).not.toMatch(/(^|[\s,>+~])\.[\w-]+/m);
  });

  it('shares one injection template', () => {
    expect(pack.js).toBe(bundledPacks.instagram.js);
    expect(pack.js).toContain('__DEEMS_CONFIG__');
  });
});

describe('messenger pack', () => {
  const pack = bundledPacks.messenger;
  it('only shows messages on facebook.com', () => {
    expect(decideNavigation(pack, 'https://www.facebook.com/messages/t/123')).toEqual({ action: 'allow' });
    for (const p of ['/watch/', '/marketplace/', '/groups/feed/', '/me', '/friends/']) {
      expect(decideNavigation(pack, `https://www.facebook.com${p}`)).toMatchObject({ action: 'redirect' });
    }
  });
  it('opens link wrappers and other hosts externally', () => {
    expect(decideNavigation(pack, 'https://l.facebook.com/l.php?u=x')).toMatchObject({ action: 'external' });
    expect(decideNavigation(pack, 'https://example.com/')).toMatchObject({ action: 'external' });
  });
});

describe('threads pack', () => {
  const pack = bundledPacks.threads;
  it('only shows messages, and lets sign-in through Instagram', () => {
    expect(decideNavigation(pack, 'https://www.threads.com/messages/t/1')).toEqual({ action: 'allow' });
    expect(decideNavigation(pack, 'https://www.instagram.com/accounts/login/')).toEqual({ action: 'allow' });
    expect(decideNavigation(pack, 'https://www.threads.com/')).toMatchObject({ action: 'redirect' });
    expect(decideNavigation(pack, 'https://www.threads.com/search')).toMatchObject({ action: 'redirect' });
    expect(decideNavigation(pack, 'https://www.instagram.com/explore/')).toMatchObject({ action: 'redirect' });
  });
});

describe('signedInKey', () => {
  it('keeps the legacy Instagram key and namespaces the others', () => {
    expect(signedInKey('instagram')).toBe('signedIn');
    expect(signedInKey('messenger')).toBe('signedIn:messenger');
    expect(signedInKey('threads')).toBe('signedIn:threads');
  });
});
