import { userResponseSchema } from '@/schemas/user.schema';
import { http } from '@/services/http';
import type { User, UserId, UserInput } from '@/types/user';

export type UsersQuery = {
  page: number;
  size: number;
  search: string;
  searchField: 'all' | 'name' | 'email' | 'role';
  sortField: keyof User;
  sortOrder: -1 | 1;
};

function extractUsers(payload: unknown): User[] {
  let raw: unknown[] = [];

  if (Array.isArray(payload)) {
    raw = payload;
  } else if (payload && typeof payload === 'object') {
    const data = (payload as { data?: unknown }).data;
    if (Array.isArray(data)) {
      raw = data;
    } else {
      const items = (payload as { items?: unknown }).items;
      if (Array.isArray(items)) {
        raw = items;
      }
    }
  }

  return raw
    .map((item) => userResponseSchema.safeParse(item))
    .filter((result) => result.success)
    .map((result) => result.data as User);
}

function extractTotal(payload: unknown, fallback: number): number {
  if (payload && typeof payload === 'object') {
    const total = (payload as { total?: unknown }).total;
    if (typeof total === 'number' && Number.isFinite(total)) {
      return total;
    }

    const items = (payload as { items?: unknown }).items;
    if (typeof items === 'number' && Number.isFinite(items)) {
      return items;
    }

    const pages = (payload as { pages?: number; per_page?: number; _per_page?: number; data?: unknown[] });
    const perPage =
      typeof pages.per_page === 'number' ? pages.per_page : typeof pages._per_page === 'number' ? pages._per_page : undefined;
    if (typeof pages.pages === 'number' && typeof perPage === 'number') {
      return pages.pages * perPage;
    }
  }

  return fallback;
}

export async function fetchUsersService(query: UsersQuery): Promise<{ items: User[]; total: number }> {
  const params: Record<string, string | number> = {
    _page: query.page + 1,
    _per_page: query.size,
    _sort: query.sortOrder === -1 ? `-${String(query.sortField)}` : String(query.sortField)
  };

  if (query.search) {
    if (query.searchField === 'all') {
      params._where = JSON.stringify({
        or: [
          { name: { contains: query.search } },
          { email: { contains: query.search } },
          { role: { contains: query.search } }
        ]
      });
    } else {
      params[`${query.searchField}:contains`] = query.search;
    }
  }

  const response = await http.get('/users', { params });
  const payload = response.data as unknown;
  const items = extractUsers(payload);
  const totalHeader = response.headers?.['x-total-count'];
  const totalFromPayload = extractTotal(payload, items.length);
  const total = totalHeader ? Number(totalHeader) : totalFromPayload;
  return { items, total };
}

export async function createOrUpdateUserService(userData: UserInput): Promise<void> {
  const now = new Date().toISOString();

  if (userData.id) {
    const payload = {
      name: userData.name,
      email: userData.email,
      role: userData.role,
      status: userData.status,
      updated_at: now
    };
    await http.patch(`/users/${userData.id}`, payload);
    return;
  }

  const payload = {
    name: userData.name,
    email: userData.email,
    role: userData.role,
    status: userData.status,
    created_at: now,
    updated_at: now
  };
  await http.post('/users', payload);
}

export async function deleteUserService(id: UserId): Promise<void> {
  await http.delete(`/users/${id}`);
}

export async function deleteUsersService(ids: UserId[]): Promise<void> {
  await Promise.all(ids.map((id) => deleteUserService(id)));
}
