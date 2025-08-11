/**
 * Relationship Panel Hooks
 * Custom hooks for evidence and tag management
 */

import { useAppStore, useCanvasStore } from '@/lib/stores';
import { useEvidenceStore } from '@/lib/stores/evidenceStore';
import { useProjectsStore } from '@/lib/stores/projectsStore';
import {
  getChangelogForTarget,
  logEvidenceAdded,
  logEvidenceRemoved,
  type ChangelogEntry,
} from '@/lib/supabase/services/changelog';
import {
  addTagsToRelationship,
  getRelationshipTags,
  removeTagsFromRelationship,
} from '@/lib/supabase/services/tags';
import type { EvidenceItem } from '@/lib/types';
import { useCallback, useEffect, useState } from 'react';

/**
 * Hook for managing relationship tags
 */
export function useRelationshipTags(relationshipId?: string) {
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const loadTags = useCallback(async () => {
    if (!relationshipId) return;

    setIsLoading(true);
    try {
      const relationshipTags = await getRelationshipTags(relationshipId);
      setTags(relationshipTags);
    } catch (error) {
      console.error('Failed to load relationship tags:', error);
      setTags([]);
    } finally {
      setIsLoading(false);
    }
  }, [relationshipId]);

  useEffect(() => {
    loadTags();
  }, [loadTags]);

  const addTag = useCallback(
    async (tag: string) => {
      if (!relationshipId) return;

      setIsSaving(true);
      try {
        await addTagsToRelationship(relationshipId, [tag]);
        // Reload tags to get the updated list
        const updatedTags = await getRelationshipTags(relationshipId);
        setTags(updatedTags);
      } catch (error) {
        console.error('Failed to add tag:', error);
      } finally {
        setIsSaving(false);
      }
    },
    [relationshipId]
  );

  const removeTag = useCallback(
    async (tagToRemove: string) => {
      if (!relationshipId) return;

      setIsSaving(true);
      try {
        await removeTagsFromRelationship(relationshipId, [tagToRemove]);
        // Reload tags to get the updated list
        const updatedTags = await getRelationshipTags(relationshipId);
        setTags(updatedTags);
      } catch (error) {
        console.error('Failed to remove tag:', error);
      } finally {
        setIsSaving(false);
      }
    },
    [relationshipId]
  );

  return {
    tags,
    isLoading,
    isSaving,
    addTag,
    removeTag,
    refetch: loadTags,
  };
}

/**
 * Hook for managing relationship evidence
 */
export function useRelationshipEvidence(
  relationshipId?: string,
  projectId?: string,
  evidence: EvidenceItem[] = [],
  onEvidenceChange?: (evidence: EvidenceItem[]) => void
) {
  const { addEvidence, updateEvidence, deleteEvidence } = useEvidenceStore();
  const { getNodeById } = useCanvasStore();
  const { getProjectById } = useProjectsStore();
  const { user } = useAppStore();

  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceItem | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [changelog, setChangelog] = useState<ChangelogEntry[]>([]);
  const [isLoadingChangelog, setIsLoadingChangelog] = useState(false);

  const currentProject = projectId ? getProjectById(projectId) : null;
  const relationship = relationshipId
    ? useCanvasStore.getState().getEdgeById(relationshipId)
    : null;
  const sourceNode = relationship ? getNodeById(relationship.sourceId) : null;
  const targetNode = relationship ? getNodeById(relationship.targetId) : null;

  // Load changelog
  const loadChangelog = useCallback(async () => {
    if (!relationshipId) return;

    setIsLoadingChangelog(true);
    try {
      const entries = await getChangelogForTarget(
        relationshipId,
        'relationship'
      );
      setChangelog(entries);
    } catch (error) {
      console.error('Failed to load changelog:', error);
      setChangelog([]);
    } finally {
      setIsLoadingChangelog(false);
    }
  }, [relationshipId]);

  useEffect(() => {
    loadChangelog();
  }, [loadChangelog]);

  const openDialog = useCallback((evidence?: EvidenceItem) => {
    setSelectedEvidence(evidence || null);
    setIsDialogOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setIsDialogOpen(false);
    setSelectedEvidence(null);
  }, []);

  const saveEvidence = useCallback(
    async (evidenceItem: EvidenceItem) => {
      if (selectedEvidence) {
        // Update existing evidence
        updateEvidence(evidenceItem.id, evidenceItem);
        // Update the evidence in the relationship
        const updatedEvidence = evidence.map((e) =>
          e.id === evidenceItem.id ? evidenceItem : e
        );
        onEvidenceChange?.(updatedEvidence);
      } else {
        // Add new evidence to global store with relationship context
        const evidenceWithContext: EvidenceItem = {
          ...evidenceItem,
          context: {
            type: 'relationship',
            targetId: relationship?.id,
            targetName: `${sourceNode?.title} → ${targetNode?.title}`,
          },
        };
        addEvidence(evidenceWithContext);
        // Add evidence to relationship
        onEvidenceChange?.([...evidence, evidenceWithContext]);

        // Log evidence addition
        if (relationship && currentProject) {
          try {
            await logEvidenceAdded(
              relationship.id,
              `${sourceNode?.title} → ${targetNode?.title}`,
              evidenceItem.title,
              evidenceItem.type,
              currentProject.id,
              user?.id || 'anonymous-user'
            );
            loadChangelog();
          } catch (error) {
            console.error('Failed to log evidence addition:', error);
          }
        }
      }
    },
    [
      selectedEvidence,
      updateEvidence,
      addEvidence,
      onEvidenceChange,
      evidence,
      relationship,
      sourceNode,
      targetNode,
      currentProject,
      user?.id,
      loadChangelog,
    ]
  );

  const removeEvidence = useCallback(
    async (evidenceId: string) => {
      const evidenceToRemove = evidence.find((e) => e.id === evidenceId);

      // Remove from global evidence store
      deleteEvidence(evidenceId);
      // Remove from relationship
      const updatedEvidence = evidence.filter((e) => e.id !== evidenceId);
      onEvidenceChange?.(updatedEvidence);

      // Log evidence removal
      if (relationship && currentProject && evidenceToRemove) {
        try {
          await logEvidenceRemoved(
            relationship.id,
            `${sourceNode?.title} → ${targetNode?.title}`,
            evidenceToRemove.title,
            currentProject.id,
            user?.id || 'anonymous-user'
          );
          loadChangelog();
        } catch (error) {
          console.error('Failed to log evidence removal:', error);
        }
      }
    },
    [
      evidence,
      deleteEvidence,
      onEvidenceChange,
      relationship,
      currentProject,
      sourceNode,
      targetNode,
      user?.id,
      loadChangelog,
    ]
  );

  const duplicateEvidence = useCallback(
    (evidenceItem: EvidenceItem) => {
      const duplicate = {
        ...evidenceItem,
        id: `evidence_${Date.now()}`,
        title: `${evidenceItem.title} (Copy)`,
        createdAt: new Date().toISOString(),
      };
      addEvidence(duplicate);
      onEvidenceChange?.([...evidence, duplicate]);
    },
    [addEvidence, onEvidenceChange, evidence]
  );

  return {
    // Dialog state
    selectedEvidence,
    isDialogOpen,
    openDialog,
    closeDialog,

    // Evidence operations
    saveEvidence,
    removeEvidence,
    duplicateEvidence,

    // Changelog
    changelog,
    isLoadingChangelog,
    refetchChangelog: loadChangelog,
  };
}
