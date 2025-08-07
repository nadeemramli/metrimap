"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { X, Trash2, Save, Database, SettingsIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useCanvasStore } from "@/lib/stores";
import { EnhancedTagInput } from "@/components/ui/enhanced-tag-input";
import {
  getMetricCardTags,
  addTagsToMetricCard,
  removeTagsFromMetricCard,
} from "@/lib/supabase/services/tags";
import type {
  CardCategory,
  SourceType,
  Dimension,
  CausalFactor,
} from "@/lib/types";

const CATEGORY_OPTIONS: Array<{ value: CardCategory; label: string }> = [
  { value: "Core/Value", label: "Core/Value" },
  { value: "Data/Metric", label: "Data/Metric" },
  { value: "Work/Action", label: "Work/Action" },
  { value: "Ideas/Hypothesis", label: "Ideas/Hypothesis" },
  { value: "Metadata", label: "Metadata" },
];

const SUB_CATEGORY_OPTIONS: Record<
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

const DIMENSION_OPTIONS: Array<{
  value: Dimension;
  label: string;
  description: string;
}> = [
  {
    value: "Qualitative",
    label: "Qualitative",
    description: "Answers 'Why is this happening?'",
  },
  {
    value: "Quantitative",
    label: "Quantitative",
    description: "Answers 'How much? How many?'",
  },
  {
    value: "Vanity",
    label: "Vanity",
    description: "Looks good but isn't actionable",
  },
  {
    value: "Actionable",
    label: "Actionable",
    description: "Informs a specific decision",
  },
  {
    value: "Efficiency",
    label: "Efficiency",
    description: "Measures resource utilization",
  },
  {
    value: "Effectiveness",
    label: "Effectiveness",
    description: "Measures achievement of desired results",
  },
  {
    value: "Strategic",
    label: "Strategic",
    description: "Tracks long-term goals",
  },
  {
    value: "Tactical",
    label: "Tactical",
    description: "Evaluates specific projects/initiatives",
  },
  {
    value: "Operational",
    label: "Operational",
    description: "Monitors daily activities",
  },
];

const CAUSAL_FACTOR_OPTIONS: Array<{
  value: CausalFactor;
  label: string;
  description: string;
}> = [
  {
    value: "Component Drift",
    label: "Component Drift",
    description: "Change due to inputs in the metric's definition",
  },
  {
    value: "Temporal Variance",
    label: "Temporal Variance",
    description: "Change due to natural, cyclic behavior",
  },
  {
    value: "Influence Drift",
    label: "Influence Drift",
    description: "Change due to its relationship with other metrics",
  },
  {
    value: "Dimension Drift",
    label: "Dimension Drift",
    description: "Change in the dimensional composition of the metric",
  },
  {
    value: "Event Shocks",
    label: "Event Shocks",
    description: "Abrupt changes from specific events",
  },
];

const SOURCE_TYPE_OPTIONS: Array<{ value: SourceType; label: string }> = [
  { value: "Manual", label: "Manual Entry" },
  { value: "Calculated", label: "Calculated Formula" },
  { value: "Random", label: "Random Data (Testing)" },
];

interface SettingsTabProps {
  cardId?: string;
  onSave: () => void;
  onDelete: () => void;
  onClose: () => void;
  isModified: boolean;
}

