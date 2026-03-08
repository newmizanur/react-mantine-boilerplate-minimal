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
  const columns: { field: SortableField; label: string }[] = [
    { field: 'name', label: 'Name' },
    { field: 'email', label: 'Email' },
    { field: 'role', label: 'Role' },
    { field: 'status', label: 'Status' },
    { field: 'created_at', label: 'Created' },
    { field: 'updated_at', label: 'Updated' }
  ];

  return (
    <Table.ScrollContainer minWidth={1100} type="native">
      <Table withTableBorder striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>
              <Checkbox checked={allVisibleSelected} indeterminate={someVisibleSelected} onChange={(event) => onToggleAll(event.currentTarget.checked)} />
            </Table.Th>
            {columns.map(({ field, label }) => (
              <Table.Th key={field}>
                <Button variant="subtle" size="compact-xs" onClick={() => onToggleSort(field)}>
                  {label} {sortSymbol(field, sortField, sortOrder)}
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
