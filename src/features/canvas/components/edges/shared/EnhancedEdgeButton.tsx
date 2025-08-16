import React from 'react';
import { EdgeLabelRenderer } from '@xyflow/react';
import { Button } from '@/shared/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import {
  Settings,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Copy,
  Share,
  Tag,
  ArrowRight,
  TrendingUp,
  Zap,
  Link2,
  GitBranch,
} from 'lucide-react';
import { Separator } from '@/shared/components/ui/separator';

interface EnhancedEdgeButtonProps {
  // Position
  labelX: number;
  labelY: number;
  
  // Edge data
  edgeId: string;
  edgeType: 'relationshipEdge' | 'dataFlowEdge' | 'referenceEdge';
  relationshipType?: string;
  weight?: number;
  confidence?: number;
  
  // Visual state
  selected?: boolean;
  isHovered?: boolean;
  
  // Actions
  onOpenSettings?: () => void;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onCopy?: () => void;
  onShare?: () => void;
  onAddTag?: () => void;
  
  // Customization
  showToolbar?: boolean;
  customLabel?: string;
  customIcon?: React.ComponentType<{ className?: string }>;
}

// Get configuration for different edge types
function getEdgeConfig(edgeType: string, relationshipType?: string, weight?: number) {
  switch (edgeType) {
    case 'relationshipEdge':
      switch (relationshipType) {
        case 'Deterministic':
          return {
            icon: ArrowRight,
            color: 'text-gray-700',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-300',
            hoverBg: 'hover:bg-blue-100',
            label: weight ? `${weight}` : '1.0',
            description: 'Deterministic relationship',
          };
        case 'Probabilistic':
          return {
            icon: TrendingUp,
            color: 'text-orange-700',
            bgColor: 'bg-orange-50',
            borderColor: 'border-orange-300',
            hoverBg: 'hover:bg-orange-100',
            label: weight ? `${weight}` : '0.0',
            description: 'Probabilistic relationship',
          };
        case 'Causal':
          return {
            icon: Zap,
            color: 'text-purple-700',
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-300',
            hoverBg: 'hover:bg-purple-100',
            label: weight ? `${weight}` : '0.0',
            description: 'Causal relationship',
          };
        default:
          return {
            icon: Link2,
            color: 'text-gray-700',
            bgColor: 'bg-gray-50',
            borderColor: 'border-gray-300',
            hoverBg: 'hover:bg-gray-100',
            label: 'REL',
            description: 'Relationship',
          };
      }
    case 'dataFlowEdge':
      return {
        icon: GitBranch,
        color: 'text-green-700',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-300',
        hoverBg: 'hover:bg-green-100',
        label: 'DATA',
        description: 'Data flow',
      };
    case 'referenceEdge':
      return {
        icon: Link2,
        color: 'text-blue-700',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-300',
        hoverBg: 'hover:bg-blue-100',
        label: 'REF',
        description: 'Reference link',
      };
    default:
      return {
        icon: Link2,
        color: 'text-gray-700',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-300',
        hoverBg: 'hover:bg-gray-100',
        label: '?',
        description: 'Unknown edge type',
      };
  }
}

