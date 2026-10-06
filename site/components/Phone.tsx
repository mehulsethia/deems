/** Our own drawing of the Deems inbox. Invented names, drawn initials, no real photos or app UI copy. */
const FRIENDS = [
  { name: 'maya', tint: '#5B93FF' },
  { name: 'jo', tint: '#FF5C9F' },
  { name: 'sam', tint: '#FFFFFF' },
  { name: 'priya', tint: '#B4B9C2' },
  { name: 'leo', tint: '#5B93FF' },
];
const CHATS = [
  { name: 'maya', tint: '#5B93FF', text: 'you free sat?', time: 'now', unread: true },
  { name: 'jo, sam and leo', tint: '#FF5C9F', text: 'leo: 7 at the usual', time: '2h', unread: true },
  { name: 'priya', tint: '#B4B9C2', text: 'You: on my way', time: '3h' },
  { name: 'sam', tint: '#FFFFFF', text: 'sent a voice note', time: '5h' },
];

export function Phone() {
  return (
    <div className="phone" role="img" aria-label="The Deems inbox: friends’ stories along the top, then messages. The tab bar has only Messages; Feed, Reels and Explore are crossed out.">
      <div className="phone-top">
        <div className="pills">
          <span className="pill on">Instagram</span>
          <span className="pill">Threads</span>
          <span className="pill">Facebook</span>
        </div>
      </div>
      <div className="stories">
        {FRIENDS.map((f) => (
          <div className="story" key={f.name}>
            <div className="ring">
              <div className="avatar" style={{ background: f.tint }}>{f.name[0]}</div>
            </div>
            {f.name}
          </div>
        ))}
      </div>
      <div className="label">Messages</div>
      <div className="chats">
        {CHATS.map((c) => (
          <div className="chat" key={c.name}>
            <div className="avatar" style={{ background: c.tint }}>{c.name[0]}</div>
            <div>
              <strong>{c.name}</strong>
              <span>
                {c.text} · {c.time}
              </span>
            </div>
            {c.unread ? <span className="dot" /> : <span />}
          </div>
        ))}
      </div>
      <div className="tabbar">
        <s>Feed</s>
        <s>Reels</s>
        <s>Explore</s>
        <span className="accent">Messages</span>
      </div>
    </div>
  );
}
