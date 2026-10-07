import { STORY_RINGS_SCRIPT } from '@/stories/instagram';

describe('STORY_RINGS_SCRIPT', () => {
  it('is valid JavaScript', () => {
    expect(() => new Function(STORY_RINGS_SCRIPT)).not.toThrow();
  });

  it('does nothing outside Instagram', () => {
    const fetch = jest.fn();
    const run = new Function('window', 'location', 'fetch', 'document', STORY_RINGS_SCRIPT);
    run({}, { host: 'www.threads.com', pathname: '/direct/inbox/' }, fetch, {});
    expect(fetch).not.toHaveBeenCalled();
  });

  it('keeps usernames to Instagram’s character set before building a story address', () => {
    expect(STORY_RINGS_SCRIPT).toContain("/^[A-Za-z0-9._]{1,30}$/");
    expect(STORY_RINGS_SCRIPT).toContain("'/stories/' + user + '/'");
  });
});
