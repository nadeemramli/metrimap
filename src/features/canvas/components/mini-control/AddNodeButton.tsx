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
import type { MetricCard as MetricCardType } from '@/shared/types';
import { ControlButton } from '@xyflow/react';
import { Plus } from 'lucide-react';

type CardCategory = MetricCardType['category'];

interface AddNodeButtonProps {
  position?: { x: number; y: number };
  asControlButton?: boolean;
  onAddCustomNode?: (
    type: 'sourceNode' | 'chartNode' | 'operatorNode' | 'whiteboardNode',
    position?: { x: number; y: number }
  ) => void;
}

const categoryTemplates: Array<{
  category: CardCategory;
  label: string;
  description: string;
  icon: string;
}> = [
  {
    category: 'Core/Value',
    label: 'Core/Value',
    description: 'Foundational value delivery elements',
    icon: '🎯',
  },
  {
    category: 'Data/Metric',
    label: 'Data/Metric',
    description: 'Quantifiable business measures',
    icon: '📊',
  },
  {
    category: 'Work/Action',
    label: 'Work/Action',
    description: 'Business activities and initiatives',
    icon: '⚡',
  },
  {
    category: 'Ideas/Hypothesis',
    label: 'Ideas/Hypothesis',
    description: 'Assumptions and potential drivers',
    icon: '💡',
  },
  {
    category: 'Metadata',
    label: 'Metadata',
    description: 'Supplementary system information',
    icon: '📋',
  },
];

export default function AddNodeButton({
  position,
  asControlButton = false,
  onAddCustomNode,
}: AddNodeButtonProps) {
  const { createNode } = useCanvasStore();

  const handleAddNode = async (category: CardCategory) => {
    const baseNodeData: Partial<MetricCardType> = {
      title: `New ${category.split('/')[1] || category}`,
      description: `A new ${String(category).toLowerCase()} card`,
      category,
      tags: [],
      causalFactors: [],
      dimensions: [],
      position: position || { x: Math.random() * 400, y: Math.random() * 400 },
      assignees: [],
    };

    const nodeWithData: Partial<MetricCardType> = {
      ...baseNodeData,
      ...(category === 'Data/Metric' && {
        data: [
          {
            period: 'Past 7 days',
            value: Math.floor(Math.random() * 10000) + 1000,
            change_percent: (Math.random() - 0.5) * 20,
            trend: Math.random() > 0.5 ? 'up' : 'down',
          },
          {
            period: 'Past 30 days',
            value: Math.floor(Math.random() * 50000) + 5000,
            change_percent: (Math.random() - 0.5) * 20,
            trend: Math.random() > 0.5 ? 'up' : 'down',
          },
          {
            period: 'Past 90 days',
            value: Math.floor(Math.random() * 200000) + 20000,
            change_percent: (Math.random() - 0.5) * 20,
            trend: Math.random() > 0.5 ? 'up' : 'down',
          },
        ],
      }),
    } as any;

    try {
      await createNode(nodeWithData as any);
    } catch (error) {
      console.error('Failed to create node:', error);
      alert('Failed to create card. Please try again.');
    }
  };

  return (
    <div className="flex gap-2">
      {/* TEMPORARY: Test button to verify node creation */}
      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          console.log(
            '🖱️ AddNodeButton: Test button clicked - creating default node'
          );
          handleAddNode('Data/Metric');
        }}
      >
        Test Add
      </Button>

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
            <Button size="sm" className="gap-2" onClick={() => {}}>
              <Plus className="h-4 w-4" />
              Add Card
            </Button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 z-[9999]" align="start">
          <DropdownMenuLabel>Select Card Type</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {categoryTemplates.map((template) => (
            <DropdownMenuItem
              key={template.category}
              onClick={() => handleAddNode(template.category)}
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
          <DropdownMenuLabel>Custom Nodes</DropdownMenuLabel>
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
