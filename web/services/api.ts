const rawBaseValue =
  (import.meta as { env?: Record<string, string | undefined> }).env
    ?.VITE_API_URL;
const rawBase = typeof rawBaseValue === "string" && rawBaseValue.length > 0
  ? rawBaseValue
  : "/api";
const normalizedBase = rawBase.replace(/\/$/, "");

const runtimeProcess: typeof process | undefined =
  typeof process !== "undefined" ? process : undefined;

const API_KEY = (() => {
  const env =
    (import.meta as { env?: Record<string, string | undefined> }).env ?? {};
  const candidates = [
    env.VITE_API_KEY,
    env.VITE_COPILOTZ_API_KEY,
    runtimeProcess?.env?.COPILOTZ_API_KEY,
    runtimeProcess?.env?.API_KEY,
  ];

  return candidates.find((value) =>
    typeof value === "string" && value.length > 0
  );
})();

export const API_BASE =
  normalizedBase.startsWith("http") || normalizedBase.startsWith("/")
    ? normalizedBase
    : `/${normalizedBase}`;

export const apiUrl = (path: string) => `${API_BASE}${path}`;

/**
 * Parse `apiUrl(path)` into a `URL` for `searchParams` etc.
 * When `API_BASE` is origin-relative (`/api`), a single-arg `new URL()` throws;
 * this supplies the current origin as the base in that case.
 */
export function apiUrlObject(path: string): URL {
  const resolved = apiUrl(path);
  if (/^https?:\/\//i.test(resolved)) {
    return new URL(resolved);
  }
  const origin =
    typeof globalThis.location !== "undefined" &&
    typeof globalThis.location.origin === "string"
      ? globalThis.location.origin
      : "http://localhost";
  return new URL(resolved, origin);
}

export const withAuthHeaders = (
  headers: Record<string, string> = {},
): Record<string, string> => {
  if (API_KEY) {
    return { ...headers, Authorization: `Bearer ${API_KEY}` };
  }

  return headers;
};
