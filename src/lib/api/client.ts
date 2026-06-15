const RAW_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "";
export const API_BASE = RAW_BASE.replace(/\/+$/, "");

const ACCESS_KEY = "1099ly_access_token";
const REFRESH_KEY = "1099ly_refresh_token";
const TEMP_KEY = "1099ly_temp_token";

export const tokenStore = {
  getAccess: () => (typeof window === "undefined" ? null : localStorage.getItem(ACCESS_KEY)),
  getRefresh: () => (typeof window === "undefined" ? null : localStorage.getItem(REFRESH_KEY)),
  getTemp: () => (typeof window === "undefined" ? null : localStorage.getItem(TEMP_KEY)),
  setAccess: (t: string | null) => {
    if (typeof window === "undefined") return;
    t ? localStorage.setItem(ACCESS_KEY, t) : localStorage.removeItem(ACCESS_KEY);
  },
  setRefresh: (t: string | null) => {
    if (typeof window === "undefined") return;
    t ? localStorage.setItem(REFRESH_KEY, t) : localStorage.removeItem(REFRESH_KEY);
  },
  setTemp: (t: string | null) => {
    if (typeof window === "undefined") return;
    t ? localStorage.setItem(TEMP_KEY, t) : localStorage.removeItem(TEMP_KEY);
  },
  clear: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(TEMP_KEY);
  },
};

export type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[] | string> | unknown;
  error_code?: string;
};

export class ApiError extends Error {
  status: number;
  errors?: unknown;
  code?: string;
  constructor(status: number, message: string, errors?: unknown, code?: string) {
    super(message);
    this.status = status;
    this.errors = errors;
    this.code = code;
  }
}

type ApiOpts = {
  method?: string;
  body?: unknown;
  token?: string | null; // override; default = access token
  formData?: FormData;
  query?: Record<string, string | number | boolean | undefined | null>;
};

export async function api<T = unknown>(path: string, opts: ApiOpts = {}): Promise<T> {
  if (!API_BASE) {
    throw new ApiError(0, "VITE_API_BASE_URL is not configured. Set it in your .env file.");
  }
  const token = opts.token === undefined ? tokenStore.getAccess() : opts.token;
  const headers: Record<string, string> = { Accept: "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  let body: BodyInit | undefined;
  if (opts.formData) {
    body = opts.formData;
  } else if (opts.body !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(opts.body);
  }

  const qs = opts.query
    ? "?" +
      Object.entries(opts.query)
        .filter(([, v]) => v !== undefined && v !== null && v !== "")
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
        .join("&")
    : "";

  const url = `${API_BASE}/v1${path.startsWith("/") ? path : `/${path}`}${qs}`;

  let res: Response;
  try {
    res = await fetch(url, { method: opts.method ?? (body ? "POST" : "GET"), headers, body });
  } catch (e) {
    throw new ApiError(0, `Network error contacting API: ${(e as Error).message}`);
  }

  let json: ApiEnvelope<T> | null = null;
  const text = await res.text();
  if (text) {
    try { json = JSON.parse(text) as ApiEnvelope<T>; } catch { /* not JSON */ }
  }

  if (!res.ok || (json && json.success === false)) {
    const msg = json?.message || `Request failed (${res.status})`;
    throw new ApiError(res.status, msg, json?.errors, json?.error_code);
  }

  return (json?.data ?? (json as unknown)) as T;
}