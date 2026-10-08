import { isMediaUrl, isReelUrl, lockScript, sharedPackFor, swipeLockFor, unwrapLinkShim, withLock } from '@/rules/sharedContent';

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

describe('lockScript', () => {
  it('is valid JavaScript with the allowed paths embedded safely', () => {
    const js = lockScript(['/reel/Cabc', '/p/Cabc/'], 'vertical');
    expect(() => new Function(js)).not.toThrow();
    expect(js).toContain('var ALLOWED = ["/reel/cabc","/p/cabc"];');
    expect(js).toContain('var SWIPE = "vertical";');
  });
});

describe('withLock', () => {
  it('keeps the lock running even if the rules script throws', () => {
    const js = withLock('throw new Error("rules");\ntrue;', ['/reel/cabc'], 'vertical');
    expect(() => new Function(js)).not.toThrow();
    expect(js.indexOf('window.__onlydmLock')).toBeGreaterThan(js.indexOf('catch (e) {}'));
  });
});

describe('swipeLockFor', () => {
  it('locks swiping on reels and stories, not posts', () => {
    expect(swipeLockFor('https://www.instagram.com/reel/Cabc/')).toBe('vertical');
    expect(swipeLockFor('https://www.instagram.com/stories/maya/123/')).toBe('all');
    expect(swipeLockFor('https://www.instagram.com/p/Cabc/')).toBe('none');
  });
});

describe('isMediaUrl', () => {
  it('recognises photos and videos from Meta media servers only', () => {
    expect(isMediaUrl('https://scontent-lhr8-1.cdninstagram.com/v/t51/abc.jpg?x=1')).toBe(true);
    expect(isMediaUrl('https://video.fbcdn.net/v/abc.mp4')).toBe(true);
    expect(isMediaUrl('https://evil.example/cdninstagram.com/a.jpg')).toBe(false);
    expect(isMediaUrl('http://scontent.cdninstagram.com/a.jpg')).toBe(false);
  });
});

describe('shared stories', () => {
  it('open in the locked viewer', () => {
    expect(sharedPackFor('https://www.instagram.com/stories/maya/3141/', 'instagram')?.id).toBe('instagram');
  });
});

describe('extra platform scripts', () => {
  it('are valid JavaScript and only added for Threads', () => {
    const { EXTRA_SCRIPTS, withExtras } = require('@/rules/extraScripts');
    expect(() => new Function(EXTRA_SCRIPTS.threads)).not.toThrow();
    expect(withExtras('instagram', 'x')).toBe('x');
    expect(withExtras('threads', 'x')).toContain('__onlydmThreads');
  });
});
