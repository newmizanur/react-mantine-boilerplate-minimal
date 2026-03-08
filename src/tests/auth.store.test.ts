import { beforeEach, describe, expect, it } from 'vitest';
import { useAuthStore } from '@/stores';

describe('auth store', () => {
  beforeEach(() => {
    useAuthStore.setState({ token: null, name: null, authenticated: false, ready: true });
  });

  it('logs in and sets authenticated state', async () => {
    await useAuthStore.getState().login('user@example.com', 'password1');
    const state = useAuthStore.getState();
    expect(state.authenticated).toBe(true);
    expect(state.token).toBeTruthy();
    expect(state.name).toBe('user');
  });

  it('clears auth state on logout', () => {
    useAuthStore.setState({ token: 'abc', name: 'john', authenticated: true, ready: true });
    useAuthStore.getState().logout();
    const state = useAuthStore.getState();
    expect(state.authenticated).toBe(false);
    expect(state.token).toBeNull();
  });

  it('registers and sets authenticated state', async () => {
    await useAuthStore.getState().register('new@example.com', 'password1', 'new-user');
    const state = useAuthStore.getState();
    expect(state.authenticated).toBe(true);
    expect(state.token).toBeTruthy();
    expect(state.name).toBe('new-user');
  });
});
