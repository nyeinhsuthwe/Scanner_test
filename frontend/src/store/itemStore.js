import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useItemStore = create(
  persist(
    (set) => ({
      createdItems: [],
      addCreatedItem: (item) =>
        set((state) => ({
          createdItems: [item, ...state.createdItems.filter((existing) => existing.code !== item.code)]
        })),
      clearCreatedItems: () => set({ createdItems: [] })
    }),
    {
      name: 'scanner-created-items'
    }
  )
);
