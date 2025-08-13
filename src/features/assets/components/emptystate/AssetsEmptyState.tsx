import { Button } from '@/shared/components/ui/button';
import { BarChart3, Network, Plus } from 'lucide-react';

interface AssetsEmptyStateProps {
  type: 'metrics' | 'relationships';
  onCreateAsset?: () => void;
}

export function AssetsEmptyState({
  type,
  onCreateAsset,
}: AssetsEmptyStateProps) {
  const content = {
    metrics: {
      icon: <BarChart3 className="h-8 w-8 text-muted-foreground/50" />,
      title: 'No metrics found',
      description: 'Create metrics on the canvas to see them here',
    },
    relationships: {
      icon: <Network className="h-8 w-8 text-muted-foreground/50" />,
      title: 'No relationships found',
      description: 'Create relationships on the canvas to see them here',
    },
  } as const;

  const { icon, title, description } = content[type];

  return (
    <div className="flex flex-col items-center gap-2">
      {icon}
      <p>{title}</p>
      <p className="text-sm text-muted-foreground">{description}</p>
      {onCreateAsset && (
        <Button onClick={onCreateAsset} className="mt-2">
          <Plus className="h-4 w-4 mr-2" />
          Create {type === 'metrics' ? 'Metric' : 'Relationship'}
        </Button>
      )}
    </div>
  );
}

export default AssetsEmptyState;
