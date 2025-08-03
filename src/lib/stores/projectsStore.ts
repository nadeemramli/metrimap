import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CanvasProject } from '../types';
import { 
  createProject as createProjectInSupabase,
  updateProject as updateProjectInSupabase,
  deleteProject as deleteProjectInSupabase,
  getUserProjects,
  getProjectById,
} from '../supabase/services';
import { useAppStore } from './appStore';
import { getAuthenticatedClient } from '../utils/authenticatedClient';

interface ProjectsStoreState {
  // State
  projects: CanvasProject[];
  isLoading: boolean;
  error: string | undefined;
  isInitialized: boolean;

  // Async Supabase Actions (Require Auth)
  initializeProjects: () => Promise<void>;
  addProject: (project: Omit<CanvasProject, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateProject: (projectId: string, updates: Partial<CanvasProject>) => Promise<void>;
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
        
        // Retry mechanism for authenticated client
        let authenticatedClient = getAuthenticatedClient();
        let retries = 0;
        const maxRetries = 5;
        
        while (!authenticatedClient && retries < maxRetries) {
          console.log(`⏳ Waiting for authenticated client... (attempt ${retries + 1}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          authenticatedClient = getAuthenticatedClient();
          retries++;
        }
        
        if (!authenticatedClient) {
          console.error('❌ No authenticated client available after retries');
          throw new Error('Authenticated client not available');
        }
        
        try {
          const user = requireAuth();
          console.log('✅ User authenticated:', user.id);
          console.log('✅ Authenticated client obtained:', !!authenticatedClient);
          
          const projects = await getUserProjects(user.id, authenticatedClient);
          console.log('✅ getUserProjects completed, got projects:', projects?.length || 0);
          // Load full canvas data for each project
          const canvasProjects: CanvasProject[] = [];
          
          console.log(`📋 Loading full data for ${projects?.length || 0} projects...`);
          console.log(`🔍 Projects from getUserProjects:`, projects?.map(p => ({ id: p.id, name: p.name })));
          for (const project of projects || []) {
            console.log(`🔍 Loading project: ${project.name} (${project.id})`);
            try {
              console.log(`🔍 Calling getProjectById for ${project.id}...`);
              const fullProject = await getProjectById(project.id, authenticatedClient || undefined);
              if (fullProject) {
                console.log(`✅ Loaded project ${project.name} with ${fullProject.nodes.length} nodes, ${fullProject.edges.length} edges, ${fullProject.groups.length} groups`);
                canvasProjects.push(fullProject);
              } else {
                console.log(`⚠️ No full data returned for project ${project.name}`);
                // Fallback to basic project data
                canvasProjects.push({
                  id: project.id,
                  name: project.name,
                  description: project.description || '',
                  tags: project.tags || [],
                  collaborators: [],
                  nodes: [],
                  edges: [],
                  groups: [],
                  createdAt: project.created_at || new Date().toISOString(),
                  updatedAt: project.updated_at || new Date().toISOString(),
                  lastModifiedBy: user.id,
                });
              }
            } catch (error) {
              console.error(`❌ Failed to load full data for project ${project.id}:`, error);
              // Fallback to basic project data
              canvasProjects.push({
                id: project.id,
                name: project.name,
                description: project.description || '',
                tags: project.tags || [],
                collaborators: [],
                nodes: [],
                edges: [],
                groups: [],
                createdAt: project.created_at || new Date().toISOString(),
                updatedAt: project.updated_at || new Date().toISOString(),
                lastModifiedBy: user.id,
              });
            }
          }
          
          set({ projects: canvasProjects, isLoading: false, isInitialized: true });
        } catch (error) {
          console.error('Failed to initialize projects:', error);
          set({ 
            projects: [], 
            isLoading: false, 
            isInitialized: true, 
            error: error instanceof Error ? error.message : 'Failed to load projects'
          });
        }
      },

      addProject: async (projectData) => {
        try {
          const user = requireAuth();
          
          set({ isLoading: true, error: undefined });
          
          const { collaborators, nodes, edges, groups, lastModifiedBy, ...dbProjectData } = projectData;
          const projectToCreate = {
            ...dbProjectData,
            created_by: user.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            last_modified_by: user.id,
            settings: projectData.settings ? JSON.parse(JSON.stringify(projectData.settings)) : undefined,
          };
          
          const newProject = await createProjectInSupabase(projectToCreate);
          
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
            
            set(state => ({
              projects: [...state.projects, canvasProject],
              isLoading: false
            }));
            
            return newProject.id;
          }
          
          throw new Error('Failed to create project');
        } catch (error) {
          console.error('Failed to add project:', error);
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to create project'
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
          if (updates.description !== undefined) dbUpdates.description = updates.description;
          if (updates.tags !== undefined) dbUpdates.tags = updates.tags;
          if (updates.settings !== undefined) dbUpdates.settings = JSON.parse(JSON.stringify(updates.settings));
          if (updates.updatedAt !== undefined) dbUpdates.updated_at = updates.updatedAt;
          if (updates.lastModifiedBy !== undefined) dbUpdates.last_modified_by = updates.lastModifiedBy;
          
          const updatedProject = await updateProjectInSupabase(projectId, dbUpdates);
          
          if (updatedProject) {
            set(state => ({
              projects: state.projects.map(p => 
                p.id === projectId 
                  ? { 
                      ...p, 
                      ...updates, 
                      updatedAt: updatedProject.updated_at || new Date().toISOString() 
                    }
                  : p
              ),
              isLoading: false
            }));
          }
        } catch (error) {
          console.error('Failed to update project:', error);
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to update project'
          });
          throw error;
        }
      },

      deleteProject: async (projectId) => {
        try {
          requireAuth();
          
          set({ isLoading: true, error: undefined });
          
          await deleteProjectInSupabase(projectId);
          
          set(state => ({
            projects: state.projects.filter(p => p.id !== projectId),
            isLoading: false
          }));
        } catch (error) {
          console.error('Failed to delete project:', error);
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to delete project'
          });
          throw error;
        }
      },

      duplicateProject: async (projectId) => {
        try {
          const user = requireAuth();
          
          const state = get();
          const originalProject = state.projects.find(p => p.id === projectId);
          
          if (!originalProject) {
            throw new Error('Project not found');
          }
          
          set({ isLoading: true, error: undefined });
          
          const duplicatedProject = {
            ...originalProject,
            name: `${originalProject.name} (Copy)`,
            created_by: user.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          
          // Remove the ID so Supabase generates a new one
          const { id, createdAt, updatedAt, lastModifiedBy, ...projectData } = duplicatedProject;
          
          // Convert settings to Json type
          const projectDataWithSettings = {
            ...projectData,
            settings: projectData.settings ? JSON.parse(JSON.stringify(projectData.settings)) : undefined,
          };
          
          const newProject = await createProjectInSupabase(projectDataWithSettings);
          
          if (newProject) {
            const canvasProject: CanvasProject = {
              id: newProject.id,
              name: newProject.name,
              description: newProject.description || '',
              tags: newProject.tags || [],
              collaborators: [],
              nodes: [...originalProject.nodes], // Copy nodes
              edges: [...originalProject.edges], // Copy edges
              groups: [...originalProject.groups], // Copy groups
              createdAt: newProject.created_at || new Date().toISOString(),
              updatedAt: newProject.updated_at || new Date().toISOString(),
              lastModifiedBy: user.id,
            };
            
            set(state => ({
              projects: [...state.projects, canvasProject],
              isLoading: false
            }));
            
            return newProject.id;
          }
          
          throw new Error('Failed to duplicate project');
        } catch (error) {
          console.error('Failed to duplicate project:', error);
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to duplicate project'
          });
          throw error;
        }
      },

      // Local Read-Only Actions (No Auth Required)
      getProjectById: (id) => {
        const state = get();
        return state.projects.find(p => p.id === id);
      },

      getProjectsByTag: (tag) => {
        const state = get();
        return state.projects.filter(p => p.tags.includes(tag));
      },

      searchProjects: (query) => {
        const state = get();
        const lowercaseQuery = query.toLowerCase();
        return state.projects.filter(p =>
          p.name.toLowerCase().includes(lowercaseQuery) ||
          p.description.toLowerCase().includes(lowercaseQuery) ||
          p.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
        );
      },

      getRecentProjects: (limit = 5) => {
        const state = get();
        return [...state.projects]
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
          .slice(0, limit);
      },
    }),
    {
      name: 'projects-store',
      partialize: (state) => ({
        projects: state.projects,
        isInitialized: state.isInitialized,
      }),
    }
  )
);
