import { isReelUrl, reelLockScript, sharedPackFor, unwrapLinkShim, withReelLock } from '@/rules/sharedContent';

describe('isReelUrl', () => {
  it('matches a specific reel, not the reels tab or a post', () => {
    expect(isReelUrl('https://www.instagram.com/reel/Cabc/')).toBe(true);
    expect(isReelUrl('https://www.instagram.com/reels/Cabc/')).toBe(true);
    expect(isReelUrl('https://www.facebook.com/reel/123')).toBe(true);
    expect(isReelUrl('https://www.instagram.com/reels/')).toBe(false);
    expect(isReelUrl('https://www.instagram.com/p/Cabc/')).toBe(false);
  });
});

describe('sharedPackFor', () => {
  it('prefers the platform the link was shared on', () => {
    expect(sharedPackFor('https://www.instagram.com/reel/Cabc/', 'instagram')?.id).toBe('instagram');
  });
  it('opens an Instagram reel sent on Facebook with the Instagram rules', () => {
    expect(sharedPackFor('https://www.instagram.com/reel/Cabc/', 'messenger')?.id).toBe('instagram');
  });
  it('opens a Facebook reel', () => {
    expect(sharedPackFor('https://www.facebook.com/reel/123', 'messenger')?.id).toBe('messenger');
  });
  it('refuses feeds and unknown sites', () => {
    expect(sharedPackFor('https://www.instagram.com/reels/')).toBeNull();
    expect(sharedPackFor('https://www.instagram.com/explore/')).toBeNull();
    expect(sharedPackFor('https://example.com/reel/1')).toBeNull();
  });
});

describe('unwrapLinkShim', () => {
  it('returns the real address behind a Meta link shim', () => {
    expect(unwrapLinkShim('https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.instagram.com%2Freel%2FCabc%2F&h=x')).toBe(
      'https://www.instagram.com/reel/Cabc/',
    );
  });
  it('leaves other links alone', () => {
    expect(unwrapLinkShim('https://example.com/?u=https%3A%2F%2Fx.com')).toBe('https://example.com/?u=https%3A%2F%2Fx.com');
    expect(unwrapLinkShim('https://l.facebook.com/l.php?u=%E0%A4%A')).toBe('https://l.facebook.com/l.php?u=%E0%A4%A');
  });
});

describe('reelLockScript', () => {
  it('is valid JavaScript with the locked path embedded safely', () => {
    const js = reelLockScript('https://www.instagram.com/reel/Cabc/?igsh=1');
    expect(() => new Function(js)).not.toThrow();
    expect(js).toContain('var LOCKED = "/reel/cabc";');
  });
});

describe('withReelLock', () => {
  it('keeps the lock running even if the rules script throws', () => {
    const js = withReelLock('throw new Error("rules");\ntrue;', 'https://www.instagram.com/reel/Cabc/');
    expect(() => new Function(js)).not.toThrow();
    expect(js.indexOf('window.__deemsReelLock')).toBeGreaterThan(js.indexOf('catch (e) {}'));
  });
});
