import { Button } from '@/shared/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import {
  Circle,
  Eraser,
  Hand,
  Lasso,
  Layers,
  MapPin,
  MessageSquarePlus,
  Minus,
  MousePointer,
  MoveUpRight,
  Palette,
  PenTool,
  SlidersHorizontal,
  Square,
  Type,
} from 'lucide-react';
import AddNodeButton from './AddNodeButton';
import { createLogger } from '@/shared/utils/logger';

export interface ShapeStyle {
  fill: string;
  stroke: string;
  strokeWidth: number;
}

// Tools that carry a stroke/fill style, so the toolbar shows the style popover
// (text reuses `stroke` as its colour; fill is hidden for it).
const SHAPE_TOOLS = new Set(['rectangle', 'ellipse', 'arrow', 'line', 'text']);

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
  shapeStyle?: ShapeStyle;
  onChangeShapeStyle?: (style: ShapeStyle) => void;

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
    { id: 'ellipse', title: 'Ellipse (O)', Icon: Circle },
    { id: 'arrow', title: 'Arrow (A)', Icon: MoveUpRight },
    { id: 'line', title: 'Line (N)', Icon: Minus },
    { id: 'text', title: 'Text (T)', Icon: Type },
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
        <>
          {whiteboardTools.map((tool) => {
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
          })}
          {/* Shape style — fill / stroke / width for the next drawn shape. */}
          {SHAPE_TOOLS.has(whiteboardTool || '') &&
            props.shapeStyle &&
            props.onChangeShapeStyle && (
              <ShapeStylePopover
                style={props.shapeStyle}
                onChange={props.onChangeShapeStyle}
                showFill={
                  whiteboardTool === 'rectangle' || whiteboardTool === 'ellipse'
                }
              />
            )}
        </>
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

const STROKE_WIDTHS = [1, 2, 4, 6] as const;
const asHex = (c: string) => (/^#[0-9a-fA-F]{6}$/.test(c) ? c : '#ffffff');

/** Fill / stroke / width control for the next drawn shape. */
function ShapeStylePopover({
  style,
  onChange,
  showFill,
}: {
  style: ShapeStyle;
  onChange: (style: ShapeStyle) => void;
  showFill: boolean;
}) {
  const hasFill = style.fill !== 'transparent';
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-lg h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-accent"
          title="Shape style"
          aria-label="Shape style"
        >
          <Palette className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-56 space-y-3 p-3">
        {showFill && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Fill
              </span>
              <button
                type="button"
                className="text-xs text-muted-foreground hover:text-foreground"
                onClick={() =>
                  onChange({
                    ...style,
                    fill: hasFill ? 'transparent' : '#dbeafe',
                  })
                }
              >
                {hasFill ? 'No fill' : 'Add fill'}
              </button>
            </div>
            {hasFill && (
              <input
                type="color"
                aria-label="Fill color"
                value={asHex(style.fill)}
                onChange={(e) => onChange({ ...style, fill: e.target.value })}
                className="h-7 w-full cursor-pointer rounded border border-border bg-transparent"
              />
            )}
          </div>
        )}

        <div className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">
            Stroke
          </span>
          <input
            type="color"
            aria-label="Stroke color"
            value={asHex(style.stroke)}
            onChange={(e) => onChange({ ...style, stroke: e.target.value })}
            className="h-7 w-full cursor-pointer rounded border border-border bg-transparent"
          />
        </div>

        <div className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">
            Width
          </span>
          <div className="flex items-center gap-1.5">
            {STROKE_WIDTHS.map((w) => (
              <button
                key={w}
                type="button"
                aria-label={`Stroke width ${w}`}
                aria-pressed={style.strokeWidth === w}
                onClick={() => onChange({ ...style, strokeWidth: w })}
                className={`flex h-7 flex-1 items-center justify-center rounded border transition-colors ${
                  style.strokeWidth === w
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:bg-accent'
                }`}
              >
                <span
                  className="rounded-full bg-foreground"
                  style={{ width: 18, height: Math.max(1, w) }}
                />
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
