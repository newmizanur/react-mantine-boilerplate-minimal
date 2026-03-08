import { create } from 'zustand';
import {
  createOrUpdateUserService,
  deleteUserService,
  deleteUsersService,
  fetchUsersService
} from '@/services/users.service';
import type { User, UserId, UserInput } from '@/types/user';

type UsersState = {
  users: User[];
  total: number;
  page_size: number;
  current_page: number;
  search: string;
  searchField: 'all' | 'name' | 'email' | 'role';
  sortField: keyof User;
  sortOrder: -1 | 1;
  loading: boolean;
  error: string | null;
  fetchUsers: (page?: number, size?: number) => Promise<void>;
  createOrUpdateUser: (userData: UserInput) => Promise<string | null>;
  deleteUser: (id: UserId) => Promise<string | null>;
  deleteUsers: (ids: UserId[]) => Promise<string | null>;
  setSearch: (value: string) => void;
  setSearchField: (value: 'all' | 'name' | 'email' | 'role') => void;
  setSort: (field: keyof User, order: -1 | 1) => void;
  setPageSize: (size: number) => void;
};

export const useUsersStore = create<UsersState>((set, get) => ({
  users: [],
  total: 0,
  page_size: 10,
  current_page: 0,
  search: '',
  searchField: 'all',
  sortField: 'id',
  sortOrder: -1,
  loading: false,
  error: null,

  setSearch: (value) => set({ search: value }),
  setSearchField: (value) => set({ searchField: value }),
  setSort: (field, order) => set({ sortField: field, sortOrder: order }),
  setPageSize: (size) => set({ page_size: size }),

  async fetchUsers(page = get().current_page, size = get().page_size) {
    try {
      set({ loading: true });
      const { items, total } = await fetchUsersService({
        page,
        size,
        search: get().search,
        searchField: get().searchField,
        sortField: get().sortField,
        sortOrder: get().sortOrder
      });

      set({ users: Array.isArray(items) ? items : [], total, current_page: page, page_size: size, error: null, loading: false });
    } catch (error) {
      console.error('Error fetching users:', error);
      set({ users: [], total: 0, error: 'Failed to load users. Make sure mock API is running on port 3001.', loading: false });
    }
  },

  async createOrUpdateUser(userData) {
    try {
      await createOrUpdateUserService(userData);
      await get().fetchUsers(get().current_page, get().page_size);
    } catch (error) {
      console.error('Error saving user:', error);
      const message =
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
          ? (error as { response?: { data?: { message?: string } } }).response!.data!.message!
          : 'Failed to save user.';
      return message;
    }
    return null;
  },

  async deleteUser(id) {
    try {
      await deleteUserService(id);
      await get().fetchUsers(get().current_page, get().page_size);
    } catch (error) {
      console.error('Error deleting user:', error);
      return 'Failed to delete user.';
    }
    return null;
  },

  async deleteUsers(ids) {
    try {
      await deleteUsersService(ids);
      await get().fetchUsers(get().current_page, get().page_size);
    } catch (error) {
      console.error('Error deleting users:', error);
      return 'Failed to delete users.';
    }
    return null;
  }
}));
