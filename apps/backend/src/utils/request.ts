import { MedusaError } from "@medusajs/framework/utils";

export async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    credentials: "include",
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok)
    throw new MedusaError(
      MedusaError.Types.FORBIDDEN,
      data.message || data.error || `Request failed (${response.status})`,
    );

  return data as T;
}
