// Cursor persistence (CVS-142).
//
// The runtime persists only a small opaque cursor string per (account, connector, stream)
// — payload-free by construction. The DB-backed implementation lands with the connection
// model; this in-memory store backs tests and mock/preview runs.
import type { CursorStore } from './types';

/** Stable cursor key for a stream run. */
export function cursorKeyFor(accountId: string, connectorId: string, stream: string): string {
  return `${accountId}:${connectorId}:${stream}`;
}

/** In-memory cursor store — for tests, sample previews, and single-process runs. */
export class InMemoryCursorStore implements CursorStore {
  private readonly cursors = new Map<string, string>();

  constructor(initial?: Record<string, string>) {
    if (initial) for (const [k, v] of Object.entries(initial)) this.cursors.set(k, v);
  }

  async read(key: string): Promise<string | undefined> {
    return this.cursors.get(key);
  }

  async write(key: string, cursor: string): Promise<void> {
    this.cursors.set(key, cursor);
  }

  /** Test/debug helper: snapshot of all persisted cursors. */
  snapshot(): Record<string, string> {
    return Object.fromEntries(this.cursors);
  }
}
