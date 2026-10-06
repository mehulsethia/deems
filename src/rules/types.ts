/** Platforms Hearth can show. Each has one bundled rules pack. */
export type PlatformId = 'instagram' | 'messenger' | 'threads';

export interface UserAgents {
  ios: string;
  android: string;
  desktop: string;
}

/** Everything platform-specific lives in a rules pack; components stay generic. */
export interface PlatformRules {
  id: PlatformId;
  displayName: string;
  /** Monotonic integer; the store keeps the highest version. */
  version: number;
  startUrl: string;
  loginUrl: string;
  /** Hosts loaded inside the web view (exact match). */
  allowedHosts: string[];
  /** Paths that may be shown (segment-aware prefix match). */
  allowedPathPrefixes: string[];
  /** While the route is under one of these, the user is still signing in. */
  loginPathPrefixes: string[];
  /** Hosts always handed to the system browser (suffix match). */
  externalHosts: string[];
  /** Specific shared content (post, reel) opened in a locked modal. Needs a segment after the prefix. */
  sharedContentPathPrefixes: string[];
  userAgent: UserAgents;
  /** CSS that hides navigation and banners. Attribute/aria selectors only. */
  css: string;
  /** Injection template; `__HEARTH_CONFIG__` is replaced by scriptBuilder. Bundled only. */
  js: string;
}

/** The only fields a remote pack may change. */
export type RemoteRules = Pick<
  PlatformRules,
  | 'id'
  | 'version'
  | 'css'
  | 'allowedPathPrefixes'
  | 'loginPathPrefixes'
  | 'sharedContentPathPrefixes'
  | 'externalHosts'
>;

export type NavigationDecision =
  | { action: 'allow' }
  | { action: 'redirect'; url: string }
  | { action: 'external'; url: string }
  | { action: 'shared'; url: string }
  | { action: 'block' };

/** Message posted from the injected script to React Native. */
export type WebMessage =
  | { type: 'route'; path: string }
  | { type: 'shared'; url: string };
