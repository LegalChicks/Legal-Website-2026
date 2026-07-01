const API_BASE = "/api";

async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(
      (err as { error?: string }).error ?? `HTTP ${res.status}`,
    );
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export type AuthUser = {
  id: number;
  username: string;
  role: string;
  fullName: string;
};

export type Member = {
  id: number;
  username: string;
  fullName: string;
  contact: string;
  role: string;
  createdAt: string;
};

export type PoultryRecord = {
  id: number;
  userId: number;
  batchName: string;
  birdType: string;
  breed: string;
  quantity: number;
  ageWeeks: number | null;
  hatchDate: string | null;
  feedNotes: string | null;
  healthStatus: string | null;
  mortalityCount: number;
  eggProduction: number | null;
  avgWeightKg: string | null;
  freeNotes: string | null;
  createdAt: string;
  updatedAt: string;
};

export const api = {
  auth: {
    login: (username: string, password: string) =>
      apiFetch<{ user: AuthUser }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      }),
    logout: () => apiFetch("/auth/logout", { method: "POST" }),
    me: () => apiFetch<{ user: AuthUser }>("/auth/me"),
  },
  admin: {
    listUsers: () => apiFetch<{ users: Member[] }>("/admin/users"),
    createUser: (data: {
      username: string;
      password: string;
      fullName: string;
      contact?: string;
      role?: string;
    }) =>
      apiFetch<{ user: Member }>("/admin/users", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    updateUser: (
      id: number,
      data: Partial<{
        fullName: string;
        contact: string;
        role: string;
        password: string;
      }>,
    ) =>
      apiFetch<{ user: Member }>(`/admin/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    deleteUser: (id: number) =>
      apiFetch(`/admin/users/${id}`, { method: "DELETE" }),
  },
  records: {
    listPublic: () => apiFetch<{ records: PoultryRecord[] }>("/records/public"),
    list: () => apiFetch<{ records: PoultryRecord[] }>("/records"),
    create: (data: Partial<PoultryRecord>) =>
      apiFetch<{ record: PoultryRecord }>("/records", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: number, data: Partial<PoultryRecord>) =>
      apiFetch<{ record: PoultryRecord }>(`/records/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
  },
};
