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
