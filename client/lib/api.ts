export type User = {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user";
};
export type PortfolioRecord = {
  _id: string;
  title?: string;
  firstname: string;
  lastname: string;
  email: string;
  completion?: string;
  description?: string;
  phone?: string;
  message?: string;
  image?: string;
  type?: string;
  roleDescription?: string;
  outcome?: string;
  tools?: string[];
  institution?: string;
  start?: string;
  status?: string;
};
export async function api<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`/backend-api${path}`, {
    ...options,
    credentials: "same-origin",
    cache: "no-store",
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok)
    throw new Error(data.error || "The request failed. Please try again.");
  return data as T;
}
