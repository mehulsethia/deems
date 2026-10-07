import { parseStories, storyUrl } from '@/stories/instagram';

const pic = 'https://scontent-lhr8-1.cdninstagram.com/v/t51/abc.jpg?x=1';

describe('parseStories', () => {
  it('keeps valid entries and puts unwatched first', () => {
    const items = parseStories([
      { username: 'maya', avatar: pic, unseen: false },
      { username: 'jo.park', avatar: pic, unseen: true },
    ]);
    expect(items.map((s) => s.username)).toEqual(['jo.park', 'maya']);
  });

  it('drops bad usernames, foreign image hosts and duplicates', () => {
    const items = parseStories([
      { username: '../accounts', avatar: pic },
      { username: 'maya', avatar: 'https://evil.example/cdninstagram.com/a.jpg' },
      { username: 'maya', avatar: 'http://scontent.cdninstagram.com/a.jpg' },
      { username: 'sam', avatar: pic },
      { username: 'sam', avatar: pic },
      null,
      'priya',
    ]);
    expect(items).toEqual([{ username: 'sam', avatar: pic, unseen: false }]);
  });

  it('returns nothing for non-arrays', () => {
    expect(parseStories({ tray: [] })).toEqual([]);
    expect(parseStories(undefined)).toEqual([]);
  });

  it('builds the story address', () => {
    expect(storyUrl('jo.park')).toBe('https://www.instagram.com/stories/jo.park/');
  });
});
