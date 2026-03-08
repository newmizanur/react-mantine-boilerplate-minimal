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
