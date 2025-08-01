import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Trash2,
  X,
  Settings,
  PieChart,
  Plus,
  ChevronRight,
} from "lucide-react";
import { InlineEditableField } from "@/components/inline-editable-field";
import { DataEventsTab } from "@/components/tabs/data-events-tab";
import { ResultsTab } from "@/components/tabs/results-tab";
import { CorrelationsTab } from "@/components/tabs/correlations-tab";
import { CommentsTab } from "@/components/tabs/comments-tab";
import { SettingsTab } from "@/components/tabs/settings-tab";
import { useCanvasStore } from "@/lib/stores";
import type { MetricCard, Segment } from "@/lib/types";

interface CardSettingsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  cardId?: string;
  initialTab?: string;
}

export default function CardSettingsSheet({
  isOpen,
  onClose,
  cardId,
  initialTab = "data",
}: CardSettingsSheetProps) {
  const { getNodeById, persistNodeUpdate, persistNodeDelete } =
    useCanvasStore();
  const card = cardId ? getNodeById(cardId) : null;

  const [activeTab, setActiveTab] = useState(initialTab);
  const [isModified, setIsModified] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<MetricCard>>(() => ({
    title: card?.title || "",
    description: card?.description || "",
    category: card?.category || "Data/Metric",
    subCategory: card?.subCategory,
    tags: card?.tags || [],
    dimensions: card?.dimensions || [],
    causalFactors: card?.causalFactors || [],
    sourceType: card?.sourceType || "Manual",
    formula: card?.formula || "",
    owner: card?.assignees?.[0] || "",
  }));

  // Update form data when card changes
  useEffect(() => {
    if (card) {
      setFormData({
        title: card.title || "",
        description: card.description || "",
        category: card.category || "Data/Metric",
        subCategory: card.subCategory,
        tags: card.tags || [],
        dimensions: card.dimensions || [],
        causalFactors: card.causalFactors || [],
        sourceType: card.sourceType || "Manual",
        formula: card.formula || "",
        owner: card.assignees?.[0] || "",
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
      ["title", "description", "category", "subCategory"].includes(field)
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
        console.error("Failed to save card:", error);
        alert("Failed to save card. Please try again.");
      }
    }
  };

  const handleDelete = async () => {
    if (
      card &&
      cardId &&
      confirm(
        "Are you sure you want to delete this card? This action cannot be undone."
      )
    ) {
      try {
        await persistNodeDelete(cardId);
        onClose();
      } catch (error) {
        console.error("Failed to delete card:", error);
        alert("Failed to delete card. Please try again.");
      }
    }
  };

  const handleTabChange = (field: string, value: any) => {
    setIsModified(true);
    // Update the form data to reflect changes
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!card) {
    return null;
  }

  return (
    <>
      {/* Custom overlay to match evidence dialog behavior */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999]" />
      )}
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-[650px] sm:max-w-[650px] overflow-y-auto bg-background border-border z-[1000]">
          <SheetHeader className="pb-4">
            <SheetTitle className="sr-only">
              Card Settings - {formData.title || "Metric Card"}
            </SheetTitle>
            <SheetDescription className="sr-only">
              Configure properties, data, and settings for this metric card
            </SheetDescription>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Settings className="h-4 w-4" />
                <span>{formData.category || "Category"}</span>
                <ChevronRight className="h-4 w-4" />
                <span>{formData.subCategory || "Sub-category"}</span>
              </div>

              <InlineEditableField
                value={formData.title || ""}
                onSave={(value) => handleFieldChange("title", value)}
                isEditing={isEditingTitle}
                onEditingChange={setIsEditingTitle}
                placeholder="Enter card title"
                className="text-xl font-semibold"
              />

              <InlineEditableField
                value={formData.description || ""}
                onSave={(value) => handleFieldChange("description", value)}
                isEditing={isEditingDescription}
                onEditingChange={setIsEditingDescription}
                multiline
                placeholder="Enter card description"
                className="text-sm text-muted-foreground font-medium"
              />
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
                  <TabsTrigger
                    value="correlations"
                    className="flex-1 h-9 px-3 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground data-[state=inactive]:bg-transparent transition-all duration-300"
                  >
                    Correlations
                  </TabsTrigger>
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

              <TabsContent value="results" className="space-y-6 pt-2">
                <ResultsTab
                  cardId={cardId}
                  onSave={handleSave}
                  isModified={isModified}
                  onFieldChange={handleTabChange}
                />
              </TabsContent>

              <TabsContent value="correlations" className="space-y-6 pt-2">
                <CorrelationsTab
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
                          name: "New Segment",
                          dimension: formData.dimensions?.[0] || "Region",
                          value: "",
                          percentage: 0,
                          filters: [],
                          color: "#3B82F6",
                          isActive: true,
                          description: "",
                          createdAt: new Date().toISOString(),
                        };
                        handleFieldChange("segments", [
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
                                    handleFieldChange("segments", updated);
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
                                  handleFieldChange("segments", updated);
                                }}
                              >
                                {segment.isActive ? "Active" : "Inactive"}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const updated =
                                    formData.segments?.filter(
                                      (_, i) => i !== index
                                    ) || [];
                                  handleFieldChange("segments", updated);
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
                                  handleFieldChange("segments", updated);
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
                                  handleFieldChange("segments", updated);
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
                                  handleFieldChange("segments", updated);
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
                                  handleFieldChange("segments", updated);
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
                                handleFieldChange("segments", updated);
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
                                    field: "value",
                                    operator: "greater_than" as const,
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
                                  handleFieldChange("segments", updated);
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
                                        handleFieldChange("segments", updated);
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
                                        handleFieldChange("segments", updated);
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
                                        handleFieldChange("segments", updated);
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
                                        handleFieldChange("segments", updated);
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
                                  ? "text-green-600"
                                  : "text-orange-600"
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
                            name: "Default Segment",
                            dimension: "Region",
                            value: "",
                            percentage: 100,
                            filters: [],
                            color: "#3B82F6",
                            isActive: true,
                            description: "",
                            createdAt: new Date().toISOString(),
                          };
                          handleFieldChange("segments", [newSegment]);
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
      </Sheet>
    </>
  );
}
