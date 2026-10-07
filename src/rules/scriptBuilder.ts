import type { PlatformRules } from './types';

/** Fields of the pack the injected script needs. Allowed prefixes come from the pack, never duplicated in JS. */
export interface ScriptConfig {
  startUrl: string;
  allowedPathPrefixes: string[];
  sharedContentPathPrefixes: string[];
  css: string;
}

export const CONFIG_PLACEHOLDER = '__ONLYDM_CONFIG__';

const LINE_SEPARATOR = new RegExp(String.fromCharCode(0x2028), 'g');
const PARAGRAPH_SEPARATOR = new RegExp(String.fromCharCode(0x2029), 'g');

/** JSON is valid JS except for these two line terminators. */
function toJsLiteral(value: unknown): string {
  return JSON.stringify(value).replace(LINE_SEPARATOR, '\\u2028').replace(PARAGRAPH_SEPARATOR, '\\u2029');
}

export function buildScript(pack: PlatformRules): string {
  const config: ScriptConfig = {
    startUrl: pack.startUrl,
    allowedPathPrefixes: pack.allowedPathPrefixes,
    sharedContentPathPrefixes: pack.sharedContentPathPrefixes,
    css: pack.css,
  };
  return pack.js.split(CONFIG_PLACEHOLDER).join(toJsLiteral(config));
}
