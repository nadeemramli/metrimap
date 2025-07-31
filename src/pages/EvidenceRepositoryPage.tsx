import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Search,
  Filter,
  FileText,
  ExternalLink,
  Calendar,
  User,
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  Globe,
  FlaskConical,
  BookOpen,
  Users,
  ArrowLeft,
} from "lucide-react";
import { useCanvasStore } from "@/lib/stores";
import { useEvidenceStore } from "@/lib/stores/evidenceStore";
import type { EvidenceItem } from "@/lib/types";

const evidenceTypeOptions = [
  {
    value: "Experiment",
    icon: FlaskConical,
    color: "bg-blue-50 text-blue-700",
  },
  { value: "Analysis", icon: FileText, color: "bg-green-50 text-green-700" },
  { value: "Notebook", icon: BookOpen, color: "bg-purple-50 text-purple-700" },
  {
    value: "External Research",
    icon: Globe,
    color: "bg-orange-50 text-orange-700",
  },
  { value: "User Interview", icon: Users, color: "bg-pink-50 text-pink-700" },
];

export default function EvidenceRepositoryPage() {
  const navigate = useNavigate();
  const { canvas } = useCanvasStore();
  const {
    evidence,
    addEvidence,
    updateEvidence,
    deleteEvidence,
    duplicateEvidence,
  } = useEvidenceStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedOwner, setSelectedOwner] = useState<string>("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceItem | null>(
    null
  );
  const [formData, setFormData] = useState<Partial<EvidenceItem>>({
    title: "",
    type: "Analysis",
    date: new Date().toISOString().split("T")[0],
    owner: "",
    summary: "",
    link: "",
    hypothesis: "",
    impactOnConfidence: "",
  });

  // Combine standalone evidence with relationship evidence
  const allEvidence = useMemo(() => {
    const evidenceMap = new Map<
      string,
      EvidenceItem & { relationshipCount: number; relationships: string[] }
    >();

    // Add standalone evidence from evidence store
    evidence.forEach((item) => {
      evidenceMap.set(item.id, {
        ...item,
        relationshipCount: 0,
        relationships: [],
      });
    });

    // Add evidence from relationships
    if (canvas?.edges) {
      canvas.edges.forEach((relationship) => {
        relationship.evidence?.forEach((relationshipEvidence) => {
          const existing = evidenceMap.get(relationshipEvidence.id);
          if (existing) {
            existing.relationshipCount++;
            existing.relationships.push(relationship.id);
          } else {
            evidenceMap.set(relationshipEvidence.id, {
              ...relationshipEvidence,
              relationshipCount: 1,
              relationships: [relationship.id],
            });
          }
        });
      });
    }

    return Array.from(evidenceMap.values());
  }, [evidence, canvas?.edges]);

  // Get unique owners for filtering
  const uniqueOwners = useMemo(() => {
    return Array.from(new Set(allEvidence.map((e) => e.owner).filter(Boolean)));
  }, [allEvidence]);

  // Filter evidence based on search and filters
  const filteredEvidence = useMemo(() => {
    return allEvidence.filter((evidence) => {
      const matchesSearch =
        evidence.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evidence.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evidence.owner.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType =
        selectedType === "all" || evidence.type === selectedType;
      const matchesOwner =
        selectedOwner === "all" || evidence.owner === selectedOwner;

      return matchesSearch && matchesType && matchesOwner;
    });
  }, [allEvidence, searchTerm, selectedType, selectedOwner]);

  const resetForm = () => {
    setFormData({
      title: "",
      type: "Analysis",
      date: new Date().toISOString().split("T")[0],
      owner: "",
      summary: "",
      link: "",
      hypothesis: "",
      impactOnConfidence: "",
    });
  };

  const handleCreateEvidence = () => {
    setIsCreateModalOpen(true);
    resetForm();
  };

  const handleEditEvidence = (evidence: EvidenceItem) => {
    setSelectedEvidence(evidence);
    setFormData({ ...evidence });
    setIsEditModalOpen(true);
  };

  const handleSaveEvidence = () => {
    if (!formData.title || !formData.summary) return;

    const evidenceData: EvidenceItem = {
      id: selectedEvidence?.id || `evidence_${Date.now()}`,
      title: formData.title!,
      type: formData.type as any,
      date: formData.date!,
      owner: formData.owner || "Unknown",
      summary: formData.summary!,
      link: formData.link,
      hypothesis: formData.hypothesis,
      impactOnConfidence: formData.impactOnConfidence,
      createdAt: selectedEvidence?.createdAt || new Date().toISOString(),
      createdBy: selectedEvidence?.createdBy || "current-user", // TODO: Get from auth
    };

    if (selectedEvidence) {
      // Update existing evidence
      updateEvidence(selectedEvidence.id, evidenceData);
    } else {
      // Create new evidence
      addEvidence(evidenceData);
    }

    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedEvidence(null);
    resetForm();
  };

  const handleDeleteEvidence = (evidenceId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this evidence? It will be removed from all relationships."
      )
    ) {
      deleteEvidence(evidenceId);
      // TODO: Also remove from relationships if needed
    }
  };

  const handleDuplicateEvidence = (evidenceItem: EvidenceItem) => {
    const duplicate = duplicateEvidence(evidenceItem.id);
    if (duplicate) {
      setFormData({ ...duplicate });
      setIsEditModalOpen(true);
    }
  };

  const getTypeIcon = (type: string) => {
    const option = evidenceTypeOptions.find((opt) => opt.value === type);
    return option ? option.icon : FileText;
  };

  const getTypeColor = (type: string) => {
    const option = evidenceTypeOptions.find((opt) => opt.value === type);
    return option ? option.color : "bg-gray-50 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  <FileText className="h-8 w-8" />
                  Evidence Repository
                </h1>
                <p className="text-muted-foreground mt-1">
                  Centralized management of all evidence across relationships
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-sm">
                {allEvidence.length} Evidence Items
              </Badge>
              <Button onClick={handleCreateEvidence} className="gap-2">
                <Plus className="h-4 w-4" />
                New Evidence
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="container mx-auto px-6 py-6">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search evidence by title, summary, or owner..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {evidenceTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedOwner} onValueChange={setSelectedOwner}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by owner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Owners</SelectItem>
                  {uniqueOwners.map((owner) => (
                    <SelectItem key={owner} value={owner}>
                      {owner}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Evidence Grid */}
        {filteredEvidence.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvidence.map((evidence) => {
              const TypeIcon = getTypeIcon(evidence.type);
              return (
                <Card key={evidence.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(evidence.type)}`}
                      >
                        <TypeIcon className="h-3 w-3 inline mr-1" />
                        {evidence.type}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleEditEvidence(evidence)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Evidence
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDuplicateEvidence(evidence)}
                          >
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          {evidence.link && (
                            <DropdownMenuItem asChild>
                              <a
                                href={evidence.link}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Open Link
                              </a>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteEvidence(evidence.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardTitle className="text-lg">{evidence.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {evidence.summary}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {evidence.owner}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(evidence.date).toLocaleDateString()}
                      </div>
                    </div>

                    {evidence.relationshipCount > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Used in {evidence.relationshipCount} relationship
                          {evidence.relationshipCount === 1 ? "" : "s"}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {evidence.relationshipCount} links
                        </Badge>
                      </div>
                    )}

                    {evidence.hypothesis && (
                      <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                        <strong>Hypothesis:</strong> {evidence.hypothesis}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              {allEvidence.length === 0
                ? "No Evidence Yet"
                : "No Evidence Found"}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {allEvidence.length === 0
                ? "Start by creating evidence to support your relationships"
                : "Try adjusting your search terms or filters"}
            </p>
            {allEvidence.length === 0 && (
              <Button onClick={handleCreateEvidence} className="gap-2">
                <Plus className="h-4 w-4" />
                Create First Evidence
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Create/Edit Evidence Modal */}
      <Dialog
        open={isCreateModalOpen || isEditModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateModalOpen(false);
            setIsEditModalOpen(false);
            setSelectedEvidence(null);
            resetForm();
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedEvidence ? "Edit Evidence" : "Create New Evidence"}
            </DialogTitle>
            <DialogDescription>
              {selectedEvidence
                ? "Update the evidence details below"
                : "Add new evidence to support your relationships"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Evidence title"
                />
              </div>
              <div>
                <Label htmlFor="type">Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, type: value as any }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {evidenceTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="owner">Owner</Label>
                <Input
                  id="owner"
                  value={formData.owner}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, owner: e.target.value }))
                  }
                  placeholder="Evidence owner"
                />
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, date: e.target.value }))
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="summary">Summary *</Label>
              <Textarea
                id="summary"
                value={formData.summary}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, summary: e.target.value }))
                }
                placeholder="Evidence summary and key findings"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="hypothesis">Hypothesis</Label>
              <Textarea
                id="hypothesis"
                value={formData.hypothesis}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    hypothesis: e.target.value,
                  }))
                }
                placeholder="Hypothesis being tested (optional)"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="link">External Link</Label>
              <Input
                id="link"
                type="url"
                value={formData.link}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, link: e.target.value }))
                }
                placeholder="https://..."
              />
            </div>

            <div>
              <Label htmlFor="impact">Impact on Confidence</Label>
              <Textarea
                id="impact"
                value={formData.impactOnConfidence}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    impactOnConfidence: e.target.value,
                  }))
                }
                placeholder="How this evidence affects relationship confidence"
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateModalOpen(false);
                setIsEditModalOpen(false);
                setSelectedEvidence(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEvidence}
              disabled={!formData.title || !formData.summary}
            >
              {selectedEvidence ? "Update Evidence" : "Create Evidence"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
