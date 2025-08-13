import { InlineEditableField } from '@/features/canvas/components/node-function/inline-editable-field';
import { CommentsTab } from '@/features/canvas/components/panels/relationship-panel/tabs/comments-tab';
import { DataEventsTab } from '@/features/canvas/components/panels/relationship-panel/tabs/data-events-tab';
import { ResultsTab } from '@/features/canvas/components/panels/relationship-panel/tabs/results-tab';
import { SettingsTab } from '@/features/canvas/components/panels/relationship-panel/tabs/settings-tab';
import EvidenceDialog from '@/features/evidence/components/EvidenceDialog';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Separator } from '@/shared/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/shared/components/ui/sheet';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui/tabs';
import { Textarea } from '@/shared/components/ui/textarea';
import {
  BookOpen,
  Calendar,
  ChevronRight,
  Copy,
  Edit,
  ExternalLink,
  FileText,
  FlaskConical,
  Globe,
  MoreVertical,
  PieChart,
  Plus,
  Settings,
  Trash2,
  User,
  Users,
  X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { useEvidenceStore } from '@/features/evidence/stores/useEvidenceStore';
import { useCanvasStore } from '@/lib/stores';
import { Badge } from '@/shared/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import type { EvidenceItem, MetricCard, Segment } from '@/shared/types';
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
  // Early return with a proper React element if not open
  if (!isOpen) {
    return <></>;
  }

  const { getNodeById, persistNodeUpdate, persistNodeDelete } =
    useCanvasStore();
  const { getEvidenceForCard, addEvidence, updateEvidence, deleteEvidence } =
    useEvidenceStore();
  const card = cardId ? getNodeById(cardId) : null;

  const [activeTab, setActiveTab] = useState(initialTab);
  const [isModified, setIsModified] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  // Evidence dialog state
  const [isEvidenceDialogOpen, setIsEvidenceDialogOpen] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceItem | null>(
    null
  );

  // Evidence type options for display
  const evidenceTypeOptions = [
    {
      value: 'Experiment',
      icon: FlaskConical,
      color: 'bg-blue-50 text-blue-700',
    },
    { value: 'Analysis', icon: FileText, color: 'bg-green-50 text-green-700' },
    {
      value: 'Notebook',
      icon: BookOpen,
      color: 'bg-purple-50 text-purple-700',
    },
    {
      value: 'External Research',
      icon: Globe,
      color: 'bg-orange-50 text-orange-700',
    },
    { value: 'User Interview', icon: Users, color: 'bg-pink-50 text-pink-700' },
  ];

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
    owner: card?.assignees?.[0] || '',
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
        owner: card.assignees?.[0] || '',
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
        alert('Failed to save card. Please try again.');
      }
    }
  };

  const handleDelete = async () => {
    if (
      card &&
      cardId &&
      confirm(
        'Are you sure you want to delete this card? This action cannot be undone.'
      )
    ) {
      try {
        await persistNodeDelete(cardId);
        onClose();
      } catch (error) {
        console.error('Failed to delete card:', error);
        alert('Failed to delete card. Please try again.');
      }
    }
  };

  const handleTabChange = (field: string, value: any) => {
    setIsModified(true);
    // Update the form data to reflect changes
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Evidence management functions
  const handleOpenEvidenceDialog = (evidence?: EvidenceItem) => {
    setSelectedEvidence(evidence || null);
    setIsEvidenceDialogOpen(true);
  };

  const handleCloseEvidenceDialog = () => {
    setIsEvidenceDialogOpen(false);
    setSelectedEvidence(null);
  };

  const handleSaveEvidence = async (evidence: EvidenceItem) => {
    if (selectedEvidence) {
      // Update existing evidence
      updateEvidence(evidence.id, evidence);
    } else {
      // Add new evidence with card context
      const evidenceWithContext: EvidenceItem = {
        ...evidence,
        context: {
          type: 'card',
          targetId: cardId,
          targetName: formData.title || card?.title || 'Untitled Card',
        },
      };
      addEvidence(evidenceWithContext);
    }
  };

  const handleRemoveEvidence = async (evidenceId: string) => {
    deleteEvidence(evidenceId);
  };

  const handleDuplicateEvidence = (evidence: EvidenceItem) => {
    const duplicate = {
      ...evidence,
      id: `evidence_${Date.now()}`,
      title: `${evidence.title} (Copy)`,
      createdAt: new Date().toISOString(),
      context: {
        type: 'card' as const,
        targetId: cardId,
        targetName: formData.title || card?.title || 'Untitled Card',
      },
    };
    addEvidence(duplicate);
  };

  // Helper functions for evidence display
  const getTypeIcon = (type: string) => {
    const option = evidenceTypeOptions.find((opt) => opt.value === type);
    return option ? option.icon : FileText;
  };

  const getTypeColor = (type: string) => {
    const option = evidenceTypeOptions.find((opt) => opt.value === type);
    return option ? option.color : 'bg-gray-50 text-gray-700';
  };

  // Get evidence for this card
  const cardEvidence = cardId ? getEvidenceForCard(cardId) : [];

  // Handle switching to a different card (for persistent sheet)
  // const handleSwitchToDifferentCard = (newCardId: string, tab?: string) => {
  //   if (onSwitchToCard) {
  //     onSwitchToCard(newCardId, tab);
  //   }
  // };

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      {card ? (
        <SheetContent className="w-[650px] sm:max-w-[650px] overflow-y-auto bg-background border-border">
          <SheetHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <SheetTitle className="sr-only">
                  Card Settings - {formData.title || 'Metric Card'}
                </SheetTitle>
                <SheetDescription className="sr-only">
                  Configure properties, data, and settings for this metric card
                </SheetDescription>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Settings className="h-4 w-4" />
                    <span>{formData.category || 'Category'}</span>
                    <ChevronRight className="h-4 w-4" />
                    <span>{formData.subCategory || 'Sub-category'}</span>
                  </div>

                  <InlineEditableField
                    value={formData.title || ''}
                    onSave={(value) => handleFieldChange('title', value)}
                    isEditing={isEditingTitle}
                    onEditingChange={setIsEditingTitle}
                    placeholder="Enter card title"
                    className="text-xl font-semibold"
                  />

                  <InlineEditableField
                    value={formData.description || ''}
                    onSave={(value) => handleFieldChange('description', value)}
                    isEditing={isEditingDescription}
                    onEditingChange={setIsEditingDescription}
                    multiline
                    placeholder="Enter card description"
                    className="text-sm text-muted-foreground font-medium"
                  />
                </div>
              </div>
            </div>
          </SheetHeader>

          <div className="mt-2 px-6 pb-6">
            <Separator className="mb-6" />

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="mb-6">
                <TabsList className="bg-gray-100 rounded-lg p-[3px] shadow-sm w-full h-auto">
                  <TabsTrigger
                    value="data"
                    className="flex-1 h-9 px-3 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground data-[state=inactive]:bg-transparent transition-all duration-300"
                  >
                    Data
                  </TabsTrigger>
                  <TabsTrigger
                    value="results"
                    className="flex-1 h-9 px-3 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground data-[state=inactive]:bg-transparent transition-all duration-300"
                  >
                    Results
                  </TabsTrigger>

                  {/* Source tab removed; source pipeline is configured on Source Node */}

                  <TabsTrigger
                    value="segments"
                    className="flex-1 h-9 px-3 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground data-[state=inactive]:bg-transparent transition-all duration-300"
                  >
                    Segments
                  </TabsTrigger>
                  <TabsTrigger
                    value="comments"
                    className="flex-1 h-9 px-3 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground data-[state=inactive]:bg-transparent transition-all duration-300"
                  >
                    Comments
                  </TabsTrigger>
                  <TabsTrigger
                    value="evidence"
                    className="flex-1 h-9 px-3 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground data-[state=inactive]:bg-transparent transition-all duration-300"
                  >
                    Evidence
                  </TabsTrigger>
                  <TabsTrigger
                    value="settings"
                    className="flex-1 h-9 px-3 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground data-[state=inactive]:bg-transparent transition-all duration-300"
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
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">
                        Card Evidence Repository
                      </h3>
                      <p className="text-sm text-gray-600">
                        All supporting evidence for this metric card
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
                    {cardEvidence && cardEvidence.length > 0 ? (
                      cardEvidence.map((evidence) => {
                        const TypeIcon = getTypeIcon(evidence.type);
                        return (
                          <div
                            key={evidence.id}
                            className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow"
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
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
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
                                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                        HYPOTHESIS
                                      </span>
                                      <p className="text-sm mt-1 text-gray-700">
                                        {evidence.hypothesis}
                                      </p>
                                    </div>
                                  )}

                                  <div>
                                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                      SUMMARY
                                    </span>
                                    <p className="text-sm mt-1 text-gray-700">
                                      {evidence.summary}
                                    </p>
                                  </div>

                                  {evidence.impactOnConfidence && (
                                    <div>
                                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
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
                                    Remove from Card
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <FileText className="h-16 w-16 mx-auto mb-4 opacity-30" />
                        <h3 className="text-lg font-medium mb-2">
                          No Evidence Yet
                        </h3>
                        <p className="text-sm mb-4">
                          Add evidence to support and validate this metric card
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
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-6 pt-2">
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
        </SheetContent>
      ) : (
        <SheetContent className="w-[650px] sm:max-w-[650px] overflow-y-auto bg-background border-border">
          <div className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">No card selected</p>
          </div>
        </SheetContent>
      )}

      {/* Evidence Dialog */}
      <EvidenceDialog
        isOpen={isEvidenceDialogOpen}
        onClose={handleCloseEvidenceDialog}
        onSave={handleSaveEvidence}
        evidence={selectedEvidence}
        title={selectedEvidence ? 'Edit Evidence' : 'Add Evidence to Card'}
        description={
          selectedEvidence
            ? 'Update the evidence details below'
            : 'Add new evidence to support this metric card'
        }
      />
    </Sheet>
  );
}

export default CardSettingsSheetComponent;
