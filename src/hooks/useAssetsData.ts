import { useAuthenticatedSupabase } from '@/lib/contexts/AuthenticatedSupabaseContext';
import { useCanvasStore } from '@/lib/stores';
import { getProjectById } from '@/lib/supabase/services/projects';
import {
  getMetricCardTags,
  getRelationshipTags,
} from '@/lib/supabase/services/tags';
import type { MetricCard, Relationship } from '@/lib/types';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

export function useAssetsData() {
  const { canvasId } = useParams();
  const supabaseClient = useAuthenticatedSupabase();
  const { canvas } = useCanvasStore();

  const [project, setProject] = useState<any>(null);
  const [isLoadingProject, setIsLoadingProject] = useState(false);
  const [metricTags, setMetricTags] = useState<Record<string, string[]>>({});
  const [relationshipTags, setRelationshipTags] = useState<
    Record<string, string[]>
  >({});
  const [isLoadingTags, setIsLoadingTags] = useState(false);

  // Track if we've already loaded tags for the current data to prevent unnecessary reloads
  const loadedTagsRef = useRef<{
    canvasId: string | undefined;
    metricIds: Set<string>;
    relationshipIds: Set<string>;
  }>({
    canvasId: undefined,
    metricIds: new Set(),
    relationshipIds: new Set(),
  });

  // Use canvas store for real-time data, fallback to project store
  const metrics = useMemo(
    () => canvas?.nodes || project?.nodes || [],
    [canvas?.nodes, project?.nodes]
  );
  const relationships = useMemo(
    () => canvas?.edges || project?.edges || [],
    [canvas?.edges, project?.edges]
  );

  // Load project data from database
  useEffect(() => {
    const loadProjectData = async () => {
      if (canvasId && !isLoadingProject) {
        setIsLoadingProject(true);
        try {
          // console.log('🔄 Loading project data from database for:', canvasId);
          const projectData = await getProjectById(canvasId, supabaseClient);
          // console.log('✅ Project data loaded:', {
          //   nodes: projectData?.nodes?.length || 0,
          //   edges: projectData?.edges?.length || 0,
          // });
          setProject(projectData);
        } catch (error) {
          console.error('❌ Failed to load project data:', error);
        } finally {
          setIsLoadingProject(false);
        }
      }
    };

    loadProjectData();
  }, [canvasId, supabaseClient]);

  // Load tags for metrics and relationships
  useEffect(() => {
    const loadTags = async () => {
      if (!canvasId || (metrics.length === 0 && relationships.length === 0))
        return;

      // Prevent multiple simultaneous tag loading operations
      if (isLoadingTags) return;

      // Check if we've already loaded tags for this exact data
      const currentMetricIds = new Set(metrics.map((m: MetricCard) => m.id));
      const currentRelationshipIds = new Set(
        relationships.map((r: Relationship) => r.id)
      );

      if (
        loadedTagsRef.current.canvasId === canvasId &&
        loadedTagsRef.current.metricIds.size === currentMetricIds.size &&
        loadedTagsRef.current.relationshipIds.size ===
          currentRelationshipIds.size &&
        [...loadedTagsRef.current.metricIds].every((id) =>
          currentMetricIds.has(id)
        ) &&
        [...loadedTagsRef.current.relationshipIds].every((id) =>
          currentRelationshipIds.has(id)
        )
      ) {
        // We've already loaded tags for this exact data, skip loading
        return;
      }

      setIsLoadingTags(true);
      try {
        // Load tags for metrics
        const metricTagPromises = metrics.map(async (metric: MetricCard) => {
          try {
            const tags = await getMetricCardTags(metric.id);
            return { id: metric.id, tags };
          } catch (error) {
            console.error(
              `Failed to load tags for metric ${metric.id}:`,
              error
            );
            return { id: metric.id, tags: [] };
          }
        });

        // Load tags for relationships
        const relationshipTagPromises = relationships.map(
          async (rel: Relationship) => {
            try {
              const tags = await getRelationshipTags(rel.id);
              return { id: rel.id, tags };
            } catch (error) {
              console.error(
                `Failed to load tags for relationship ${rel.id}:`,
                error
              );
              return { id: rel.id, tags: [] };
            }
          }
        );

        const [metricResults, relationshipResults] = await Promise.all([
          Promise.all(metricTagPromises),
          Promise.all(relationshipTagPromises),
        ]);

        // Convert to record format
        const metricTagsRecord = metricResults.reduce(
          (acc, { id, tags }) => {
            acc[id] = tags;
            return acc;
          },
          {} as Record<string, string[]>
        );

        const relationshipTagsRecord = relationshipResults.reduce(
          (acc, { id, tags }) => {
            acc[id] = tags;
            return acc;
          },
          {} as Record<string, string[]>
        );

        setMetricTags(metricTagsRecord);
        setRelationshipTags(relationshipTagsRecord);

        // Update the ref to track what we've loaded
        loadedTagsRef.current = {
          canvasId,
          metricIds: new Set(currentMetricIds) as Set<string>,
          relationshipIds: new Set(currentRelationshipIds) as Set<string>,
        };
      } catch (error) {
        console.error('Failed to load tags:', error);
      } finally {
        setIsLoadingTags(false);
      }
    };

    loadTags();
  }, [canvasId, metrics.length, relationships.length]);

  // Get derived data
  const metricCategories = useMemo(() => {
    const cats = new Set(metrics.map((m: MetricCard) => m.category));
    return Array.from(cats);
  }, [metrics]);

  const relationshipTypes = useMemo(() => {
    const types = new Set(relationships.map((r: Relationship) => r.type));
    return Array.from(types);
  }, [relationships]);

  const confidenceLevels = useMemo(() => {
    const levels = new Set(
      relationships.map((r: Relationship) => r.confidence)
    );
    return Array.from(levels);
  }, [relationships]);

  const getNodeById = (id: string) =>
    metrics.find((node: MetricCard) => node.id === id);

  return {
    canvasId,
    project,
    isLoadingProject,
    metrics,
    relationships,
    metricTags,
    relationshipTags,
    isLoadingTags,
    metricCategories,
    relationshipTypes,
    confidenceLevels,
    getNodeById,
    setProject,
    setMetricTags,
    setRelationshipTags,
  };
}
