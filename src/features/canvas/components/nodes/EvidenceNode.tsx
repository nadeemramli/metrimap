// Compact canvas evidence node (annotations overhaul): a Figma-style pin that
// expands to a theme-aware preview card. Deep editing (notebook, metadata,
// comments) lives on the full-page editor ("View full") — the old ~900-line
// inline-EditorJS card is gone.
import EvidenceContentRenderer from '@/features/evidence/components/EvidenceContentRenderer';
import { useEvidenceStore } from '@/features/evidence/stores/useEvidenceStore';
import { useAppStore } from '@/lib/stores';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import type { EvidenceItem } from '@/shared/types';
import type { Node, NodeProps } from '@xyflow/react';
import {
  BookOpen,
  Calendar,
  ExternalLink,
  FileText,
  FlaskConical,
  Globe,
  Link2,
  MessageSquare,
  Minimize2,
  Trash2,
  Users,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useConfirm } from '@/shared/components/ConfirmDialog';
import { FourSideHandles } from './FourSideHandles';
import {
  AnnotationPin,
  useAnnotationScale,
} from '@/features/canvas/components/nodes/shared/AnnotationPin';
import { isUnseen, markSeen } from '@/features/canvas/utils/annotationSeen';

interface EvidenceNodeData extends Record<string, unknown> {
  evidence: EvidenceItem;
  onUpdateEvidence: (id: string, updates: Partial<EvidenceItem>) => void;
  onDeleteEvidence: (id: string) => void;
}

type EvidenceFlowNode = Node<EvidenceNodeData, 'evidence'>;

const TYPE_META: Record<
  string,
  { icon: React.ElementType; chip: string }
