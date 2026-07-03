// Deterministic fingerprint for grouping runtime crashes (System Health intake).
// Groups repeated crashes without merging unrelated ones, and stays stable across
// deploys by stripping bundle content-hashes, line/col numbers, and dynamic ids.
//
// Inputs are intentionally limited to non-PII signal (message + top stack frame +
// top component frame + route path). NEVER feed user id, email, note text, raw
// timestamps, or full URL query values into the fingerprint — see
// docs/features/system-health-intake.md.

export interface FingerprintInput {
  message: string | null | undefined;
  errorStack: string | null | undefined;
  componentStack: string | null | undefined;
  pathname: string | null | undefined;
}

/** Collapse dynamic ids so unrelated occurrences don't fragment into new groups. */
function scrubDynamic(s: string): string {
  return s
    .replace(
      /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi,
      ":uuid"
    )
    .replace(/\b[0-9a-f]{16,}\b/gi, ":hex")
    .replace(/\d+/g, ":n");
}

function normalizeMessage(message: string | null | undefined): string {
  if (!message) return "unknown";
  return scrubDynamic(message.trim().toLowerCase()).replace(/\s+/g, " ").slice(0, 300);
}

/** First meaningful `at …` line, stripped of origin, query, :line:col and file hashes. */
function normalizeTopFrame(stack: string | null | undefined): string {
  if (!stack) return "";
  const lines = stack.split("\n").map((l) => l.trim());
  const frame = lines.find((l) => l.startsWith("at ")) ?? lines[1] ?? "";
  return frame
    .replace(/https?:\/\/[^/\s)]+/g, "") // origin
    .replace(/\?[^\s)]*/g, "") // query string
    .replace(/:\d+:\d+/g, "") // :line:col
    .replace(/-[a-z0-9]{6,}(?=\.[a-z]+)/gi, "") // bundle content hash before extension
    .replace(/\s+/g, " ")
    .toLowerCase()
    .slice(0, 200);
}

/** First meaningful React component-stack frame (e.g. "at DashboardPage"). */
function normalizeTopComponent(componentStack: string | null | undefined): string {
  if (!componentStack) return "";
  const line = componentStack
    .split("\n")
    .map((l) => l.trim())
    .find((l) => l.length > 0);
  return (line ?? "").replace(/\s+/g, " ").toLowerCase().slice(0, 200);
}

/** Route path with dynamic segments collapsed; query string dropped entirely. */
export function normalizeRoute(pathname: string | null | undefined): string {
  if (!pathname) return "/";
  const path = pathname.split("?")[0].split("#")[0];
  return (
    "/" +
    path
      .split("/")
      .filter(Boolean)
      .map((seg) => {
        if (
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(seg)
        )
          return ":id";
        if (/^\d+$/.test(seg)) return ":id";
        return seg;
      })
      .join("/")
  );
}

async function sha256hex(s: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(buf)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Stable 16-char hex fingerprint. Same crash → same fingerprint (across deploys);
 * unrelated crashes → different fingerprints. Returns null only if hashing is
 * unavailable (fingerprint is best-effort — a null just means "ungrouped").
 */
export async function computeErrorFingerprint(
  input: FingerprintInput
): Promise<string | null> {
  try {
    const basis = [
      normalizeMessage(input.message),
      normalizeTopFrame(input.errorStack),
      normalizeTopComponent(input.componentStack),
      normalizeRoute(input.pathname),
    ].join("|");
    return (await sha256hex(basis)).slice(0, 16);
  } catch {
    return null;
  }
}
