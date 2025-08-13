import { useEvidenceStore } from '@/features/evidence/stores/useEvidenceStore';
import { useCanvasStore } from '@/lib/stores';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Input } from '@/shared/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import type { EvidenceItem } from '@/shared/types';
import {
  BookOpen,
  Calendar,
  Copy,
  Edit,
  ExternalLink,
  FileText,
  Filter,
  FlaskConical,
  Globe,
  MoreVertical,
  Plus,
  Search,
  Trash2,
  User,
  Users,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import EvidenceEditor from '../components/EvidenceEditor';

const evidenceTypeOptions = [
  {
    value: 'Experiment',
    icon: FlaskConical,
    color: 'bg-blue-50 text-blue-700',
  },
  { value: 'Analysis', icon: FileText, color: 'bg-green-50 text-green-700' },
  { value: 'Notebook', icon: BookOpen, color: 'bg-purple-50 text-purple-700' },
  {
    value: 'External Research',
    icon: Globe,
    color: 'bg-orange-50 text-orange-700',
  },
  { value: 'User Interview', icon: Users, color: 'bg-pink-50 text-pink-700' },
];

export default function EvidenceRepositoryPage() {
  const { canvas } = useCanvasStore();
  const {
    evidence,
    addEvidence,
    updateEvidence,
    deleteEvidence,
    duplicateEvidence,
  } = useEvidenceStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedOwner, setSelectedOwner] = useState<string>('all');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceItem | null>(
    null
  );

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
        selectedType === 'all' || evidence.type === selectedType;
      const matchesOwner =
        selectedOwner === 'all' || evidence.owner === selectedOwner;

      return matchesSearch && matchesType && matchesOwner;
    });
  }, [allEvidence, searchTerm, selectedType, selectedOwner]);

  const handleCreateEvidence = () => {
    setSelectedEvidence(null);
    setIsEditorOpen(true);
  };

  const handleEditEvidence = (evidence: EvidenceItem) => {
    setSelectedEvidence(evidence);
    setIsEditorOpen(true);
  };

  const handleSaveEvidence = (
    evidence: EvidenceItem,
    options?: { autoSave?: boolean }
  ) => {
    if (selectedEvidence) {
      // Update existing evidence
      updateEvidence(selectedEvidence.id, evidence);
    } else {
      // Create new evidence
      addEvidence(evidence);
    }

    // Only close dialog on manual save, not auto-save
    if (!options?.autoSave) {
      setIsEditorOpen(false);
      setSelectedEvidence(null);
    }
  };

  const handleCancelEditor = () => {
    setIsEditorOpen(false);
    setSelectedEvidence(null);
    setIsFullscreen(false);
  };

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleDeleteEvidence = (evidenceId: string) => {
    if (
      confirm(
        'Are you sure you want to delete this evidence? It will be removed from all relationships.'
      )
    ) {
      deleteEvidence(evidenceId);
      // TODO: Also remove from relationships if needed
    }
  };

  const handleDuplicateEvidence = (evidenceItem: EvidenceItem) => {
    const duplicate = duplicateEvidence(evidenceItem.id);
    if (duplicate) {
      setSelectedEvidence(duplicate);
      setIsEditorOpen(true);
    }
  };

  const handleViewInCanvas = (e: EvidenceItem) => {
    // Prefer nested canvas route if available
    const canvasId = canvas?.id;
    const ctx = e.context as any;
    const prefix =
      ctx?.type === 'card'
        ? 'card'
        : ctx?.type === 'relationship'
          ? 'rel'
          : 'evidence';
    const focusId =
      ctx?.type === 'card'
        ? ctx.targetId
        : ctx?.type === 'relationship'
          ? ctx.targetId
          : e.id;
    if (canvasId) {
      window.location.href = `/canvas/${canvasId}?focus=${prefix}:${focusId}`;
    }
  };

  const getTypeIcon = (type: string) => {
    const option = evidenceTypeOptions.find((opt) => opt.value === type);
    return option ? option.icon : FileText;
  };

  const getTypeColor = (type: string) => {
    const option = evidenceTypeOptions.find((opt) => opt.value === type);
    return option ? option.color : 'bg-gray-50 text-gray-700';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Evidence Repository</h1>
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

      {/* Filters and Search */}
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
                        <DropdownMenuItem asChild>
                          <Link to={`/evidence/${evidence.id}`}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Open Full Page
                          </Link>
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
                        {canvas?.id && (
                          <DropdownMenuItem
                            onClick={() => handleViewInCanvas(evidence)}
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View in Canvas
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
                        {evidence.relationshipCount === 1 ? '' : 's'}
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
            {allEvidence.length === 0 ? 'No Evidence Yet' : 'No Evidence Found'}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {allEvidence.length === 0
              ? 'Start by creating evidence to support your relationships'
              : 'Try adjusting your search terms or filters'}
          </p>
          {allEvidence.length === 0 && (
            <Button onClick={handleCreateEvidence} className="gap-2">
              <Plus className="h-4 w-4" />
              Create First Evidence
            </Button>
          )}
        </div>
      )}

      {/* Evidence Editor */}
      <EvidenceEditor
        evidence={selectedEvidence}
        onSave={handleSaveEvidence}
        onCancel={handleCancelEditor}
        isOpen={isEditorOpen}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
      />
    </div>
  );
}
