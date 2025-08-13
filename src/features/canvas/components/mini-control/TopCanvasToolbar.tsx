import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { LayoutGrid, MapPin, MousePointer, Pencil, Search } from 'lucide-react';
import AddNodeButton from './AddNodeButton';
import FilterControls from './FilterControls';

type CanvasMode = 'edit' | 'draw';
type NavigationTool = 'hand' | 'move' | 'scale' | string;
type DrawTool =
  | 'selection'
  | 'freedraw'
  | 'rectangle'
  | 'ellipse'
  | 'arrow'
  | 'line'
  | 'text'
  | string;

interface TopCanvasToolbarProps {
  mode: CanvasMode;
  onChangeMode: (mode: CanvasMode) => void;

  navigationTool: NavigationTool;
  onChangeNavigationTool: (tool: NavigationTool) => void;

  keepToolActive: boolean;
  onToggleKeepToolActive: (value: boolean) => void;

  drawActiveTool: DrawTool;
  onSetDrawTool: (tool: DrawTool) => void;

  onOpenFilters: () => void;
  onOpenSearch?: () => void;
  onAddEvidence: () => void;
  onApplyLayout: () => void;
  currentLayoutDirection?: string;
  onAddCustomNode?: (type: 'commentNode') => void;
}

export default function TopCanvasToolbar(props: TopCanvasToolbarProps) {
  const {
    mode,
    onChangeMode,
    navigationTool,
    onChangeNavigationTool,
    keepToolActive,
    onToggleKeepToolActive,
    drawActiveTool,
    onSetDrawTool,
    onOpenFilters,
    onAddEvidence,
    onApplyLayout,
    currentLayoutDirection,
  } = props;

  const drawTools: DrawTool[] = [
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

      {/* Pointer tool (lightweight cue, matches legacy look) */}
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
        <AddNodeButton />
        {/* Comment pin */}
        <Button
          variant="outline"
          size="sm"
          title="Add comment pin"
          onClick={() => props.onAddCustomNode?.('commentNode')}
        >
          <MapPin className="h-4 w-4" />
        </Button>
        {/* Layout popover trigger (icon) */}
        <Button
          variant="ghost"
          size="sm"
          className="rounded-lg"
          title="Layout"
          onClick={() => window.dispatchEvent(new Event('openUnifiedLayout'))}
        >
          <LayoutGrid className="w-4 h-4" />
        </Button>
        {/* Filters */}
        <FilterControls />
        {/* Search */}
        <Button
          variant="outline"
          size="sm"
          onClick={props.onOpenSearch}
          title="Search"
        >
          <Search className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={onAddEvidence}>
          Add Evidence
        </Button>
        <Button variant="outline" size="sm" onClick={onApplyLayout}>
          Apply Layout{' '}
          {currentLayoutDirection ? `(${currentLayoutDirection})` : ''}
        </Button>
      </div>
    </div>
  );
}
