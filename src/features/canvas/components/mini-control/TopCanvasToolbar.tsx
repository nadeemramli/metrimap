import { Button } from '@/shared/components/ui/button';
import {
  ArrowRight,
  Circle,
  Diamond,
  Eraser,
  Hand,
  Image,
  Lasso,
  MapPin,
  MessageSquarePlus,
  Minus,
  MousePointer,
  PenTool,
  Search,
  Square,
  Type,
} from 'lucide-react';
import AddNodeButton from './AddNodeButton';
import FilterControls from './FilterControls';
import LayoutDropdownButton from './LayoutDropdownButton';

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
  onOpenSearch?: () => void;
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
}

export default function TopCanvasToolbar(props: TopCanvasToolbarProps) {
  const {
    mode,
    keepToolActive,
    onToggleKeepToolActive,
    drawActiveTool,
    onSetDrawTool,
    whiteboardTool,
    onSetWhiteboardTool,
  } = props;

  console.log('🎯 TopCanvasToolbar render:', { mode, whiteboardTool });

  // React Flow whiteboard tools (for draw mode)
  const whiteboardTools: { id: string; title: string; Icon: any }[] = [
    { id: 'select', title: 'Select (V)', Icon: MousePointer },
    { id: 'hand', title: 'Hand Tool (H)', Icon: Hand },
    { id: 'eraser', title: 'Eraser (E)', Icon: Eraser },
    { id: 'lasso', title: 'Lasso Selection (L)', Icon: Lasso },
    { id: 'rectangle', title: 'Rectangle (R)', Icon: Square },
    { id: 'freehand', title: 'Freehand Draw (P)', Icon: PenTool },
  ];

  // Legacy draw tools (for backward compatibility)
  const drawTools: { id: string; title: string; Icon: any }[] = [
    { id: 'selection', title: 'Selection (V)', Icon: MousePointer },
    { id: 'rectangle', title: 'Rectangle (R)', Icon: Square },
    { id: 'ellipse', title: 'Ellipse (O)', Icon: Circle },
    { id: 'diamond', title: 'Diamond (D)', Icon: Diamond },
    { id: 'arrow', title: 'Arrow (A)', Icon: ArrowRight },
    { id: 'line', title: 'Line (L)', Icon: Minus },
    { id: 'freedraw', title: 'Draw (P)', Icon: PenTool },
    { id: 'text', title: 'Text (T)', Icon: Type },
    { id: 'image', title: 'Image', Icon: Image },
  ];

  const getToolButtonClasses = (active: boolean) =>
    `rounded-lg h-8 w-8 p-0 transition-colors ${
      active
        ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-200 hover:bg-blue-200'
        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
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
    <div className="pointer-events-auto flex items-center gap-3 rounded-2xl bg-white/95 backdrop-blur-sm border border-gray-200 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_-1px_0_rgba(0,0,0,0.04)_inset,0_10px_24px_-12px_rgba(0,0,0,0.25)] px-3 py-2">
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
                className={getToolButtonClasses(isActive)}
                title={tool.title}
                onClick={() => {
                  console.log('🎯 Tool clicked:', tool.id);
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
              <AddNodeButton onAddCustomNode={props.onAddCustomNode} />
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
          {/* Layout dropdown */}
          <LayoutDropdownButton />
          <FilterControls />
        </div>
      )}

      {/* Search - Available in both modes */}
      <div className="flex items-center gap-1">
        <WithTooltip label="Search" hotkey="/">
          <Button
            variant="ghost"
            size="sm"
            onClick={props.onOpenSearch}
            title="Search"
            className="rounded-lg"
          >
            <Search className="h-4 w-4" />
          </Button>
        </WithTooltip>
      </div>
    </div>
  );
}
