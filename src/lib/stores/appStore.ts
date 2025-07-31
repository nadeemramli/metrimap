import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState } from '../types';
import { supabase } from '../supabase/client';

interface AppStoreState extends AppState {
  // Auth state
  isAuthLoading: boolean;
  isInitialized: boolean;
  
  // Actions
  setCurrentCanvas: (canvasId: string) => void;
  setUser: (user: AppState['user']) => void;
  setDateRange: (start: string, end: string) => void;
  setTheme: (theme: AppState['preferences']['theme']) => void;
  clearCurrentCanvas: () => void;
  signOut: () => Promise<void>;
  initializeAuth: () => Promise<void>;
}

export const useAppStore = create<AppStoreState>()(
  persist(
    (set) => ({
      // Initial state
      currentCanvasId: undefined,
      user: undefined,
      isAuthLoading: true,
      isInitialized: false,
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

      signOut: async () => {
        try {
          await supabase.auth.signOut();
          set({ 
            user: undefined, 
            currentCanvasId: undefined 
          });
        } catch (error) {
          console.error('Error signing out:', error);
        }
      },

      initializeAuth: async () => {
        try {
          set({ isAuthLoading: true });
          
          // Get current session
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session?.user) {
            set({
              user: {
                id: session.user.id,
                email: session.user.email || '',
                name: session.user.user_metadata?.name || session.user.email || 'User',
              }
            });
          }

          // Listen for auth changes
          supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
              set({
                user: {
                  id: session.user.id,
                  email: session.user.email || '',
                  name: session.user.user_metadata?.name || session.user.email || 'User',
                }
              });
            } else if (event === 'SIGNED_OUT') {
              set({ 
                user: undefined, 
                currentCanvasId: undefined 
              });
            }
          });

        } catch (error) {
          console.error('Error initializing auth:', error);
        } finally {
          set({ 
            isAuthLoading: false, 
            isInitialized: true 
          });
        }
      },
    }),
    {
      name: 'metrimap-app-store',
      partialize: (state) => ({
        preferences: state.preferences,
        // Don't persist user data - it will be restored from Supabase session
      }),
    }
  )
);