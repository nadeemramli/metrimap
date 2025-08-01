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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Save,
  Trash2,
  Plus,
  FileText,
  ExternalLink,
  BarChart3,
  Zap,
  TrendingUp,
  Network,
  Layers,
  CheckCircle,
  Clock,
  Settings,
  ChevronRight,
  HelpCircle,
} from "lucide-react";
import { InlineEditableField } from "@/components/inline-editable-field";
import { CloseButton } from "@/components/ui/close-button";
import CorrelationAnalysisPanel from "./CorrelationAnalysisPanel";
import { useCanvasStore } from "@/lib/stores";
import type {
  Relationship,
  RelationshipType,
  ConfidenceLevel,
  EvidenceItem,
} from "@/lib/types";

interface RelationshipSheetProps {
  isOpen: boolean;
  onClose: () => void;
  relationshipId?: string;
  onSwitchToRelationship?: (relationshipId: string) => void;
}

const relationshipTypeOptions: Array<{
  value: RelationshipType;
  label: string;
  description: string;
  icon: any;
}> = [
  {
    value: "Deterministic",
    label: "Deterministic",
    description: "Direct causal relationship with predictable outcomes",
    icon: Zap,
  },
  {
    value: "Probabilistic",
    label: "Probabilistic",
    description: "Statistical correlation with probabilistic outcomes",
    icon: TrendingUp,
  },
  {
    value: "Causal",
    label: "Causal",
    description: "Proven causal influence through experimentation",
    icon: BarChart3,
  },
  {
    value: "Compositional",
    label: "Compositional",
    description: "Part-of or hierarchical relationship",
    icon: Layers,
  },
];

const confidenceOptions: Array<{
  value: ConfidenceLevel;
  label: string;
  description: string;
  color: string;
}> = [
  {
    value: "High",
    label: "High Confidence",
    description: "Strong evidence and proven relationship",
    color: "text-green-600",
  },
  {
    value: "Medium",
    label: "Medium Confidence",
    description: "Some evidence with room for validation",
    color: "text-yellow-600",
  },
  {
    value: "Low",
    label: "Low Confidence",
    description: "Hypothesis or weak evidence",
    color: "text-red-600",
  },
];

const evidenceTypeOptions = [
  "Experiment",
  "Analysis",
  "Notebook",
  "External Research",
  "User Interview",
];

