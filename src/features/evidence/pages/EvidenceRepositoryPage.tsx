import { useEvidenceStore } from '@/features/evidence/stores/useEvidenceStore';
import { useCanvasStore } from '@/lib/stores';
import { usePageHeader } from '@/shared/hooks/usePageHeader';
import { useConfirm } from '@/shared/components/ConfirmDialog';
import { EmptyState } from '@/shared/components/EmptyState';
import { Badge } from '@/shared/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/shared/components/ui/breadcrumb';
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
import { formatDate } from '@/shared/utils/formatDate';
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
import { Link, useParams } from 'react-router-dom';
import EvidenceEditor from '../components/EvidenceEditor';
import { useClerkSupabase } from '@/shared/hooks/useClerkSupabase';
import { useAppStore } from '@/shared/stores/useAppStore';
import { createProjectEvidence } from '@/shared/lib/supabase/services/evidence';
import { updateEvidenceItem } from '@/shared/lib/supabase/services/relationships';

const evidenceTypeOptions = [
  { value: 'Experiment', icon: FlaskConical, variant: 'blue' },
  { value: 'Analysis', icon: FileText, variant: 'green' },
  { value: 'Notebook', icon: BookOpen, variant: 'purple' },
  { value: 'External Research', icon: Globe, variant: 'orange' },
  { value: 'User Interview', icon: Users, variant: 'pink' },
] as const;

// Card preview: first real text from the notebook content, falling back to the
// summary — so the card reflects what's actually written in the notebook.
function contentPreview(ev: EvidenceItem): string {
  const blocks = (ev.content as any)?.blocks;
  if (Array.isArray(blocks)) {
    for (const b of blocks) {
      const raw = b?.data?.text ?? b?.data?.items?.[0] ?? '';
      const text = String(raw).replace(/<[^>]+>/g, '').trim();
      if (text) return text;
    }
  }
  return ev.summary || '';
}

export default function EvidenceRepositoryPage() {
  const { canvasId } = useParams();
  const isCanvasScoped = Boolean(canvasId);
  const client = useClerkSupabase();
  const { user } = useAppStore();
  const { canvas } = useCanvasStore();
  const confirm = useConfirm();
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

  const handleSaveEvidence = async (
    evidence: EvidenceItem,
    options?: { autoSave?: boolean }
  ) => {
    if (selectedEvidence) {
      // Update existing evidence (store + DB)
      updateEvidence(selectedEvidence.id, evidence);
      if (client) {
        try {
          await updateEvidenceItem(selectedEvidence.id, evidence, client);
        } catch (e) {
          console.error('Failed to persist evidence edit to DB', e);
        }
      }
    } else {
      // Create new evidence — persist to the DB (project-scoped) when we have a
      // canvas/project context, so it's DB-backed rather than store-only and
      // resolvable by id across surfaces (CVS-34 slice 3).
      let created = evidence;
      if (canvasId && client && user?.id) {
        try {
          created = await createProjectEvidence(
            evidence,
            canvasId,
            user.id,
            client
          );
        } catch (e) {
          console.error('Failed to create evidence in DB; storing locally', e);
        }
      }
      addEvidence(created);
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

  const handleDeleteEvidence = async (evidenceId: string) => {
    const confirmed = await confirm({
      title: 'Delete this evidence?',
      description:
        'It will be removed from all relationships. This cannot be undone.',
      actionLabel: 'Delete',
      destructive: true,
    });
    if (confirmed) {
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

  const getTypeVariant = (type: string) => {
    const option = evidenceTypeOptions.find((opt) => opt.value === type);
    return option ? option.variant : 'gray';
  };

  // Feed the shared canvas top bar when canvas-scoped; the top-level /evidence
  // mount has no provider so this no-ops and we keep the in-page title below.
  usePageHeader({
    title: 'Evidence',
    description: 'Evidence used across this canvas and its relationships',
    actions: (
      <>
        <Badge variant="outline" className="text-xs">
          {allEvidence.length} Items
        </Badge>
        <Button onClick={handleCreateEvidence} size="sm" className="h-7 gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          New Evidence
        </Button>
      </>
    ),
    deps: [allEvidence.length],
  });

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {isCanvasScoped && canvas?.name && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to={`/canvas/${canvasId}`}>{canvas.name}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </>
          )}
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Evidence</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header — only for the top-level /evidence route (no shared top bar).
          Canvas-scoped mounts surface title/actions via usePageHeader above. */}
      {!isCanvasScoped && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Evidence Repository</h1>
              <p className="text-muted-foreground mt-1">
                Centralized management of all evidence across your canvases
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
      )}

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
                    <Badge variant={getTypeVariant(evidence.type)}>
                      <TypeIcon className="h-3 w-3" />
                      {evidence.type}
                    </Badge>
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
                    {contentPreview(evidence)}
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
                      {formatDate(evidence.date)}
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
                    <div className="mt-3 p-2 bg-info/10 border border-info/20 rounded text-xs">
                      <strong>Hypothesis:</strong> {evidence.hypothesis}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={<FileText />}
          title={
            allEvidence.length === 0 ? 'No evidence yet' : 'No evidence found'
          }
          description={
            allEvidence.length === 0
              ? 'Start by creating evidence to support your relationships'
              : 'Try adjusting your search terms or filters'
          }
          action={
            allEvidence.length === 0 ? (
              <Button onClick={handleCreateEvidence} className="gap-2">
                <Plus className="h-4 w-4" />
                Create First Evidence
              </Button>
            ) : undefined
          }
        />
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
