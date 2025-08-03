import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { TagRow } from '../supabase/services/tags';
import { 
  getProjectTags,
  createTag,
  updateTag,
  deleteTag,
  searchProjectTags,
  getTagUsageStats,
} from '../supabase/services/tags';
import { useAppStore } from './appStore';

interface TagStoreState {
  // State
  tags: TagRow[];
  isLoading: boolean;
  error: string | undefined;
  searchResults: TagRow[];
  isSearching: boolean;

  // Actions
  loadProjectTags: (projectId: string) => Promise<void>;
  createProjectTag: (projectId: string, tagData: { name: string; color?: string; description?: string }) => Promise<void>;
  updateProjectTag: (tagId: string, updates: { name?: string; color?: string; description?: string }) => Promise<void>;
  deleteProjectTag: (tagId: string) => Promise<void>;
  searchTags: (projectId: string, query: string) => Promise<void>;
  clearSearchResults: () => void;
  getTagById: (tagId: string) => TagRow | undefined;
  getTagsByNames: (names: string[]) => TagRow[];
  getTagUsageStats: (projectId: string) => Promise<any[]>;
}

export const useTagStore = create<TagStoreState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    tags: [],
    isLoading: false,
    error: undefined,
    searchResults: [],
    isSearching: false,

    // Load all tags for a project
    loadProjectTags: async (projectId: string) => {
      set({ isLoading: true, error: undefined });
      try {
        console.log("🔄 Loading project tags for:", projectId);
        const tags = await getProjectTags(projectId);
        console.log("✅ Project tags loaded:", tags.length, "tags");
        console.log("📋 Tags:", tags);
        set({ tags, isLoading: false });
      } catch (error) {
        console.error('Failed to load project tags:', error);
        set({ 
          tags: [], 
          isLoading: false, 
          error: error instanceof Error ? error.message : 'Failed to load tags'
        });
      }
    },

    // Create a new tag for a project
    createProjectTag: async (projectId: string, tagData: { name: string; color?: string; description?: string }) => {
      set({ isLoading: true, error: undefined });
      try {
        const { user } = useAppStore.getState();
        if (!user) throw new Error('User not authenticated');

        const newTag = await createTag({
          name: tagData.name,
          color: tagData.color || null,
          description: tagData.description || null,
          project_id: projectId,
          created_by: user.id,
        });

        set(state => ({
          tags: [...state.tags, newTag],
          isLoading: false,
        }));
      } catch (error) {
        console.error('Failed to create tag:', error);
        set({ 
          isLoading: false, 
          error: error instanceof Error ? error.message : 'Failed to create tag'
        });
        throw error;
      }
    },

    // Update a tag
    updateProjectTag: async (tagId: string, updates: { name?: string; color?: string; description?: string }) => {
      set({ isLoading: true, error: undefined });
      try {
        const updatedTag = await updateTag(tagId, updates);
        
        set(state => ({
          tags: state.tags.map(tag => 
            tag.id === tagId ? updatedTag : tag
          ),
          isLoading: false,
        }));
      } catch (error) {
        console.error('Failed to update tag:', error);
        set({ 
          isLoading: false, 
          error: error instanceof Error ? error.message : 'Failed to update tag'
        });
        throw error;
      }
    },

    // Delete a tag
    deleteProjectTag: async (tagId: string) => {
      set({ isLoading: true, error: undefined });
      try {
        await deleteTag(tagId);
        
        set(state => ({
          tags: state.tags.filter(tag => tag.id !== tagId),
          isLoading: false,
        }));
      } catch (error) {
        console.error('Failed to delete tag:', error);
        set({ 
          isLoading: false, 
          error: error instanceof Error ? error.message : 'Failed to delete tag'
        });
        throw error;
      }
    },

    // Search tags for autocomplete
    searchTags: async (projectId: string, query: string) => {
      if (query.length < 2) {
        set({ searchResults: [], isSearching: false });
        return;
      }

      set({ isSearching: true });
      try {
        const results = await searchProjectTags(projectId, query);
        set({ searchResults: results, isSearching: false });
      } catch (error) {
        console.error('Failed to search tags:', error);
        set({ searchResults: [], isSearching: false });
      }
    },

    // Clear search results
    clearSearchResults: () => {
      set({ searchResults: [] });
    },

    // Get tag by ID
    getTagById: (tagId: string) => {
      const state = get();
      return state.tags.find(tag => tag.id === tagId);
    },

    // Get tags by names
    getTagsByNames: (names: string[]) => {
      const state = get();
      return state.tags.filter(tag => names.includes(tag.name));
    },

    // Get tag usage statistics
    getTagUsageStats: async (projectId: string) => {
      try {
        return await getTagUsageStats(projectId);
      } catch (error) {
        console.error('Failed to get tag usage stats:', error);
        return [];
      }
    },
  }))
); 