import { Button } from '@/components/ui/button';
import { Clock, Network, Plus, Star } from 'lucide-react';

interface EmptyStateProps {
  type: 'no-projects' | 'no-results' | 'no-recent' | 'no-starred';
  onCreateCanvas?: () => void;
  isCreatingCanvas?: boolean;
}

export function EmptyState({
  type,
  onCreateCanvas,
  isCreatingCanvas = false,
}: EmptyStateProps) {
  const getEmptyStateContent = () => {
    switch (type) {
      case 'no-projects':
        return {
          icon: <Network className="h-8 w-8 text-muted-foreground" />,
          title: 'No projects yet',
          description:
            'Create your first canvas to start mapping your business architecture',
          showButton: true,
        };
      case 'no-results':
        return {
          icon: <Network className="h-8 w-8 text-muted-foreground" />,
          title: 'No projects match your criteria',
          description: 'Try adjusting your search terms or filters',
          showButton: false,
        };
      case 'no-recent':
        return {
          icon: (
            <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          ),
          title: 'No recent projects',
          description:
            "Projects you've worked on in the last 7 days will appear here",
          showButton: false,
        };
      case 'no-starred':
        return {
          icon: (
            <Star className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          ),
          title: 'No starred projects',
          description: 'Star your favorite projects to find them quickly',
          showButton: false,
        };
      default:
        return {
          icon: <Network className="h-8 w-8 text-muted-foreground" />,
          title: 'No projects',
          description: '',
          showButton: false,
        };
    }
  };

  const { icon, title, description, showButton } = getEmptyStateContent();

  return (
    <div className="text-center py-12">
      <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      {showButton && onCreateCanvas && (
        <Button
          onClick={onCreateCanvas}
          className="gap-2"
          disabled={isCreatingCanvas}
        >
          <Plus className="h-4 w-4" />
          {isCreatingCanvas ? 'Creating...' : 'Create Your First Canvas'}
        </Button>
      )}
    </div>
  );
}
