import { toast } from 'sonner';
import { InlineEditableField } from '@/features/canvas/components/node-function/inline-editable-field';
import { CommentsTab } from '@/features/canvas/components/panels/metric-panel/tabs/comments-tab';
import { DataEventsTab } from '@/features/canvas/components/panels/metric-panel/tabs/data-events-tab';
import { ResultsTab } from '@/features/canvas/components/panels/metric-panel/tabs/results-tab';
import { SettingsTab } from '@/features/canvas/components/panels/metric-panel/tabs/settings-tab';
import { WorkflowSection } from '@/features/canvas/components/panels/metric-panel/WorkflowSection';
import { NodeVisibilityControl } from '@/features/settings/components/NodeVisibilityControl';
import LinkedEvidenceList from '@/features/canvas/components/panels/metric-panel/LinkedEvidenceList';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { DockPanel } from '@/features/canvas/components/dock';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui/tabs';
import { Textarea } from '@/shared/components/ui/textarea';
import {
  ChevronRight,
  PieChart,
  Plus,
  Settings,
  Trash2,
  X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { useCanvasStore } from '@/lib/stores';
import { useConfirm } from '@/shared/components/ConfirmDialog';
import { useClerkSupabase } from '@/shared/hooks/useClerkSupabase';
import {
  linkCardToMetric,
  promoteCardToTrackedMetric,
} from '@/shared/lib/supabase/services/trackedMetrics';
import AlertsTab from './AlertsTab';
import { Badge } from '@/shared/components/ui/badge';
import type { MetricCard, Segment } from '@/shared/types';
// Source pipeline UI is now owned by Source Node; removed from card settings

interface CardSettingsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  cardId?: string;
  initialTab?: string;
  onSwitchToCard?: (cardId: string, tab?: string) => void;
}

