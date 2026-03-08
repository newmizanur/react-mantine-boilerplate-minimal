import { Alert, Card, Group, LoadingOverlay, Pagination, Select, Stack, Text } from '@mantine/core';
import { useDebouncedValue, useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { useEffect, useMemo, useRef, useState } from 'react';
import { UserFormModal } from '@/components/users/UserFormModal';
import { UserSearchBar } from '@/components/users/UserSearchBar';
import { UserTable } from '@/components/users/UserTable';
import { UserToolbar } from '@/components/users/UserToolbar';
import type { UserInputSchema } from '@/schemas/user.schema';
import { useUsersStore } from '@/stores';
import type { User, UserId } from '@/types/user';

type SearchFieldOption = 'all' | 'name' | 'email' | 'role';
type SortableField = 'name' | 'email' | 'role' | 'status' | 'created_at' | 'updated_at';

function downloadCsv(rows: User[]) {
  const header = ['id', 'name', 'email', 'role', 'status', 'created_at', 'updated_at'];
  const lines = rows.map((row) =>
    [row.id, row.name, row.email, row.role, row.status, row.created_at, row.updated_at]
      .map((value) => `"${String(value).replace(/\"/g, '""')}"`)
      .join(',')
  );
  const csv = [header.join(','), ...lines].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'users.csv';
  anchor.click();
  URL.revokeObjectURL(url);
}

export function UsersPage() {
  const store = useUsersStore();
  const [selectedIds, setSelectedIds] = useState<UserId[]>([]);
  const [userDialogOpened, userDialogHandlers] = useDisclosure(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [search, setSearch] = useState(store.search);
  const [debouncedSearch] = useDebouncedValue(search, 300);
  const [searchField, setSearchField] = useState<SearchFieldOption>(store.searchField);
  const didInitSearchEffect = useRef(false);

  const allVisibleSelected = useMemo(() => {
    if (!store.users.length) return false;
    return store.users.every((user) => selectedIds.includes(user.id));
  }, [store.users, selectedIds]);

  const someVisibleSelected = useMemo(() => {
    return store.users.some((user) => selectedIds.includes(user.id)) && !allVisibleSelected;
  }, [store.users, selectedIds, allVisibleSelected]);

  useEffect(() => {
    void store.fetchUsers(0, store.page_size);
  }, []);

  useEffect(() => {
    if (!didInitSearchEffect.current) {
      didInitSearchEffect.current = true;
      return;
    }
    store.setSearch(debouncedSearch.trim());
    store.setSearchField(searchField);
    void store.fetchUsers(0, store.page_size);
  }, [debouncedSearch, searchField]);

  function openNew() {
    setCurrentUser(null);
    userDialogHandlers.open();
  }

  function editUser(user: User) {
    setCurrentUser(user);
    userDialogHandlers.open();
  }

  function toggleSort(field: SortableField) {
    const nextOrder: -1 | 1 = store.sortField === field ? (store.sortOrder === -1 ? 1 : -1) : 1;
    store.setSort(field, nextOrder);
    void store.fetchUsers(0, store.page_size);
  }

  async function saveUser(values: UserInputSchema) {
    const payload = currentUser ? { id: currentUser.id, ...values } : values;
    const errorMessage = await store.createOrUpdateUser(payload);
    if (errorMessage) {
      notifications.show({ color: 'red', message: errorMessage });
      return;
    }
    notifications.show({ color: 'green', message: 'User saved' });
    userDialogHandlers.close();
    setCurrentUser(null);
  }

  async function onDeleteUser(user: User) {
    const errorMessage = await store.deleteUser(user.id);
    if (errorMessage) {
      notifications.show({ color: 'red', message: errorMessage });
      return;
    }
    notifications.show({ color: 'green', message: 'User deleted' });
    setCurrentUser(null);
    setSelectedIds((prev) => prev.filter((id) => id !== user.id));
  }

  async function onDeleteSelectedUsers(ids: UserId[]) {
    if (!ids.length) return;
    const errorMessage = await store.deleteUsers(ids);
    if (errorMessage) {
      notifications.show({ color: 'red', message: errorMessage });
      return;
    }
    notifications.show({ color: 'green', message: 'Users deleted' });
    setSelectedIds([]);
  }

  function confirmDeleteUser(user: User) {
    modals.openConfirmModal({
      title: 'Confirm',
      children: <Text>Are you sure you want to delete <b>{user.name}</b>?</Text>,
      labels: { confirm: 'Yes', cancel: 'No' },
      confirmProps: { color: 'red' },
      onConfirm: () => { void onDeleteUser(user); }
    });
  }

  function confirmDeleteSelectedUsers() {
    modals.openConfirmModal({
      title: 'Confirm',
      children: <Text>Are you sure you want to delete the selected users?</Text>,
      labels: { confirm: 'Yes', cancel: 'No' },
      confirmProps: { color: 'red' },
      onConfirm: () => { void onDeleteSelectedUsers(selectedIds); }
    });
  }

  function toggleAllVisible(checked: boolean) {
    if (checked) {
      const merged = new Set([...selectedIds, ...store.users.map((user) => user.id)]);
      setSelectedIds(Array.from(merged));
      return;
    }
    const visibleIds = new Set(store.users.map((user) => user.id));
    setSelectedIds((prev) => prev.filter((id) => !visibleIds.has(id)));
  }

  function toggleOne(id: UserId, checked: boolean) {
    if (checked) {
      setSelectedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
      return;
    }
    setSelectedIds((prev) => prev.filter((item) => item !== id));
  }

  const first = store.total === 0 ? 0 : store.current_page * store.page_size + 1;
  const last = Math.min(store.total, (store.current_page + 1) * store.page_size);
  const pageCount = Math.max(1, Math.ceil(store.total / store.page_size));

  return (
    <Stack>
      {store.error ? <Alert color="red">{store.error}</Alert> : null}
      <Card withBorder pos="relative">
        <LoadingOverlay visible={store.loading} />
        <Stack>
          <UserToolbar
            onNew={openNew}
            onDeleteSelected={confirmDeleteSelectedUsers}
            onExport={() => downloadCsv(store.users)}
            hasSelection={selectedIds.length > 0}
          />
          <UserSearchBar
            search={search}
            onSearchChange={setSearch}
            searchField={searchField}
            onSearchFieldChange={setSearchField}
          />
          <UserTable
            users={store.users}
            selectedIds={selectedIds}
            allVisibleSelected={allVisibleSelected}
            someVisibleSelected={someVisibleSelected}
            sortField={store.sortField}
            sortOrder={store.sortOrder}
            onToggleSort={toggleSort}
            onToggleAll={toggleAllVisible}
            onToggleOne={toggleOne}
            onEdit={editUser}
            onDelete={confirmDeleteUser}
          />
          <Group justify="space-between">
            <Text c="dimmed">Showing {first} to {last} of {store.total} users</Text>
            <Group>
              <Pagination value={store.current_page + 1} onChange={(page) => void store.fetchUsers(page - 1, store.page_size)} total={pageCount} />
              <Select
                value={String(store.page_size)}
                onChange={(value) => { store.setPageSize(Number(value)); void store.fetchUsers(0, Number(value)); }}
                data={[
                  { value: '5', label: '5 / page' },
                  { value: '10', label: '10 / page' },
                  { value: '25', label: '25 / page' }
                ]}
                allowDeselect={false}
                w={110}
              />
            </Group>
          </Group>
        </Stack>
      </Card>
      <UserFormModal
        opened={userDialogOpened}
        user={currentUser}
        onClose={userDialogHandlers.close}
        onSave={saveUser}
      />
    </Stack>
  );
}
