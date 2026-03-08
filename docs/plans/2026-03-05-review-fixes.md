# Review Fixes Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix the token bug, upgrade Mantine component usage (custom theme, Select, LoadingOverlay, SegmentedControl), add lazy route loading, add Zod validation in the service layer, and break UsersPage into smaller components.

**Architecture:** Fix the auth token mismatch between Zustand persist and Axios interceptor. Enhance MantineProvider with a custom theme. Replace NativeSelect with richer Mantine alternatives throughout. Decompose the monolithic UsersPage into focused sub-components. Add route-level code splitting via TanStack Router lazy(). Validate API responses with Zod in the service layer.

**Tech Stack:** React 18, Mantine 7, TanStack Router, Zustand 5, Zod, Axios, Vitest

---

### Task 1: Fix token key mismatch between Zustand persist and Axios interceptor

**Files:**
- Modify: `src/services/http.ts`

**Context:** Zustand persist stores auth under key `auth-storage` as a JSON blob `{ state: { token, name, authenticated }, version: 0 }`. But the Axios interceptor reads `localStorage.getItem('auth_token')` which is a completely different key that never gets set. The interceptor will never attach a token to requests.

**Step 1: Fix the interceptor to read from the Zustand persist key**

In `src/services/http.ts`, replace the interceptor to read from the Zustand store directly instead of a raw localStorage key:

```ts
import axios from 'axios';
import { useAuthStore } from '@/stores';

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json'
  }
});

http.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**Step 2: Run existing tests to verify nothing breaks**

Run: `cd /home/dev/workspace/playground/mantine-boilerplate && npx vitest run`
Expected: All existing tests pass.

**Step 3: Commit**

```bash
git add src/services/http.ts
git commit -m "fix: read auth token from Zustand store instead of wrong localStorage key"
```

---

### Task 2: Add custom Mantine theme

**Files:**
- Create: `src/theme.ts`
- Modify: `src/providers/AppProviders.tsx`

**Step 1: Create the theme file**

Create `src/theme.ts`:

```ts
import { createTheme } from '@mantine/core';

export const theme = createTheme({
  primaryColor: 'blue',
  defaultRadius: 'sm',
  fontFamily: "'DM Sans', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  headings: {
    fontFamily: "'DM Sans', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  }
});
```

**Step 2: Wire theme into MantineProvider**

In `src/providers/AppProviders.tsx`, import the theme and pass it:

```tsx
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import type { ReactNode } from 'react';
import { theme } from '@/theme';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <MantineProvider defaultColorScheme="light" theme={theme}>
      <ModalsProvider>
        <Notifications position="top-right" />
        {children}
      </ModalsProvider>
    </MantineProvider>
  );
}
```

**Step 3: Remove duplicate font-family from styles.css**

In `src/styles.css`, remove the `:root { font-family: ... }` block since the theme now handles it. Keep just the reset:

```css
html,
body,
#root {
  height: 100%;
  margin: 0;
}
```

**Step 4: Run typecheck and tests**

Run: `cd /home/dev/workspace/playground/mantine-boilerplate && npx tsc --noEmit -p tsconfig.app.json && npx vitest run`
Expected: No type errors, all tests pass.

**Step 5: Commit**

```bash
git add src/theme.ts src/providers/AppProviders.tsx src/styles.css
git commit -m "feat: add custom Mantine theme with font and radius defaults"
```

---

### Task 3: Replace NativeSelect with Select and SegmentedControl

**Files:**
- Modify: `src/pages/UsersPage.tsx`

**Context:** Three `NativeSelect` usages in UsersPage:
1. Search field selector (all/name/email/role) → replace with `SegmentedControl`
2. Role selector in user form modal → replace with `Select`
3. Status selector in user form modal → replace with `Select`
4. Page size selector (5/10/25) → replace with `Select`

**Step 1: Update imports**

Replace `NativeSelect` import with `Select` and `SegmentedControl`:

```ts
import {
  ActionIcon,
  Alert,
  Badge,
  Button,
  Card,
  Center,
  Checkbox,
  Group,
  LoadingOverlay,
  Modal,
  Pagination,
  SegmentedControl,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  Title
} from '@mantine/core';
```

**Step 2: Replace search field NativeSelect with SegmentedControl**

Replace the search field `NativeSelect` (around line 265-274) with:

```tsx
<SegmentedControl
  value={searchField}
  onChange={(value) => setSearchField(value as SearchFieldOption)}
  data={[
    { value: 'all', label: 'All' },
    { value: 'name', label: 'Name' },
    { value: 'email', label: 'Email' },
    { value: 'role', label: 'Role' }
  ]}