> = {
  Experiment: { icon: FlaskConical, chip: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
  Analysis: { icon: FileText, chip: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
  Notebook: { icon: BookOpen, chip: 'bg-purple-500/10 text-purple-600 dark:text-purple-400' },
  'External Research': { icon: Globe, chip: 'bg-orange-500/10 text-orange-600 dark:text-orange-400' },
  'User Interview': { icon: Users, chip: 'bg-pink-500/10 text-pink-600 dark:text-pink-400' },
};

export default function EvidenceNode({ data }: NodeProps<EvidenceFlowNode>) {
  const onUpdateEvidence = data?.onUpdateEvidence;
  const onDeleteEvidence = data?.onDeleteEvidence;
  const evidence = data?.evidence ?? ({} as EvidenceItem);
  const { canvasId } = useParams();
  const confirm = useConfirm();
  const user = useAppStore((s) => s.user);
  const bubbleScale = useAnnotationScale();

  const justCreatedId = useEvidenceStore((s) => s.justCreatedEvidenceId);
  const clearJustCreated = useEvidenceStore((s) => s.setJustCreatedEvidenceId);
  const isJustCreated = justCreatedId === evidence.id;

  const [isExpanded, setIsExpanded] = useState(
    evidence.isExpanded || isJustCreated
  );
  // Freshly created evidence opens straight into title editing (card first,
  // not icon first) with the default title preselected.
  const [editingTitle, setEditingTitle] = useState(isJustCreated);
  const [titleDraft, setTitleDraft] = useState(evidence.title || '');
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingTitle) {
      requestAnimationFrame(() => titleInputRef.current?.select());
    }
  }, [editingTitle]);

  // Unread (device-local): the item changed since this user last opened it.
  const unread =
    !isExpanded &&
    !isJustCreated &&
    isUnseen(user?.id, evidence.id, evidence.updatedAt);
  useEffect(() => {
    if (isExpanded && evidence.id) markSeen(user?.id, evidence.id);
  }, [isExpanded, evidence.id, evidence.updatedAt, user?.id]);

  const setExpanded = (expanded: boolean) => {
    setIsExpanded(expanded);
    onUpdateEvidence?.(evidence.id, { isExpanded: expanded });
    if (isJustCreated) clearJustCreated?.(null);
  };

  const commitTitle = () => {
    const next = titleDraft.trim();
    if (next && next !== evidence.title) {
      onUpdateEvidence?.(evidence.id, { title: next });
    } else {
      setTitleDraft(evidence.title || '');
    }
    setEditingTitle(false);
    if (isJustCreated) clearJustCreated?.(null);
  };

  const handleDelete = async () => {
    const ok = await confirm({
      title: `Delete "${evidence.title}"?`,
      description: 'This removes the evidence item and its content.',
      actionLabel: 'Delete',
      destructive: true,
    });
    if (ok) onDeleteEvidence?.(evidence.id);
  };

  const meta = TYPE_META[evidence.type] ?? {
    icon: FileText,
    chip: 'bg-muted text-muted-foreground',
  };
  const TypeIcon = meta.icon;

  // "View full" keeps the canvas context (nested route — CVS-36).
  const evidenceHref = canvasId
    ? `/canvas/${canvasId}/evidence/${evidence.id}`
    : `/evidence/${evidence.id}`;

  const linkedName =
    evidence.context && evidence.context.type !== 'general'
      ? evidence.context.targetName
      : null;
  const commentCount = evidence.comments?.length || 0;

  // Collapsed: just the pin — constant screen size, no floating title label.
  if (!isExpanded) {
    return (
      <div className="relative cursor-move">
        <FourSideHandles />
        <AnnotationPin
          colorClass="bg-emerald-500"
          unread={unread}
          title={evidence.title || 'Evidence'}
          onClick={() => setExpanded(true)}
        >
          <TypeIcon className="h-4 w-4" />
        </AnnotationPin>
      </div>
    );
  }

  return (
    <div className="relative select-none cursor-move">
      <FourSideHandles />
      <div
        style={{ transform: `scale(${bubbleScale})`, transformOrigin: 'top left' }}
      >
        <div className="mb-1">
          <AnnotationPin
            colorClass="bg-emerald-500"
            title="Collapse"
            onClick={() => setExpanded(false)}
          >
            <TypeIcon className="h-4 w-4" />
          </AnnotationPin>
        </div>

        <Card className="w-80 rounded-xl rounded-tl-sm border bg-card/95 p-3 shadow-md backdrop-blur-sm">
          {/* Header: type chip + inline-editable title + actions */}
          <div className="flex items-start gap-2">
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${meta.chip}`}
            >
              <TypeIcon className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              {editingTitle ? (
                <Input
                  ref={titleInputRef}
                  autoFocus
                  value={titleDraft}
                  onChange={(e) => setTitleDraft(e.target.value)}
                  onBlur={commitTitle}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      commitTitle();
                    } else if (e.key === 'Escape') {
                      setTitleDraft(evidence.title || '');
                      setEditingTitle(false);
                    }
                  }}
                  className="nodrag h-7 text-sm font-semibold"
                  placeholder="Evidence title…"
                />
              ) : (
                <button
                  type="button"
                  className="nodrag block w-full truncate text-left text-sm font-semibold hover:underline"
                  title="Rename"
                  onClick={() => {
                    setTitleDraft(evidence.title || '');
                    setEditingTitle(true);
                  }}
                >
                  {evidence.title || 'Untitled evidence'}
                </button>
              )}
              <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                <Badge variant="outline" className="h-4 px-1.5 text-[10px]">
                  {evidence.type}
                </Badge>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {evidence.date}
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="nodrag h-6 w-6 shrink-0 p-0 text-muted-foreground"
              title="Collapse"
              onClick={() => setExpanded(false)}
            >
              <Minimize2 className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Content preview */}
          <div className="relative mt-2 max-h-32 overflow-hidden rounded-md">
            <EvidenceContentRenderer evidence={evidence} className="text-sm" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-card to-transparent" />
          </div>

          {/* Linked target (set by dragging an edge to a node, or via the
              relationship sheet) — the point of evidence: it backs something. */}
          {linkedName && (
            <div className="mt-2 flex items-center gap-1.5 rounded-md bg-muted/60 px-2 py-1 text-xs">
              <Link2 className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Linked to</span>
              <span className="truncate font-medium">{linkedName}</span>
            </div>
          )}

          {/* Footer: comments count + actions */}
          <div className="mt-2 flex items-center justify-between border-t border-border/60 pt-2">
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <MessageSquare className="h-3 w-3" />
              {commentCount} comment{commentCount === 1 ? '' : 's'}
            </span>
            <div className="flex items-center gap-0.5">
              <Button
                variant="ghost"
                size="sm"
                className="nodrag h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                title="Delete evidence"
                onClick={handleDelete}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="nodrag h-6 gap-1 px-2 text-xs"
              >
                <Link to={evidenceHref}>
                  <ExternalLink className="h-3 w-3" />
                  View full
                </Link>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
