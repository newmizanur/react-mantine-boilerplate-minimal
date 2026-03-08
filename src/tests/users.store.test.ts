import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useUsersStore } from '@/stores';

vi.mock('@/services/users.service', () => ({
  fetchUsersService: vi.fn().mockResolvedValue({
    items: [
      {
        id: 1,
        name: 'A',
        email: 'a@example.com',
        role: 'Admin',
        status: 'Active',
        created_at: '2026-01-01T00:00:00.000Z',
        updated_at: '2026-01-01T00:00:00.000Z'
      }
    ],
    total: 1
  }),
  createOrUpdateUserService: vi.fn().mockResolvedValue(undefined),
  deleteUserService: vi.fn().mockResolvedValue(undefined),
  deleteUsersService: vi.fn().mockResolvedValue(undefined)
}));

describe('users store', () => {
  beforeEach(() => {
    useUsersStore.setState({
      users: [],
      total: 0,
      page_size: 10,
      current_page: 0,
      search: '',
      searchField: 'all',
      sortField: 'id',
      sortOrder: -1
    });
  });

  it('updates search value', () => {
    useUsersStore.getState().setSearch('alice');
    expect(useUsersStore.getState().search).toBe('alice');
  });

  it('fetches users and updates state', async () => {
    await useUsersStore.getState().fetchUsers(0, 10);
    expect(useUsersStore.getState().users).toHaveLength(1);
    expect(useUsersStore.getState().total).toBe(1);
  });
});
