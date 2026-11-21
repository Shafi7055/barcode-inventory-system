const API_BASE_URL = "/api/v1";

export class ApiError extends Error {
  constructor(status, error) {
    super(error?.message || "The request failed.");
    this.name = "ApiError";
    this.status = status;
    this.code = error?.code || "REQUEST_FAILED";
    this.details = error?.details || [];
  }
}

export async function apiRequest(path, options = {}) {
  const headers = new Headers(options.headers || {});
  if (options.body !== undefined) headers.set("Content-Type", "application/json");
  if (options.idempotent) headers.set("Idempotency-Key", crypto.randomUUID());

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method || "GET",
    headers,
    cache: "no-store",
    credentials: "same-origin",
    ...(options.body !== undefined ? { body: JSON.stringify(options.body) } : {}),
  });

  if (response.status === 204) return null;
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new ApiError(response.status, payload?.error);
  return payload;
}

export function queryString(values = {}) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) {
    if (value !== undefined && value !== null && value !== "") params.set(key, String(value));
  }
  const result = params.toString();
  return result ? `?${result}` : "";
}
