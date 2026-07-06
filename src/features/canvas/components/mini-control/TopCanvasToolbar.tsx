import { Button } from '@/shared/components/ui/button';
import {
  Eraser,
  Hand,
  Lasso,
  Layers,
  MapPin,
  MessageSquarePlus,
  MousePointer,
  PenTool,
  SlidersHorizontal,
  Square,
} from 'lucide-react';
import AddNodeButton from './AddNodeButton';
import { createLogger } from '@/shared/utils/logger';

const log = createLogger('canvas');

type CanvasMode = 'edit' | 'draw';

interface TopCanvasToolbarProps {
  mode: CanvasMode;

  navigationTool: string;
  onChangeNavigationTool: (tool: string) => void;

  keepToolActive: boolean;
  onToggleKeepToolActive: (value: boolean) => void;

  drawActiveTool: string;
  onSetDrawTool: (tool: string) => void;

  // Whiteboard tools (for draw mode)
  whiteboardTool?: string;
  onSetWhiteboardTool?: (tool: string) => void;

  onOpenFilters: () => void;
  onAddEvidence: () => void;
  onApplyLayout: () => void;
  currentLayoutDirection?: string;
  onAddCustomNode?: (
    type:
      | 'commentNode'
      | 'sourceNode'
      | 'chartNode'
      | 'operatorNode'
      | 'whiteboardNode'
  ) => void;
  onAddFromCatalog?: (position?: { x: number; y: number }) => void;

  // Organize cluster (folded in from the old top-right panel, CVS-31)
  onToggleGroups?: () => void;
  groupsActive?: boolean;
  onToggleOperators?: () => void;
  operatorsActive?: boolean;
  exportSlot?: React.ReactNode;
}

export default function TopCanvasToolbar(props: TopCanvasToolbarProps) {
  const {
    mode,
    whiteboardTool,
    onSetWhiteboardTool,
  } = props;

  log.debug('🎯 TopCanvasToolbar render:', { mode, whiteboardTool });

  // React Flow whiteboard tools (for draw mode)
  const whiteboardTools: { id: string; title: string; Icon: any }[] = [
    { id: 'select', title: 'Select (V)', Icon: MousePointer },
    { id: 'hand', title: 'Hand Tool (H)', Icon: Hand },
    { id: 'eraser', title: 'Eraser (E)', Icon: Eraser },
    { id: 'lasso', title: 'Lasso Selection (L)', Icon: Lasso },
    { id: 'rectangle', title: 'Rectangle (R)', Icon: Square },
    { id: 'freehand', title: 'Freehand Draw (P)', Icon: PenTool },
  ];

  const getToolButtonClasses = (active: boolean) =>
    `rounded-lg h-8 w-8 p-0 transition-colors ${
      active
        ? 'bg-primary/15 text-primary ring-1 ring-primary/30 hover:bg-primary/25'
        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
    }`;

  const WithTooltip = ({
    label,
    hotkey,
    children,
  }: {
    label: string;
    hotkey?: string;
    children: React.ReactNode;
  }) => (
    <div className="relative group">
      {children}
      <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-1 hidden group-hover:flex items-center gap-1 whitespace-nowrap rounded-md bg-black/80 text-white text-[11px] px-2 py-1 shadow-lg">
        <span>{label}</span>
        {hotkey && (
          <kbd className="bg-white/20 px-1 rounded-sm text-[10px]">
            {hotkey}
          </kbd>
        )}
      </div>
    </div>
  );

  return (
    <div className="pointer-events-auto flex items-center gap-3 rounded-2xl bg-popover/95 backdrop-blur-sm border border-border shadow-[0_10px_24px_-12px_rgba(0,0,0,0.35)] px-3 py-2">
      {/* Drawing Tools - Show different tools based on mode */}
      {mode === 'draw' ? (
        /* React Flow Whiteboard Tools */
        whiteboardTools.map((tool) => {
          const Icon = tool.Icon;
          const isActive = whiteboardTool === tool.id;

          return (
            <WithTooltip key={tool.id} label={tool.title}>
              <Button
                variant="ghost"
                size="sm"
                aria-pressed={isActive}
                className={getToolButtonClasses(isActive)}
                title={tool.title}
                onClick={() => {
                  log.debug('🎯 Tool clicked:', tool.id);
                  onSetWhiteboardTool?.(tool.id);
                }}
              >
                <Icon className="w-4 h-4" />
              </Button>
            </WithTooltip>
          );
        })
      ) : (
        /* Edit Mode - Just selection tool */
        <WithTooltip label="Selection" hotkey="V">
          <Button
            variant="ghost"
            size="sm"
            className={getToolButtonClasses(true)}
            title="Selection (V)"
          >
            <MousePointer className="w-4 h-4" />
          </Button>
        </WithTooltip>
      )}

      {/* Draw mode - no indicator needed since it's clear from the tools */}

      {/* Actions - Only show in edit mode */}
      {mode === 'edit' && (
        <div className="flex items-center gap-1">
          <WithTooltip label="Add Card" hotkey="A">
            <div>
              <AddNodeButton
                onAddCustomNode={props.onAddCustomNode}
                onAddFromCatalog={props.onAddFromCatalog}
              />
            </div>
          </WithTooltip>
          {/* Add Evidence Node */}
          <WithTooltip label="Add Evidence">
            <Button
              variant="ghost"
              size="sm"
              title="Add evidence"
              className="rounded-lg"
              onClick={props.onAddEvidence}
            >
              <MapPin className="h-4 w-4" />
            </Button>
          </WithTooltip>
          {/* Add Comment Node */}
          <WithTooltip label="Add Comment">
            <Button
              variant="ghost"
              size="sm"
              title="Add comment"
              className="rounded-lg"
              onClick={() => props.onAddCustomNode?.('commentNode')}
            >
              <MessageSquarePlus className="h-4 w-4" />
            </Button>
          </WithTooltip>
          {/* Layout, Filter & Search moved to the bottom-left Controls (CVS UI). */}
          {/* Organize: groups + tools (operators) + export — folded in from the
              old scattered top-right panel so the canvas has one toolbar (CVS-31) */}
          {(props.onToggleGroups || props.onToggleOperators || props.exportSlot) && (
            <>
              <div className="mx-0.5 h-6 w-px bg-border" aria-hidden />
              {props.onToggleGroups && (
                <WithTooltip label="Groups">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={getToolButtonClasses(!!props.groupsActive)}
                    title="Groups"
                    aria-pressed={!!props.groupsActive}
                    onClick={props.onToggleGroups}
                  >
                    <Layers className="h-4 w-4" />
                  </Button>
                </WithTooltip>
              )}
              {props.onToggleOperators && (
                <WithTooltip label="Tools">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={getToolButtonClasses(!!props.operatorsActive)}
                    title="Tools"
                    aria-pressed={!!props.operatorsActive}
                    onClick={props.onToggleOperators}
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                </WithTooltip>
              )}
              {props.exportSlot}
            </>
          )}
        </div>
      )}
    </div>
  );
}
