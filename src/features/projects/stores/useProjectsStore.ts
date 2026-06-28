import {
  createProject as createProjectInSupabase,
  deleteProject as deleteProjectInSupabase,
  duplicateProjectDeep as duplicateProjectDeepInSupabase,
  getUserProjects,
  updateProject as updateProjectInSupabase,
} from '@/shared/lib/supabase/services/projects';
import { useAppStore } from '@/shared/stores/useAppStore';
import type { CanvasProject } from '@/shared/types';
import {
  getClientForEnvironment,
  isDevelopmentMode,
  whenAuthenticatedClientReady,
} from '@/shared/utils/authenticatedClient';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProjectsStoreState {
  // State
  projects: CanvasProject[];
  isLoading: boolean;
  error: string | undefined;
  isInitialized: boolean;

  // Async Supabase Actions (Require Auth)
  initializeProjects: () => Promise<void>;
  addProject: (
    project: Omit<CanvasProject, 'id' | 'createdAt' | 'updatedAt'>
  ) => Promise<string>;
  updateProject: (
    projectId: string,
    updates: Partial<CanvasProject>
  ) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  duplicateProject: (projectId: string) => Promise<string>;

  // Local Read-Only Actions (No Auth Required)
  getProjectById: (id: string) => CanvasProject | undefined;
  getProjectsByTag: (tag: string) => CanvasProject[];
  searchProjects: (query: string) => CanvasProject[];
  getRecentProjects: (limit?: number) => CanvasProject[];
}

// Helper function to check authentication using Clerk user
const requireAuth = () => {
  const { user } = useAppStore.getState();
  if (!user) {
    throw new Error('Authentication required. Please log in.');
  }
  return user;
};

