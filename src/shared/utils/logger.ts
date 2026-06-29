/**
 * Central leveled logger.
 *
 * Replaces ad-hoc `console.*` calls so verbose debug output stops polluting the
 * console (and production builds) while staying available on demand.
 *
 * Levels: debug < info < warn < error.
 *  - `debug` / `info` are gated: silent unless their namespace is enabled.
 *  - `warn` / `error` always emit.
 *
 * Enabling debug output:
 *  - Development (`import.meta.env.DEV`): all namespaces on by default.
 *  - Production / on demand: add `?debug=canvas,projects` to the URL, or set
 *    `localStorage.debug = 'canvas,projects'` (use `*` for everything).
 *    Call `setDebugNamespaces('*')` at runtime to toggle without reloading.
 *
 * Usage:
 *   const log = createLogger('canvas');
 *   log.debug('Transforming relationship', rel);  // gated
 *   log.error('Failed to load canvas', err);       // always prints
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const isDev = Boolean(import.meta.env?.DEV);

/** Comma/space separated namespace spec, e.g. "*", "canvas", "canvas,projects". */
let debugSpec: string | null | undefined;

function readDebugSpec(): string | null {
  // URL query param wins, then localStorage. Guard for non-browser (tests/SSR).
  try {
    if (typeof window !== 'undefined' && window.location) {
      const q = new URLSearchParams(window.location.search).get('debug');
      if (q !== null) return q;
    }
  } catch {
    /* ignore */
  }
  try {
    if (typeof localStorage !== 'undefined') {
      const ls = localStorage.getItem('debug');
      if (ls !== null) return ls;
    }
  } catch {
    /* ignore */
  }
  return null;
}

function getSpec(): string | null {
  if (debugSpec === undefined) debugSpec = readDebugSpec();
  return debugSpec;
}

/** Override the enabled namespaces at runtime (does not persist). */
export function setDebugNamespaces(spec: string | null): void {
  debugSpec = spec;
}

function namespaceEnabled(namespace: string): boolean {
  const spec = getSpec();
  // An explicit spec always takes precedence (lets you narrow even in dev).
  if (spec !== null) {
    const tokens = spec
      .split(/[\s,]+/)
      .map((t) => t.trim())
      .filter(Boolean);
    if (tokens.includes('*')) return true;
    return tokens.includes(namespace);
  }
  // No explicit spec: on in dev, off in prod.
  return isDev;
}

export interface Logger {
  debug: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
}

function emit(level: LogLevel, namespace: string, args: unknown[]): void {
  if ((level === 'debug' || level === 'info') && !namespaceEnabled(namespace)) {
    return;
  }
  const method =
    level === 'debug' ? console.log : (console[level] as typeof console.log);
  method(...args);
}

/** Create a namespaced logger. The namespace is the gating key for debug/info. */
export function createLogger(namespace: string): Logger {
  return {
    debug: (...args: unknown[]) => emit('debug', namespace, args),
    info: (...args: unknown[]) => emit('info', namespace, args),
    warn: (...args: unknown[]) => emit('warn', namespace, args),
    error: (...args: unknown[]) => emit('error', namespace, args),
  };
}

/** Default general-purpose logger for code without a clear feature namespace. */
export const logger = createLogger('app');
