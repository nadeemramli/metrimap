import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CanvasProject } from '../types';

interface ProjectsStoreState {
  projects: CanvasProject[];
  isLoading: boolean;
  error?: string;

  // Actions
  loadProjects: (projects: CanvasProject[]) => void;
  addProject: (project: CanvasProject) => void;
  updateProject: (projectId: string, updates: Partial<CanvasProject>) => void;
  deleteProject: (projectId: string) => void;
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
      // Initial state with mock data
      projects: mockProjects,
      isLoading: false,
      error: undefined,

      // Actions
      loadProjects: (projects: CanvasProject[]) =>
        set({ projects, isLoading: false, error: undefined }),

      addProject: (project: CanvasProject) =>
        set((state) => ({
          projects: [...state.projects, project],
        })),

      updateProject: (projectId: string, updates: Partial<CanvasProject>) =>
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === projectId
              ? { ...project, ...updates, updatedAt: new Date().toISOString() }
              : project
          ),
        })),

      deleteProject: (projectId: string) =>
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
      }),
    }
  )
);