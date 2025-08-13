import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import {
  MapPin,
  MessageSquarePlus,
  MousePointer,
  Pencil,
  Search,
} from 'lucide-react';
import AddNodeButton from './AddNodeButton';
import FilterControls from './FilterControls';
import LayoutDropdownButton from './LayoutDropdownButton';

type CanvasMode = 'edit' | 'draw';

interface TopCanvasToolbarProps {
  mode: CanvasMode;
  onChangeMode: (mode: CanvasMode) => void;

  navigationTool: string;
  onChangeNavigationTool: (tool: string) => void;

  keepToolActive: boolean;
  onToggleKeepToolActive: (value: boolean) => void;

  drawActiveTool: string;
  onSetDrawTool: (tool: string) => void;

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
    onChangeMode,
    keepToolActive,
    onToggleKeepToolActive,
    drawActiveTool,
    onSetDrawTool,
  } = props;

  const drawTools: string[] = [
    'selection',
    'freedraw',
    'rectangle',
    'ellipse',
    'arrow',
    'line',
    'text',
  ];

  return (
    <div className="pointer-events-auto flex items-center gap-3 rounded-2xl bg-white/95 backdrop-blur-sm border border-gray-200 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_-1px_0_rgba(0,0,0,0.04)_inset,0_10px_24px_-12px_rgba(0,0,0,0.25)] px-3 py-2">
      {/* Mode Toggle */}
      <div className="flex bg-gray-100 rounded-xl p-1 mr-1">
        <Button
          variant={mode === 'edit' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onChangeMode('edit')}
          className={`rounded-lg transition-all duration-200 ${
            mode === 'edit'
              ? 'bg-white shadow-sm text-gray-900'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Pencil className="w-4 h-4 mr-2" />
          Edit
        </Button>
        <Button
          variant={mode === 'draw' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onChangeMode('draw')}
          className={`rounded-lg transition-all duration-200 ${
            mode === 'draw'
              ? 'bg-white shadow-sm text-gray-900'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Pencil className="w-4 h-4 mr-2" />
          Draw
        </Button>
      </div>

      {/* Pointer tool */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="rounded-lg"
          title="Select (V)"
        >
          <MousePointer className="w-4 h-4" />
        </Button>
      </div>

      {/* Drawing tools (visible in draw mode) */}
      {mode === 'draw' && (
        <div className="flex items-center gap-1">
          <Badge variant="outline">Tools</Badge>
          {drawTools.map((tool) => (
            <Button
              key={tool}
              variant={drawActiveTool === tool ? 'default' : 'secondary'}
              size="sm"
              onClick={() => onSetDrawTool(tool)}
              className="rounded-lg"
            >
              {tool.charAt(0).toUpperCase() + tool.slice(1)}
            </Button>
          ))}
          <div className="flex items-center gap-2 pl-2">
            <Checkbox
              id="keepToolActive"
              checked={keepToolActive}
              onCheckedChange={(v) => onToggleKeepToolActive(Boolean(v))}
            />
            <label
              htmlFor="keepToolActive"
              className="text-xs text-muted-foreground"
            >
              Lock tool
            </label>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1">
        <AddNodeButton onAddCustomNode={props.onAddCustomNode} />
        {/* Add Evidence Node */}
        <Button
          variant="ghost"
          size="sm"
          title="Add evidence"
          className="rounded-lg"
          onClick={props.onAddEvidence}
        >
          <MapPin className="h-4 w-4" />
        </Button>
        {/* Add Comment Node */}
        <Button
          variant="ghost"
          size="sm"
          title="Add comment"
          className="rounded-lg"
          onClick={() => props.onAddCustomNode?.('commentNode')}
        >
          <MessageSquarePlus className="h-4 w-4" />
        </Button>
        {/* Layout dropdown */}
        <LayoutDropdownButton />
        <FilterControls />
        <Button
          variant="ghost"
          size="sm"
          onClick={props.onOpenSearch}
          title="Search"
          className="rounded-lg"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
