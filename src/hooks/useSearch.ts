import { useState, useMemo, useCallback } from 'react';
import { useCanvasStore } from '@/lib/stores';
import { useEvidenceStore } from '@/lib/stores/evidenceStore';
import type {
  MetricCard,
  Relationship,
  EvidenceItem,
  CardCategory,
  RelationshipType,
  ConfidenceLevel,
} from '@/lib/types';

export interface SearchResult {
  id: string;
  type: 'metric' | 'relationship' | 'evidence';
  title: string;
  description?: string;
  category?: string;
  tags?: string[];
  score: number;
  data: MetricCard | Relationship | EvidenceItem;
  highlights?: string[];
}

export interface SearchFilters {
  types: string[];
  categories: string[];
  tags: string[];
  dateRange: {
    from?: string;
    to?: string;
  };
  owners: string[];
  confidence?: ConfidenceLevel;
}

export interface UseSearchOptions {
  fuzzySearch?: boolean;
  includeContent?: boolean;
  maxResults?: number;
}

export const useSearch = (options: UseSearchOptions = {}) => {
  const { fuzzySearch = true, includeContent = true, maxResults = 50 } = options;
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    types: [],
    categories: [],
    tags: [],
    dateRange: {},
    owners: [],
  });

  const { canvas } = useCanvasStore();
  const { evidence } = useEvidenceStore();

  // Quick search function for immediate results
  const quickSearch = useCallback((query: string, limit: number = 10): SearchResult[] => {
    if (!query.trim()) return [];

    const results: SearchResult[] = [];
    const normalizedQuery = query.toLowerCase();

    // Search metrics
    canvas?.nodes.forEach(card => {
      let score = 0;
      const highlights: string[] = [];

      if (card.title.toLowerCase().includes(normalizedQuery)) {
        score += 100;
        highlights.push('title');
      }
      if (card.description?.toLowerCase().includes(normalizedQuery)) {
        score += 50;
        highlights.push('description');
      }
      if (card.category.toLowerCase().includes(normalizedQuery)) {
        score += 30;
        highlights.push('category');
      }

      if (score > 0) {
        results.push({
          id: card.id,
          type: 'metric',
          title: card.title,
          description: card.description,
          category: card.category,
          tags: card.tags,
          score,
          data: card,
          highlights
        });
      }
    });

    // Search relationships
    canvas?.edges.forEach(relationship => {
      let score = 0;
      const highlights: string[] = [];

      if (relationship.type.toLowerCase().includes(normalizedQuery)) {
        score += 80;
        highlights.push('type');
      }
      if (relationship.confidence.toLowerCase().includes(normalizedQuery)) {
        score += 60;
        highlights.push('confidence');
      }

      if (score > 0) {
        const sourceNode = canvas?.nodes.find(n => n.id === relationship.sourceId);
        const targetNode = canvas?.nodes.find(n => n.id === relationship.targetId);
        
        results.push({
          id: relationship.id,
          type: 'relationship',
          title: `${sourceNode?.title || 'Unknown'} → ${targetNode?.title || 'Unknown'}`,
          description: `${relationship.type} relationship with ${relationship.confidence} confidence`,
          category: relationship.type,
          score,
          data: relationship,
          highlights
        });
      }
    });

    // Search evidence
    evidence.forEach(item => {
      let score = 0;
      const highlights: string[] = [];

      if (item.title.toLowerCase().includes(normalizedQuery)) {
        score += 100;
        highlights.push('title');
      }
      if (item.summary.toLowerCase().includes(normalizedQuery)) {
        score += 70;
        highlights.push('summary');
      }
      if (item.owner.toLowerCase().includes(normalizedQuery)) {
        score += 40;
        highlights.push('owner');
      }

      if (score > 0) {
        results.push({
          id: item.id,
          type: 'evidence',
          title: item.title,
          description: item.summary,
          category: item.type,
          tags: [],
          score,
          data: item,
          highlights
        });
      }
    });

    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }, [canvas, evidence]);

  // Advanced search with filters
  const searchResults = useMemo(() => {
    if (!searchQuery.trim() && Object.values(filters).every(f => 
      Array.isArray(f) ? f.length === 0 : !f || Object.keys(f).length === 0
    )) {
      return [];
    }

    const results: SearchResult[] = [];
    const query = searchQuery.toLowerCase();

    // Search metric cards
    if (!filters.types.length || filters.types.includes('metric')) {
      canvas?.nodes.forEach(card => {
        let score = 0;
        const highlights: string[] = [];
        
        // Title match (highest priority)
        if (card.title.toLowerCase().includes(query)) {
          score += 100;
          highlights.push('title');
        }
        
        // Description match
        if (card.description?.toLowerCase().includes(query)) {
          score += 50;
          highlights.push('description');
        }
        
        // Category match
        if (card.category.toLowerCase().includes(query)) {
          score += 30;
          highlights.push('category');
        }
        
        // Tags match
        card.tags?.forEach(tag => {
          if (tag.toLowerCase().includes(query)) {
            score += 20;
            highlights.push('tags');
          }
        });

        // Fuzzy search on content
        if (fuzzySearch && includeContent) {
          const content = [card.title, card.description, card.category, ...(card.tags || [])].join(' ').toLowerCase();
          const words = query.split(' ').filter(w => w.length > 2);
          words.forEach(word => {
            if (content.includes(word)) {
              score += 10;
            }
          });
        }

        // Apply filters
        if (filters.categories.length && !filters.categories.includes(card.category)) return;
        if (filters.tags.length && !filters.tags.some(tag => card.tags?.includes(tag))) return;
        if (filters.owners.length && card.owner && !filters.owners.includes(card.owner)) return;

        if (score > 0 || (!searchQuery.trim() && Object.values(filters).some(f => 
          Array.isArray(f) ? f.length > 0 : !!f
        ))) {
          results.push({
            id: card.id,
            type: 'metric',
            title: card.title,
            description: card.description,
            category: card.category,
            tags: card.tags,
            score: score || 1,
            data: card,
            highlights
          });
        }
      });
    }

    // Search relationships
    if (!filters.types.length || filters.types.includes('relationship')) {
      canvas?.edges.forEach(relationship => {
        let score = 0;
        const highlights: string[] = [];
        
        // Type match
        if (relationship.type.toLowerCase().includes(query)) {
          score += 80;
          highlights.push('type');
        }
        
        // Confidence match
        if (relationship.confidence.toLowerCase().includes(query)) {
          score += 60;
          highlights.push('confidence');
        }

        // Evidence content search
        relationship.evidence?.forEach(evidence => {
          if (evidence.title.toLowerCase().includes(query)) {
            score += 40;
            highlights.push('evidence');
          }
          if (evidence.summary.toLowerCase().includes(query)) {
            score += 30;
            highlights.push('evidence');
          }
        });

        // Apply filters
        if (filters.confidence && relationship.confidence !== filters.confidence) return;

        if (score > 0 || (!searchQuery.trim() && filters.confidence)) {
          const sourceNode = canvas?.nodes.find(n => n.id === relationship.sourceId);
          const targetNode = canvas?.nodes.find(n => n.id === relationship.targetId);
          
          results.push({
            id: relationship.id,
            type: 'relationship',
            title: `${sourceNode?.title || 'Unknown'} → ${targetNode?.title || 'Unknown'}`,
            description: `${relationship.type} relationship with ${relationship.confidence} confidence`,
            category: relationship.type,
            score: score || 1,
            data: relationship,
            highlights
          });
        }
      });
    }

    // Search evidence
    if (!filters.types.length || filters.types.includes('evidence')) {
      evidence.forEach(item => {
        let score = 0;
        const highlights: string[] = [];
        
        // Title match
        if (item.title.toLowerCase().includes(query)) {
          score += 100;
          highlights.push('title');
        }
        
        // Summary match
        if (item.summary.toLowerCase().includes(query)) {
          score += 70;
          highlights.push('summary');
        }
        
        // Owner match
        if (item.owner.toLowerCase().includes(query)) {
          score += 40;
          highlights.push('owner');
        }
        
        // Type match
        if (item.type.toLowerCase().includes(query)) {
          score += 30;
          highlights.push('type');
        }

        // Hypothesis match
        if (item.hypothesis?.toLowerCase().includes(query)) {
          score += 25;
          highlights.push('hypothesis');
        }

        // Apply filters
        if (filters.owners.length && !filters.owners.includes(item.owner)) return;

        if (score > 0 || (!searchQuery.trim() && filters.owners.length)) {
          results.push({
            id: item.id,
            type: 'evidence',
            title: item.title,
            description: item.summary,
            category: item.type,
            tags: [],
            score: score || 1,
            data: item,
            highlights
          });
        }
      });
    }

    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults);
  }, [searchQuery, filters, canvas, evidence, fuzzySearch, includeContent, maxResults]);

  // Filter options
  const filterOptions = useMemo(() => {
    const categories = new Set<string>();
    const tags = new Set<string>();
    const owners = new Set<string>();

    canvas?.nodes.forEach(card => {
      categories.add(card.category);
      card.tags?.forEach(tag => tags.add(tag));
      if (card.owner) owners.add(card.owner);
    });

    evidence.forEach(item => {
      if (item.owner) owners.add(item.owner);
    });

    return {
      categories: Array.from(categories),
      tags: Array.from(tags),
      owners: Array.from(owners)
    };
  }, [canvas, evidence]);

  // Search actions
  const openSearch = useCallback(() => setIsSearchOpen(true), []);
  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
    setSearchQuery('');
  }, []);

  const updateQuery = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      types: [],
      categories: [],
      tags: [],
      dateRange: {},
      owners: [],
    });
  }, []);

  const resetSearch = useCallback(() => {
    setSearchQuery('');
    clearFilters();
  }, [clearFilters]);

  return {
    // State
    isSearchOpen,
    searchQuery,
    filters,
    searchResults,
    filterOptions,

    // Actions
    openSearch,
    closeSearch,
    updateQuery,
    updateFilters,
    clearFilters,
    resetSearch,
    quickSearch,

    // Utils
    hasActiveFilters: Object.values(filters).some(f => 
      Array.isArray(f) ? f.length > 0 : !!f
    ),
    resultCount: searchResults.length,
  };
};