/>
```

**Step 3: Replace Role NativeSelect with Select in user form modal**

Replace the role `NativeSelect` (around line 397-403) with:

```tsx
<Select
  label="Role"
  withAsterisk
  data={roleOptions as unknown as string[]}
  value={form.values.role}
  onChange={(value) => form.setFieldValue('role', (value ?? 'Admin') as UserInputSchema['role'])}
  error={form.errors.role}
  allowDeselect={false}
/>
```

**Step 4: Replace Status NativeSelect with Select in user form modal**

Replace the status `NativeSelect` (around line 405-412) with:

```tsx
<Select
  label="Status"
  withAsterisk
  data={statusOptions as unknown as string[]}
  value={form.values.status}
  onChange={(value) => form.setFieldValue('status', (value ?? 'Active') as UserInputSchema['status'])}
  error={form.errors.status}
  allowDeselect={false}
/>
```

**Step 5: Replace page size NativeSelect with Select**

Replace the page size `NativeSelect` (around line 378-386) with:

```tsx
<Select
  value={String(store.page_size)}
  onChange={(value) => onChangePageSize(Number(value))}
  data={[
    { value: '5', label: '5 / page' },
    { value: '10', label: '10 / page' },
    { value: '25', label: '25 / page' }
  ]}
  allowDeselect={false}
  w={110}
/>
```

**Step 6: Run typecheck and tests**

Run: `cd /home/dev/workspace/playground/mantine-boilerplate && npx tsc --noEmit -p tsconfig.app.json && npx vitest run`
Expected: No type errors, all tests pass.

**Step 7: Commit**

```bash
git add src/pages/UsersPage.tsx
git commit -m "feat: replace NativeSelect with Select and SegmentedControl for richer UX"
```

---

### Task 4: Add LoadingOverlay to UsersPage table

**Files:**
- Modify: `src/pages/UsersPage.tsx`

**Context:** The UsersPage sets `loading` state but just shows a "Loading users..." text row. Mantine's `LoadingOverlay` provides a proper visual overlay over the table card.

**Step 1: Add LoadingOverlay import**

`LoadingOverlay` should already be imported from Task 3's import update. If not, add it.

**Step 2: Wrap the Card with position relative and add LoadingOverlay**

Add `pos="relative"` to the Card, and add `<LoadingOverlay visible={store.loading} />` as first child of the Card:

```tsx
<Card withBorder pos="relative">
  <LoadingOverlay visible={store.loading} />
  <Stack>
    ...
  </Stack>
</Card>
```

**Step 3: Remove the "Loading users..." table row**

Remove the loading text row from the table body (lines 320-328 approximately):

```tsx
{store.loading ? (
  <Table.Tr>
    <Table.Td colSpan={8}>
      <Center py="md">
        <Text c="dimmed">Loading users...</Text>
      </Center>
    </Table.Td>
  </Table.Tr>
) : null}
```

Also remove the `!store.loading &&` guard from the "No users found" row and the users map — now that there's a visual overlay, the empty state can show underneath.

**Step 4: Run typecheck**

Run: `cd /home/dev/workspace/playground/mantine-boilerplate && npx tsc --noEmit -p tsconfig.app.json`
Expected: No type errors.

**Step 5: Commit**

```bash
git add src/pages/UsersPage.tsx
git commit -m "feat: add LoadingOverlay to users table for proper loading state"
```

---

### Task 5: Break UsersPage into sub-components

**Files:**
- Create: `src/components/users/UserTable.tsx`
- Create: `src/components/users/UserToolbar.tsx`
- Create: `src/components/users/UserSearchBar.tsx`
- Create: `src/components/users/UserFormModal.tsx`
- Modify: `src/pages/UsersPage.tsx`

**Context:** UsersPage is ~425 lines handling table, search, toolbar, and form modal. Extract into focused components. The page becomes an orchestrator that passes props.

**Step 1: Create UserToolbar component**

Create `src/components/users/UserToolbar.tsx`:

```tsx
import { Button, Group } from '@mantine/core';

