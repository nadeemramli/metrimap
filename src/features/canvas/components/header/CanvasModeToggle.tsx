import { Button } from '@/shared/components/ui/button';
import { Edit3, PenTool } from 'lucide-react';

type CanvasMode = 'edit' | 'draw';

interface CanvasModeToggleProps {
  mode: CanvasMode;
  onChangeMode: (mode: CanvasMode) => void;
  className?: string;
}

export function CanvasModeToggle({ 
  mode, 
  onChangeMode, 
  className = '' 
}: CanvasModeToggleProps) {
  return (
    <div className={`flex bg-gray-100 rounded-lg p-0.5 ${className}`}>
      <Button
        variant={mode === 'edit' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onChangeMode('edit')}
        className={`h-7 px-3 text-xs font-medium rounded-md transition-all duration-200 ${
          mode === 'edit'
            ? 'bg-white shadow-sm text-gray-900 border-0'
            : 'text-gray-600 hover:text-gray-900 bg-transparent border-0 shadow-none'
        }`}
      >
        <Edit3 className="w-3.5 h-3.5 mr-1.5" />
        Edit
      </Button>
      <Button
        variant={mode === 'draw' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onChangeMode('draw')}
        className={`h-7 px-3 text-xs font-medium rounded-md transition-all duration-200 ${
          mode === 'draw'
            ? 'bg-white shadow-sm text-gray-900 border-0'
            : 'text-gray-600 hover:text-gray-900 bg-transparent border-0 shadow-none'
        }`}
      >
        <PenTool className="w-3.5 h-3.5 mr-1.5" />
        Draw
      </Button>
    </div>
  );
}

export default CanvasModeToggle;
