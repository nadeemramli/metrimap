import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Save,
  Trash2,
  X,
  BarChart3,
  Calendar,
  Target,
  TrendingUp,
  MessageSquare,
  Settings,
  PieChart,
  Plus,
} from "lucide-react";
import { useCanvasStore } from "@/lib/stores";
import type {
  MetricCard,
  CardCategory,
  CardSubCategory,
  SourceType,
  Dimension,
  CausalFactor,
  Segment,
} from "@/lib/types";

interface CardSettingsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  cardId?: string;
}

const categoryOptions: Array<{ value: CardCategory; label: string }> = [
  { value: "Core/Value", label: "Core/Value" },
  { value: "Data/Metric", label: "Data/Metric" },
  { value: "Work/Action", label: "Work/Action" },
  { value: "Ideas/Hypothesis", label: "Ideas/Hypothesis" },
  { value: "Metadata", label: "Metadata" },
];

const subCategoryOptions: Record<
  CardCategory,
  Array<{ value: string; label: string }>
> = {
  "Core/Value": [
    { value: "Journey Step", label: "Journey Step" },
    { value: "Value Chain", label: "Value Chain" },
    { value: "Critical Path", label: "Critical Path" },
  ],
  "Data/Metric": [
    { value: "Input Metric", label: "Input Metric" },
    { value: "Output Metric", label: "Output Metric" },
    { value: "Leading KPI", label: "Leading KPI" },
    { value: "Lagging KPI", label: "Lagging KPI" },
    { value: "Diagnostic Metric", label: "Diagnostic Metric" },
    { value: "North Star Metric", label: "North Star Metric" },
  ],
  "Work/Action": [
    { value: "Experiment", label: "Experiment" },
    { value: "BAU", label: "BAU (Business as Usual)" },
    { value: "Initiative", label: "Initiative" },
    { value: "Scope/Function", label: "Scope/Function" },
    { value: "Business Driver", label: "Business Driver" },
  ],
  "Ideas/Hypothesis": [
    { value: "Factor", label: "Factor" },
    { value: "Seller Solution", label: "Seller Solution" },
  ],
  Metadata: [
    { value: "Group", label: "Group" },
    { value: "Subflow", label: "Subflow" },
    { value: "Reference", label: "Reference" },
  ],
};

const sourceTypeOptions: Array<{ value: SourceType; label: string }> = [
  { value: "Manual", label: "Manual Entry" },
  { value: "Calculated", label: "Calculated Formula" },
  { value: "Random", label: "Random Data (Testing)" },
];

const dimensionOptions: Array<{ value: Dimension; label: string }> = [
  { value: "Qualitative", label: "Qualitative" },
  { value: "Quantitative", label: "Quantitative" },
  { value: "Vanity", label: "Vanity" },
  { value: "Actionable", label: "Actionable" },
  { value: "Efficiency", label: "Efficiency" },
  { value: "Effectiveness", label: "Effectiveness" },
  { value: "Strategic", label: "Strategic" },
  { value: "Tactical", label: "Tactical" },
  { value: "Operational", label: "Operational" },
];

const causalFactorOptions: Array<{ value: CausalFactor; label: string }> = [
  { value: "Component Drift", label: "Component Drift" },
  { value: "Temporal Variance", label: "Temporal Variance" },
  { value: "Influence Drift", label: "Influence Drift" },
  { value: "Dimension Drift", label: "Dimension Drift" },
  { value: "Event Shocks", label: "Event Shocks" },
];

