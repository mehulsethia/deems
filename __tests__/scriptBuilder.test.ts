import bundled from '../src/rules/instagram.json';
import { buildScript, CONFIG_PLACEHOLDER } from '../src/rules/scriptBuilder';
import { lockPackToUrl } from '../src/rules/matching';
import type { PlatformRules } from '../src/rules/types';

const pack = bundled as PlatformRules;

interface Harness {
  messages: any[];
  replaced: string[];
  history: { pushState: (...a: any[]) => void; replaceState: (...a: any[]) => void };
  originalPushState: jest.Mock;
  location: { href: string; pathname: string; host: string; replace: (u: string) => void };
  style: { id: string; textContent: string } | null;
  fireDomChange: () => void;
  popstate: () => void;
}

/** Runs the injected script against minimal stand-ins for the browser globals. */
function run(script: string, startHref = 'https://www.instagram.com/direct/inbox/'): Harness {
  const h: Harness = {
    messages: [],
    replaced: [],
    history: { pushState: jest.fn(), replaceState: jest.fn() },
    originalPushState: jest.fn(),
    location: { href: '', pathname: '', host: '', replace: () => {} },
    style: null,
    fireDomChange: () => {},
    popstate: () => {},
  };
  const setLocation = (href: string) => {
    const u = new URL(href);
    h.location.href = u.href;
    h.location.pathname = u.pathname;
    h.location.host = u.host;
  };
  h.originalPushState = h.history.pushState as jest.Mock;
  setLocation(startHref);
  h.location.replace = (u: string) => {
    h.replaced.push(u);
    setLocation(u);
  };
  const listeners: Record<string, () => void> = {};
  const win: any = {
    ReactNativeWebView: { postMessage: (m: string) => h.messages.push(JSON.parse(m)) },
    addEventListener: (n: string, fn: () => void) => (listeners[n] = fn),
  };
  const doc: any = {
    documentElement: { appendChild: (el: any) => (h.style = el) },
    head: null,
    getElementById: (id: string) => (h.style && h.style.id === id ? h.style : null),
    createElement: () => ({ id: '', textContent: '' }),
  };
  let observerCb: () => void = () => {};
  class FakeObserver {
    constructor(cb: () => void) {
      observerCb = cb;
    }
    observe() {}
  }
  h.fireDomChange = () => observerCb();
  h.popstate = () => listeners.popstate?.();
  jest.useFakeTimers();
  new Function('window', 'document', 'history', 'location', 'MutationObserver', 'URL', script)(
    win, doc, h.history, h.location, FakeObserver, URL,
  );
  return h;
}

afterEach(() => jest.useRealTimers());

describe('buildScript', () => {
  it('substitutes the placeholder with pack data', () => {
    const script = buildScript(pack);
    expect(pack.js).toContain(CONFIG_PLACEHOLDER);
    expect(script).not.toContain(CONFIG_PLACEHOLDER);
    for (const prefix of pack.allowedPathPrefixes) expect(script).toContain(`"${prefix}"`);
    expect(script).toContain(JSON.stringify(pack.startUrl));
  });

  it('produces syntactically valid JavaScript', () => {
    expect(() => new Function(buildScript(pack))).not.toThrow();
  });

  it('survives awkward characters in remote css', () => {
    const nasty = { ...pack, css: 'a[href="/x"]{}  </script>\'`${x}' };
    const script = buildScript(nasty);
    expect(() => new Function(script)).not.toThrow();
  });

  it('ends with `true;` so injectedJavaScript does not warn', () => {
    expect(buildScript(pack).trim().endsWith('true;')).toBe(true);
  });

  it('uses only attribute selectors in the pack css, no obfuscated classes', () => {
    expect(pack.css).not.toMatch(/(^|[\s,>+~])\.[\w-]+/m);
    expect(pack.css).toContain('a[href="/explore/"]');
    expect(pack.css).toContain('a[href="/reels/"]');
    expect(pack.css).toContain('a[href="/"]');
  });
});

describe('injected script behaviour', () => {
  it('injects the style and reports the first route', () => {
    const h = run(buildScript(pack));
    expect(h.style?.textContent).toBe(pack.css);
    expect(h.messages).toEqual([{ type: 'route', path: '/direct/inbox/' }]);
  });

  it('lets allowed pushState through and reports the route', () => {
    const h = run(buildScript(pack));
    h.history.pushState({}, '', '/direct/t/123/');
    expect(h.replaced).toEqual([]);
    expect(h.originalPushState).toHaveBeenCalledTimes(1);
  });

  it('redirects pushState to a disallowed path back to the start url', () => {
    const h = run(buildScript(pack));
    h.history.pushState({}, '', '/explore/');
    expect(h.replaced).toEqual([pack.startUrl]);
    expect(h.originalPushState).not.toHaveBeenCalled();
  });

  it('redirects on popstate when the path is outside the allowlist', () => {
    const h = run(buildScript(pack));
    h.location.pathname = '/reels/';
    h.location.href = 'https://www.instagram.com/reels/';
    h.popstate();
    expect(h.replaced).toEqual([pack.startUrl]);
  });

  it('redirects immediately when loaded on a disallowed path', () => {
    const h = run(buildScript(pack), 'https://www.instagram.com/');
    expect(h.replaced).toEqual([pack.startUrl]);
  });

  it('posts shared content instead of navigating to it', () => {
    const h = run(buildScript(pack));
    h.history.pushState({}, '', '/reel/Cabc/');
    expect(h.replaced).toEqual([]);
    expect(h.messages).toContainEqual({ type: 'shared', url: 'https://www.instagram.com/reel/Cabc/' });
  });

  it('does not treat the Reels tab as shared content', () => {
    const h = run(buildScript(pack));
    h.history.pushState({}, '', '/reels/');
    expect(h.replaced).toEqual([pack.startUrl]);
    expect(h.messages.find((m) => m.type === 'shared')).toBeUndefined();
  });

  it('debounces the mutation observer and restores a removed style', () => {
    const h = run(buildScript(pack));
    const current = () => h.style as Harness['style'];
    h.style = null;
    h.fireDomChange();
    h.fireDomChange();
    expect(current()).toBeNull();
    jest.advanceTimersByTime(200);
    expect(current()?.textContent).toBe(pack.css);
  });

  it('locked pack only allows its own path', () => {
    const locked = lockPackToUrl(pack, 'https://www.instagram.com/reel/Cabc/');
    const h = run(buildScript(locked), 'https://www.instagram.com/reel/Cabc/');
    expect(h.replaced).toEqual([]);
    h.history.pushState({}, '', '/direct/inbox/');
    expect(h.replaced).toEqual([locked.startUrl]);
  });
});
