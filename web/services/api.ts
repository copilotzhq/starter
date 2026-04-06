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

export const withAuthHeaders = (
  headers: Record<string, string> = {},
): Record<string, string> => {
  if (API_KEY) {
    return { ...headers, Authorization: `Bearer ${API_KEY}` };
  }

  return headers;
};
