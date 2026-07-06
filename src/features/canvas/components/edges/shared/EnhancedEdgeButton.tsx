import React from 'react';
import { EdgeLabelRenderer } from '@xyflow/react';
import { cn } from '@/shared/utils';
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
  Link2,
  GitBranch,
} from 'lucide-react';
import {
  getRelationshipEdgeStyle,
  getRelationshipTypeMeta,
  getRelationshipWeightLabel,
} from '@/features/canvas/constants/relationshipTypeMeta';

// Tone → pill classes, matching the drawn line's semantics (CVS-165): a
// relationship's centre chip reads the same colour as its edge, so a negative or
// weak link never looks like a healthy green one.
const TONE_PILL: Record<
  string,
  { bg: string; border: string; text: string }
> = {
  positive: {
    bg: 'bg-green-50',
    border: 'border-green-300',
    text: 'text-green-700',
  },
  negative: { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-700' },
  weak: {
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    text: 'text-amber-700',
  },
  neutral: {
    bg: 'bg-gray-50',
    border: 'border-gray-300',
    text: 'text-gray-600',
  },
  structural: {
    bg: 'bg-slate-50',
    border: 'border-slate-300',
    text: 'text-slate-600',
  },
};

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
  /** Force the warning look (red + dashed) — e.g. a refuted causal link. */
  warn?: boolean;
  
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
    case 'relationshipEdge': {
      const meta = getRelationshipTypeMeta(relationshipType);
      return {
        icon: meta.icon,
        color: meta.textColor,
        bgColor: meta.bgColor,
        borderColor: meta.borderColor,
        hoverBg: meta.hoverBg,
        label: getRelationshipWeightLabel(relationshipType, weight),
        description: `${meta.label} relationship`,
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
  edgeType,
  relationshipType,
  weight,
  selected = false,
  isHovered = false,
  warn = false,
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

  // Relationship edges: tint the chip by the edge's tone (direction/strength) so
  // it matches the line. Other edge types keep their own config colours.
  const relStyle =
    edgeType === 'relationshipEdge'
      ? getRelationshipEdgeStyle(relationshipType, weight)
      : null;
  const effectiveTone = warn ? 'negative' : (relStyle?.tone ?? 'neutral');
  const pill = relStyle
    ? TONE_PILL[effectiveTone] ?? TONE_PILL.neutral
    : { bg: config.bgColor, border: config.borderColor, text: config.color };
  const loose = warn || (relStyle?.loose ?? false);

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
          {/* Centre chip — compact tone-aware score pill (CVS-165). */}
          <button
            type="button"
            onClick={handleMainButtonClick}
            title={`${config.description} — click to open settings`}
            data-testid="edge-score-pill"
            data-tone={effectiveTone}
            data-loose={loose ? 'true' : 'false'}
            className={cn(
              'flex items-center gap-1 rounded-full border bg-clip-padding px-2 py-0.5',
              'shadow-sm backdrop-blur-sm transition-all duration-200',
              pill.bg,
              pill.border,
              pill.text,
              loose ? 'border-dashed opacity-90' : '',
              selected ? 'ring-2 ring-blue-500 ring-offset-1' : '',
              isHovered ? 'scale-110 shadow-md' : 'hover:scale-110'
            )}
          >
            <Icon className="h-3 w-3 shrink-0" />
            <span className="font-mono text-[10px] font-semibold leading-none">
              {label}
            </span>
          </button>

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