export default function CardSettingsSheet({
  isOpen,
  onClose,
  cardId,
}: CardSettingsSheetProps) {
  const { getNodeById, updateNode, deleteNode } = useCanvasStore();
  const card = cardId ? getNodeById(cardId) : null;

  const [activeTab, setActiveTab] = useState("details");
  const [isModified, setIsModified] = useState(false);

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

  const handleFieldChange = (field: keyof MetricCard, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsModified(true);
  };

  const handleTagAdd = (tag: string) => {
    if (tag.trim() && !formData.tags?.includes(tag.trim())) {
      handleFieldChange("tags", [...(formData.tags || []), tag.trim()]);
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    handleFieldChange(
      "tags",
      formData.tags?.filter((tag) => tag !== tagToRemove) || []
    );
  };

  const handleDimensionToggle = (dimension: Dimension) => {
    const current = formData.dimensions || [];
    const updated = current.includes(dimension)
      ? current.filter((d) => d !== dimension)
      : [...current, dimension];
    handleFieldChange("dimensions", updated);
  };

  const handleSave = () => {
    if (card && cardId) {
      updateNode(cardId, {
        ...formData,
        updatedAt: new Date().toISOString(),
      });
      setIsModified(false);
      onClose();
    }
  };

  const handleDelete = () => {
    if (
      card &&
      cardId &&
      confirm(
        "Are you sure you want to delete this card? This action cannot be undone."
      )
    ) {
      deleteNode(cardId);
      onClose();
    }
  };

  if (!card) {
    return null;
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[600px] sm:max-w-[600px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Card Settings
          </SheetTitle>
          <SheetDescription>
            Configure properties, data sources, and metadata for this metric
            card.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 mb-6">
              <TabsTrigger value="details" className="text-xs">
                <BarChart3 className="h-3 w-3 mr-1" />
                Details
              </TabsTrigger>
              <TabsTrigger value="data" className="text-xs">
                Data
              </TabsTrigger>
              <TabsTrigger value="source" className="text-xs">
                Source
              </TabsTrigger>
              <TabsTrigger value="events" className="text-xs">
                <Calendar className="h-3 w-3 mr-1" />
                Events
              </TabsTrigger>
              <TabsTrigger value="results" className="text-xs">
                <Target className="h-3 w-3 mr-1" />
                Results
              </TabsTrigger>
              <TabsTrigger value="correlations" className="text-xs">
                <TrendingUp className="h-3 w-3 mr-1" />
                Correlations
              </TabsTrigger>
              <TabsTrigger value="comments" className="text-xs">
                <MessageSquare className="h-3 w-3 mr-1" />
                Comments
              </TabsTrigger>
              <TabsTrigger value="settings" className="text-xs">
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Card Title
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleFieldChange("title", e.target.value)}
                    placeholder="Enter card title"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Description
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      handleFieldChange("description", e.target.value)
                    }
                    placeholder="Enter card description"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Category
                    </label>
                    <Select
                      value={formData.category}
                      onValueChange={(value: CardCategory) =>
                        handleFieldChange("category", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Sub-Category
                    </label>
                    <Select
                      value={formData.subCategory || ""}
                      onValueChange={(value) =>
                        handleFieldChange("subCategory", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select sub-category" />
                      </SelectTrigger>
                      <SelectContent>
                        {formData.category &&
                          subCategoryOptions[formData.category]?.map(
                            (option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            )
                          )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Chart Options
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <Select defaultValue="month">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="day">Daily</SelectItem>
                        <SelectItem value="week">Weekly</SelectItem>
                        <SelectItem value="month">Monthly</SelectItem>
                        <SelectItem value="quarter">Quarterly</SelectItem>
                        <SelectItem value="year">Yearly</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select defaultValue="incremental">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="incremental">Incremental</SelectItem>
                        <SelectItem value="cumulative">Cumulative</SelectItem>
                        <SelectItem value="distribution">
                          Distribution
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Data Tab */}
            <TabsContent value="data" className="space-y-6">
              <div className="space-y-4">
                <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
                  <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">
                    Data Management
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Spreadsheet-like interface for viewing and editing metric
                    data
                  </p>
                  <Button variant="outline">Open Data Editor</Button>
                </div>
              </div>
            </TabsContent>

            {/* Source Tab */}
            <TabsContent value="source" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Data Source
                  </label>
                  <Select
                    value={formData.sourceType}
                    onValueChange={(value: SourceType) =>
                      handleFieldChange("sourceType", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sourceTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.sourceType === "Calculated" && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Formula
                    </label>
                    <Textarea
                      value={formData.formula}
                      onChange={(e) =>
                        handleFieldChange("formula", e.target.value)
                      }
                      placeholder="Enter formula (e.g., [Card_ID_1].value + [Card_ID_2].value)"
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Reference other cards using [Card_ID].value syntax
                    </p>
                  </div>
                )}

                {formData.sourceType === "Random" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Standard Deviation
                        </label>
                        <Input type="number" defaultValue="100" />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Upward Move %
                        </label>
                        <Input type="number" defaultValue="60" />
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      Generate Random Data
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Other tabs with placeholder content */}
            <TabsContent value="events" className="space-y-6">
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  Events Timeline
                </h3>
                <p className="text-sm text-muted-foreground">
                  Manage annotations and events for this metric
                </p>
              </div>
            </TabsContent>

            <TabsContent value="results" className="space-y-6">
              <div className="text-center py-8">
                <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  Key Results (OKRs)
                </h3>
                <p className="text-sm text-muted-foreground">
                  Define targets and track progress against goals
                </p>
              </div>
            </TabsContent>

            <TabsContent value="correlations" className="space-y-6">
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  Correlations Analysis
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Discover statistical relationships with other metrics
                </p>
                <Button variant="outline">Compute Correlations</Button>
              </div>
            </TabsContent>

            <TabsContent value="comments" className="space-y-6">
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  Comments & Discussion
                </h3>
                <p className="text-sm text-muted-foreground">
                  Threaded discussions and notes for this metric
                </p>
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Owner/Assignee
                  </label>
                  <Input
                    value={formData.owner}
                    onChange={(e) => handleFieldChange("owner", e.target.value)}
                    placeholder="Enter owner name"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Tags</label>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {formData.tags?.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 ml-1"
                            onClick={() => handleTagRemove(tag)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                    <Input
                      placeholder="Add tag (press Enter)"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleTagAdd((e.target as HTMLInputElement).value);
                          (e.target as HTMLInputElement).value = "";
                        }
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Dimensions
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {dimensionOptions.map((dimension) => (
                      <label
                        key={dimension.value}
                        className="flex items-center space-x-2 text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={
                            formData.dimensions?.includes(dimension.value) ||
                            false
                          }
                          onChange={() =>
                            handleDimensionToggle(dimension.value)
                          }
                          className="rounded"
                        />
                        <span>{dimension.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Causal Factors
                  </label>
                  <Select
                    value={formData.causalFactors?.[0] || ""}
                    onValueChange={(value: CausalFactor) =>
                      handleFieldChange("causalFactors", [value])
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select causal factor" />
                    </SelectTrigger>
                    <SelectContent>
                      {causalFactorOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <Separator className="my-6" />

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete Card
            </Button>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!isModified}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