export default function EnhancedEdgeButton({
  labelX,
  labelY,
  edgeId,
  edgeType,
  relationshipType,
  weight,
  confidence,
  selected = false,
  isHovered = false,
  onOpenSettings,
  onView,
  onEdit,
  onDelete,
  onCopy,
  onShare,
  onAddTag,
  showToolbar = true,
  customLabel,
  customIcon,
}: EnhancedEdgeButtonProps) {
  const [showActions, setShowActions] = React.useState(false);
  
  const config = getEdgeConfig(edgeType, relationshipType, weight);
  const Icon = customIcon || config.icon;
  const label = customLabel || config.label;

  // Actions for the toolbar
  const actions = [
    {
      icon: Settings,
      label: 'Edge Settings',
      onClick: onOpenSettings,
      show: !!onOpenSettings,
      className: 'hover:bg-purple-50 hover:text-purple-600',
    },
    {
      icon: Eye,
      label: 'View Details',
      onClick: onView,
      show: !!onView,
      className: 'hover:bg-blue-50 hover:text-blue-600',
    },
    {
      icon: Edit,
      label: 'Edit',
      onClick: onEdit,
      show: !!onEdit,
      className: 'hover:bg-green-50 hover:text-green-600',
    },
    {
      icon: Copy,
      label: 'Duplicate',
      onClick: onCopy,
      show: !!onCopy,
      className: 'hover:bg-gray-50 hover:text-gray-600',
    },
    {
      icon: Share,
      label: 'Share',
      onClick: onShare,
      show: !!onShare,
      className: 'hover:bg-blue-50 hover:text-blue-600',
    },
    {
      icon: Tag,
      label: 'Add Tag',
      onClick: onAddTag,
      show: !!onAddTag,
      className: 'hover:bg-yellow-50 hover:text-yellow-600',
    },
    {
      icon: Trash2,
      label: 'Delete',
      onClick: onDelete,
      show: !!onDelete,
      className: 'hover:bg-red-50 hover:text-red-600',
    },
  ].filter(action => action.show);

  const handleMainButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onOpenSettings) {
      onOpenSettings();
    } else if (onEdit) {
      onEdit();
    } else if (onView) {
      onView();
    }
  };

  return (
    <EdgeLabelRenderer>
      <div
        style={{
          position: 'absolute',
          transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
          pointerEvents: 'all',
          zIndex: 10,
        }}
        className="nodrag nopan"
      >
        <div className="flex items-center gap-1">
          {/* Main Edge Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleMainButtonClick}
            className={`
              h-10 w-10 p-0 rounded-full shadow-lg transition-all duration-200 border-2
              ${config.bgColor} ${config.borderColor} ${config.color} ${config.hoverBg}
              ${selected ? 'ring-2 ring-blue-500 ring-offset-1' : ''}
              ${isHovered ? 'scale-110' : 'hover:scale-110'}
              hover:shadow-xl
            `}
            title={`${config.description} - Click to open settings`}
          >
            <div className="flex flex-col items-center justify-center">
              <Icon className="h-3 w-3 mb-0.5" />
              <span className="text-[8px] font-mono font-bold leading-none">
                {label}
              </span>
            </div>
          </Button>

          {/* Toolbar Actions */}
          {showToolbar && (selected || isHovered) && actions.length > 0 && (
            <div className="flex items-center gap-1 ml-2">
              {actions.length <= 3 ? (
                // Show actions directly if 3 or fewer
                actions.map((action, index) => {
                  const ActionIcon = action.icon;
                  return (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        action.onClick?.();
                      }}
                      className={`
                        h-8 w-8 p-0 bg-white/95 backdrop-blur-sm border
                        hover:scale-110 transition-all duration-200
                        ${action.className}
                      `}
                      title={action.label}
                    >
                      <ActionIcon className="h-3 w-3" />
                    </Button>
                  );
                })
              ) : (
                // Show dropdown for more than 3 actions
                <Popover open={showActions} onOpenChange={setShowActions}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 bg-white/95 backdrop-blur-sm border hover:scale-110 transition-all duration-200"
                      title="More Actions"
                    >
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-1" align="center">
                    <div className="space-y-1">
                      {actions.map((action, index) => {
                        const ActionIcon = action.icon;
                        return (
                          <Button
                            key={index}
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              action.onClick?.();
                              setShowActions(false);
                            }}
                            className="w-full justify-start text-xs"
                          >
                            <ActionIcon className="mr-2 h-3 w-3" />
                            {action.label}
                          </Button>
                        );
                      })}
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          )}
        </div>
      </div>
    </EdgeLabelRenderer>
  );
}

// Helper hook for common edge actions
export function useEdgeActions(edgeId: string, edgeType: string) {
  const handleOpenSettings = React.useCallback(() => {
    console.log(`⚙️ Open settings for ${edgeType} edge:`, edgeId);
    // This will be connected to the RelationshipSheet
  }, [edgeId, edgeType]);

  const handleView = React.useCallback(() => {
    console.log(`👁️ View ${edgeType} edge:`, edgeId);
    // Implement view logic
  }, [edgeId, edgeType]);

  const handleEdit = React.useCallback(() => {
    console.log(`✏️ Edit ${edgeType} edge:`, edgeId);
    // Implement edit logic
  }, [edgeId, edgeType]);

  const handleDelete = React.useCallback(() => {
    console.log(`🗑️ Delete ${edgeType} edge:`, edgeId);
    // Implement delete logic with confirmation
  }, [edgeId, edgeType]);

  const handleCopy = React.useCallback(() => {
    console.log(`📋 Copy ${edgeType} edge:`, edgeId);
    // Implement copy logic
  }, [edgeId, edgeType]);

  const handleShare = React.useCallback(() => {
    console.log(`🔗 Share ${edgeType} edge:`, edgeId);
    // Implement share logic
  }, [edgeId, edgeType]);

  const handleAddTag = React.useCallback(() => {
    console.log(`🏷️ Add tag to ${edgeType} edge:`, edgeId);
    // Implement tag logic
  }, [edgeId, edgeType]);

  return {
    handleOpenSettings,
    handleView,
    handleEdit,
    handleDelete,
    handleCopy,
    handleShare,
    handleAddTag,
  };
}
