import { describe, expect, it, vi } from 'vitest';

vi.mock('@/services/http', () => ({
  http: {
    get: vi.fn()
  }
}));

import { http } from '@/services/http';
import { fetchUsersService } from '@/services/users.service';

describe('fetchUsersService', () => {
  it('normalizes object payload with items array', async () => {
    vi.mocked(http.get).mockResolvedValueOnce({
      data: {
        items: [
          {
            id: 1,
            name: 'Alice',
            email: 'alice@example.com',
            role: 'Admin',
            status: 'Active',
            created_at: '2026-01-01T00:00:00.000Z',
            updated_at: '2026-01-01T00:00:00.000Z'
          }
        ],
        total: 1
      },
      headers: {}
    } as never);

    const result = await fetchUsersService({
      page: 0,
      size: 10,
      search: '',
      searchField: 'all',
      sortField: 'id',
      sortOrder: -1
    });

    expect(Array.isArray(result.items)).toBe(true);
    expect(result.items).toHaveLength(1);
    expect(result.total).toBe(1);
  });

  it('normalizes object payload with data array', async () => {
    vi.mocked(http.get).mockResolvedValueOnce({
      data: {
        data: [
          {
            id: 2,
            name: 'Brian',
            email: 'brian@example.com',
            role: 'Manager',
            status: 'Invited',
            created_at: '2026-01-02T00:00:00.000Z',
            updated_at: '2026-01-02T00:00:00.000Z'
          }
        ],
        total: 1
      },
      headers: {}
    } as never);

    const result = await fetchUsersService({
      page: 0,
      size: 10,
      search: '',
      searchField: 'all',
      sortField: 'id',
      sortOrder: -1
    });

    expect(Array.isArray(result.items)).toBe(true);
    expect(result.items).toHaveLength(1);
    expect(result.total).toBe(1);
  });
});
