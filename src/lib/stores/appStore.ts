import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState } from '../types';

interface AppStoreState extends AppState {
  // Actions
  setCurrentCanvas: (canvasId: string) => void;
  setUser: (user: AppState['user']) => void;
  setDateRange: (start: string, end: string) => void;
  setTheme: (theme: AppState['preferences']['theme']) => void;
  clearCurrentCanvas: () => void;
}

export const useAppStore = create<AppStoreState>()(
  persist(
    (set) => ({
      // Initial state
      currentCanvasId: undefined,
      user: undefined,
      preferences: {
        dateRange: {
          start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
          end: new Date().toISOString().split('T')[0], // today
        },
        theme: 'system',
      },

      // Actions
      setCurrentCanvas: (canvasId: string) =>
        set({ currentCanvasId: canvasId }),

      setUser: (user: AppState['user']) =>
        set({ user }),

      setDateRange: (start: string, end: string) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            dateRange: { start, end },
          },
        })),

      setTheme: (theme: AppState['preferences']['theme']) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            theme,
          },
        })),

      clearCurrentCanvas: () =>
        set({ currentCanvasId: undefined }),
    }),
    {
      name: 'metrimap-app-store',
      partialize: (state) => ({
        preferences: state.preferences,
        user: state.user,
      }),
    }
  )
);