function CardSettingsSheetComponent({
  isOpen,
  onClose,
  cardId,
  initialTab = 'data',
  // onSwitchToCard,
}: CardSettingsSheetProps): React.ReactElement {
  // NOTE: no early `if (!isOpen) return` here — that ran before the hooks below
  // and violated the Rules of Hooks (hooks must run in the same order every
  // render). The <DockPanel open={isOpen}> at the bottom already gates rendering.

  const { getNodeById, persistNodeUpdate, persistNodeDelete } =
    useCanvasStore();
  const confirm = useConfirm();
  const catalogClient = useClerkSupabase();
  const card = cardId ? getNodeById(cardId) : null;

  const [activeTab, setActiveTab] = useState(initialTab);
  const [isModified, setIsModified] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [catalogBusy, setCatalogBusy] = useState(false);

  // Semantic layer: promote this (operationalized) card into the Metric Catalog.
  const cardHasData = Array.isArray(card?.data) && card.data.length > 0;
  const isCatalogued = Boolean(card?.trackedMetricId);
  const handleCatalogMetric = async () => {
    if (!card || !cardId || !catalogClient) return;
    setCatalogBusy(true);
    try {
      const trackedId = await promoteCardToTrackedMetric(
        {
          cardId,
          projectId: useCanvasStore.getState().canvas?.id ?? null,
          name: card.title || 'Untitled metric',
          formula: card.formula ?? null,
          source_kind: card.sourceType ?? undefined,
        },
        catalogClient
      );
      // Optimistic local update so the Tracked badge appears immediately.
      useCanvasStore.getState().updateNode(cardId, {
        trackedMetricId: trackedId,
      } as Partial<MetricCard>);
      toast.success('Added to Metric Catalog');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to catalog metric'
      );
    } finally {
      setCatalogBusy(false);
    }
  };

  // Detach: fork this card into an independent copy. It keeps its current
  // title/formula/values (already hydrated from the catalog) but stops
  // referencing the Tracked Metric — future catalog edits no longer flow to it.
  const handleDetachMetric = async () => {
    if (!card || !cardId || !catalogClient) return;
    setCatalogBusy(true);
    try {
      await linkCardToMetric(cardId, null, catalogClient);
      useCanvasStore.getState().updateNode(cardId, {
        trackedMetricId: null,
      } as Partial<MetricCard>);
      // Persist the currently-displayed series onto the card. Referenced cards
      // hydrate values from the catalog on load; once detached they won't, so
      // freeze what's on screen as the fork's own data (else it could reload to
      // whatever was last in the card's own DB row).
      if (Array.isArray(card.data) && card.data.length) {
        await useCanvasStore
          .getState()
          .persistNodeUpdate(cardId, { data: card.data } as Partial<MetricCard>);
      }
      toast.success('Detached from catalog — this card is now independent');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to detach metric'
      );
    } finally {
      setCatalogBusy(false);
    }
  };

  // Form state
  const [formData, setFormData] = useState<Partial<MetricCard>>(() => ({
    title: card?.title || '',
    description: card?.description || '',
    category: card?.category || 'Data/Metric',
    subCategory: card?.subCategory,
    tags: card?.tags || [],
    dimensions: card?.dimensions || [],
    causalFactors: card?.causalFactors || [],
    sourceType: card?.sourceType || 'Manual',
    formula: card?.formula || '',
    owner: card?.owner || '',
  }));

  // Update form data when card changes
  useEffect(() => {
    if (card) {
      setFormData({
        title: card.title || '',
        description: card.description || '',
        category: card.category || 'Data/Metric',
        subCategory: card.subCategory,
        tags: card.tags || [],
        dimensions: card.dimensions || [],
        causalFactors: card.causalFactors || [],
        sourceType: card.sourceType || 'Manual',
        formula: card.formula || '',
        owner: card.owner || '',
      });
    }
  }, [card]);

  // Update active tab when initialTab changes
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const handleFieldChange = async (field: keyof MetricCard, value: any) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    setIsModified(true);

    // Auto-save critical fields immediately
    if (
      card &&
      cardId &&
      ['title', 'description', 'category', 'subCategory'].includes(field)
    ) {
      try {
        await persistNodeUpdate(cardId, {
          [field]: value,
          updatedAt: new Date().toISOString(),
        });
      } catch (error) {
        console.error(`Failed to auto-save ${field}:`, error);
      }
    }
  };

  const handleSave = async () => {
    if (card && cardId) {
      try {
        await persistNodeUpdate(cardId, {
          ...formData,
          updatedAt: new Date().toISOString(),
        });
        setIsModified(false);
        onClose();
      } catch (error) {
        console.error('Failed to save card:', error);
        toast.error('Failed to save card. Please try again.');
      }
    }
  };

  const handleDelete = async () => {
    if (!card || !cardId) return;
    const confirmed = await confirm({
      title: 'Delete this card?',
      description: 'This action cannot be undone.',
      actionLabel: 'Delete',
      destructive: true,
    });
    if (!confirmed) return;
    try {
      await persistNodeDelete(cardId);
      onClose();
    } catch (error) {
      console.error('Failed to delete card:', error);
      toast.error('Failed to delete card. Please try again.');
    }
  };

  const handleTabChange = (field: string, value: any) => {
    setIsModified(true);
    // Update the form data to reflect changes
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle switching to a different card (for persistent sheet)
  // const handleSwitchToDifferentCard = (newCardId: string, tab?: string) => {
  //   if (onSwitchToCard) {
  //     onSwitchToCard(newCardId, tab);
  //   }
  // };

  return (
    <DockPanel
      open={isOpen}
      onClose={onClose}
      width="lg"
      padded={false}
      eyebrow={
        <span className="inline-flex items-center gap-1">
          <Settings className="h-3 w-3" />
          <span>{formData.category || 'Category'}</span>
          <ChevronRight className="h-3 w-3" />
          <span>{formData.subCategory || 'Sub-category'}</span>
        </span>
      }
      title={
        <InlineEditableField
          value={formData.title || ''}
          onSave={(value) => handleFieldChange('title', value)}
          isEditing={isEditingTitle}
          onEditingChange={setIsEditingTitle}
          placeholder="Enter card title"
          className="text-base font-semibold"
        />
      }
      headerExtra={
        <div className="space-y-2">
          <InlineEditableField
            value={formData.description || ''}
            onSave={(value) => handleFieldChange('description', value)}
            isEditing={isEditingDescription}
            onEditingChange={setIsEditingDescription}
            multiline
            placeholder="Enter card description"
            className="text-sm text-muted-foreground font-medium"
          />

          {/* Semantic layer: catalog status / promote */}
          <div>
            {isCatalogued ? (
              <div className="flex items-center gap-2">
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                  ✓ In Metric Catalog
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1 text-xs text-muted-foreground hover:text-foreground"
                  disabled={catalogBusy || !catalogClient}
                  onClick={handleDetachMetric}
                  title="Fork an independent copy that no longer follows the catalogued metric"
                >
                  {catalogBusy ? 'Detaching…' : 'Detach'}
                </Button>
              </div>
            ) : cardHasData ? (
              <Button
                variant="outline"
                size="sm"
                className="h-7 gap-1 text-xs"
                disabled={catalogBusy || !catalogClient}
                onClick={handleCatalogMetric}
              >
                {catalogBusy ? 'Cataloging…' : 'Catalog this metric'}
              </Button>
            ) : (
              <span className="text-xs text-muted-foreground/70">
                Add data (or wire a source) to catalog this metric
              </span>
            )}
          </div>
        </div>
      }
    >
      {card ? (
        <div className="px-4 py-4">
          <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="mb-6">
                <TabsList className="bg-muted rounded-lg p-[3px] shadow-sm w-full h-auto">
                  <TabsTrigger
                    value="data"
                    className="flex-1 h-9 px-3 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-md data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground data-[state=inactive]:bg-transparent transition-all duration-300"
                  >
                    Data
                  </TabsTrigger>
                  <TabsTrigger
                    value="results"
                    className="flex-1 h-9 px-3 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-md data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground data-[state=inactive]:bg-transparent transition-all duration-300"
                  >
                    Results
                  </TabsTrigger>

                  {/* Source tab removed; source pipeline is configured on Source Node */}

                  <TabsTrigger
                    value="segments"
                    className="flex-1 h-9 px-3 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-md data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground data-[state=inactive]:bg-transparent transition-all duration-300"
                  >
                    Segments
                  </TabsTrigger>
                  <TabsTrigger
                    value="comments"
                    className="flex-1 h-9 px-3 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-md data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground data-[state=inactive]:bg-transparent transition-all duration-300"
                  >
                    Comments
                  </TabsTrigger>
                  <TabsTrigger
                    value="evidence"
                    className="flex-1 h-9 px-3 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-md data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground data-[state=inactive]:bg-transparent transition-all duration-300"
                  >
                    Evidence
                  </TabsTrigger>
                  <TabsTrigger
                    value="alerts"
                    className="flex-1 h-9 px-3 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-md data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground data-[state=inactive]:bg-transparent transition-all duration-300"
                  >
                    Alerts
                  </TabsTrigger>
                  <TabsTrigger
                    value="settings"
                    className="flex-1 h-9 px-3 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-md data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground data-[state=inactive]:bg-transparent transition-all duration-300"
                  >
                    Settings
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Data Tab */}
              <TabsContent value="data" className="space-y-6 pt-2">
                <DataEventsTab
                  cardId={cardId}
                  onSave={handleSave}
                  isModified={isModified}
                  onFieldChange={handleTabChange}
                />
              </TabsContent>

              {/* Alerts Tab */}
              <TabsContent value="alerts" className="space-y-6 pt-2">
                {cardId && <AlertsTab cardId={cardId} />}
              </TabsContent>

              {/* Source tab content removed */}

              <TabsContent value="results" className="space-y-6 pt-2">
                <ResultsTab
                  cardId={cardId}
                  onSave={handleSave}
                  isModified={isModified}
                  onFieldChange={handleTabChange}
                />
              </TabsContent>

              {/* Segments Tab */}
              <TabsContent value="segments" className="space-y-6 pt-2">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">Metric Segments</h3>
                      <p className="text-sm text-muted-foreground">
                        Decompose this metric by dimensions and criteria
                      </p>
                    </div>
                    <Button
                      size="sm"
                      className="gap-2"
                      onClick={() => {
                        const newSegment: Segment = {
                          id: `segment_${Date.now()}`,
                          name: 'New Segment',
                          dimension: formData.dimensions?.[0] || 'Region',
                          value: '',
                          percentage: 0,
                          filters: [],
                          color: '#3B82F6',
                          isActive: true,
                          description: '',
                          createdAt: new Date().toISOString(),
                        };
                        handleFieldChange('segments', [
                          ...(formData.segments || []),
                          newSegment,
                        ]);
                      }}
                    >
                      <Plus className="h-4 w-4" />
                      Add Segment
                    </Button>
                  </div>

                  {/* Segments List */}
                  {formData.segments && formData.segments.length > 0 ? (
                    <div className="space-y-4">
                      {formData.segments.map((segment, index) => (
                        <div
                          key={segment.id}
                          className="border rounded-lg p-4 space-y-4"
                        >
                          {/* Segment Header */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-4 h-4 rounded"
                                style={{ backgroundColor: segment.color }}
                              />
                              <div className="flex-1">
                                <Input
                                  value={segment.name}
                                  onChange={(e) => {
                                    const updated = [
                                      ...(formData.segments || []),
                                    ];
                                    updated[index] = {
                                      ...segment,
                                      name: e.target.value,
                                    };
                                    handleFieldChange('segments', updated);
                                  }}
                                  className="font-medium"
                                  placeholder="Segment name"
                                />
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const updated = [
                                    ...(formData.segments || []),
                                  ];
                                  updated[index] = {
                                    ...segment,
                                    isActive: !segment.isActive,
                                  };
                                  handleFieldChange('segments', updated);
                                }}
                              >
                                {segment.isActive ? 'Active' : 'Inactive'}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const updated =
                                    formData.segments?.filter(
                                      (_, i) => i !== index
                                    ) || [];
                                  handleFieldChange('segments', updated);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Segment Configuration */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium mb-2 block">
                                Dimension
                              </label>
                              <Select
                                value={segment.dimension}
                                onValueChange={(value) => {
                                  const updated = [
                                    ...(formData.segments || []),
                                  ];
                                  updated[index] = {
                                    ...segment,
                                    dimension: value,
                                  };
                                  handleFieldChange('segments', updated);
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {formData.dimensions?.map((dim) => (
                                    <SelectItem key={dim} value={dim}>
                                      {dim}
                                    </SelectItem>
                                  ))}
                                  <SelectItem value="Region">Region</SelectItem>
                                  <SelectItem value="Product">
                                    Product
                                  </SelectItem>
                                  <SelectItem value="Channel">
                                    Channel
                                  </SelectItem>
                                  <SelectItem value="Customer">
                                    Customer
                                  </SelectItem>
                                  <SelectItem value="Time">Time</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-2 block">
                                Segment Value
                              </label>
                              <Input
                                value={segment.value}
                                onChange={(e) => {
                                  const updated = [
                                    ...(formData.segments || []),
                                  ];
                                  updated[index] = {
                                    ...segment,
                                    value: e.target.value,
                                  };
                                  handleFieldChange('segments', updated);
                                }}
                                placeholder="e.g., North America, Mobile"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium mb-2 block">
                                Percentage (%)
                              </label>
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                value={segment.percentage || 0}
                                onChange={(e) => {
                                  const updated = [
                                    ...(formData.segments || []),
                                  ];
                                  updated[index] = {
                                    ...segment,
                                    percentage: parseInt(e.target.value) || 0,
                                  };
                                  handleFieldChange('segments', updated);
                                }}
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-2 block">
                                Color
                              </label>
                              <Input
                                type="color"
                                value={segment.color}
                                onChange={(e) => {
                                  const updated = [
                                    ...(formData.segments || []),
                                  ];
                                  updated[index] = {
                                    ...segment,
                                    color: e.target.value,
                                  };
                                  handleFieldChange('segments', updated);
                                }}
                              />
                            </div>
                          </div>

                          {/* Description */}
                          <div>
                            <label className="text-sm font-medium mb-2 block">
                              Description
                            </label>
                            <Textarea
                              value={segment.description}
                              onChange={(e) => {
                                const updated = [...(formData.segments || [])];
                                updated[index] = {
                                  ...segment,
                                  description: e.target.value,
                                };
                                handleFieldChange('segments', updated);
                              }}
                              placeholder="Describe this segment's criteria and purpose"
                              rows={2}
                            />
                          </div>

                          {/* Filters */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <label className="text-sm font-medium">
                                Filters ({segment.filters?.length || 0})
                              </label>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const newFilter = {
                                    field: 'value',
                                    operator: 'greater_than' as const,
                                    value: 0,
                                  };
                                  const updated = [
                                    ...(formData.segments || []),
                                  ];
                                  updated[index] = {
                                    ...segment,
                                    filters: [
                                      ...(segment.filters || []),
                                      newFilter,
                                    ],
                                  };
                                  handleFieldChange('segments', updated);
                                }}
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Add Filter
                              </Button>
                            </div>

                            {segment.filters && segment.filters.length > 0 && (
                              <div className="space-y-2 p-3 bg-muted/30 rounded">
                                {segment.filters.map((filter, filterIndex) => (
                                  <div
                                    key={filterIndex}
                                    className="flex items-center gap-2 text-xs"
                                  >
                                    <Select
                                      value={filter.field}
                                      onValueChange={(value) => {
                                        const updated = [
                                          ...(formData.segments || []),
                                        ];
                                        const updatedFilters = [
                                          ...(segment.filters || []),
                                        ];
                                        updatedFilters[filterIndex] = {
                                          ...filter,
                                          field: value,
                                        };
                                        updated[index] = {
                                          ...segment,
                                          filters: updatedFilters,
                                        };
                                        handleFieldChange('segments', updated);
                                      }}
                                    >
                                      <SelectTrigger className="h-8">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="value">
                                          Value
                                        </SelectItem>
                                        <SelectItem value="date">
                                          Date
                                        </SelectItem>
                                        <SelectItem value="category">
                                          Category
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>

                                    <Select
                                      value={filter.operator}
                                      onValueChange={(value: any) => {
                                        const updated = [
                                          ...(formData.segments || []),
                                        ];
                                        const updatedFilters = [
                                          ...(segment.filters || []),
                                        ];
                                        updatedFilters[filterIndex] = {
                                          ...filter,
                                          operator: value,
                                        };
                                        updated[index] = {
                                          ...segment,
                                          filters: updatedFilters,
                                        };
                                        handleFieldChange('segments', updated);
                                      }}
                                    >
                                      <SelectTrigger className="h-8">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="equals">
                                          Equals
                                        </SelectItem>
                                        <SelectItem value="contains">
                                          Contains
                                        </SelectItem>
                                        <SelectItem value="greater_than">
                                          Greater than
                                        </SelectItem>
                                        <SelectItem value="less_than">
                                          Less than
                                        </SelectItem>
                                        <SelectItem value="between">
                                          Between
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>

                                    <Input
                                      className="h-8 flex-1"
                                      value={filter.value.toString()}
                                      onChange={(e) => {
                                        const updated = [
                                          ...(formData.segments || []),
                                        ];
                                        const updatedFilters = [
                                          ...(segment.filters || []),
                                        ];
                                        updatedFilters[filterIndex] = {
                                          ...filter,
                                          value: isNaN(Number(e.target.value))
                                            ? e.target.value
                                            : Number(e.target.value),
                                        };
                                        updated[index] = {
                                          ...segment,
                                          filters: updatedFilters,
                                        };
                                        handleFieldChange('segments', updated);
                                      }}
                                      placeholder="Filter value"
                                    />

                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        const updated = [
                                          ...(formData.segments || []),
                                        ];
                                        const updatedFilters =
                                          segment.filters?.filter(
                                            (_, i) => i !== filterIndex
                                          ) || [];
                                        updated[index] = {
                                          ...segment,
                                          filters: updatedFilters,
                                        };
                                        handleFieldChange('segments', updated);
                                      }}
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}

                      {/* Segments Summary */}
                      <div className="border rounded-lg p-4 bg-muted/20">
                        <h4 className="font-medium mb-2">Segments Summary</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Total Segments:</span>
                            <span className="font-medium">
                              {formData.segments.length}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Active Segments:</span>
                            <span className="font-medium">
                              {
                                formData.segments.filter((s) => s.isActive)
                                  .length
                              }
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total Percentage:</span>
                            <span
                              className={`font-medium ${
                                formData.segments.reduce(
                                  (sum, s) => sum + (s.percentage || 0),
                                  0
                                ) === 100
                                  ? 'text-green-600'
                                  : 'text-orange-600'
                              }`}
                            >
                              {formData.segments.reduce(
                                (sum, s) => sum + (s.percentage || 0),
                                0
                              )}
                              %
                            </span>
                          </div>
                        </div>

                        {formData.segments.reduce(
                          (sum, s) => sum + (s.percentage || 0),
                          0
                        ) !== 100 && (
                          <div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded text-xs text-orange-700">
                            ⚠️ Segment percentages should sum to 100% for
                            accurate decomposition
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
                      <PieChart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium text-muted-foreground mb-2">
                        No Segments Defined
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Create segments to decompose this metric by dimensions
                        like region, product, or customer type
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          const newSegment: Segment = {
                            id: `segment_${Date.now()}`,
                            name: 'Default Segment',
                            dimension: 'Region',
                            value: '',
                            percentage: 100,
                            filters: [],
                            color: '#3B82F6',
                            isActive: true,
                            description: '',
                            createdAt: new Date().toISOString(),
                          };
                          handleFieldChange('segments', [newSegment]);
                        }}
                      >
                        Create First Segment
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="comments" className="space-y-6 pt-2">
                <CommentsTab
                  cardId={cardId}
                  onSave={handleSave}
                  isModified={isModified}
                  onFieldChange={handleTabChange}
                />
              </TabsContent>

              {/* Evidence Tab */}
              <TabsContent value="evidence" className="space-y-6 pt-2">
                {/* Delegated: evidence lives as pins + the docked editor; the
                    panel just lists what's linked to this card. */}
                {cardId && <LinkedEvidenceList cardId={cardId} />}
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-6 pt-2">
                {cardId && <NodeVisibilityControl cardId={cardId} />}
                {card && (
                  <WorkflowSection
                    card={card}
                    onPersist={(updates) => persistNodeUpdate(cardId!, updates)}
                  />
                )}
                <SettingsTab
                  cardId={cardId}
                  onSave={handleSave}
                  onDelete={handleDelete}
                  onClose={onClose}
                  isModified={isModified}
                />
              </TabsContent>
            </Tabs>
        </div>
      ) : (
        <div className="flex items-center justify-center h-32">
          <p className="text-muted-foreground">No card selected</p>
        </div>
      )}

      {/* Evidence Dialog */}
    </DockPanel>
  );
}

export default CardSettingsSheetComponent;
