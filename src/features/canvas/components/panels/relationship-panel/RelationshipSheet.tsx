// @ts-nocheck
// TODO(type-debt): pre-existing type errors quarantined when strict type-checking
// was enabled. See docs/architecture/TYPE_CHECK_DEBT.md. Fix the errors and remove
// this directive — do not add new code here assuming it is type-checked.
import { toast } from 'sonner';
import { track } from '@/shared/lib/analytics';
import { useConfirm } from '@/shared/components/ConfirmDialog';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { DockPanel } from '@/features/canvas/components/dock';
import { Textarea } from '@/shared/components/ui/textarea';
import {
  AlertCircle,
  BarChart3,
  Calendar,
  CheckSquare,
  Clock,
  Copy,
  Edit,
  ExternalLink,
  FileText,
  HelpCircle,
  MoreVertical,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  User,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import EvidenceDialog from '@/features/evidence/components/EvidenceDialog';
import { useProjectsStore } from '@/features/projects/stores/useProjectsStore';
import { useCanvasStore } from '@/lib/stores';
import { EnhancedTagInput } from '@/shared/components/ui/enhanced-tag-input';
import { analyzeCorrelation } from '@/lib/workers';
import {
  logAnalysisRun,
  logRelationshipUpdated,
} from '@/shared/lib/supabase/services/changelog';

import type {
  CausalStatus,
  ConfidenceLevel,
  Relationship,
  RelationshipType,
} from '@/shared/types';
import { CAUSAL_STATUS_LIST } from '@/features/canvas/constants/relationshipTypeMeta';
import {
  getEvidenceTypeIcon,
  getTypeColor,
  relationshipTypeOptions,
} from './constants';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';
import { InfoHint } from '@/shared/components/common/InfoHint';
import { useRelationshipEvidence, useRelationshipTags } from './hooks';
import { StrengthTrendCard } from './StrengthTrendCard';

interface RelationshipSheetProps {
  isOpen: boolean;
  onClose: () => void;
  relationshipId?: string;
  onSwitchToRelationship?: (relationshipId: string) => void;
}

export default function RelationshipSheet({
  isOpen,
  onClose,
  relationshipId,
  // onSwitchToRelationship,
}: RelationshipSheetProps) {
  const { canvasId } = useParams();
  const { getEdgeById, persistEdgeUpdate, persistEdgeDelete, getNodeById } =
    useCanvasStore();
  const confirm = useConfirm();
  const { getProjectById } = useProjectsStore();
  const currentProject = canvasId ? getProjectById(canvasId) : null;
  const relationship = relationshipId ? getEdgeById(relationshipId) : null;

  // Get source and target nodes for context
  const sourceNode = relationship ? getNodeById(relationship.sourceId) : null;
  const targetNode = relationship ? getNodeById(relationship.targetId) : null;

  // Form state - extend Relationship with analysis and checklist data
  const [formData, setFormData] = useState<
    Partial<
      Relationship & {
        analysisResults?: any;
        causalChecklist?: any[];
      }
    >
  >(() => ({
    type: relationship?.type || 'Probabilistic',
    confidence: relationship?.confidence || 'Medium',
    weight: relationship?.weight || 0,
    evidence: relationship?.evidence || [],
    notes: relationship?.notes || '',
    analysisResults: null,
    causalChecklist: [],
  }));

  const [activeTab, setActiveTab] = useState('settings');
  const [isModified, setIsModified] = useState(false);

  // Evidence management using hook
  const {
    selectedEvidence,
    isDialogOpen: isEvidenceDialogOpen,
    openDialog: handleOpenEvidenceDialog,
    closeDialog: handleCloseEvidenceDialog,
    saveEvidence: handleSaveEvidence,
    removeEvidence: handleRemoveEvidence,
    duplicateEvidence: handleDuplicateEvidence,
    changelog,
    isLoadingChangelog,
    refetchChangelog,
    strengthHistory,
  } = useRelationshipEvidence(
    relationshipId,
    canvasId,
    formData.evidence || [],
    (evidence) => handleFieldChange('evidence', evidence)
  );

  // Analysis state
  const [analysisResults, setAnalysisResults] = useState<{
    correlation: number;
    pValue: number;
    confidenceInterval: [number, number];
    sampleSize: number;
    isSignificant: boolean;
    effectSize: 'small' | 'medium' | 'large';
    powerAnalysis: {
      power: number;
      requiredSampleSize: number;
    };
  } | null>(null);
  const [isRunningAnalysis, setIsRunningAnalysis] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Tag management using hook
  const {
    tags: relationshipTags,
    isLoading: isLoadingTags,
    isSaving: isSavingTags,
    addTag: handleAddTag,
    removeTag: handleRemoveTag,
  } = useRelationshipTags(relationshipId);

  // Causal checklist state
  const [causalChecklist, setCausalChecklist] = useState([
    {
      id: 'temporal',
      label: 'Temporal Precedence',
      description: 'Does the cause happen before the effect?',
      checked: false,
      notes: '',
    },
    {
      id: 'covariation',
      label: 'Covariation',
      description: 'Is there a clear statistical relationship?',
      checked: false,
      notes: '',
    },
    {
      id: 'spuriousness',
      label: 'Non-Spuriousness',
      description: 'Have potential confounding variables been considered?',
      checked: false,
      notes: '',
    },
    {
      id: 'mechanism',
      label: 'Mechanism',
      description:
        'Is there a logical reason why this cause leads to this effect?',
      checked: false,
      notes: '',
    },
  ]);

  // Causal validation status (persisted in relationship.causalMetadata).
  const [causalStatus, setCausalStatus] = useState<CausalStatus>(
    relationship?.causalMetadata?.status ?? 'unvalidated'
  );

  // Get available tabs based on relationship type
  const getAvailableTabs = (type: RelationshipType) => {
    const baseTabs = ['settings', 'evidence', 'history'];

    switch (type) {
      case 'Probabilistic':
        return [...baseTabs, 'analysis'];
      case 'Causal':
        return [...baseTabs, 'checklist'];
      case 'Deterministic':
      case 'Compositional':
      default:
        return baseTabs;
    }
  };

  const availableTabs = getAvailableTabs(formData.type || 'Probabilistic');

  // Ensure active tab is valid for current relationship type
  useEffect(() => {
    if (!availableTabs.includes(activeTab)) {
      setActiveTab('settings');
    }
  }, [formData.type, availableTabs, activeTab]);

  // Tags are now loaded by the useRelationshipTags hook

  // Update form data when relationship changes
  useEffect(() => {
    if (relationship) {
      setFormData({
        type: relationship.type || 'Probabilistic',
        confidence: relationship.confidence || 'Medium',
        weight: relationship.weight || 0,
        evidence: relationship.evidence || [],
        notes: relationship.notes || '',
      });

      // Hydrate causal validation state from the persisted metadata (the static
      // labels/descriptions stay local; only checked/notes + status persist).
      const saved = relationship.causalMetadata;
      setCausalStatus(saved?.status ?? 'unvalidated');
      setCausalChecklist((prev) =>
        prev.map((item) => {
          const hit = saved?.checklist?.find((c) => c.id === item.id);
          return hit
            ? { ...item, checked: !!hit.checked, notes: hit.notes ?? '' }
            : { ...item, checked: false, notes: '' };
        })
      );
    }
  }, [relationship]);

  // Changelog is now loaded by the useRelationshipEvidence hook

  const handleFieldChange = (field: keyof Relationship, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsModified(true);
  };

  // Tag management functions are now provided by useRelationshipTags hook

  // Evidence management functions are now provided by useRelationshipEvidence hook

  // Helper functions for evidence display - now imported from constants

  // Function to log analysis runs
  const handleAnalysisRun = async (
    analysisType: string,
    results: Record<string, any> = {}
  ) => {
    if (relationship && currentProject) {
      try {
        await logAnalysisRun(
          relationship.id,
          `${sourceNode?.title} → ${targetNode?.title}`,
          analysisType,
          results,
          currentProject.id,
          'current-user' // TODO: Get from auth context
        );

        // Refresh changelog
        refetchChangelog();
      } catch (error) {
        console.error('Failed to log analysis run:', error);
      }
    }
  };

  // Extract a node's real numeric value series (from its tracked metric data).
  const seriesFromNode = (node: typeof sourceNode): number[] =>
    (node?.data ?? [])
      .map((d: { value?: number }) => d?.value)
      .filter((v: unknown): v is number => typeof v === 'number');

  // Function to run statistical analysis
  const handleRunAnalysis = async () => {
    if (!sourceNode || !targetNode) {
      setAnalysisError('Source and target nodes are required for analysis');
      return;
    }

    setIsRunningAnalysis(true);
    setAnalysisError(null);

    try {
      // Use the nodes' REAL metric values (not mock data).
      const sourceData = seriesFromNode(sourceNode);
      const targetData = seriesFromNode(targetNode);

      // Need enough overlapping data to correlate.
      if (sourceData.length < 3 || targetData.length < 3) {
        throw new Error(
          `Need at least 3 data points in each metric to analyze correlation (have ${sourceData.length} and ${targetData.length}). Add values to both cards first.`
        );
      }
      if (sourceData.length !== targetData.length) {
        throw new Error(
          `Both metrics must have the same number of data points to correlate (have ${sourceData.length} vs ${targetData.length}).`
        );
      }

      // Run correlation analysis using the worker
      const results = await analyzeCorrelation(sourceData, targetData);

      if (!results) {
        throw new Error('Analysis failed to return results');
      }

      setAnalysisResults(results);

      // Store results in component state
      // Note: analysisResults is not part of the Relationship type,
      // but we store it locally for UI display

      // Log the analysis run
      await handleAnalysisRun('Statistical Analysis', {
        correlation: results.correlation,
        pValue: results.pValue,
        sampleSize: results.sampleSize,
        isSignificant: results.isSignificant,
        effectSize: results.effectSize,
      });

      // Value signal: the analytical payoff of a live tree — running a real
      // correlation between two metrics.
      track('correlation_analyzed', {
        relationship_id: relationship?.id,
        project_id: currentProject?.id,
        correlation: results.correlation,
        p_value: results.pValue,
        sample_size: results.sampleSize,
        is_significant: results.isSignificant,
      });
    } catch (error) {
      console.error('Analysis failed:', error);
      setAnalysisError(
        error instanceof Error ? error.message : 'Analysis failed'
      );
    } finally {
      setIsRunningAnalysis(false);
    }
  };

  // Function to update checklist item
  const updateChecklistItem = (
    id: string,
    field: 'checked' | 'notes',
    value: boolean | string
  ) => {
    setCausalChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
    setIsModified(true);
  };

  const handleCausalStatusChange = (status: CausalStatus) => {
    setCausalStatus(status);
    setIsModified(true);
  };

  // Calculate checklist progress
  const checklistProgress =
    (causalChecklist.filter((item) => item.checked).length /
      causalChecklist.length) *
    100;

  const handleSave = async () => {
    if (relationship && relationshipId) {
      try {
        // Detect changes for logging
        const changes: Record<string, { from: any; to: any }> = {};

        if (formData.type !== relationship.type) {
          changes.type = { from: relationship.type, to: formData.type };
        }
        if (formData.confidence !== relationship.confidence) {
          changes.confidence = {
            from: relationship.confidence,
            to: formData.confidence,
          };
        }
        if (formData.weight !== relationship.weight) {
          changes.weight = { from: relationship.weight, to: formData.weight };
        }
        if (formData.notes !== relationship.notes) {
          changes.notes = {
            from: relationship.notes || '',
            to: formData.notes || '',
          };
        }

        // Save the relationship (causal validation state rides along for Causal).
        await persistEdgeUpdate(relationshipId, {
          ...formData,
          ...(formData.type === 'Causal'
            ? {
                causalMetadata: {
                  status: causalStatus,
                  checklist: causalChecklist.map((i) => ({
                    id: i.id,
                    checked: i.checked,
                    notes: i.notes,
                  })),
                },
              }
            : {}),
          updatedAt: new Date().toISOString(),
        });

        // Log changes if any
        if (Object.keys(changes).length > 0 && currentProject) {
          try {
            await logRelationshipUpdated(
              relationship.id,
              `${sourceNode?.title} → ${targetNode?.title}`,
              changes,
              currentProject.id,
              user?.id || 'anonymous-user'
            );

            // Refresh changelog
            refetchChangelog();
          } catch (error) {
            console.error('Failed to log relationship update:', error);
          }
        }

        setIsModified(false);
        onClose();
      } catch (error) {
        console.error('Failed to save relationship:', error);
        toast.error('Failed to save relationship. Please try again.');
      }
    }
  };

  const handleDelete = async () => {
    if (!relationship || !relationshipId) return;
    const confirmed = await confirm({
      title: 'Delete this relationship?',
      description: 'This action cannot be undone.',
      actionLabel: 'Delete',
      destructive: true,
    });
    if (!confirmed) return;
    try {
      await persistEdgeDelete(relationshipId);
      onClose();
    } catch (error) {
      console.error('Failed to delete relationship:', error);
      toast.error('Failed to delete relationship. Please try again.');
    }
  };

  if (!relationship || !sourceNode || !targetNode) {
    return null;
  }

  const selectedTypeConfig = relationshipTypeOptions.find(
    (opt) => opt.value === formData.type
  );

  const getStrengthColor = (value: number) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-muted-foreground';
  };

  return (
    <DockPanel
      open={isOpen}
      onClose={onClose}
      width="lg"
      eyebrow="Relationship"
      title={`${sourceNode?.title ?? '…'} → ${targetNode?.title ?? '…'}`}
      subtitle={
        selectedTypeConfig?.description ||
        'Configure relationship properties and evidence'
      }
      headerActions={
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.open('https://nadeemramli.com', '_blank')}
          className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
          title="Get help with relationships"
        >
          <HelpCircle className="h-4 w-4" />
        </Button>
      }
      padded={false}
    >
      <div className="p-4">
        <div>{/* Content */}
            {/* Tabs */}
            <div className="mb-6">
              <div className="flex space-x-1 bg-muted rounded-lg p-1">
                {availableTabs.includes('settings') && (
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all ${
                      activeTab === 'settings'
                        ? 'bg-card text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-muted-foreground'
                    }`}
                  >
                    Settings
                  </button>
                )}
                {availableTabs.includes('evidence') && (
                  <button
                    onClick={() => setActiveTab('evidence')}
                    className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all ${
                      activeTab === 'evidence'
                        ? 'bg-card text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-muted-foreground'
                    }`}
                  >
                    Evidence ({formData.evidence?.length || 0})
                  </button>
                )}
                {availableTabs.includes('history') && (
                  <button
                    onClick={() => setActiveTab('history')}
                    className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all ${
                      activeTab === 'history'
                        ? 'bg-card text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-muted-foreground'
                    }`}
                  >
                    History ({relationship?.history?.length || 0})
                  </button>
                )}
                {formData.type === 'Probabilistic' && (
                  <button
                    onClick={() => setActiveTab('analysis')}
                    className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all ${
                      activeTab === 'analysis'
                        ? 'bg-card text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-muted-foreground'
                    }`}
                  >
                    Analysis
                  </button>
                )}
                {formData.type === 'Causal' && (
                  <button
                    onClick={() => setActiveTab('checklist')}
                    className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all ${
                      activeTab === 'checklist'
                        ? 'bg-card text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-muted-foreground'
                    }`}
                  >
                    Checklist
                  </button>
                )}
              </div>
            </div>

            {/* Tab Content */}
            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                {/* Relationship Type */}
                <div className="space-y-3">
                  <label className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                    Relationship Type
                    <InfoHint
                      side="right"
                      content="How this metric relates to its target. Components (Deterministic, Compositional) are true by definition; influences (Probabilistic, Causal) are empirical levers. Hover a type for details."
                    />
                  </label>
                  <TooltipProvider delayDuration={150}>
                    <div className="grid grid-cols-2 gap-3">
                      {relationshipTypeOptions.map((type) => {
                        const Icon = type.icon;
                        return (
                          <Tooltip key={type.value}>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() =>
                                  handleFieldChange('type', type.value)
                                }
                                className={`p-3 rounded-lg border-2 text-left transition-all ${
                                  formData.type === type.value
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-border hover:border-border'
                                }`}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <Icon className="w-4 h-4" />
                                  <span className="font-medium text-sm">
                                    {type.label}
                                  </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {type.description}
                                </p>
                              </button>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              className="max-w-xs text-xs leading-relaxed"
                            >
                              {type.tooltip}
                            </TooltipContent>
                          </Tooltip>
                        );
                      })}
                    </div>
                  </TooltipProvider>
                </div>

                {/* Confidence & Strength */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Confidence
                    </label>
                    <select
                      value={formData.confidence}
                      onChange={(e) =>
                        handleFieldChange(
                          'confidence',
                          e.target.value as ConfidenceLevel
                        )
                      }
                      className="w-full p-2 border border-border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="High">🟢 High</option>
                      <option value="Medium">🟡 Medium</option>
                      <option value="Low">🔴 Low</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-muted-foreground">
                        Strength
                      </label>
                      <span
                        className={`text-sm font-medium px-2 py-1 rounded ${getStrengthColor(formData.weight || 0)}`}
                      >
                        {formData.weight && formData.weight > 0
                          ? `+${formData.weight}`
                          : formData.weight || 0}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={formData.weight || 0}
                      onChange={(e) =>
                        handleFieldChange('weight', parseInt(e.target.value))
                      }
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Negative (-100)</span>
                      <span>Neutral (0)</span>
                      <span>Positive (+100)</span>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Notes
                  </label>
                  <textarea
                    placeholder="Add notes about this relationship..."
                    value={formData.notes || ''}
                    onChange={(e) => handleFieldChange('notes', e.target.value)}
                    className="w-full p-3 border border-border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Tags
                  </label>
                  {isLoadingTags ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span className="ml-2 text-sm text-muted-foreground">
                        Loading tags...
                      </span>
                    </div>
                  ) : (
                    <EnhancedTagInput
                      tags={relationshipTags}
                      onAdd={handleAddTag}
                      onRemove={handleRemoveTag}
                      placeholder="Add tags..."
                      maxTags={10}
                      className="min-h-[2.5rem]"
                      showCreateOption={true}
                      showSearchResults={true}
                    />
                  )}
                  {isSavingTags && (
                    <div className="flex items-center justify-center py-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="ml-2 text-xs text-muted-foreground">
                        Saving tags...
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons - Only in Settings Tab */}
                <div className="pt-6 mt-6 border-t border-border">
                  <div className="flex items-center justify-between">
                    <Button
                      variant="destructive"
                      onClick={handleDelete}
                      className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={onClose}
                        className="px-4 py-2 border border-border text-muted-foreground rounded-lg hover:bg-muted/60 transition-colors"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSave}
                        disabled={!isModified}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Save className="h-4 w-4" />
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Evidence Tab */}
            {activeTab === 'evidence' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">
                      Evidence Repository
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      All supporting evidence for this relationship
                    </p>
                  </div>
                  <Button
                    onClick={() => handleOpenEvidenceDialog()}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Evidence
                  </Button>
                </div>

                {/* Evidence Grid */}
                <div className="space-y-4">
                  {formData.evidence && formData.evidence.length > 0 ? (
                    formData.evidence.map((evidence) => {
                      const TypeIcon = getEvidenceTypeIcon(evidence.type);
                      return (
                        <div
                          key={evidence.id}
                          className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <div
                                  className={`p-2 rounded-lg ${getTypeColor(
                                    evidence.type
                                  )}`}
                                >
                                  <TypeIcon className="h-4 w-4" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-lg">
                                    {evidence.title}
                                  </h3>
                                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <Badge
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {evidence.type}
                                    </Badge>
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      {new Date(
                                        evidence.date
                                      ).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <User className="h-3 w-3" />
                                      {evidence.owner || 'Unknown'}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-3">
                                {evidence.hypothesis && (
                                  <div>
                                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                      HYPOTHESIS
                                    </span>
                                    <p className="text-sm mt-1 text-muted-foreground">
                                      {evidence.hypothesis}
                                    </p>
                                  </div>
                                )}

                                <div>
                                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                    SUMMARY
                                  </span>
                                  <p className="text-sm mt-1 text-muted-foreground">
                                    {evidence.summary}
                                  </p>
                                </div>

                                {evidence.impactOnConfidence && (
                                  <div>
                                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                      IMPACT ON CONFIDENCE
                                    </span>
                                    <p className="text-sm mt-1 text-blue-600 font-medium">
                                      {evidence.impactOnConfidence}
                                    </p>
                                  </div>
                                )}

                                {evidence.link && (
                                  <div className="pt-2">
                                    <a
                                      href={evidence.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                                    >
                                      <ExternalLink className="h-3 w-3" />
                                      View Source
                                    </a>
                                  </div>
                                )}
                              </div>
                            </div>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleOpenEvidenceDialog(evidence)
                                  }
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleDuplicateEvidence(evidence)
                                  }
                                >
                                  <Copy className="mr-2 h-4 w-4" />
                                  Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleRemoveEvidence(evidence.id)
                                  }
                                  className="text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Remove from Relationship
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <FileText className="h-16 w-16 mx-auto mb-4 opacity-30" />
                      <h3 className="text-lg font-medium mb-2">
                        No Evidence Yet
                      </h3>
                      <p className="text-sm mb-4">
                        Add evidence to support and strengthen this relationship
                      </p>
                      <Button
                        onClick={() => handleOpenEvidenceDialog()}
                        variant="outline"
                        className="inline-flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Add Your First Evidence
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold">Audit Trail</h3>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive log of all changes and activities for this
                    relationship
                  </p>
                </div>

                <StrengthTrendCard points={strengthHistory} />

                {isLoadingChangelog ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p>Loading history...</p>
                  </div>
                ) : changelog.length > 0 ? (
                  <div className="space-y-4">
                    {changelog.map((entry, index) => {
                      const getActionColor = (action: string) => {
                        switch (action) {
                          case 'created':
                            return 'bg-green-500';
                          case 'updated':
                            return 'bg-blue-500';
                          case 'evidence_added':
                            return 'bg-purple-500';
                          case 'evidence_removed':
                            return 'bg-red-500';
                          case 'analysis_run':
                            return 'bg-orange-500';
                          default:
                            return 'bg-muted/500';
                        }
                      };

                      const getActionIcon = (action: string) => {
                        switch (action) {
                          case 'created':
                            return <Plus className="h-3 w-3" />;
                          case 'updated':
                            return <Edit className="h-3 w-3" />;
                          case 'evidence_added':
                            return <FileText className="h-3 w-3" />;
                          case 'evidence_removed':
                            return <Trash2 className="h-3 w-3" />;
                          case 'analysis_run':
                            return <BarChart3 className="h-3 w-3" />;
                          default:
                            return <Clock className="h-3 w-3" />;
                        }
                      };

                      const formatTimestamp = (timestamp: string) => {
                        const date = new Date(timestamp);
                        const isToday =
                          date.toDateString() === new Date().toDateString();

                        if (isToday) {
                          return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                        } else {
                          return date.toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          });
                        }
                      };

                      return (
                        <div
                          key={entry.id}
                          className="flex gap-4 pb-4 border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-8 h-8 rounded-full ${getActionColor(
                                entry.action
                              )} flex items-center justify-center text-white`}
                            >
                              {getActionIcon(entry.action)}
                            </div>
                            {index < changelog.length - 1 && (
                              <div className="w-px h-6 bg-gray-200 mt-2"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-medium text-foreground">
                                {entry.description}
                              </p>
                              <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground capitalize">
                                {entry.action.replace('_', ' ')}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>{formatTimestamp(entry.timestamp)}</span>
                              {entry.userId && <span>by {entry.userId}</span>}
                            </div>

                            {/* Show metadata if available */}
                            {entry.metadata && (
                              <div className="mt-2 p-2 bg-muted/50 border border-border rounded text-xs">
                                {entry.action === 'updated' &&
                                  entry.metadata.changes && (
                                    <div className="space-y-1">
                                      <strong>Changes:</strong>
                                      {Object.entries(
                                        entry.metadata.changes
                                      ).map(
                                        ([field, change]: [string, any]) => (
                                          <div key={field} className="text-xs">
                                            <span className="font-medium capitalize">
                                              {field}:
                                            </span>{' '}
                                            <span className="text-red-600">
                                              {change.from}
                                            </span>{' '}
                                            →{' '}
                                            <span className="text-green-600">
                                              {change.to}
                                            </span>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  )}
                                {(entry.action === 'evidence_added' ||
                                  entry.action === 'evidence_removed') && (
                                  <div>
                                    <strong>Evidence:</strong>{' '}
                                    {entry.metadata.evidenceTitle}
                                    {entry.metadata.evidenceType && (
                                      <span className="ml-2 px-1 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                                        {entry.metadata.evidenceType}
                                      </span>
                                    )}
                                  </div>
                                )}
                                {entry.action === 'analysis_run' && (
                                  <div>
                                    <strong>Analysis Type:</strong>{' '}
                                    {entry.metadata.analysisType}
                                    {entry.metadata.results && (
                                      <div className="mt-1 text-xs text-muted-foreground">
                                        Results logged
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Clock className="h-16 w-16 mx-auto mb-4 opacity-30" />
                    <h3 className="text-lg font-medium mb-2">No History Yet</h3>
                    <p className="text-sm mb-4">
                      Activities and changes will be automatically tracked here
                    </p>
                    <p className="text-xs text-muted-foreground/70">
                      Try adding evidence, changing settings, or running
                      analysis to see events appear
                    </p>
                  </div>
                )}

                {/* Quick Stats */}
                {changelog.length > 0 && (
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-semibold text-foreground">
                          {
                            changelog.filter(
                              (e) => e.action === 'evidence_added'
                            ).length
                          }
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Evidence Added
                        </div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-foreground">
                          {
                            changelog.filter((e) => e.action === 'updated')
                              .length
                          }
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Settings Updates
                        </div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-foreground">
                          {
                            changelog.filter((e) => e.action === 'analysis_run')
                              .length
                          }
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Analyses Run
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Analysis Tab (Probabilistic only) */}
            {activeTab === 'analysis' && formData.type === 'Probabilistic' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">
                      Statistical Analysis
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Correlation analysis and statistical evidence
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleRunAnalysis}
                    disabled={isRunningAnalysis}
                    className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted/60 transition-colors disabled:opacity-50"
                  >
                    {isRunningAnalysis ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    ) : (
                      <RotateCcw className="w-4 h-4" />
                    )}
                    {isRunningAnalysis
                      ? 'Running Analysis...'
                      : 'Re-run Analysis'}
                  </Button>
                </div>

                <div className="space-y-6">
                  <div className="space-y-6">
                    {/* Error State */}
                    {analysisError && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-red-800">
                          <AlertCircle className="h-5 w-5" />
                          <span className="font-medium">Analysis Error</span>
                        </div>
                        <p className="text-sm text-red-700 mt-1">
                          {analysisError}
                        </p>
                      </div>
                    )}

                    {/* Analysis Results */}
                    {analysisResults ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-card border rounded-lg p-4">
                          <h4 className="text-base font-medium mb-4">
                            Correlation Metrics
                          </h4>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">
                                Correlation Coefficient (r)
                              </span>
                              <span
                                className={`text-sm font-medium px-2 py-1 rounded ${
                                  Math.abs(analysisResults.correlation) > 0.5
                                    ? 'text-green-600 bg-green-50'
                                    : Math.abs(analysisResults.correlation) >
                                        0.3
                                      ? 'text-yellow-600 bg-yellow-50'
                                      : 'text-red-600 bg-red-50'
                                }`}
                              >
                                {analysisResults.correlation.toFixed(3)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">
                                P-value
                              </span>
                              <span
                                className={`text-sm font-medium px-2 py-1 rounded ${
                                  analysisResults.isSignificant
                                    ? 'text-green-600 bg-green-50'
                                    : 'text-red-600 bg-red-50'
                                }`}
                              >
                                {analysisResults.pValue < 0.001
                                  ? '< 0.001'
                                  : analysisResults.pValue.toFixed(3)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">
                                Sample Size
                              </span>
                              <span className="text-sm font-medium px-2 py-1 bg-muted rounded">
                                {analysisResults.sampleSize}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">
                                Effect Size
                              </span>
                              <span
                                className={`text-sm font-medium px-2 py-1 rounded capitalize ${
                                  analysisResults.effectSize === 'large'
                                    ? 'text-green-600 bg-green-50'
                                    : analysisResults.effectSize === 'medium'
                                      ? 'text-yellow-600 bg-yellow-50'
                                      : 'text-muted-foreground bg-muted'
                                }`}
                              >
                                {analysisResults.effectSize}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">
                                Statistical Significance
                              </span>
                              <span
                                className={`text-sm font-medium px-2 py-1 rounded ${
                                  analysisResults.isSignificant
                                    ? 'text-green-600 bg-green-50'
                                    : 'text-red-600 bg-red-50'
                                }`}
                              >
                                {analysisResults.isSignificant
                                  ? 'Significant'
                                  : 'Not Significant'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-card border rounded-lg p-4">
                          <h4 className="text-base font-medium mb-4">
                            Advanced Metrics
                          </h4>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">
                                Confidence Interval (95%)
                              </span>
                              <span className="text-sm font-medium px-2 py-1 bg-muted rounded">
                                [
                                {analysisResults.confidenceInterval[0].toFixed(
                                  3
                                )}
                                ,{' '}
                                {analysisResults.confidenceInterval[1].toFixed(
                                  3
                                )}
                                ]
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">
                                Statistical Power
                              </span>
                              <span className="text-sm font-medium px-2 py-1 bg-muted rounded">
                                {(
                                  analysisResults.powerAnalysis.power * 100
                                ).toFixed(1)}
                                %
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">
                                Required Sample Size
                              </span>
                              <span className="text-sm font-medium px-2 py-1 bg-muted rounded">
                                {
                                  analysisResults.powerAnalysis
                                    .requiredSampleSize
                                }
                              </span>
                            </div>
                          </div>

                          {/* Interpretation */}
                          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                            <h5 className="text-sm font-medium text-blue-900 mb-1">
                              Interpretation
                            </h5>
                            <p className="text-xs text-blue-800">
                              {analysisResults.isSignificant
                                ? `There is a statistically significant ${analysisResults.effectSize} correlation between the variables.`
                                : 'No statistically significant correlation was found between the variables.'}
                              {analysisResults.powerAnalysis.power < 0.8 &&
                                ' Consider collecting more data to increase statistical power.'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-30" />
                        <h3 className="text-lg font-medium mb-2">
                          No Analysis Results
                        </h3>
                        <p className="text-sm mb-4">
                          Click "Re-run Analysis" to perform statistical
                          analysis on this relationship
                        </p>
                        <p className="text-xs text-muted-foreground/70">
                          Analysis will calculate correlation, statistical
                          significance, and effect size
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Causal Checklist Tab (Causal only) */}
            {activeTab === 'checklist' && formData.type === 'Causal' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold">
                    Causal Validation Checklist
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Systematic validation of causal claims based on established
                    criteria
                  </p>
                </div>

                {/* Validation status — surfaces on the edge (CVS-264) */}
                <div>
                  <p className="mb-2 text-sm font-medium text-muted-foreground">
                    Validation status
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {CAUSAL_STATUS_LIST.map((s) => (
                      <button
                        key={s.status}
                        type="button"
                        onClick={() => handleCausalStatusChange(s.status)}
                        className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                          causalStatus === s.status
                            ? `${s.badge} font-medium`
                            : 'border-border text-muted-foreground hover:bg-muted/60'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Correlation isn't causation — work the checklist below, then
                    mark this claim <strong>validated</strong> or{' '}
                    <strong>refuted</strong>. A refuted causal link is flagged on
                    the canvas.
                  </p>
                </div>

                <div className="space-y-4">
                  {causalChecklist.map((item) => (
                    <div
                      key={item.id}
                      className={`bg-card border-l-4 rounded-lg p-4 ${
                        item.checked
                          ? 'border-l-green-500'
                          : 'border-l-gray-300'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={(e) =>
                            updateChecklistItem(
                              item.id,
                              'checked',
                              e.target.checked
                            )
                          }
                          className="mt-1 w-4 h-4 text-blue-600 border-border rounded focus:ring-blue-500"
                        />
                        <div className="flex-1 space-y-3">
                          <div>
                            <h4 className="text-base font-medium">
                              {item.label}
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {item.description}
                            </p>
                          </div>
                          <Textarea
                            placeholder="Add notes explaining how this criterion is met..."
                            value={item.notes}
                            onChange={(e) =>
                              updateChecklistItem(
                                item.id,
                                'notes',
                                e.target.value
                              )
                            }
                            className="w-full p-3 border border-border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckSquare className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-900">
                      Causal Validation Progress
                    </span>
                  </div>
                  <p className="text-sm text-blue-700 mb-2">
                    {causalChecklist.filter((item) => item.checked).length} of{' '}
                    {causalChecklist.length} criteria validated
                  </p>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${checklistProgress}%`,
                      }}
                    ></div>
                  </div>
                  {checklistProgress === 100 && (
                    <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded">
                      <p className="text-sm text-green-800 font-medium">
                        🎉 All causal validation criteria have been met!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
        </div>
      </div>

      {/* Evidence Dialog */}
      <EvidenceDialog
        isOpen={isEvidenceDialogOpen}
        onClose={handleCloseEvidenceDialog}
        onSave={handleSaveEvidence}
        evidence={selectedEvidence}
        title={
          selectedEvidence ? 'Edit Evidence' : 'Add Evidence to Relationship'
        }
        description={
          selectedEvidence
            ? 'Update the evidence details below'
            : 'Add new evidence to support this relationship'
        }
      />
    </DockPanel>
  );
}
