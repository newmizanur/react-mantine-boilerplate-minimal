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