export const useProjectsStore = create<ProjectsStoreState>()(
  persist(
    (set, get) => ({
      // Initial state (will load from Supabase)
      projects: [],
      isLoading: false,
      error: undefined,
      isInitialized: false,

      // Async Supabase Actions
      initializeProjects: async () => {
        const state = get();
        if (state.isInitialized) return;

        console.log('🚀 initializeProjects called');
        set({ isLoading: true, error: undefined });

        try {
          const user = requireAuth();
          console.log('✅ User authenticated:', user.id);

          // Wait for the Clerk-authenticated client to be set by
          // AuthenticatedSupabaseProvider instead of throwing on the
          // user-set / client-set effect race.
          const client = await whenAuthenticatedClientReady();
          console.log('✅ Client obtained for environment');

          const projects = await getUserProjects(user.id, client);
          console.log(
            '✅ getUserProjects completed, got projects:',
            projects?.length || 0
          );

          // Build lightweight list items directly from the aggregated query.
          // Counts come from embedded PostgREST aggregates (metric_cards(count)
          // etc.); collaborators from embedded rows. Full node/edge/group data
          // is loaded lazily when a canvas is opened — so the homepage list is
          // one round trip instead of an N+1 of getProjectById per project.
          const countOf = (v: any): number =>
            Array.isArray(v) ? (v[0]?.count ?? v.length ?? 0) : 0;

          const canvasProjects: CanvasProject[] = (projects || []).map(
            (project: any) => {
              const collaborators: string[] = (
                project.project_collaborators || []
              )
                .map((pc: any) => pc?.users?.email)
                .filter(Boolean);
              return {
                id: project.id,
                name: project.name,
                description: project.description || '',
                tags: project.tags || [],
                collaborators,
                // Lightweight nodes/edges JUST for the homepage CanvasPreview
                // (id/title/category + edge endpoints). Full canvas data is still
                // lazy-loaded on open. Capped so a huge canvas can't bloat the list.
                nodes: (project.preview_cards || [])
                  .slice(0, 80)
                  .map((c: any) => ({
                    id: c.id,
                    title: c.title,
                    category: c.category,
                  })) as any,
                edges: (project.preview_rels || []).map((r: any) => ({
                  id: r.id,
                  source: r.source_id,
                  target: r.target_id,
                })) as any,
                groups: [],
                nodeCount: countOf(project.metric_cards),
                edgeCount: countOf(project.relationships),
                groupCount: countOf(project.groups),
                settings: (project.settings as any) || undefined,
                createdAt: project.created_at || new Date().toISOString(),
                updatedAt: project.updated_at || new Date().toISOString(),
                lastModifiedBy: project.last_modified_by || user.id,
              };
            }
          );

          console.log(
            `📋 Loaded ${canvasProjects.length} projects (counts via aggregate query)`
          );

          set({
            projects: canvasProjects,
            isLoading: false,
            isInitialized: true,
          });
        } catch (error) {
          console.error('Failed to initialize projects:', error);

          // In development, show more helpful error messages
          const errorMessage = isDevelopmentMode()
            ? `Development Error: ${error instanceof Error ? error.message : 'Unknown error'}. This might be due to using production keys in development.`
            : error instanceof Error
              ? error.message
              : 'Failed to load projects';

          set({
            projects: [],
            isLoading: false,
            isInitialized: true,
            error: errorMessage,
          });
        }
      },

      addProject: async (projectData) => {
        try {
          const user = requireAuth();

          set({ isLoading: true, error: undefined });

          const {
            collaborators,
            nodes,
            edges,
            groups,
            lastModifiedBy,
            // Exclude camelCase fields that would conflict with database schema
            ...dbProjectData
          } = projectData;
          const projectToCreate = {
            ...dbProjectData,
            created_by: user.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            last_modified_by: user.id,
            settings: projectData.settings
              ? JSON.parse(JSON.stringify(projectData.settings))
              : undefined,
          };

          const client = getClientForEnvironment();
          const newProject = await createProjectInSupabase(
            projectToCreate,
            client
          );

          if (newProject) {
            const canvasProject: CanvasProject = {
              id: newProject.id,
              name: newProject.name,
              description: newProject.description || '',
              tags: newProject.tags || [],
              collaborators: [],
              nodes: [],
              edges: [],
              groups: [],
              createdAt: newProject.created_at || new Date().toISOString(),
              updatedAt: newProject.updated_at || new Date().toISOString(),
              lastModifiedBy: user.id,
            };

            set((state) => ({
              projects: [...state.projects, canvasProject],
              isLoading: false,
            }));

            return newProject.id;
          }

          throw new Error('Failed to create project');
        } catch (error) {
          console.error('Failed to add project:', error);
          set({
            isLoading: false,
            error:
              error instanceof Error
                ? error.message
                : 'Failed to create project',
          });
          throw error;
        }
      },

      updateProject: async (projectId, updates) => {
        try {
          requireAuth();

          set({ isLoading: true, error: undefined });

          // Convert camelCase to snake_case for database
          const dbUpdates: any = {};
          if (updates.name !== undefined) dbUpdates.name = updates.name;
          if (updates.description !== undefined)
            dbUpdates.description = updates.description;
          if (updates.tags !== undefined) dbUpdates.tags = updates.tags;
          if (updates.settings !== undefined)
            dbUpdates.settings = JSON.parse(JSON.stringify(updates.settings));
          if (updates.updatedAt !== undefined)
            dbUpdates.updated_at = updates.updatedAt;
          if (updates.lastModifiedBy !== undefined)
            dbUpdates.last_modified_by = updates.lastModifiedBy;

          const client = getClientForEnvironment();
          const updatedProject = await updateProjectInSupabase(
            projectId,
            dbUpdates,
            client
          );

          if (updatedProject) {
            set((state) => ({
              projects: state.projects.map((p) =>
                p.id === projectId
                  ? {
                      ...p,
                      ...updates,
                      updatedAt:
                        updatedProject.updated_at || new Date().toISOString(),
                    }
                  : p
              ),
              isLoading: false,
            }));
          }
        } catch (error) {
          console.error('Failed to update project:', error);
          set({
            isLoading: false,
            error:
              error instanceof Error
                ? error.message
                : 'Failed to update project',
          });
          throw error;
        }
      },

      deleteProject: async (projectId) => {
        try {
          requireAuth();

          set({ isLoading: true, error: undefined });

          const client = getClientForEnvironment();
          await deleteProjectInSupabase(projectId, client);

          set((state) => ({
            projects: state.projects.filter((p) => p.id !== projectId),
            isLoading: false,
          }));
        } catch (error) {
          console.error('Failed to delete project:', error);
          set({
            isLoading: false,
            error:
              error instanceof Error
                ? error.message
                : 'Failed to delete project',
          });
          throw error;
        }
      },

      duplicateProject: async (projectId) => {
        try {
          const user = requireAuth();
          set({ isLoading: true, error: undefined });

          const client = getClientForEnvironment();
          // Real deep copy: clones the project + all cards/nodes/relationships/
          // groups/data-flow edges under a new id space (service layer).
          const newProjectId = await duplicateProjectDeepInSupabase(
            projectId,
            user.id,
            client
          );

          // Force a list refresh so the copy appears with accurate counts +
          // preview (initializeProjects no-ops while isInitialized is true).
          set({ isInitialized: false });
          await get().initializeProjects();
          set({ isLoading: false });

          return newProjectId;
        } catch (error) {
          console.error('Failed to duplicate project:', error);
          set({
            isLoading: false,
            error:
              error instanceof Error
                ? error.message
                : 'Failed to duplicate project',
          });
          throw error;
        }
      },

      // Local Read-Only Actions (No Auth Required)
      getProjectById: (id) => {
        const state = get();
        return state.projects.find((p) => p.id === id);
      },

      getProjectsByTag: (tag) => {
        const state = get();
        return state.projects.filter((p) => p.tags.includes(tag));
      },

      searchProjects: (query) => {
        const state = get();
        const lowercaseQuery = query.toLowerCase();
        return state.projects.filter(
          (p) =>
            p.name.toLowerCase().includes(lowercaseQuery) ||
            p.description.toLowerCase().includes(lowercaseQuery) ||
            p.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery))
        );
      },

      getRecentProjects: (limit = 5) => {
        const state = get();
        return [...state.projects]
          .sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          )
          .slice(0, limit);
      },
    }),
    {
      name: 'projects-store',
      partialize: (state) => ({
        projects: state.projects,
      }),
    }
  )
);