export default function RelationshipSheet({
  isOpen,
  onClose,
  relationshipId,
  // onSwitchToRelationship,
}: RelationshipSheetProps) {
  console.log("📋 RelationshipSheet props:", { isOpen, relationshipId });
  const { getEdgeById, persistEdgeUpdate, persistEdgeDelete, getNodeById } =
    useCanvasStore();
  const relationship = relationshipId ? getEdgeById(relationshipId) : null;

  // Get source and target nodes for context
  const sourceNode = relationship ? getNodeById(relationship.sourceId) : null;
  const targetNode = relationship ? getNodeById(relationship.targetId) : null;

  // Form state
  const [formData, setFormData] = useState<Partial<Relationship>>(() => ({
    type: relationship?.type || "Probabilistic",
    confidence: relationship?.confidence || "Medium",
    weight: relationship?.weight || 0,
    evidence: relationship?.evidence || [],
    notes: relationship?.notes || "",
  }));

  const [activeTab, setActiveTab] = useState("details");
  const [isModified, setIsModified] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  // Get available tabs based on relationship type
  const getAvailableTabs = (type: RelationshipType) => {
    const baseTabs = ["details", "evidence", "history"];

    switch (type) {
      case "Probabilistic":
        return [...baseTabs, "analysis"];
      case "Causal":
        return [...baseTabs, "causal-checklist"];
      case "Deterministic":
      case "Compositional":
      default:
        return baseTabs;
    }
  };

  const availableTabs = getAvailableTabs(formData.type || "Probabilistic");

  // Ensure active tab is valid for current relationship type
  useEffect(() => {
    if (!availableTabs.includes(activeTab)) {
      setActiveTab("details");
    }
  }, [formData.type, availableTabs, activeTab]);

  // Update form data when relationship changes
  useEffect(() => {
    if (relationship) {
      setFormData({
        type: relationship.type || "Probabilistic",
        confidence: relationship.confidence || "Medium",
        weight: relationship.weight || 0,
        evidence: relationship.evidence || [],
        notes: relationship.notes || "",
      });
    }
  }, [relationship]);

  const [newEvidence, setNewEvidence] = useState<Partial<EvidenceItem>>({
    title: "",
    type: "Analysis",
    summary: "",
    date: new Date().toISOString().split("T")[0],
    owner: "",
    link: "",
    hypothesis: "",
    impactOnConfidence: "",
  });

  const handleFieldChange = (field: keyof Relationship, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsModified(true);
  };

  const handleAddEvidence = () => {
    if (newEvidence.title && newEvidence.summary) {
      const evidence: EvidenceItem = {
        id: `evidence_${Date.now()}`,
        title: newEvidence.title!,
        type: newEvidence.type as any,
        date: newEvidence.date!,
        owner: newEvidence.owner!,
        summary: newEvidence.summary!,
        link: newEvidence.link,
        hypothesis: newEvidence.hypothesis,
        impactOnConfidence: newEvidence.impactOnConfidence,
      };

      handleFieldChange("evidence", [...(formData.evidence || []), evidence]);

      // Reset form
      setNewEvidence({
        title: "",
        type: "Analysis",
        summary: "",
        date: new Date().toISOString().split("T")[0],
        owner: "",
        link: "",
        hypothesis: "",
        impactOnConfidence: "",
      });
    }
  };

  const handleRemoveEvidence = (evidenceId: string) => {
    handleFieldChange(
      "evidence",
      formData.evidence?.filter((e) => e.id !== evidenceId) || []
    );
  };

  const handleSave = async () => {
    if (relationship && relationshipId) {
      try {
        await persistEdgeUpdate(relationshipId, {
          ...formData,
          updatedAt: new Date().toISOString(),
        });
        setIsModified(false);
        onClose();
      } catch (error) {
        console.error("Failed to save relationship:", error);
        // Show error to user - you might want to add toast notification here
        alert("Failed to save relationship. Please try again.");
      }
    }
  };

  const handleDelete = async () => {
    if (
      relationship &&
      relationshipId &&
      confirm(
        "Are you sure you want to delete this relationship? This action cannot be undone."
      )
    ) {
      try {
        await persistEdgeDelete(relationshipId);
        onClose();
      } catch (error) {
        console.error("Failed to delete relationship:", error);
        alert("Failed to delete relationship. Please try again.");
      }
    }
  };

  // Handle switching to a different relationship (for persistent sheet)
  // const handleSwitchToDifferentRelationship = (newRelationshipId: string) => {
  //   if (onSwitchToRelationship) {
  //     onSwitchToRelationship(newRelationshipId);
  //   }
  // };

  if (!relationship || !sourceNode || !targetNode) {
    return null;
  }

  const selectedTypeConfig = relationshipTypeOptions.find(
    (opt) => opt.value === formData.type
  );

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[650px] sm:max-w-[650px] overflow-y-auto bg-background border-border z-[1001] relative pointer-events-auto sheet-content">
        <SheetHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <SheetTitle className="sr-only">
                Relationship Settings - {sourceNode?.title} →{" "}
                {targetNode?.title}
              </SheetTitle>
              <SheetDescription className="sr-only">
                Configure properties and evidence for this relationship
              </SheetDescription>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Settings className="h-4 w-4" />
                  <span>{formData.type || "Relationship Type"}</span>
                  <ChevronRight className="h-4 w-4" />
                  <span>{formData.confidence || "Confidence"}</span>
                </div>

                <InlineEditableField
                  value={`${sourceNode?.title || "Source"} → ${targetNode?.title || "Target"}`}
                  onSave={(value) => {
                    // This is read-only, but keeping for consistency
                    console.log("Relationship title updated:", value);
                  }}
                  isEditing={isEditingTitle}
                  onEditingChange={setIsEditingTitle}
                  placeholder="Relationship title"
                  className="text-xl font-semibold"
                  readOnly={true}
                />

                <InlineEditableField
                  value={
                    relationshipTypeOptions.find(
                      (opt) => opt.value === formData.type
                    )?.description ||
                    "Configure relationship properties and evidence"
                  }
                  onSave={(value) => {
                    // This is read-only, but keeping for consistency
                    console.log("Relationship description updated:", value);
                  }}
                  isEditing={isEditingDescription}
                  onEditingChange={setIsEditingDescription}
                  multiline
                  placeholder="Relationship description"
                  className="text-sm text-muted-foreground font-medium"
                  readOnly={true}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open("https://nadeemramli.com", "_blank")}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                title="Get help with relationships"
              >
                <HelpCircle className="h-4 w-4" />
              </Button>
              <CloseButton onClose={onClose} />
            </div>
          </div>
        </SheetHeader>

        <div className="mt-2 px-6 pb-6">
          {/* Relationship Configuration Card - Always Visible */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">
                Relationship Configuration
              </CardTitle>
              <CardDescription>
                Define the core properties of this relationship
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Type</label>
                <Select
                  value={formData.type}
                  onValueChange={(value: RelationshipType) =>
                    handleFieldChange("type", value)
                  }
                >
                  <SelectTrigger
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Type dropdown clicked");
                    }}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-[9999] pointer-events-auto bg-popover text-popover-foreground background-white border shadow-md">
                    {relationshipTypeOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            <div>
                              <div className="font-medium">{option.label}</div>
                              <div className="text-xs text-muted-foreground">
                                {option.description}
                              </div>
                            </div>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                {selectedTypeConfig && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedTypeConfig.description}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Confidence Level
                </label>
                <Select
                  value={formData.confidence}
                  onValueChange={(value: ConfidenceLevel) =>
                    handleFieldChange("confidence", value)
                  }
                >
                  <SelectTrigger
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Confidence dropdown clicked");
                    }}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-[9999] pointer-events-auto bg-popover text-popover-foreground background-white border shadow-md">
                    {confidenceOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              option.value === "High"
                                ? "bg-green-500"
                                : option.value === "Medium"
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }`}
                          />
                          <div>
                            <div className="font-medium">{option.label}</div>
                            <div className="text-xs text-muted-foreground">
                              {option.description}
                            </div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Relationship Strength ({formData.weight || 0})
                </label>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={formData.weight || 0}
                  onChange={(e) =>
                    handleFieldChange("weight", parseInt(e.target.value))
                  }
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Negative (-100)</span>
                  <span>Neutral (0)</span>
                  <span>Positive (+100)</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Notes</label>
                <Textarea
                  value={formData.notes || ""}
                  onChange={(e) => handleFieldChange("notes", e.target.value)}
                  placeholder="Add notes about this relationship..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Separator className="mb-6" />

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="mb-6">
              <TabsList className="bg-gray-100 rounded-lg p-[3px] shadow-sm w-full h-auto">
                {availableTabs.includes("details") && (
                  <TabsTrigger
                    value="details"
                    className="flex-1 h-9 px-3 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground data-[state=inactive]:bg-transparent transition-all duration-300"
                  >
                    Details
                  </TabsTrigger>
                )}
                {availableTabs.includes("evidence") && (
                  <TabsTrigger
                    value="evidence"
                    className="flex-1 h-9 px-3 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground data-[state=inactive]:bg-transparent transition-all duration-300"
                  >
                    Evidence ({formData.evidence?.length || 0})
                  </TabsTrigger>
                )}
                {availableTabs.includes("history") && (
                  <TabsTrigger
                    value="history"
                    className="flex-1 h-9 px-3 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground data-[state=inactive]:bg-transparent transition-all duration-300"
                  >
                    History ({relationship?.history?.length || 0})
                  </TabsTrigger>
                )}
                {availableTabs.includes("analysis") && (
                  <TabsTrigger
                    value="analysis"
                    className="flex-1 h-9 px-3 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground data-[state=inactive]:bg-transparent transition-all duration-300"
                  >
                    Analysis
                  </TabsTrigger>
                )}
                {availableTabs.includes("causal-checklist") && (
                  <TabsTrigger
                    value="causal-checklist"
                    className="flex-1 h-9 px-3 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground data-[state=inactive]:bg-transparent transition-all duration-300"
                  >
                    Causal Checklist
                  </TabsTrigger>
                )}
              </TabsList>
            </div>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-6 pt-2">
              <div className="text-center py-8 text-muted-foreground">
                <p>Relationship configuration is available above.</p>
                <p className="text-sm">
                  Use the tabs below for additional details and evidence.
                </p>
              </div>
            </TabsContent>

            {/* Causal Checklist Tab */}
            <TabsContent value="causal-checklist" className="space-y-6 pt-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Causal Inference Checklist
                  </CardTitle>
                  <CardDescription>
                    Validate causality using established criteria
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    {/* Temporal Precedence */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          id="temporal-precedence"
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <label
                            htmlFor="temporal-precedence"
                            className="font-medium"
                          >
                            Temporal Precedence
                          </label>
                          <p className="text-sm text-muted-foreground mt-1">
                            Does the cause happen before the effect?
                          </p>
                          <Textarea
                            placeholder="Explain the temporal relationship..."
                            className="mt-2"
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Covariation */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          id="covariation"
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <label htmlFor="covariation" className="font-medium">
                            Covariation
                          </label>
                          <p className="text-sm text-muted-foreground mt-1">
                            Is there a clear statistical relationship?
                          </p>
                          <Textarea
                            placeholder="Reference the analysis performed in the Probabilistic step..."
                            className="mt-2"
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Non-Spuriousness */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          id="non-spuriousness"
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <label
                            htmlFor="non-spuriousness"
                            className="font-medium"
                          >
                            Non-Spuriousness
                          </label>
                          <p className="text-sm text-muted-foreground mt-1">
                            Have potential confounding variables been considered
                            or ruled out?
                          </p>
                          <Textarea
                            placeholder="List potential confounders and how they were addressed..."
                            className="mt-2"
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Mechanism */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          id="mechanism"
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <label htmlFor="mechanism" className="font-medium">
                            Mechanism
                          </label>
                          <p className="text-sm text-muted-foreground mt-1">
                            Is there a logical, believable reason why this cause
                            would lead to this effect?
                          </p>
                          <Textarea
                            placeholder="Articulate the business logic and causal mechanism..."
                            className="mt-2"
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">
                      Causal Validation Progress
                    </h4>
                    <div className="space-y-2 text-sm text-blue-800">
                      <p>
                        ✓ All criteria must be satisfied to upgrade from
                        correlation to causation
                      </p>
                      <p>
                        ✓ This checklist ensures rigorous validation of causal
                        claims
                      </p>
                      <p>
                        ✓ Each criterion should be thoroughly documented with
                        evidence
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Evidence Tab */}
            <TabsContent value="evidence" className="space-y-6 pt-2">
              {/* Add New Evidence */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Add Evidence</CardTitle>
                  <CardDescription>
                    Support this relationship with evidence
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Title
                      </label>
                      <Input
                        value={newEvidence.title}
                        onChange={(e) =>
                          setNewEvidence((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        placeholder="Evidence title"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Type
                      </label>
                      <Select
                        value={newEvidence.type}
                        onValueChange={(value) =>
                          setNewEvidence((prev) => ({
                            ...prev,
                            type: value as any,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {evidenceTypeOptions.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Date
                      </label>
                      <Input
                        type="date"
                        value={newEvidence.date}
                        onChange={(e) =>
                          setNewEvidence((prev) => ({
                            ...prev,
                            date: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Owner
                      </label>
                      <Input
                        value={newEvidence.owner}
                        onChange={(e) =>
                          setNewEvidence((prev) => ({
                            ...prev,
                            owner: e.target.value,
                          }))
                        }
                        placeholder="Evidence owner"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Summary
                    </label>
                    <Textarea
                      value={newEvidence.summary}
                      onChange={(e) =>
                        setNewEvidence((prev) => ({
                          ...prev,
                          summary: e.target.value,
                        }))
                      }
                      placeholder="Evidence summary and findings"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Link (Optional)
                    </label>
                    <Input
                      value={newEvidence.link}
                      onChange={(e) =>
                        setNewEvidence((prev) => ({
                          ...prev,
                          link: e.target.value,
                        }))
                      }
                      placeholder="https://..."
                    />
                  </div>

                  <Button
                    onClick={handleAddEvidence}
                    disabled={!newEvidence.title || !newEvidence.summary}
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Evidence
                  </Button>
                </CardContent>
              </Card>

              {/* Existing Evidence */}
              <div className="space-y-3">
                <h3 className="text-lg font-medium">Evidence Repository</h3>
                {formData.evidence && formData.evidence.length > 0 ? (
                  formData.evidence.map((evidence) => (
                    <Card key={evidence.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">{evidence.type}</Badge>
                              <span className="text-sm text-muted-foreground">
                                {new Date(evidence.date).toLocaleDateString()}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                by {evidence.owner}
                              </span>
                            </div>
                            <h4 className="font-medium mb-1">
                              {evidence.title}
                            </h4>
                            <p className="text-sm text-muted-foreground mb-2">
                              {evidence.summary}
                            </p>
                            {evidence.link && (
                              <a
                                href={evidence.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary hover:underline flex items-center gap-1"
                              >
                                <ExternalLink className="h-3 w-3" />
                                View Evidence
                              </a>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveEvidence(evidence.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No evidence added yet</p>
                    <p className="text-sm">
                      Add evidence to support this relationship
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="space-y-6 pt-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Influence Drift Analysis
                  </CardTitle>
                  <CardDescription>
                    Track how this relationship's strength and confidence have
                    changed over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {relationship?.history && relationship.history.length > 0 ? (
                    <div className="space-y-4">
                      {/* Timeline visualization */}
                      <div className="relative">
                        {relationship.history
                          .sort(
                            (a, b) =>
                              new Date(b.timestamp).getTime() -
                              new Date(a.timestamp).getTime()
                          )
                          .map((entry, index) => {
                            const isLast =
                              index === relationship.history!.length - 1;
                            const getChangeIcon = (changeType: string) => {
                              switch (changeType) {
                                case "strength":
                                  return <TrendingUp className="h-4 w-4" />;
                                case "confidence":
                                  return <CheckCircle className="h-4 w-4" />;
                                case "type":
                                  return <Network className="h-4 w-4" />;
                                case "evidence":
                                  return <FileText className="h-4 w-4" />;
                                default:
                                  return <Clock className="h-4 w-4" />;
                              }
                            };

                            const getChangeColor = (changeType: string) => {
                              switch (changeType) {
                                case "strength":
                                  return "text-blue-600 bg-blue-50 border-blue-200";
                                case "confidence":
                                  return "text-green-600 bg-green-50 border-green-200";
                                case "type":
                                  return "text-purple-600 bg-purple-50 border-purple-200";
                                case "evidence":
                                  return "text-orange-600 bg-orange-50 border-orange-200";
                                default:
                                  return "text-gray-600 bg-gray-50 border-gray-200";
                              }
                            };

                            return (
                              <div key={entry.id} className="relative">
                                {/* Timeline line */}
                                {!isLast && (
                                  <div className="absolute left-6 top-8 w-0.5 h-16 bg-border" />
                                )}

                                {/* Timeline entry */}
                                <div className="flex items-start gap-4">
                                  <div
                                    className={`p-2 rounded-full border ${getChangeColor(entry.changeType)}`}
                                  >
                                    {getChangeIcon(entry.changeType)}
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                      <h4 className="text-sm font-medium capitalize">
                                        {entry.changeType} Change
                                      </h4>
                                      <time className="text-xs text-muted-foreground">
                                        {new Date(
                                          entry.timestamp
                                        ).toLocaleString()}
                                      </time>
                                    </div>

                                    <p className="text-sm text-muted-foreground mb-2">
                                      {entry.description}
                                    </p>

                                    {/* Show value changes */}
                                    {entry.changeType !== "evidence" && (
                                      <div className="text-xs bg-muted/50 p-2 rounded">
                                        <span className="text-destructive">
                                          {entry.oldValue}
                                        </span>
                                        <span className="mx-2">→</span>
                                        <span className="text-green-600">
                                          {entry.newValue}
                                        </span>
                                      </div>
                                    )}

                                    {/* User annotation if exists */}
                                    {entry.annotation && (
                                      <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                                        <strong>Note:</strong>{" "}
                                        {entry.annotation}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>

                      {/* Summary statistics */}
                      <div className="mt-6 pt-6 border-t">
                        <h4 className="text-sm font-medium mb-3">
                          Change Summary
                        </h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">
                              Total Changes:
                            </span>
                            <span className="ml-2 font-medium">
                              {relationship.history.length}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Most Recent:
                            </span>
                            <span className="ml-2 font-medium">
                              {new Date(
                                relationship.history[0]?.timestamp
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Change Types:
                            </span>
                            <span className="ml-2 font-medium">
                              {
                                [
                                  ...new Set(
                                    relationship.history.map(
                                      (h) => h.changeType
                                    )
                                  ),
                                ].length
                              }
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Created:
                            </span>
                            <span className="ml-2 font-medium">
                              {new Date(
                                relationship.createdAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No changes recorded yet</p>
                      <p className="text-sm">
                        Changes to this relationship will appear here over time
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analysis Tab */}
            <TabsContent value="analysis" className="space-y-6 pt-2">
              {sourceNode && targetNode ? (
                <CorrelationAnalysisPanel
                  sourceCard={sourceNode}
                  targetCard={targetNode}
                />
              ) : (
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">
                    Statistical Analysis
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Unable to load metric data for analysis
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6 pt-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Relationship Metadata
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Created:</span>
                      <span className="ml-2 text-muted-foreground">
                        {new Date(relationship.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Updated:</span>
                      <span className="ml-2 text-muted-foreground">
                        {new Date(relationship.updatedAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="font-medium">Source Node:</span>
                    <span className="ml-2">{sourceNode.title}</span>
                  </div>

                  <div>
                    <span className="font-medium">Target Node:</span>
                    <span className="ml-2">{targetNode.title}</span>
                  </div>
                </CardContent>
              </Card>
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
              Delete Relationship
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