export function SettingsTab({
  cardId,
  onSave,
  onDelete,
  onClose,
  isModified,
}: SettingsTabProps) {
  const { getNodeById, persistNodeUpdate } = useCanvasStore();
  const card = cardId ? getNodeById(cardId) : null;

  // Tag state for the new database system
  const [cardTags, setCardTags] = useState<string[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(false);
  const [isSavingTags, setIsSavingTags] = useState(false);

  // Adapter functions to match the v0 interface
  const updateCard = (updates: any) => {
    if (card && cardId) {
      persistNodeUpdate(cardId, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
    }
  };

  const saveCard = async () => {
    // Use the parent's save function
    onSave();
  };
  const [isSaving, setIsSaving] = useState(false);

  // Load tags for this metric card
  useEffect(() => {
    const loadTags = async () => {
      if (!cardId) return;

      setIsLoadingTags(true);
      try {
        const tags = await getMetricCardTags(cardId);
        setCardTags(tags);
      } catch (error) {
        console.error(`Failed to load tags for metric card ${cardId}:`, error);
        setCardTags([]);
      } finally {
        setIsLoadingTags(false);
      }
    };

    loadTags();
  }, [cardId]);

  const handleAddTag = async (tag: string) => {
    if (!cardId) return;

    setIsSavingTags(true);
    try {
      await addTagsToMetricCard(cardId, [tag]);
      // Reload tags to get the updated list
      const updatedTags = await getMetricCardTags(cardId);
      setCardTags(updatedTags);
    } catch (error) {
      console.error("Failed to add tag:", error);
    } finally {
      setIsSavingTags(false);
    }
  };

  const handleRemoveTag = async (tagToRemove: string) => {
    if (!cardId) return;

    setIsSavingTags(true);
    try {
      await removeTagsFromMetricCard(cardId, [tagToRemove]);
      // Reload tags to get the updated list
      const updatedTags = await getMetricCardTags(cardId);
      setCardTags(updatedTags);
    } catch (error) {
      console.error("Failed to remove tag:", error);
    } finally {
      setIsSavingTags(false);
    }
  };

  const handleDimensionChange = (dimension: Dimension, checked: boolean) => {
    if (card) {
      const currentDimensions = card.dimensions || [];
      const updatedDimensions = checked
        ? [...currentDimensions, dimension]
        : currentDimensions.filter((d) => d !== dimension);

      updateCard({
        dimensions: updatedDimensions,
      });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    await saveCard();
    setIsSaving(false);
  };

  if (!card) return <></>;

  return (
    <div className="space-y-6">
      {/* Data Source Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Source Configuration
          </CardTitle>
          <CardDescription>
            Configure where your data comes from
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Source Type</label>
            <Select
              value={card.sourceType || "Manual"}
              onValueChange={(value: SourceType) =>
                updateCard({ sourceType: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SOURCE_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {(card.sourceType || "Manual") === "Calculated" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Formula</label>
              <Textarea
                value={card.formula || ""}
                onChange={(e) => updateCard({ formula: e.target.value })}
                placeholder="Enter your calculation formula..."
                className="min-h-[100px]"
              />
              <p className="text-xs text-muted-foreground">
                Use mathematical expressions and reference other metrics
              </p>
            </div>
          )}

          {(card.sourceType || "Manual") === "Random" && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Random data will be generated based on your chart configuration
              </p>
              <Button variant="outline">Generate Sample Data</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Category Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Category & Classification</CardTitle>
          <CardDescription>
            Define the card's role and type within your metric tree
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select
                value={card.category}
                onValueChange={(value: CardCategory) => {
                  updateCard({
                    category: value,
                    subCategory: undefined, // Reset sub-category when category changes
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Sub-Category</label>
              <Select
                value={card.subCategory || ""}
                onValueChange={(value) => updateCard({ subCategory: value })}
                disabled={!card.category}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sub-category" />
                </SelectTrigger>
                <SelectContent>
                  {card.category &&
                    SUB_CATEGORY_OPTIONS[card.category]?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ownership & Assignment */}
      <Card>
        <CardHeader>
          <CardTitle>Ownership & Assignment</CardTitle>
          <CardDescription>
            Manage who is responsible for this metric
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Primary Owner</label>
            <Input
              value={card.owner || ""}
              onChange={(e) => updateCard({ owner: e.target.value })}
              placeholder="Enter owner name or email"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Assignees</label>
            <div className="flex flex-wrap gap-2">
              {(card.assignees || []).map((assignee, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {assignee}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                    onClick={() => {
                      const updated = (card.assignees || []).filter(
                        (_, i) => i !== index
                      );
                      updateCard({ assignees: updated });
                    }}
                  />
                </Badge>
              ))}
            </div>
            <Input
              placeholder="Add assignee (press Enter)"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.currentTarget.value.trim()) {
                  const newAssignee = e.currentTarget.value.trim();
                  if (!(card.assignees || []).includes(newAssignee)) {
                    updateCard({
                      assignees: [...(card.assignees || []), newAssignee],
                    });
                  }
                  e.currentTarget.value = "";
                }
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tags */}
      <Card>
        <CardHeader>
          <CardTitle>Tags</CardTitle>
          <CardDescription>
            Add tags to categorize and organize this metric
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoadingTags ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-sm text-muted-foreground">
                Loading tags...
              </span>
            </div>
          ) : (
            <EnhancedTagInput
              tags={cardTags}
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
        </CardContent>
      </Card>

      {/* Metric Dimensions */}
      <Card>
        <CardHeader>
          <CardTitle>Metric Dimensions</CardTitle>
          <CardDescription>
            Classify the analytical characteristics of this metric (PRD Section
            5.1.a)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {DIMENSION_OPTIONS.map((dimension) => (
              <div
                key={dimension.value}
                className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/30 transition-colors"
              >
                <Checkbox
                  id={dimension.value}
                  checked={(card.dimensions || []).includes(dimension.value)}
                  onCheckedChange={(checked) =>
                    handleDimensionChange(dimension.value, checked as boolean)
                  }
                  className="mt-1"
                />
                <div className="flex-1">
                  <label
                    htmlFor={dimension.value}
                    className="text-sm font-medium cursor-pointer"
                  >
                    {dimension.label}
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">
                    {dimension.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {(card.dimensions || []).length > 0 && (
            <div className="mt-4 p-3 bg-muted/20 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Selected Dimensions:</h4>
              <div className="flex flex-wrap gap-2">
                {(card.dimensions || []).map((dim) => (
                  <Badge key={dim} variant="outline">
                    {dim}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Causal Factors */}
      <Card>
        <CardHeader>
          <CardTitle>Causal Factors</CardTitle>
          <CardDescription>
            Diagnose the source of metric changes using the Metric Drift
            Framework (PRD Section 5.1.a)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select
            onValueChange={(value: CausalFactor) => {
              if (!(card.causalFactors || []).includes(value)) {
                updateCard({
                  causalFactors: [...(card.causalFactors || []), value],
                });
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Add causal factor" />
            </SelectTrigger>
            <SelectContent>
              {CAUSAL_FACTOR_OPTIONS.filter(
                (factor) => !(card.causalFactors || []).includes(factor.value)
              ).map((factor) => (
                <SelectItem key={factor.value} value={factor.value}>
                  <div className="flex flex-col">
                    <span className="font-medium">{factor.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {factor.description}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="space-y-2">
            {(card.causalFactors || []).map((factor) => {
              const factorOption = CAUSAL_FACTOR_OPTIONS.find(
                (f) => f.value === factor
              );
              return (
                <div
                  key={factor}
                  className="flex items-start gap-3 p-3 border rounded-lg bg-muted/20"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{factor}</Badge>
                      <X
                        className="h-4 w-4 cursor-pointer hover:text-destructive"
                        onClick={() =>
                          updateCard({
                            causalFactors: (card.causalFactors || []).filter(
                              (f) => f !== factor
                            ),
                          })
                        }
                      />
                    </div>
                    {factorOption && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {factorOption.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {(card.causalFactors || []).length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              <p className="text-sm">No causal factors assigned</p>
              <p className="text-xs">
                Add factors to track why this metric changes
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            Actions
          </CardTitle>
          <CardDescription>Manage this metric card</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              disabled={!isModified || isSaving}
              className="flex-1"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={onDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Card
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
