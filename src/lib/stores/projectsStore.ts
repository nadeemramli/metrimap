import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CanvasProject } from '../types';
import { 
  getUserProjects, 
  getProjectById as getProjectFromSupabase, 
  createProject as createProjectInSupabase,
  updateProject as updateProjectInSupabase,
  deleteProject as deleteProjectInSupabase,
  duplicateProject as duplicateProjectInSupabase,
  getCurrentUser,
  supabase 
} from '../supabase/services';

interface ProjectsStoreState {
  projects: CanvasProject[];
  isLoading: boolean;
  error?: string;
  isInitialized: boolean;

  // Async Supabase Actions
  initializeProjects: () => Promise<void>;
  createProject: (name: string, description?: string) => Promise<CanvasProject>;
  updateProject: (projectId: string, updates: Partial<CanvasProject>) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  duplicateProject: (projectId: string, newName: string) => Promise<CanvasProject>;
  fetchProjectById: (projectId: string) => Promise<CanvasProject | null>;

  // Local State Actions
  loadProjects: (projects: CanvasProject[]) => void;
  addProjectToStore: (project: CanvasProject) => void;
  updateProjectInStore: (projectId: string, updates: Partial<CanvasProject>) => void;
  removeProjectFromStore: (projectId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | undefined) => void;

  // Utility functions
  getProjectById: (projectId: string) => CanvasProject | undefined;
  getProjectsByTag: (tag: string) => CanvasProject[];
  searchProjects: (query: string) => CanvasProject[];
  getRecentProjects: (limit?: number) => CanvasProject[];
}