type UserToolbarProps = {
  onNew: () => void;
  onDeleteSelected: () => void;
  onExport: () => void;
  hasSelection: boolean;
};

export function UserToolbar({ onNew, onDeleteSelected, onExport, hasSelection }: UserToolbarProps) {
  return (
    <Group justify="space-between">
      <Group>
        <Button onClick={onNew}>New</Button>
        <Button color="red" variant="light" onClick={onDeleteSelected} disabled={!hasSelection}>
          Delete
        </Button>
      </Group>
      <Button variant="light" onClick={onExport}>
        Export
      </Button>
    </Group>
  );
}
```

**Step 2: Create UserSearchBar component**

Create `src/components/users/UserSearchBar.tsx`:

```tsx
import { Group, SegmentedControl, TextInput, Title } from '@mantine/core';

type SearchFieldOption = 'all' | 'name' | 'email' | 'role';

type UserSearchBarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  searchField: SearchFieldOption;
  onSearchFieldChange: (value: SearchFieldOption) => void;
};

export function UserSearchBar({ search, onSearchChange, searchField, onSearchFieldChange }: UserSearchBarProps) {
  return (
    <Group justify="space-between" align="end">
      <Title order={4} m={0}>
        Manage Users
      </Title>
      <Group>
        <SegmentedControl
          value={searchField}
          onChange={(value) => onSearchFieldChange(value as SearchFieldOption)}
          data={[
            { value: 'all', label: 'All' },
            { value: 'name', label: 'Name' },
            { value: 'email', label: 'Email' },
            { value: 'role', label: 'Role' }
          ]}
        />
        <TextInput value={search} onChange={(event) => onSearchChange(event.currentTarget.value)} placeholder="Search..." />
      </Group>
    </Group>
  );
}
```

**Step 3: Create UserTable component**

Create `src/components/users/UserTable.tsx`:

```tsx
import { ActionIcon, Badge, Button, Center, Checkbox, Group, Table, Text } from '@mantine/core';
import type { User, UserId } from '@/types/user';

type SortableField = 'name' | 'email' | 'role' | 'status' | 'created_at' | 'updated_at';

function sortSymbol(field: SortableField, currentField: keyof User, currentOrder: -1 | 1) {
  if (currentField !== field) return '↕';
  return currentOrder === -1 ? '↓' : '↑';
}

function statusColor(status: User['status']) {
  if (status === 'Active') return 'green';
  if (status === 'Invited') return 'blue';
  return 'red';
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString();
}

type UserTableProps = {
  users: User[];
  selectedIds: UserId[];
  allVisibleSelected: boolean;
  someVisibleSelected: boolean;
  sortField: keyof User;
  sortOrder: -1 | 1;
  onToggleSort: (field: SortableField) => void;
  onToggleAll: (checked: boolean) => void;
  onToggleOne: (id: UserId, checked: boolean) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
};

