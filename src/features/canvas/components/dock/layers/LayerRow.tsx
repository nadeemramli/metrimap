import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Input } from '@/shared/components/ui/input';
import { cn } from '@/shared/utils';
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  BarChart3,
  ChevronsDown,
  ChevronsUp,
  Circle,
  Database,
  Eye,
  EyeOff,
  FileText,
  Gem,
  Image as ImageIcon,
  Lightbulb,
  LineChart,
  Lock,
  MessageSquare,
  Minus,
  MoreHorizontal,
  PenLine,
  Sigma,
  Square,
  Type,
  Unlock,
  Zap,
} from 'lucide-react';
import { useState, type ComponentType } from 'react';
import type { LayerEntry } from './useLayersTree';

const TYPE_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  'Core/Value': Gem,
  'Work/Action': Zap,
  'Ideas/Hypothesis': Lightbulb,
  'Data/Metric': BarChart3,
  valueNode: Gem,
  actionNode: Zap,
  hypothesisNode: Lightbulb,
  metricNode: BarChart3,
  sourceNode: Database,
  chartNode: LineChart,
  operatorNode: Sigma,
  commentNode: MessageSquare,
  'whiteboard:freehand': PenLine,
  'whiteboard:rect': Square,
  'whiteboard:ellipse': Circle,
  'whiteboard:arrow': ArrowRight,
  'whiteboard:line': Minus,
  'whiteboard:text': Type,
  'whiteboard:image': ImageIcon,
  evidence: FileText,
};

export interface LayerRowProps {
  entry: LayerEntry;
  selected: boolean;
  hidden: boolean;
  locked: boolean;
  /** Indent members of an expanded group folder. */
  indented?: boolean;
  /** Another row is being dragged over this one (drop indicator). */
  dropTarget?: boolean;
  onSelect: (entry: LayerEntry, additive: boolean) => void;
  onRename: (entry: LayerEntry, title: string) => void;
  onToggleHidden: (id: string) => void;
  onToggleLocked: (id: string) => void;
  onZAction: (
    entry: LayerEntry,
    action: 'front' | 'forward' | 'backward' | 'back'
  ) => void;
  onDragStart?: (entry: LayerEntry) => void;
  onDragOver?: (entry: LayerEntry) => void;
  onDropOn?: (entry: LayerEntry) => void;
  onDragEnd?: () => void;
}

export function LayerRow({
  entry,
  selected,
  hidden,
  locked,
  indented,
  dropTarget,
  onSelect,
  onRename,
  onToggleHidden,
  onToggleLocked,
  onZAction,
  onDragStart,
  onDragOver,
  onDropOn,
  onDragEnd,
}: LayerRowProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(entry.title);
  const Icon = TYPE_ICONS[entry.typeKey] ?? BarChart3;

  const commit = () => {
    const next = draft.trim();
    if (next && next !== entry.title) onRename(entry, next);
    setEditing(false);
  };

  return (
    <div
      className={cn(
        'group flex h-7 items-center gap-1.5 rounded-md px-1.5 text-xs transition-colors',
        indented && 'ml-5',
        selected
          ? 'bg-accent text-accent-foreground'
          : 'hover:bg-accent/50 text-foreground',
        hidden && 'opacity-45',
        dropTarget && 'ring-1 ring-primary/60 bg-primary/5'
      )}
      onClick={(e) => onSelect(entry, e.metaKey || e.ctrlKey)}
      onDoubleClick={(e) => {
        e.stopPropagation();
        setDraft(entry.title);
        setEditing(true);
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !editing)
          onSelect(entry, e.metaKey || e.ctrlKey);
      }}
      draggable={!editing}
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', entry.id);
        onDragStart?.(entry);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        onDragOver?.(entry);
      }}
      onDrop={(e) => {
        e.preventDefault();
        onDropOn?.(entry);
      }}
      onDragEnd={onDragEnd}
    >
      <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />

      {editing ? (
        <Input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === 'Enter') commit();
            if (e.key === 'Escape') setEditing(false);
          }}
          className="h-5 flex-1 rounded-sm px-1 text-xs"
        />
      ) : (
        <span className="min-w-0 flex-1 truncate" title={entry.title}>
          {entry.title}
        </span>
      )}

      {/* Hover / state controls */}
      <div
        className={cn(
          'flex shrink-0 items-center',
          !hidden &&
            !locked &&
            'opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant="ghost"
          size="sm"
          className="h-5 w-5 p-0 text-muted-foreground hover:text-foreground"
          onClick={() => onToggleHidden(entry.id)}
          title={hidden ? 'Show' : 'Hide'}
          aria-label={hidden ? 'Show layer' : 'Hide layer'}
        >
          {hidden ? (
            <EyeOff className="h-3 w-3" />
          ) : (
            <Eye className="h-3 w-3" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-5 w-5 p-0 text-muted-foreground hover:text-foreground"
          onClick={() => onToggleLocked(entry.id)}
          title={locked ? 'Unlock' : 'Lock'}
          aria-label={locked ? 'Unlock layer' : 'Lock layer'}
        >
          {locked ? (
            <Lock className="h-3 w-3" />
          ) : (
            <Unlock className="h-3 w-3" />
          )}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-5 w-5 p-0 text-muted-foreground hover:text-foreground"
              aria-label="Layer actions"
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onClick={() => onZAction(entry, 'front')}>
              <ChevronsUp className="mr-2 h-3.5 w-3.5" />
              Bring to front
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onZAction(entry, 'forward')}>
              <ArrowUp className="mr-2 h-3.5 w-3.5" />
              Bring forward
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onZAction(entry, 'backward')}>
              <ArrowDown className="mr-2 h-3.5 w-3.5" />
              Send backward
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onZAction(entry, 'back')}>
              <ChevronsDown className="mr-2 h-3.5 w-3.5" />
              Send to back
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setDraft(entry.title);
                setEditing(true);
              }}
            >
              Rename
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
