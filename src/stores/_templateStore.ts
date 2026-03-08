import { create } from 'zustand';

type TemplateState = {
  value: string;
  setValue: (value: string) => void;
};

export const useTemplateStore = create<TemplateState>((set) => ({
  value: '',
  setValue: (value) => set({ value })
}));