export function UserTable({
  users,
  selectedIds,
  allVisibleSelected,
  someVisibleSelected,
  sortField,
  sortOrder,
  onToggleSort,
  onToggleAll,
  onToggleOne,
  onEdit,
  onDelete
}: UserTableProps) {
  return (
    <Table.ScrollContainer minWidth={1100} type="native">
      <Table withTableBorder striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>
              <Checkbox checked={allVisibleSelected} indeterminate={someVisibleSelected} onChange={(event) => onToggleAll(event.currentTarget.checked)} />
            </Table.Th>
            {(['name', 'email', 'role', 'status', 'created_at', 'updated_at'] as const).map((field) => (
              <Table.Th key={field}>
                <Button variant="subtle" size="compact-xs" onClick={() => onToggleSort(field)}>
                  {field === 'created_at' ? 'Created' : field === 'updated_at' ? 'Updated' : field.charAt(0).toUpperCase() + field.slice(1)} {sortSymbol(field, sortField, sortOrder)}
                </Button>
              </Table.Th>
            ))}
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {users.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={8}>
                <Center py="md">
                  <Text c="dimmed">No users found.</Text>
                </Center>
              </Table.Td>
            </Table.Tr>
          ) : null}
          {users.map((user) => (
            <Table.Tr key={user.id}>
              <Table.Td>
                <Checkbox checked={selectedIds.includes(user.id)} onChange={(event) => onToggleOne(user.id, event.currentTarget.checked)} />
              </Table.Td>
              <Table.Td>{user.name}</Table.Td>
              <Table.Td>{user.email}</Table.Td>
              <Table.Td>{user.role}</Table.Td>
              <Table.Td>
                <Badge color={statusColor(user.status)} variant="light">
                  {user.status}
                </Badge>
              </Table.Td>
              <Table.Td>{formatDateTime(user.created_at)}</Table.Td>
              <Table.Td>{formatDateTime(user.updated_at)}</Table.Td>
              <Table.Td>
                <Group gap="xs">
                  <ActionIcon variant="light" onClick={() => onEdit(user)} aria-label="Edit user">
                    ✎
                  </ActionIcon>
                  <ActionIcon color="red" variant="light" onClick={() => onDelete(user)} aria-label="Delete user">
                    🗑
                  </ActionIcon>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}
```

**Step 4: Create UserFormModal component**

Create `src/components/users/UserFormModal.tsx`:

```tsx
import { Button, Group, Modal, Select, Stack, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useEffect, useState } from 'react';
import { userSchema, type UserInputSchema } from '@/schemas/user.schema';
import type { User } from '@/types/user';

const roleOptions = ['Admin', 'Manager', 'Viewer'];
const statusOptions = ['Active', 'Invited', 'Disabled'];

type UserFormModalProps = {
  opened: boolean;
  user: User | null;
  onClose: () => void;
  onSave: (values: UserInputSchema) => Promise<void>;
};

export function UserFormModal({ opened, user, onClose, onSave }: UserFormModalProps) {
  const [saving, setSaving] = useState(false);

  const form = useForm<UserInputSchema>({
    mode: 'controlled',
    initialValues: {
      name: '',
      email: '',
      role: 'Admin',
      status: 'Active'
    },
    validate: zodResolver(userSchema)
  });

  useEffect(() => {
    if (opened) {
      if (user) {
        form.setValues({ name: user.name, email: user.email, role: user.role, status: user.status });
      } else {
        form.setValues({ name: '', email: '', role: 'Admin', status: 'Active' });
      }
      form.resetDirty();
      form.clearErrors();
    }
  }, [opened, user]);

  async function handleSubmit(values: UserInputSchema) {
    setSaving(true);
    await onSave(values);
    setSaving(false);
  }

  return (
    <Modal opened={opened} onClose={onClose} title="User Details" centered>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput label="Name" withAsterisk {...form.getInputProps('name')} />
          <TextInput label="Email" withAsterisk {...form.getInputProps('email')} />
          <Select
            label="Role"
            withAsterisk
            data={roleOptions}
            value={form.values.role}
            onChange={(value) => form.setFieldValue('role', (value ?? 'Admin') as UserInputSchema['role'])}
            error={form.errors.role}
            allowDeselect={false}
          />
          <Select
            label="Status"
            withAsterisk
            data={statusOptions}
            value={form.values.status}
            onChange={(value) => form.setFieldValue('status', (value ?? 'Active') as UserInputSchema['status'])}
            error={form.errors.status}
            allowDeselect={false}
          />
          <Group justify="flex-end">
            <Button variant="default" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              Save
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
```

**Step 5: Rewrite UsersPage as orchestrator**

Rewrite `src/pages/UsersPage.tsx` to import and compose the sub-components. The page keeps the state management, store interaction, notification logic, and CSV export — sub-components are purely presentational.

```tsx
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
```

**Step 6: Run typecheck and tests**

Run: `cd /home/dev/workspace/playground/mantine-boilerplate && npx tsc --noEmit -p tsconfig.app.json && npx vitest run`
Expected: No type errors, all tests pass.

**Step 7: Commit**

```bash
git add src/components/users/ src/pages/UsersPage.tsx
git commit -m "refactor: extract UserTable, UserToolbar, UserSearchBar, UserFormModal from UsersPage"
```

---

### Task 6: Add lazy route loading

**Files:**
- Modify: `src/router/index.tsx`

**Context:** All page components are eagerly imported. TanStack Router supports `lazy()` for code splitting. Convert each route's `component` to use dynamic imports.

**Step 1: Convert to lazy routes**

Rewrite `src/router/index.tsx`:

```tsx
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  lazyRouteComponent,
  redirect
} from '@tanstack/react-router';
import { AppLayout } from '@/layouts/AppLayout';
import { useAuthStore } from '@/stores';

const rootRoute = createRootRoute({ component: () => <Outlet /> });

const protectedLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'protected',
  beforeLoad: () => {
    const authenticated = useAuthStore.getState().authenticated;
    if (!authenticated) {
      throw redirect({ to: '/login' });
    }
  },
  component: AppLayout
});

const usersRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/users',
  component: lazyRouteComponent(() => import('@/pages/UsersPage').then((m) => ({ default: m.UsersPage })))
});

const emptyRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/empty',
  component: lazyRouteComponent(() => import('@/pages/EmptyPage').then((m) => ({ default: m.EmptyPage })))
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/users' });
  }
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: lazyRouteComponent(() => import('@/pages/auth/LoginPage').then((m) => ({ default: m.LoginPage })))
});

const accessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/access',
  component: lazyRouteComponent(() => import('@/pages/auth/AccessPage').then((m) => ({ default: m.AccessPage })))
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: lazyRouteComponent(() => import('@/pages/auth/RegisterPage').then((m) => ({ default: m.RegisterPage })))
});

const errorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/error',
  component: lazyRouteComponent(() => import('@/pages/auth/ErrorPage').then((m) => ({ default: m.ErrorPage })))
});

const notFoundRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/not-found',
  component: lazyRouteComponent(() => import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })))
});

const routeTree = rootRoute.addChildren([
  protectedLayoutRoute.addChildren([usersRoute, emptyRoute, notFoundRoute]),
  homeRoute,
  loginRoute,
  registerRoute,
  accessRoute,
  errorRoute
]);

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent'
});

export function AppRouter() {
  return <RouterProvider router={router} />;
}

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
```

Note: `defaultNotFoundComponent: NotFoundPage` is removed since `NotFoundPage` is no longer eagerly imported. The `/not-found` route handles it via the route tree.

**Step 2: Run typecheck and build**

Run: `cd /home/dev/workspace/playground/mantine-boilerplate && npx tsc --noEmit -p tsconfig.app.json && npx vitest run`
Expected: No type errors, all tests pass.

**Step 3: Commit**

```bash
git add src/router/index.tsx
git commit -m "feat: add lazy route loading for code splitting"
```

---

### Task 7: Validate API responses with Zod in the service layer

**Files:**
- Modify: `src/schemas/user.schema.ts`
- Modify: `src/services/users.service.ts`

**Context:** The service layer receives API data with `as User[]` type assertions but no runtime validation. Add Zod parsing to catch API contract violations.

**Step 1: Add a full user response schema**

In `src/schemas/user.schema.ts`, add a schema for the full User object (with id, timestamps):

```ts
import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  role: z.enum(['Admin', 'Manager', 'Viewer']),
  status: z.enum(['Active', 'Invited', 'Disabled'])
});

export type UserInputSchema = z.infer<typeof userSchema>;

export const userResponseSchema = userSchema.extend({
  id: z.union([z.string(), z.number()]),
  created_at: z.string(),
  updated_at: z.string()
});
```

**Step 2: Use the schema in extractUsers**

In `src/services/users.service.ts`, import `userResponseSchema` and validate:

Replace the `extractUsers` function:

```ts
import { userResponseSchema } from '@/schemas/user.schema';

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
```

This silently filters out invalid records instead of crashing. In production, you'd likely want to log a warning for failed validations.

**Step 3: Run existing tests to verify normalization still works**

Run: `cd /home/dev/workspace/playground/mantine-boilerplate && npx vitest run`
Expected: All tests pass (the mock data in tests matches the schema).

**Step 4: Commit**

```bash
git add src/schemas/user.schema.ts src/services/users.service.ts
git commit -m "feat: validate API user responses with Zod in service layer"
```

---

## Summary of Tasks

| # | Category | Description |
|---|----------|-------------|
| 1 | Bug | Fix token key mismatch in Axios interceptor |
| 2 | High | Add custom Mantine theme |
| 3 | High | Replace NativeSelect with Select and SegmentedControl |
| 4 | High | Add LoadingOverlay to UsersPage |
| 5 | Medium | Break UsersPage into sub-components |
| 6 | Medium | Add lazy route loading |
| 7 | Medium | Validate API responses with Zod |
