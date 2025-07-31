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
  Workflow,
} from "lucide-react";
import RelationshipWorkflows from "./RelationshipWorkflows";
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
}: RelationshipSheetProps) {
  const { getEdgeById, persistEdgeUpdate, persistEdgeDelete, getNodeById } =
    useCanvasStore();
  const relationship = relationshipId ? getEdgeById(relationshipId) : null;

  const [activeTab, setActiveTab] = useState("details");
  const [isModified, setIsModified] = useState(false);

  // Get source and target nodes for context
  const sourceNode = relationship ? getNodeById(relationship.sourceId) : null;
  const targetNode = relationship ? getNodeById(relationship.targetId) : null;

  // Form state
  const [formData, setFormData] = useState<Partial<Relationship>>(() => ({
    type: relationship?.type || "Probabilistic",
    confidence: relationship?.confidence || "Medium",
    weight: relationship?.weight || 50,
    evidence: relationship?.evidence || [],
  }));

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

  if (!relationship || !sourceNode || !targetNode) {
    return null;
  }

  const selectedTypeConfig = relationshipTypeOptions.find(
    (opt) => opt.value === formData.type
  );

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[700px] sm:max-w-[700px] overflow-y-auto bg-background border-border z-[100]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Network className="h-5 w-5" />
            Relationship Configuration
          </SheetTitle>
          <SheetDescription>
            {sourceNode.title} → {targetNode.title}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-6 mb-6">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="workflow" className="gap-1">
                <Workflow className="h-3 w-3" />
                Workflow
              </TabsTrigger>
              <TabsTrigger value="evidence">
                Evidence ({formData.evidence?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="history" className="gap-1">
                <Clock className="h-3 w-3" />
                History ({relationship?.history?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Relationship Type</CardTitle>
                  <CardDescription>
                    Define the nature of this relationship
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Type
                    </label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: RelationshipType) =>
                        handleFieldChange("type", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {relationshipTypeOptions.map((option) => {
                          const Icon = option.icon;
                          return (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center gap-2">
                                <Icon className="h-4 w-4" />
                                <div>
                                  <div className="font-medium">
                                    {option.label}
                                  </div>
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
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
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
                                <div className="font-medium">
                                  {option.label}
                                </div>
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
                      Relationship Strength ({formData.weight || 50}%)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={formData.weight || 50}
                      onChange={(e) =>
                        handleFieldChange("weight", parseInt(e.target.value))
                      }
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Weak</span>
                      <span>Strong</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Workflow Tab */}
            <TabsContent value="workflow" className="space-y-6">
              <RelationshipWorkflows
                type={formData.type || "Probabilistic"}
                onConfidenceChange={(confidence) =>
                  handleFieldChange("confidence", confidence)
                }
                onEvidenceAdd={(evidence) =>
                  handleFieldChange("evidence", [
                    ...(formData.evidence || []),
                    evidence,
                  ])
                }
                onTypeUpgrade={(newType) => handleFieldChange("type", newType)}
                currentEvidence={formData.evidence || []}
              />
            </TabsContent>

            {/* Evidence Tab */}
            <TabsContent value="evidence" className="space-y-6">
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
            <TabsContent value="history" className="space-y-6">
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
            <TabsContent value="analysis" className="space-y-6">
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
            <TabsContent value="settings" className="space-y-6">
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
