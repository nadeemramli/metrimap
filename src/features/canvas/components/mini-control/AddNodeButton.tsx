import { useNewNodeTypesStore } from '@/features/canvas/stores/useNewNodeTypesStore';
import { useCanvasStore } from '@/lib/stores';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import type {
  ActionNode,
  AnyNode,
  HypothesisNode,
  MetricNode,
  ValueNode,
} from '@/shared/types/nodeTypes';
import { ControlButton } from '@xyflow/react';
import { Plus } from 'lucide-react';

interface AddNodeButtonProps {
  position?: { x: number; y: number };
  asControlButton?: boolean;
  onAddCustomNode?: (
    type: 'sourceNode' | 'chartNode' | 'operatorNode' | 'whiteboardNode',
    position?: { x: number; y: number }
  ) => void;
  onAddNewNodeType?: (
    type: 'valueNode' | 'actionNode' | 'hypothesisNode' | 'metricNode',
    position?: { x: number; y: number }
  ) => void;
}

// New PRD-based node types
const newNodeTypeTemplates: Array<{
  type: 'valueNode' | 'actionNode' | 'hypothesisNode' | 'metricNode';
  label: string;
  description: string;
  icon: string;
}> = [
  {
    type: 'valueNode',
    label: 'Value Node',
    description: 'Core business value chain components',
    icon: '🎯',
  },
  {
    type: 'actionNode',
    label: 'Action Node',
    description: 'Tasks and initiatives (BAU or new)',
    icon: '⚡',
  },
  {
    type: 'hypothesisNode',
    label: 'Hypothesis Node',
    description: 'Brainstorming and idea capture',
    icon: '💡',
  },
  {
    type: 'metricNode',
    label: 'Metric Node',
    description: 'Data-centric metric proxy',
    icon: '📊',
  },
];

export default function AddNodeButton({
  position,
  asControlButton = false,
  onAddCustomNode,
  onAddNewNodeType,
}: AddNodeButtonProps) {
  const { createNewNode } = useNewNodeTypesStore();
  const canvas = useCanvasStore((state) => state.canvas);

  // Handle creating new PRD-based node types
  const handleAddNewNodeType = async (
    nodeType: 'valueNode' | 'actionNode' | 'hypothesisNode' | 'metricNode'
  ) => {
    if (!canvas) {
      console.error('❌ No canvas loaded');
      alert('No canvas loaded. Please try again.');
      return;
    }

    const basePosition = position || {
      x: Math.random() * 400,
      y: Math.random() * 400,
    };

    let nodeData: Partial<AnyNode>;

    switch (nodeType) {
      case 'valueNode':
        nodeData = {
          title: 'New Value Node',
          description: 'A new core business value component',
          valueType: 'Journey Step',
          businessImpact: 'Medium',
          stakeholders: [],
          tags: [],
          position: basePosition,
        } as Partial<ValueNode>;
        break;

      case 'actionNode':
        nodeData = {
          title: 'New Action Node',
          description: 'A new task or initiative',
          actionType: 'Initiative',
          status: 'Planning',
          priority: 'Medium',
          effort: 0,
          tags: [],
          position: basePosition,
        } as Partial<ActionNode>;
        break;

      case 'hypothesisNode':
        nodeData = {
          title: 'New Hypothesis Node',
          description: 'A new idea or assumption',
          hypothesisType: 'Factor',
          confidence: 'Medium',
          testable: false,
          assumptions: [],
          successCriteria: [],
          tags: [],
          position: basePosition,
        } as Partial<HypothesisNode>;
        break;

      case 'metricNode':
        nodeData = {
          title: 'New Metric Node',
          description: 'A new data-centric metric',
          metricType: 'Output Metric',
          unit: '',
          currentValue: 0,
          targetValue: 0,
          dimensions: [],
          segments: [],
          tags: [],
          position: basePosition,
        } as Partial<MetricNode>;
        break;

      default:
        console.error('Unknown node type:', nodeType);
        return;
    }

    try {
      if (onAddNewNodeType) {
        onAddNewNodeType(nodeType, basePosition);
      } else {
        // Create the new node using the store
        console.log('🎯 Creating new node type:', nodeType, nodeData);
        await createNewNode(nodeType, nodeData, canvas.id);
        console.log('✅ Successfully created new node type:', nodeType);
      }
    } catch (error) {
      console.error('Failed to create new node type:', error);
      alert('Failed to create node. Please try again.');
    }
  };

  return (
    <div className="flex gap-2">
      <DropdownMenu
        onOpenChange={(open) =>
          console.log('Dropdown:', open ? 'opened' : 'closed')
        }
        modal={false}
      >
        <DropdownMenuTrigger asChild>
          {asControlButton ? (
            <ControlButton title="Add Node" onClick={() => {}}>
              <Plus className="h-4 w-4" />
            </ControlButton>
          ) : (
            <Button size="sm" variant="ghost" className="gap-2 rounded-lg">
              <Plus className="h-4 w-4" />
              Add Card
            </Button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 z-[9999]" align="start">
          <DropdownMenuLabel>Core Node Types</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Core node types */}
          {newNodeTypeTemplates.map((template) => (
            <DropdownMenuItem
              key={template.type}
              onClick={() => handleAddNewNodeType(template.type)}
              className="flex items-start gap-3 p-3"
            >
              <span className="text-lg mt-0.5">{template.icon}</span>
              <div className="flex-1">
                <div className="font-medium text-sm">{template.label}</div>
                <div className="text-xs text-muted-foreground leading-relaxed">
                  {template.description}
                </div>
              </div>
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator />
          <DropdownMenuLabel>Utility Nodes</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => onAddCustomNode?.('sourceNode', position)}
            className="flex items-start gap-3 p-3"
          >
            <span className="text-lg mt-0.5">🗄️</span>
            <div className="flex-1">
              <div className="font-medium text-sm">Source Node</div>
              <div className="text-xs text-muted-foreground leading-relaxed">
                Connect or generate data
              </div>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onAddCustomNode?.('chartNode', position)}
            className="flex items-start gap-3 p-3"
          >
            <span className="text-lg mt-0.5">📈</span>
            <div className="flex-1">
              <div className="font-medium text-sm">Visualization Node</div>
              <div className="text-xs text-muted-foreground leading-relaxed">
                Drag fields and configure axes
              </div>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onAddCustomNode?.('operatorNode', position)}
            className="flex items-start gap-3 p-3"
          >
            <span className="text-lg mt-0.5">⚙️</span>
            <div className="flex-1">
              <div className="font-medium text-sm">Operative Node</div>
              <div className="text-xs text-muted-foreground leading-relaxed">
                Apply formula/toggle/date logic
              </div>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
