const BASE = import.meta.env.VITE_API_BASE_URL;
const token = () => localStorage.getItem("token");
const authHeaders = () =>
  token() ? { Authorization: `Bearer ${token()}` } : {};

export async function login(username: string, password: string) {
  const r = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!r.ok) throw new Error("Invalid credentials");
  return r.json(); // { token }
}

export async function listUrls() {
  const r = await fetch(`${BASE}/urls`, { headers: { ...authHeaders() } });
  if (r.status === 401) throw new Error("unauthorized");
  return r.json();
}

export async function createUrl(payload: { url: string; active: boolean }) {
  const r = await fetch(`${BASE}/urls`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  if (r.status === 401) throw new Error("unauthorized");
  return r.json();
}

export async function updateUrl(
  id: string,
  patch: Partial<{ url: string; active: boolean }>
) {
  const r = await fetch(`${BASE}/urls/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(patch),
  });
  if (r.status === 401) throw new Error("unauthorized");
  return r.json();
}

export async function deleteUrl(id: string) {
  const r = await fetch(`${BASE}/urls/${id}`, {
    method: "DELETE",
    headers: { ...authHeaders() },
  });
  if (r.status === 401) throw new Error("unauthorized");
  return r.json();
}

export async function getOnePublic() {
  const r = await fetch(`${BASE}/url`, { cache: "no-store" });
  if (!r.ok) throw new Error("no url");
  return r.json(); // { url }
}

export type UrlItem = {
  id: string;
  url: string;
  active?: boolean;
};
