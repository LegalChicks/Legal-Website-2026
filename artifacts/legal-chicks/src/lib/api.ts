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
  deletedAt: string | null;
};

export type AdminRecord = PoultryRecord & {
  memberName: string;
  memberUsername: string;
};

export type SalesRecord = {
  id: number;
  userId: number;
  saleDate: string;
  productType: "fertile_eggs" | "table_eggs" | "live_chickens";
  breed: string;
  quantity: number;
  unit: string;
  unitPrice: string;
  totalAmount: string;
  buyerName: string;
  buyerContact: string;
  deliveryMethod: string;
  deliveryAddress: string | null;
  paymentMethod: string;
  paymentStatus: string;
  amountPaid: string;
  balance: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type AdminSalesRecord = SalesRecord & {
  memberName: string;
  memberUsername: string;
};

export type IncubationRecord = {
  id: number;
  userId: number;
  batchName: string;
  breed: string;
  eggsSetCount: number;
  setDate: string;
  incubatorType: string;
  temperatureC: string | null;
  humidityPercent: string | null;
  expectedHatchDate: string | null;
  day7FertileCount: number | null;
  day7InfertileCount: number | null;
  day14FertileCount: number | null;
  day14InfertileCount: number | null;
  day18FertileCount: number | null;
  day18InfertileCount: number | null;
  actualHatchDate: string | null;
  hatchedCount: number | null;
  unhatchedCount: number | null;
  deadInShellCount: number | null;
  cullCount: number | null;
  status: "incubating" | "hatched" | "failed";
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type AdminIncubationRecord = IncubationRecord & {
  memberName: string;
  memberUsername: string;
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
    listAllRecords: () =>
      apiFetch<{ records: AdminRecord[] }>("/admin/records"),
    listAllSales: () =>
      apiFetch<{ records: AdminSalesRecord[] }>("/admin/sales"),
    listAllIncubation: () =>
      apiFetch<{ records: AdminIncubationRecord[] }>("/admin/incubation"),
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
    delete: (id: number) =>
      apiFetch<{ ok: boolean }>(`/records/${id}`, { method: "DELETE" }),
  },
  sales: {
    list: () => apiFetch<{ records: SalesRecord[] }>("/sales"),
    create: (data: Partial<SalesRecord>) =>
      apiFetch<{ record: SalesRecord }>("/sales", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: number, data: Partial<SalesRecord>) =>
      apiFetch<{ record: SalesRecord }>(`/sales/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      apiFetch<{ ok: boolean }>(`/sales/${id}`, { method: "DELETE" }),
  },
  incubation: {
    list: () => apiFetch<{ records: IncubationRecord[] }>("/incubation"),
    create: (data: Partial<IncubationRecord>) =>
      apiFetch<{ record: IncubationRecord }>("/incubation", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: number, data: Partial<IncubationRecord>) =>
      apiFetch<{ record: IncubationRecord }>(`/incubation/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      apiFetch<{ ok: boolean }>(`/incubation/${id}`, { method: "DELETE" }),
  },
};
