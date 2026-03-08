import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LoginInput } from '@/schemas/auth.schema';
import { loginService, registerService } from '@/services/auth.service';

type AuthState = {
  token: string | null;
  name: string | null;
  ready: boolean;
  authenticated: boolean;
  login: (email: string, password: string) => Promise<string>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      name: null,
      ready: true,
      authenticated: false,
      async login(email: string, password: string) {
        const payload: LoginInput = { email, password };
        const response = await loginService(payload);
        set({ token: response.token, name: response.name, authenticated: true });
        return response.token;
      },
      async register(email: string, password: string, name: string) {
        const response = await registerService({ email, password, name });
        set({ token: response.token, name: response.name, authenticated: true });
      },
      logout() {
        set({ token: null, name: null, authenticated: false });
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, name: state.name, authenticated: state.authenticated })
    }
  )
);
