/** Tiny pub/sub so Settings can ask the inbox web view to reload or wipe its stored data. */
type Event = 'reload' | 'clear';
const listeners: Record<Event, Set<() => void>> = { reload: new Set(), clear: new Set() };

export function emitWebEvent(e: Event) {
  listeners[e].forEach((fn) => fn());
}

export function onWebEvent(e: Event, fn: () => void): () => void {
  listeners[e].add(fn);
  return () => {
    listeners[e].delete(fn);
  };
}