// Mock data for development
const mockProjects: CanvasProject[] = [
  {
    id: "1",
    name: "SaaSCo Q3 Growth Model",
    description: "Customer acquisition and revenue optimization analysis",
    tags: ["Marketing", "Finance", "In Progress"],
    collaborators: ["JD", "SK", "AM"],
    nodes: [
      {
        id: "n1",
        title: "Monthly Recurring Revenue",
        description: "Primary revenue metric",
        category: "Data/Metric",
        subCategory: "North Star Metric",
        tags: ["Revenue", "Core"],
        causalFactors: [],
        dimensions: ["Quantitative", "Strategic"],
        position: { x: 300, y: 100 },
        assignees: ["JD"],
        createdAt: "2024-01-10T10:00:00Z",
        updatedAt: "2024-01-15T14:30:00Z",
        data: [
          { period: "Past 7 days", value: 124567, change_percent: 8.2, trend: "up" },
          { period: "Past 30 days", value: 487234, change_percent: 12.5, trend: "up" },
          { period: "Past 90 days", value: 1423876, change_percent: 15.8, trend: "up" },
        ],
      },
      {
        id: "n2",
        title: "Customer Acquisition Cost",
        description: "Cost to acquire a new customer",
        category: "Data/Metric",
        subCategory: "Leading KPI",
        tags: ["Marketing", "CAC"],
        causalFactors: [],
        dimensions: ["Quantitative", "Tactical"],
        position: { x: 100, y: 200 },
        assignees: ["SK"],
        createdAt: "2024-01-08T09:00:00Z",
        updatedAt: "2024-01-14T16:20:00Z",
        data: [
          { period: "Past 7 days", value: 89, change_percent: -5.4, trend: "down" },
          { period: "Past 30 days", value: 95, change_percent: -2.1, trend: "down" },
          { period: "Past 90 days", value: 102, change_percent: 3.2, trend: "up" },
        ],
      },
      {
        id: "n3",
        title: "Ad Spend",
        description: "Total advertising expenditure",
        category: "Data/Metric",
        subCategory: "Input Metric",
        tags: ["Marketing", "Spend"],
        causalFactors: [],
        dimensions: ["Quantitative", "Operational"],
        position: { x: 50, y: 50 },
        assignees: ["SK"],
        createdAt: "2024-01-05T08:00:00Z",
        updatedAt: "2024-01-12T11:45:00Z",
      },
    ],
    edges: [
      {
        id: "e1",
        sourceId: "n3",
        targetId: "n2",
        type: "Probabilistic",
        confidence: "High",
        weight: 0.75,
        evidence: [
          {
            id: "ev1",
            title: "Q3 Ad Spend Analysis",
            type: "Analysis",
            date: "2024-01-10",
            owner: "SK",
            summary: "Strong correlation between ad spend and CAC efficiency",
            link: "https://example.com/analysis",
          },
        ],
        createdAt: "2024-01-10T12:00:00Z",
        updatedAt: "2024-01-10T12:00:00Z",
      },
      {
        id: "e2",
        sourceId: "n2",
        targetId: "n1",
        type: "Causal",
        confidence: "Medium",
        weight: 0.62,
        evidence: [],
        createdAt: "2024-01-12T14:00:00Z",
        updatedAt: "2024-01-12T14:00:00Z",
      },
    ],
    groups: [
      {
        id: "g1",
        name: "Customer Acquisition Funnel",
        nodeIds: ["n2", "n3"],
        position: { x: 25, y: 25 },
        size: { width: 200, height: 250 },
      },
    ],
    createdAt: "2024-01-05T08:00:00Z",
    updatedAt: "2024-01-15T14:30:00Z",
    lastModifiedBy: "JD",
  },
  {
    id: "2",
    name: "User Retention Analytics",
    description: "Comprehensive user behavior and retention mapping",
    tags: ["Product", "Analytics", "Complete"],
    collaborators: ["AM", "RP"],
    nodes: [
      {
        id: "n4",
        title: "Monthly Active Users",
        description: "Users active in the past 30 days",
        category: "Data/Metric",
        subCategory: "Lagging KPI",
        tags: ["Users", "Retention"],
        causalFactors: [],
        dimensions: ["Quantitative", "Strategic"],
        position: { x: 200, y: 150 },
        assignees: ["AM"],
        createdAt: "2024-01-01T10:00:00Z",
        updatedAt: "2024-01-10T12:00:00Z",
        data: [
          { period: "Past 7 days", value: 15642, change_percent: 12.1, trend: "up" },
          { period: "Past 30 days", value: 58976, change_percent: 8.7, trend: "up" },
          { period: "Past 90 days", value: 167234, change_percent: 5.3, trend: "up" },
        ],
      },
    ],
    edges: [],
    groups: [],
    createdAt: "2024-01-01T10:00:00Z",
    updatedAt: "2024-01-10T12:00:00Z",
    lastModifiedBy: "AM",
  },
];

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
        
        set({ isLoading: true, error: undefined });
        try {
          const user = await getCurrentUser();
          if (!user) {
            // If no user, use mock data for now
            set({ projects: mockProjects, isLoading: false, isInitialized: true });
            return;
          }
          
          const projects = await getUserProjects(user.id);
          // Convert Supabase projects to CanvasProject format if needed
          const canvasProjects: CanvasProject[] = projects?.map(p => ({
            id: p.id,
            name: p.name,
            description: p.description || '',
            tags: p.tags || [],
            collaborators: [],  // This will be resolved from project_collaborators
            nodes: [],
            edges: [],
            groups: [],
            settings: p.settings as any || {},
            createdAt: p.created_at || new Date().toISOString(),
            updatedAt: p.updated_at || new Date().toISOString(),
            lastModifiedBy: p.last_modified_by || p.created_by,
          })) || [];
          
          set({ projects: canvasProjects, isLoading: false, isInitialized: true });
        } catch (error) {
          console.error('Error initializing projects:', error);
          set({ error: 'Failed to load projects', isLoading: false, isInitialized: true });
          // Fallback to mock data
          set({ projects: mockProjects });
        }
      },

      createProject: async (name: string, description = '') => {
        set({ isLoading: true, error: undefined });
        try {
          const user = await getCurrentUser();
          if (!user) throw new Error('User not authenticated');
          
          const newProject = await createProjectInSupabase({
            name,
            description,
            tags: [],
            created_by: user.id,
            last_modified_by: user.id,
          });
          
          const canvasProject: CanvasProject = {
            id: newProject.id,
            name: newProject.name,
            description: newProject.description || '',
            tags: newProject.tags || [],
            collaborators: [user.email || ''],
            nodes: [],
            edges: [],
            groups: [],
            settings: newProject.settings as any || {},
            createdAt: newProject.created_at || new Date().toISOString(),
            updatedAt: newProject.updated_at || new Date().toISOString(),
            lastModifiedBy: newProject.last_modified_by || newProject.created_by,
          };
          
          set((state) => ({
            projects: [...state.projects, canvasProject],
            isLoading: false,
          }));
          
          return canvasProject;
        } catch (error) {
          console.error('Error creating project:', error);
          set({ error: 'Failed to create project', isLoading: false });
          throw error;
        }
      },

      updateProject: async (projectId: string, updates: Partial<CanvasProject>) => {
        set({ isLoading: true, error: undefined });
        try {
          const user = await getCurrentUser();
          if (!user) throw new Error('User not authenticated');
          
          const supabaseUpdates: any = {};
          if (updates.name !== undefined) supabaseUpdates.name = updates.name;
          if (updates.description !== undefined) supabaseUpdates.description = updates.description;
          if (updates.tags !== undefined) supabaseUpdates.tags = updates.tags;
          if (updates.settings !== undefined) supabaseUpdates.settings = updates.settings;
          supabaseUpdates.last_modified_by = user.id;
          
          await updateProjectInSupabase(projectId, supabaseUpdates);
          
          set((state) => ({
            projects: state.projects.map((project) =>
              project.id === projectId
                ? { ...project, ...updates, updatedAt: new Date().toISOString() }
                : project
            ),
            isLoading: false,
          }));
        } catch (error) {
          console.error('Error updating project:', error);
          set({ error: 'Failed to update project', isLoading: false });
          throw error;
        }
      },

      deleteProject: async (projectId: string) => {
        set({ isLoading: true, error: undefined });
        try {
          await deleteProjectInSupabase(projectId);
          
          set((state) => ({
            projects: state.projects.filter((project) => project.id !== projectId),
            isLoading: false,
          }));
        } catch (error) {
          console.error('Error deleting project:', error);
          set({ error: 'Failed to delete project', isLoading: false });
          throw error;
        }
      },

      duplicateProject: async (projectId: string, newName: string) => {
        set({ isLoading: true, error: undefined });
        try {
          const user = await getCurrentUser();
          if (!user) throw new Error('User not authenticated');
          
          const newProject = await duplicateProjectInSupabase(projectId, newName, user.id);
          
          const canvasProject: CanvasProject = {
            id: newProject.id,
            name: newProject.name,
            description: newProject.description || '',
            tags: newProject.tags || [],
            collaborators: [user.email || ''],
            nodes: [],
            edges: [],
            groups: [],
            settings: newProject.settings as any || {},
            createdAt: newProject.created_at || new Date().toISOString(),
            updatedAt: newProject.updated_at || new Date().toISOString(),
            lastModifiedBy: newProject.last_modified_by || newProject.created_by,
          };
          
          set((state) => ({
            projects: [...state.projects, canvasProject],
            isLoading: false,
          }));
          
          return canvasProject;
        } catch (error) {
          console.error('Error duplicating project:', error);
          set({ error: 'Failed to duplicate project', isLoading: false });
          throw error;
        }
      },

      fetchProjectById: async (projectId: string) => {
        try {
          const project = await getProjectFromSupabase(projectId);
          return project;
        } catch (error) {
          console.error('Error fetching project:', error);
          return null;
        }
      },

      // Local State Actions
      loadProjects: (projects: CanvasProject[]) =>
        set({ projects, isLoading: false, error: undefined }),

      addProjectToStore: (project: CanvasProject) =>
        set((state) => ({
          projects: [...state.projects, project],
        })),

      updateProjectInStore: (projectId: string, updates: Partial<CanvasProject>) =>
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === projectId
              ? { ...project, ...updates, updatedAt: new Date().toISOString() }
              : project
          ),
        })),

      removeProjectFromStore: (projectId: string) =>
        set((state) => ({
          projects: state.projects.filter((project) => project.id !== projectId),
        })),

      setLoading: (isLoading: boolean) => set({ isLoading }),
      setError: (error: string | undefined) => set({ error }),

      // Utility functions
      getProjectById: (projectId: string) => {
        const state = get();
        return state.projects.find((project) => project.id === projectId);
      },

      getProjectsByTag: (tag: string) => {
        const state = get();
        return state.projects.filter((project) =>
          project.tags.some((t) => t.toLowerCase().includes(tag.toLowerCase()))
        );
      },

      searchProjects: (query: string) => {
        const state = get();
        const lowercaseQuery = query.toLowerCase();
        return state.projects.filter(
          (project) =>
            project.name.toLowerCase().includes(lowercaseQuery) ||
            project.description.toLowerCase().includes(lowercaseQuery) ||
            project.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery))
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
      name: 'metrimap-projects-store',
      partialize: (state) => ({
        projects: state.projects,
        isInitialized: state.isInitialized,
      }),
    }
  )
);