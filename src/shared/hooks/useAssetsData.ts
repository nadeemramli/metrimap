import { useAuthenticatedSupabase } from '@/shared/contexts/AuthenticatedSupabaseContext';
import { useCanvasStore } from '@/lib/stores';
import { getProjectById } from '@/shared/lib/supabase/services/projects';
import {
  getMetricCardTags,
  getRelationshipTags,
} from '@/shared/lib/supabase/services/tags';
import type { MetricCard, Relationship } from '@/shared/types';
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

  // Monotonic token so only the latest tag-load run commits its results
  const tagLoadSeq = useRef(0);

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
    let cancelled = false;

    const loadProjectData = async () => {
      if (canvasId) {
        setIsLoadingProject(true);
        try {
          // console.log('🔄 Loading project data from database for:', canvasId);
          const projectData = await getProjectById(canvasId, supabaseClient);
          // console.log('✅ Project data loaded:', {
          //   nodes: projectData?.nodes?.length || 0,
          //   edges: projectData?.edges?.length || 0,
          // });
          if (!cancelled) {
            setProject(projectData);
          }
        } catch (error) {
          console.error('❌ Failed to load project data:', error);
        } finally {
          if (!cancelled) {
            setIsLoadingProject(false);
          }
        }
      }
    };

    loadProjectData();

    return () => {
      cancelled = true;
    };
  }, [canvasId, supabaseClient]);

  // Stable identity of the id sets so equal-length replacements still re-fire the effect
  const metricIdsKey = useMemo(
    () =>
      metrics
        .map((m: MetricCard) => m.id)
        .sort()
        .join(','),
    [metrics]
  );
  const relationshipIdsKey = useMemo(
    () =>
      relationships
        .map((r: Relationship) => r.id)
        .sort()
        .join(','),
    [relationships]
  );

  // Load tags for metrics and relationships
  useEffect(() => {
    const loadTags = async () => {
      if (!canvasId || (metrics.length === 0 && relationships.length === 0))
        return;

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

      const seq = ++tagLoadSeq.current;
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

        // Only the latest run commits — a superseded run must not overwrite newer data
        if (seq === tagLoadSeq.current) {
          setMetricTags(metricTagsRecord);
          setRelationshipTags(relationshipTagsRecord);

          // Update the ref to track what we've loaded
          loadedTagsRef.current = {
            canvasId,
            metricIds: new Set(currentMetricIds) as Set<string>,
            relationshipIds: new Set(currentRelationshipIds) as Set<string>,
          };
        }
      } catch (error) {
        console.error('Failed to load tags:', error);
      } finally {
        if (seq === tagLoadSeq.current) {
          setIsLoadingTags(false);
        }
      }
    };

    loadTags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasId, metricIdsKey, relationshipIdsKey]);

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
