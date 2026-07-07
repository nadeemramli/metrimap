import { AccessTagControls } from '@/features/settings/components/AccessTagControls';
import { AssetsChartsTab } from '@/features/assets/components/AssetsChartsTab';
import { AssetsDataTab } from '@/features/assets/components/AssetsDataTab';
import { AssetsEmptyState } from '@/features/assets/components/emptystate/AssetsEmptyState';
import CardSettingsSheet from '@/features/canvas/components/panels/metric-panel/CardSettingsSheet';
import RelationshipSheet from '@/features/canvas/components/panels/relationship-panel/RelationshipSheet';
import { useCanvasStore, useTagStore } from '@/lib/stores';
import { usePagePanel } from '@/features/canvas/stores/useCanvasPanelStore';
import { useConfirm } from '@/shared/components/ConfirmDialog';
import { usePageHeader } from '@/shared/hooks/usePageHeader';
import { useClerkSupabase } from '@/shared/hooks/useClerkSupabase';
import { promoteCardToTrackedMetric } from '@/shared/lib/supabase/services/trackedMetrics';
import { useSearchParams } from 'react-router-dom';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Checkbox } from '@/shared/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { EnhancedTagInput } from '@/shared/components/ui/enhanced-tag-input';
import { Input } from '@/shared/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import {
  addTagsToMetricCard,
  addTagsToRelationship,
} from '@/shared/lib/supabase/services/tags';
import type { MetricCard, Relationship } from '@/shared/types';
import { formatDate } from '@/shared/utils/formatDate';
import {
  getCategoryColor,
  getRelationshipTypeColor,
} from '@/shared/utils/metricUtils';
import { toast } from 'sonner';
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  CheckSquare,
  Clock,
  Download,
  BookMarked,
  Edit,
  FileText,
  MoreHorizontal,
  MoreVertical,
  Network,
  Plus,
  Search,
  Settings,
  Square,
  Tag,
  Trash2,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

// Custom hooks and components
import { useAssetsData } from '@/shared/hooks/useAssetsData';
import { useAssetsFiltering } from '@/shared/hooks/useAssetsFiltering';

type TabType = 'metrics' | 'relationships' | 'data' | 'charts';
const TAB_TYPES: TabType[] = ['metrics', 'relationships', 'data', 'charts'];
type SortField =
  | 'name'
  | 'category'
  | 'updated'
  | 'connections'
  | 'confidence'
  | 'type';
type SortOrder = 'asc' | 'desc';

export default function AssetsPage() {
  const { persistNodeDelete, persistEdgeDelete } = useCanvasStore();
  const confirm = useConfirm();
  const supabaseClient = useClerkSupabase();

  // Tab synced with ?tab= so /data can redirect straight to the Data hub tab.
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') as TabType | null;
  const activeTab: TabType =
    tabParam && TAB_TYPES.includes(tabParam) ? tabParam : 'metrics';
  const setActiveTab = (tab: TabType) => {
    setSearchParams(tab === 'metrics' ? {} : { tab }, { replace: true });
  };
  const isTableTab = activeTab === 'metrics' || activeTab === 'relationships';
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('updated');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [confidenceFilter, setConfidenceFilter] = useState('all');

  // Custom hooks
  const {
    canvasId,
    project,
    isLoadingProject,
    metrics,
    relationships,
    metricTags,
    relationshipTags,
    isLoadingTags,
    metricCategories,
    relationshipTypes,
    confidenceLevels,
    getNodeById,
    setMetricTags,
    setRelationshipTags,
  } = useAssetsData();

  const { filteredMetrics, filteredRelationships } = useAssetsFiltering({
    metrics,
    relationships,
    searchQuery,
    sortField,
    sortOrder,
    categoryFilter,
    typeFilter,
    confidenceFilter,
  });

  // Detail panels dock into the shared right slot (one open at a time,
  // app-wide) — open state lives in the panel store, payload in the id.
  const pagePanel = usePagePanel();
  const selectedCardId = pagePanel.openId?.startsWith('metric:')
    ? pagePanel.openId.slice('metric:'.length)
    : undefined;
  const isCardSettingsOpen = selectedCardId !== undefined;
  const selectedRelationshipId = pagePanel.openId?.startsWith('rel:')
    ? pagePanel.openId.slice('rel:'.length)
    : undefined;
  const isRelationshipSheetOpen = selectedRelationshipId !== undefined;

  // Tag dialog state
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isAddingTags, setIsAddingTags] = useState(false);

  // Tag management state
  const [isTagManagementOpen, setIsTagManagementOpen] = useState(false);

  // Add Asset state
  const [isAddAssetOpen, setIsAddAssetOpen] = useState(false);
  const [newAssetType, setNewAssetType] = useState<'metric' | 'relationship'>(
    'metric'
  );

  // Drag and drop state
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  // Tag store
  const { loadProjectTags, tags, deleteProjectTag } = useTagStore();

  // Selection state
  const [selectedMetricIds, setSelectedMetricIds] = useState<Set<string>>(
    new Set()
  );
  const [selectedRelationshipIds, setSelectedRelationshipIds] = useState<
    Set<string>
  >(new Set());
  const [visibleColumns, setVisibleColumns] = useState<{
    metrics: Set<string>;
    relationships: Set<string>;
  }>({
    metrics: new Set([
      'title',
      'description',
      'category',
      'value',
      'connections',
      'updated',
      'actions',
    ]),
    relationships: new Set([
      'relationship',
      'notes',
      'type',
      'confidence',
      'evidence',
      'updated',
      'actions',
    ]),
  });

  // Column order state
  const [columnOrder, setColumnOrder] = useState<{
    metrics: string[];
    relationships: string[];
  }>({
    metrics: [
      'title',
      'description',
      'category',
      'value',
      'connections',
      'updated',
      'actions',
    ],
    relationships: [
      'relationship',
      'notes',
      'type',
      'confidence',
      'evidence',
      'updated',
      'actions',
    ],
  });

  // Debug logging (commented out to reduce console noise)
  // console.log('🔍 AssetsPage Debug:', {
  //   canvasId,
  //   hasProject: !!project,
  //   isLoadingProject,
  //   projectNodes: project?.nodes?.length || 0,
  //   projectEdges: project?.edges?.length || 0,
  //   metricsLength: metrics.length,
  //   relationshipsLength: relationships.length,
  // });

  // Load project data from database and auto-load canvas data if needed
  // REMOVED: This was causing a conflict with useAssetsData hook
  // useEffect(() => {
  //   const loadProjectData = async () => {
  //     if (canvasId && !isLoadingProject) {
  //       setIsLoadingProject(true);
  //       try {
  //         // console.log('🔄 Loading project data from database for:', canvasId);
  //         const projectData = await getProjectById(canvasId, supabaseClient);
  //         // console.log('✅ Project data loaded:', {
  //           nodes: projectData?.nodes?.length || 0,
  //           edges: projectData?.edges?.length || 0,
  //         });
  //         setProject(projectData);
  //       } catch (error) {
  //         console.error('❌ Failed to load project data:', error);
  //       } finally {
  //         setIsLoadingProject(false);
  //       }
  //     }
  //   };

  //   loadProjectData();
  // }, [canvasId]);

  // Load project tags
  const loadProjectTagsCallback = useCallback(
    (projectId: string) => {
      loadProjectTags(projectId);
    },
    [loadProjectTags]
  );

  useEffect(() => {
    if (canvasId) {
      loadProjectTagsCallback(canvasId);
    }
  }, [canvasId, loadProjectTagsCallback]);

  // Tags are loaded by useAssetsData hook - no need for duplicate loading logic

  // Sheet handlers
  const handleOpenCardSettings = (cardId: string) =>
    pagePanel.open(`metric:${cardId}`);
  const handleCloseCardSettings = () => pagePanel.close();
  const handleOpenRelationshipSheet = (relationshipId: string) =>
    pagePanel.open(`rel:${relationshipId}`);
  const handleCloseRelationshipSheet = () => pagePanel.close();

  const handleDeleteMetric = async (metricId: string) => {
    const confirmed = await confirm({
      title: 'Delete this metric?',
      description: 'This action cannot be undone.',
      actionLabel: 'Delete',
      destructive: true,
    });
    if (!confirmed) return;
    try {
      await persistNodeDelete(metricId);
    } catch (error) {
      console.error('Failed to delete metric:', error);
      toast.error('Failed to delete metric. Please try again.');
    }
  };

  const handleDeleteRelationship = async (relationshipId: string) => {
    const confirmed = await confirm({
      title: 'Delete this relationship?',
      description: 'This action cannot be undone.',
      actionLabel: 'Delete',
      destructive: true,
    });
    if (!confirmed) return;
    try {
      await persistEdgeDelete(relationshipId);
    } catch (error) {
      console.error('Failed to delete relationship:', error);
      toast.error('Failed to delete relationship. Please try again.');
    }
  };

  // Column definitions with consistent structure
  const metricColumns = [
    { key: 'title', label: 'Metric', sortable: true, width: 'w-1/4' },
    { key: 'category', label: 'Category', sortable: true, width: 'w-1/6' },
    { key: 'value', label: 'Value', sortable: false, width: 'w-1/6' },
    {
      key: 'connections',
      label: 'Connections',
      sortable: true,
      width: 'w-1/8',
    },
    { key: 'updated', label: 'Updated', sortable: true, width: 'w-1/6' },
    {
      key: 'description',
      label: 'Description',
      sortable: false,
      width: 'w-1/4',
    },
    { key: 'owner', label: 'Owner', sortable: true, width: 'w-1/8' },
    { key: 'tags', label: 'Tags', sortable: false, width: 'w-1/6' },
    { key: 'actions', label: 'Actions', sortable: false, width: 'w-1/8' },
  ];

  const relationshipColumns = [
    {
      key: 'relationship',
      label: 'Relationship',
      sortable: true,
      width: 'w-1/3',
    },
    { key: 'type', label: 'Type', sortable: true, width: 'w-1/8' },
    { key: 'confidence', label: 'Confidence', sortable: true, width: 'w-1/8' },
    { key: 'evidence', label: 'Evidence', sortable: true, width: 'w-1/8' },
    { key: 'updated', label: 'Updated', sortable: true, width: 'w-1/6' },
    { key: 'weight', label: 'Weight', sortable: true, width: 'w-1/8' },
    { key: 'notes', label: 'Notes', sortable: false, width: 'w-1/4' },
    { key: 'tags', label: 'Tags', sortable: false, width: 'w-1/6' },
    { key: 'actions', label: 'Actions', sortable: false, width: 'w-1/8' },
  ];

  // Selection handlers
  const handleMetricSelection = (metricId: string, checked: boolean) => {
    const newSelection = new Set(selectedMetricIds);
    if (checked) {
      newSelection.add(metricId);
    } else {
      newSelection.delete(metricId);
    }
    setSelectedMetricIds(newSelection);
  };

  const handleRelationshipSelection = (
    relationshipId: string,
    checked: boolean
  ) => {
    const newSelection = new Set(selectedRelationshipIds);
    if (checked) {
      newSelection.add(relationshipId);
    } else {
      newSelection.delete(relationshipId);
    }
    setSelectedRelationshipIds(newSelection);
  };

  const handleSelectAllMetrics = (checked: boolean) => {
    if (checked) {
      setSelectedMetricIds(
        new Set(filteredMetrics.map((m: MetricCard) => m.id))
      );
    } else {
      setSelectedMetricIds(new Set());
    }
  };

  const handleSelectAllRelationships = (checked: boolean) => {
    if (checked) {
      setSelectedRelationshipIds(
        new Set(filteredRelationships.map((r: Relationship) => r.id))
      );
    } else {
      setSelectedRelationshipIds(new Set());
    }
  };

  // Bulk operations
  const handleBulkDeleteMetrics = async () => {
    if (selectedMetricIds.size === 0) return;

    const confirmed = await confirm({
      title: `Delete ${selectedMetricIds.size} metric${selectedMetricIds.size === 1 ? '' : 's'}?`,
      description: 'This action cannot be undone.',
      actionLabel: 'Delete',
      destructive: true,
    });
    if (!confirmed) return;
    try {
      for (const metricId of selectedMetricIds) {
        await persistNodeDelete(metricId);
      }
      setSelectedMetricIds(new Set());
    } catch (error) {
      console.error('Failed to delete metrics:', error);
      toast.error('Failed to delete some metrics. Please try again.');
    }
  };

  const handleBulkDeleteRelationships = async () => {
    if (selectedRelationshipIds.size === 0) return;

    const confirmed = await confirm({
      title: `Delete ${selectedRelationshipIds.size} relationship${selectedRelationshipIds.size === 1 ? '' : 's'}?`,
      description: 'This action cannot be undone.',
      actionLabel: 'Delete',
      destructive: true,
    });
    if (!confirmed) return;
    try {
      for (const relationshipId of selectedRelationshipIds) {
        await persistEdgeDelete(relationshipId);
      }
      setSelectedRelationshipIds(new Set());
    } catch (error) {
      console.error('Failed to delete relationships:', error);
      toast.error('Failed to delete some relationships. Please try again.');
    }
  };

  const handleBulkAddTags = async (tags: string[]) => {
    const selectedItems =
      activeTab === 'metrics'
        ? Array.from(selectedMetricIds)
        : Array.from(selectedRelationshipIds);

    if (selectedItems.length === 0) return;

    setIsAddingTags(true);
    try {
      // console.log('🏷️ Adding tags to selected items:', tags);

      if (activeTab === 'metrics') {
        // Add tags to selected metrics using database system
        for (const metricId of selectedItems) {
          await addTagsToMetricCard(metricId, tags);
        }
      } else {
        // Add tags to selected relationships using database system
        for (const relationshipId of selectedItems) {
          await addTagsToRelationship(relationshipId, tags);
        }
      }

      // console.log(
      //   '✅ Tags added successfully to',
      //   selectedItems.length,
      //   'items'
      // );
      setSelectedTags([]);
      setIsTagDialogOpen(false);

      // Refresh data and tags
      if (project) {
        // REMOVED: getProjectById is no longer needed here
        // const updatedProject = await getProjectById(project.id, supabaseClient);
        // setProject(updatedProject);

        // Reload tags for the affected items
        const loadUpdatedTags = async () => {
          try {
            if (activeTab === 'metrics') {
              // For metrics, we need to refresh the metric tags
              // Since we can't directly call getMetricCardTags, we'll trigger a refresh
              // by updating the metricTags state with the new tags we just added
              const updatedMetricTags = { ...metricTags };
              for (const metricId of selectedItems) {
                // The tags were already added to the database, so we can update our local state
                // This will trigger a re-render and the useAssetsData hook will handle the rest
                if (updatedMetricTags[metricId]) {
                  // Keep existing tags and add new ones if they're not already there
                  const existingTags = updatedMetricTags[metricId] || [];
                  const newTags = selectedTags.filter(
                    (tag) => !existingTags.includes(tag)
                  );
                  updatedMetricTags[metricId] = [...existingTags, ...newTags];
                }
              }
              setMetricTags(updatedMetricTags);
            } else {
              // For relationships, similar logic
              const updatedRelationshipTags = { ...relationshipTags };
              for (const relationshipId of selectedItems) {
                if (updatedRelationshipTags[relationshipId]) {
                  const existingTags =
                    updatedRelationshipTags[relationshipId] || [];
                  const newTags = selectedTags.filter(
                    (tag) => !existingTags.includes(tag)
                  );
                  updatedRelationshipTags[relationshipId] = [
                    ...existingTags,
                    ...newTags,
                  ];
                }
              }
              setRelationshipTags(updatedRelationshipTags);
            }
          } catch (error) {
            console.error('Failed to reload tags after adding:', error);
          }
        };

        loadUpdatedTags();
      }
    } catch (error) {
      console.error('❌ Error adding tags:', error);
      toast.error('Failed to add tags. Please try again.');
    } finally {
      setIsAddingTags(false);
    }
  };

  const handleOpenTagDialog = () => {
    setIsTagDialogOpen(true);
    setSelectedTags([]); // Clear selected tags from dialog
  };

  const handleCloseTagDialog = () => {
    setIsTagDialogOpen(false);
    setSelectedTags([]); // Clear selected tags from dialog
  };

  const handleOpenTagManagement = () => {
    // console.log('Opening tag management dialog');
    // console.log('Current tags state:', tags);
    // console.log('Canvas ID:', canvasId);

    // Ensure tags are loaded
    if (canvasId) {
      loadProjectTags(canvasId);
    }

    setIsTagManagementOpen(true);
  };

  const handleSubmitTags = () => {
    const tags = selectedTags.map((tag) => tag.trim());

    if (tags.length > 0) {
      handleBulkAddTags(tags);
    }
  };

  // Export functionality
  const handleExport = () => {
    const dataToExport =
      activeTab === 'metrics' ? filteredMetrics : filteredRelationships;

    if (dataToExport.length === 0) {
      toast.error('No data to export');
      return;
    }

    // Create CSV content
    let csvContent = '';

    if (activeTab === 'metrics') {
      // Export metrics
      const headers = [
        'Title',
        'Category',
        'Description',
        'Value',
        'Connections',
        'Updated',
        'Tags',
      ];
      csvContent = headers.join(',') + '\n';

      filteredMetrics.forEach((metric) => {
        const row = [
          `"${metric.title}"`,
          `"${metric.category}"`,
          `"${metric.description || ''}"`,
          `"${metric.data && metric.data.length > 0 ? metric.data[0].value : ''}"`,
          `${relationships.filter((r: Relationship) => r.sourceId === metric.id || r.targetId === metric.id).length}`,
          `"${formatDate(metric.updatedAt)}"`,
          `"${(metric.tags || []).join('; ')}"`,
        ];
        csvContent += row.join(',') + '\n';
      });
    } else {
      // Export relationships
      const headers = [
        'Source',
        'Target',
        'Type',
        'Confidence',
        'Weight',
        'Updated',
      ];
      csvContent = headers.join(',') + '\n';

      filteredRelationships.forEach((rel) => {
        const sourceNode = getNodeById(rel.sourceId);
        const targetNode = getNodeById(rel.targetId);
        const row = [
          `"${sourceNode?.title || 'Unknown'}"`,
          `"${targetNode?.title || 'Unknown'}"`,
          `"${rel.type}"`,
          `"${rel.confidence}"`,
          `${rel.weight || 0}`,
          `"${formatDate(rel.updatedAt)}"`,
        ];
        csvContent += row.join(',') + '\n';
      });
    }

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `${activeTab}_${new Date().toISOString().split('T')[0]}.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Drag and drop handlers
  const handleDragStart = (columnKey: string) => {
    setDraggedColumn(columnKey);
  };

  const handleDragOver = (e: React.DragEvent, columnKey: string) => {
    e.preventDefault();
    setDragOverColumn(columnKey);
  };

  const handleDragEnd = () => {
    if (draggedColumn && dragOverColumn && draggedColumn !== dragOverColumn) {
      const currentTab = activeTab as 'metrics' | 'relationships';
      const currentOrder = [...columnOrder[currentTab]];

      // Remove dragged column from current position
      const draggedIndex = currentOrder.indexOf(draggedColumn);
      currentOrder.splice(draggedIndex, 1);

      // Insert at new position
      const dropIndex = currentOrder.indexOf(dragOverColumn);
      currentOrder.splice(dropIndex, 0, draggedColumn);

      setColumnOrder((prev) => ({
        ...prev,
        [currentTab]: currentOrder,
      }));
    }

    setDraggedColumn(null);
    setDragOverColumn(null);
  };

  // Get ordered visible columns
  const getOrderedVisibleColumns = (type: 'metrics' | 'relationships') => {
    const order = columnOrder[type];
    const visible = visibleColumns[type];
    return order.filter((col) => visible.has(col));
  };

  // Operative action: catalog a card as a workspace Tracked Metric.
  const handlePromoteToTracked = async (metric: MetricCard) => {
    if (!supabaseClient || !canvasId) return;
    if (metric.trackedMetricId) {
      toast.info('Already catalogued as a tracked metric');
      return;
    }
    try {
      await promoteCardToTrackedMetric(
        {
          cardId: metric.id,
          projectId: canvasId,
          name: metric.title,
          formula: metric.formula ?? null,
          source_kind: metric.sourceType ?? null,
        },
        supabaseClient
      );
      toast.success(`"${metric.title}" catalogued as a tracked metric`);
    } catch {
      toast.error('Failed to promote metric');
    }
  };

  const tabs = [
    { id: 'metrics' as const, label: 'Metrics', count: filteredMetrics.length },
    {
      id: 'relationships' as const,
      label: 'Relationships',
      count: filteredRelationships.length,
    },
    { id: 'data' as const, label: 'Data', count: null },
    { id: 'charts' as const, label: 'Charts', count: null },
  ];

  // The shared top bar stays clean and consistent across pages: title +
  // description only. Page actions live in the in-page toolbar row below.
  usePageHeader({
    title: 'Assets',
    description: 'Metrics, relationships, and templates',
  });

  return (
    <div className="p-6 space-y-4">
      {/* Toolbar row: tabs (primary navigation) left, page actions right. */}
      <div className="flex items-center justify-between gap-3">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as TabType)}
        >
          <TabsList className="bg-muted rounded-lg p-[3px] shadow-sm w-fit h-auto">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex-1 h-9 px-3 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-md data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground data-[state=inactive]:bg-transparent transition-all duration-300"
              >
                {tab.count === null ? tab.label : `${tab.label} (${tab.count})`}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-1.5">
          <Button size="sm" onClick={() => setIsAddAssetOpen(true)}>
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Add asset
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                title="More actions"
                aria-label="More actions"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={handleOpenTagManagement}>
                <Tag className="h-3.5 w-3.5 mr-2" />
                Manage tags
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExport}>
                <Download className="h-3.5 w-3.5 mr-2" />
                Export CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Data hub tab (Connections / Tracked Metrics / Events) */}
      {activeTab === 'data' && <AssetsDataTab />}

      {/* Chart nodes tab */}
      {activeTab === 'charts' && canvasId && (
        <AssetsChartsTab canvasId={canvasId} />
      )}

      {isTableTab && (
      <>
      {/* Search and Filter Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {activeTab === 'metrics' && (
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {(metricCategories as string[]).map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {activeTab === 'relationships' && (
            <div className="flex items-center gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {(relationshipTypes as string[]).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={confidenceFilter}
                onValueChange={setConfidenceFilter}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Confidence</SelectItem>
                  {(confidenceLevels as string[]).map((confidence) => (
                    <SelectItem key={confidence} value={confidence}>
                      {confidence}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Select
            value={`${sortField}-${sortOrder}`}
            onValueChange={(value) => {
              const [field, order] = value.split('-');
              setSortField(field as SortField);
              setSortOrder(order as SortOrder);
            }}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updated-desc">Latest First</SelectItem>
              <SelectItem value="updated-asc">Oldest First</SelectItem>
              <SelectItem value="name-asc">Name A-Z</SelectItem>
              <SelectItem value="name-desc">Name Z-A</SelectItem>
              {activeTab === 'metrics' && (
                <SelectItem value="category-asc">Category A-Z</SelectItem>
              )}
              {activeTab === 'relationships' && (
                <>
                  <SelectItem value="type-asc">Type A-Z</SelectItem>
                  <SelectItem value="type-desc">Type Z-A</SelectItem>
                  <SelectItem value="confidence-asc">Confidence A-Z</SelectItem>
                  <SelectItem value="confidence-desc">
                    Confidence Z-A
                  </SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Column Selector - Moved to the right */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Settings className="h-4 w-4" />
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuItem className="font-medium">
              {activeTab === 'metrics'
                ? 'Metric Columns'
                : 'Relationship Columns'}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <div className="p-2 space-y-1">
              {getOrderedVisibleColumns(
                activeTab as 'metrics' | 'relationships'
              ).map((columnKey) => {
                const column = (
                  activeTab === 'metrics' ? metricColumns : relationshipColumns
                ).find((c) => c.key === columnKey);
                if (!column) return null;

                return (
                  <div
                    key={column.key}
                    draggable
                    onDragStart={() => handleDragStart(column.key)}
                    onDragOver={(e) => handleDragOver(e, column.key)}
                    onDragEnd={handleDragEnd}
                    onClick={() => {
                      // Remove column from visible columns
                      const currentColumns =
                        activeTab === 'metrics'
                          ? visibleColumns.metrics
                          : visibleColumns.relationships;
                      const newColumns = new Set(currentColumns);
                      newColumns.delete(column.key);

                      // Remove from column order
                      const currentOrder = [
                        ...columnOrder[
                          activeTab as 'metrics' | 'relationships'
                        ],
                      ];
                      const filteredOrder = currentOrder.filter(
                        (key) => key !== column.key
                      );
                      setColumnOrder((prev) => ({
                        ...prev,
                        [activeTab === 'metrics' ? 'metrics' : 'relationships']:
                          filteredOrder,
                      }));

                      setVisibleColumns((prev) => ({
                        ...prev,
                        [activeTab === 'metrics' ? 'metrics' : 'relationships']:
                          newColumns,
                      }));
                    }}
                    className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-muted ${
                      draggedColumn === column.key ? 'opacity-50' : ''
                    } ${
                      dragOverColumn === column.key
                        ? 'bg-accent border-l-2 border-primary'
                        : ''
                    }`}
                  >
                    <div className="w-4 h-4 flex items-center justify-center">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                    </div>
                    <CheckSquare className="h-4 w-4 text-success" />
                    <span className="text-sm">{column.label}</span>
                  </div>
                );
              })}
              <DropdownMenuSeparator />
              {(activeTab === 'metrics' ? metricColumns : relationshipColumns)
                .filter(
                  (col) =>
                    !visibleColumns[
                      activeTab === 'metrics' ? 'metrics' : 'relationships'
                    ].has(col.key)
                )
                .map((column) => (
                  <div
                    key={column.key}
                    onClick={() => {
                      const currentColumns =
                        activeTab === 'metrics'
                          ? visibleColumns.metrics
                          : visibleColumns.relationships;
                      const newColumns = new Set(currentColumns);
                      newColumns.add(column.key);

                      // Add to column order
                      const currentOrder = [
                        ...columnOrder[
                          activeTab as 'metrics' | 'relationships'
                        ],
                      ];
                      if (!currentOrder.includes(column.key)) {
                        currentOrder.push(column.key);
                        setColumnOrder((prev) => ({
                          ...prev,
                          [activeTab === 'metrics'
                            ? 'metrics'
                            : 'relationships']: currentOrder,
                        }));
                      }

                      setVisibleColumns((prev) => ({
                        ...prev,
                        [activeTab === 'metrics' ? 'metrics' : 'relationships']:
                          newColumns,
                      }));
                    }}
                    className="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-muted"
                  >
                    <div className="w-4 h-4"></div>
                    <Square className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {column.label}
                    </span>
                  </div>
                ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Selection Toolbar */}
      {((activeTab === 'metrics' && selectedMetricIds.size > 0) ||
        (activeTab === 'relationships' &&
          selectedRelationshipIds.size > 0)) && (
        <div className="bg-info/10 border border-info/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-foreground">
                {activeTab === 'metrics'
                  ? `${selectedMetricIds.size} metric${selectedMetricIds.size > 1 ? 's' : ''} selected`
                  : `${selectedRelationshipIds.size} relationship${selectedRelationshipIds.size > 1 ? 's' : ''} selected`}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (activeTab === 'metrics') {
                    setSelectedMetricIds(new Set());
                  } else {
                    setSelectedRelationshipIds(new Set());
                  }
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                Clear Selection
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenTagDialog}
                className="flex items-center gap-1"
              >
                <Tag className="h-4 w-4" />
                Add Tags
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  if (activeTab === 'metrics') {
                    handleBulkDeleteMetrics();
                  } else {
                    handleBulkDeleteRelationships();
                  }
                }}
                className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700"
              >
                <Trash2 className="h-4 w-4" />
                Delete Selected
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      // Open sheet for first selected item
                      const selectedIds =
                        activeTab === 'metrics'
                          ? Array.from(selectedMetricIds)
                          : Array.from(selectedRelationshipIds);
                      if (selectedIds.length > 0) {
                        if (activeTab === 'metrics') {
                          handleOpenCardSettings(selectedIds[0]);
                        } else {
                          handleOpenRelationshipSheet(selectedIds[0]);
                        }
                      }
                    }}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Selected
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="mr-2 h-4 w-4" />
                    Export Selected
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => {
                      if (activeTab === 'metrics') {
                        handleBulkDeleteMetrics();
                      } else {
                        handleBulkDeleteRelationships();
                      }
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete All Selected
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="space-y-4">
        {isLoadingProject && (
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-muted-foreground">Loading project data...</p>
            </div>
          </div>
        )}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-12">
                      <Checkbox
                        checked={
                          activeTab === 'metrics'
                            ? selectedMetricIds.size ===
                                filteredMetrics.length &&
                              filteredMetrics.length > 0
                            : selectedRelationshipIds.size ===
                                filteredRelationships.length &&
                              filteredRelationships.length > 0
                        }
                        onCheckedChange={(checked) =>
                          activeTab === 'metrics'
                            ? handleSelectAllMetrics(checked === true)
                            : handleSelectAllRelationships(checked === true)
                        }
                      />
                    </th>
                    {getOrderedVisibleColumns(
                      activeTab as 'metrics' | 'relationships'
                    ).map((columnKey) => {
                      const columns =
                        activeTab === 'metrics'
                          ? metricColumns
                          : relationshipColumns;
                      const column = columns.find((c) => c.key === columnKey);
                      if (!column) return null;

                      return (
                        <th
                          key={columnKey}
                          className={`px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider border-r border-border ${column.width}`}
                        >
                          {column.label}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {activeTab === 'metrics' ? (
                    filteredMetrics.length > 0 ? (
                      filteredMetrics.map((metric: MetricCard) => (
                        <tr
                          key={metric.id}
                          className="cursor-pointer transition-colors duration-150 hover:bg-accent/50 active:bg-accent/70"
                          onDoubleClick={(e) => {
                            // Don't hijack double-clicks on inline controls.
                            const t = e.target as HTMLElement;
                            if (t.closest('button, a, input, [role="checkbox"], [role="menu"]'))
                              return;
                            handleOpenCardSettings(metric.id);
                          }}
                          title="Double-click to open"
                        >
                          <td className="px-6 py-4 w-12">
                            <Checkbox
                              checked={selectedMetricIds.has(metric.id)}
                              onCheckedChange={(checked) =>
                                handleMetricSelection(metric.id, checked === true)
                              }
                            />
                          </td>
                          {getOrderedVisibleColumns('metrics').map(
                            (columnKey) => {
                              const column = metricColumns.find(
                                (c) => c.key === columnKey
                              );
                              if (!column) return null;

                              return (
                                <td
                                  key={columnKey}
                                  className={`px-6 py-4 ${column.width}`}
                                >
                                  {columnKey === 'title' && (
                                    <div className="font-medium text-foreground">
                                      {metric.title}
                                    </div>
                                  )}
                                  {columnKey === 'category' && (
                                    <Badge
                                      variant="outline"
                                      className={getCategoryColor(
                                        metric.category
                                      )}
                                    >
                                      {metric.category}
                                    </Badge>
                                  )}
                                  {columnKey === 'value' && (
                                    <div className="min-h-[2.5rem] flex flex-col justify-center">
                                      <div className="text-sm font-medium">
                                        {metric.data && metric.data.length > 0
                                          ? `${metric.data[0].value}`
                                          : 'No data'}
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        {metric.data && metric.data.length > 0
                                          ? `Period: ${metric.data[0].period}`
                                          : ''}
                                      </div>
                                    </div>
                                  )}
                                  {columnKey === 'connections' && (
                                    <div className="flex items-center gap-1 min-h-[2.5rem]">
                                      <Network className="h-3 w-3 text-muted-foreground" />
                                      <span className="text-sm">
                                        {
                                          relationships.filter(
                                            (r: Relationship) =>
                                              r.sourceId === metric.id ||
                                              r.targetId === metric.id
                                          ).length
                                        }
                                      </span>
                                    </div>
                                  )}
                                  {columnKey === 'updated' && (
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground min-h-[2.5rem]">
                                      <Calendar className="h-3 w-3" />
                                      {formatDate(metric.updatedAt)}
                                    </div>
                                  )}
                                  {columnKey === 'description' && (
                                    <div className="text-sm text-muted-foreground max-w-xs truncate min-h-[2.5rem] flex items-center">
                                      {metric.description || 'No description'}
                                    </div>
                                  )}
                                  {columnKey === 'owner' && (
                                    <div className="text-sm text-muted-foreground min-h-[2.5rem] flex items-center">
                                      {metric.assignees?.[0] || 'Unassigned'}
                                    </div>
                                  )}
                                  {columnKey === 'tags' && (
                                    <div className="flex flex-wrap gap-1 min-h-[2.5rem] items-center">
                                      {isLoadingTags ? (
                                        <span className="text-xs text-muted-foreground">
                                          Loading...
                                        </span>
                                      ) : (
                                        <>
                                          {metricTags[metric.id]
                                            ?.slice(0, 2)
                                            .map(
                                              (tag: string, index: number) => (
                                                <Badge
                                                  key={index}
                                                  variant="secondary"
                                                  className="text-xs"
                                                >
                                                  {tag}
                                                </Badge>
                                              )
                                            )}
                                          {metricTags[metric.id] &&
                                            metricTags[metric.id].length >
                                              2 && (
                                              <Badge
                                                variant="secondary"
                                                className="text-xs"
                                              >
                                                +
                                                {metricTags[metric.id].length -
                                                  2}
                                              </Badge>
                                            )}
                                        </>
                                      )}
                                    </div>
                                  )}
                                  {columnKey === 'actions' && (
                                    <div className="flex items-center justify-center min-h-[2.5rem]">
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button variant="ghost" size="sm">
                                            <MoreVertical className="h-4 w-4" />
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                          <DropdownMenuItem
                                            onClick={() =>
                                              handleOpenCardSettings(metric.id)
                                            }
                                          >
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit
                                          </DropdownMenuItem>
                                          <DropdownMenuItem
                                            disabled={!!metric.trackedMetricId}
                                            onClick={() =>
                                              void handlePromoteToTracked(
                                                metric
                                              )
                                            }
                                          >
                                            <BookMarked className="mr-2 h-4 w-4" />
                                            {metric.trackedMetricId
                                              ? 'Tracked metric'
                                              : 'Promote to tracked'}
                                          </DropdownMenuItem>
                                          <DropdownMenuSeparator />
                                          <DropdownMenuItem
                                            className="text-destructive"
                                            onClick={() =>
                                              handleDeleteMetric(metric.id)
                                            }
                                          >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </div>
                                  )}
                                </td>
                              );
                            }
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={
                            getOrderedVisibleColumns('metrics').length + 1
                          }
                          className="px-6 py-8 text-center text-muted-foreground"
                        >
                          <AssetsEmptyState
                            type="metrics"
                            onCreateAsset={() => {
                              setNewAssetType('metric');
                              setIsAddAssetOpen(true);
                            }}
                          />
                        </td>
                      </tr>
                    )
                  ) : filteredRelationships.length > 0 ? (
                    filteredRelationships.map((rel: Relationship) => {
                      const sourceNode = getNodeById(rel.sourceId);
                      const targetNode = getNodeById(rel.targetId);
                      return (
                        <tr
                          key={rel.id}
                          className="cursor-pointer transition-colors duration-150 hover:bg-accent/50 active:bg-accent/70"
                          onDoubleClick={(e) => {
                            // Don't hijack double-clicks on inline controls.
                            const t = e.target as HTMLElement;
                            if (t.closest('button, a, input, [role="checkbox"], [role="menu"]'))
                              return;
                            handleOpenRelationshipSheet(rel.id);
                          }}
                          title="Double-click to open"
                        >
                          <td className="px-6 py-4 w-12">
                            <Checkbox
                              checked={selectedRelationshipIds.has(rel.id)}
                              onCheckedChange={(checked) =>
                                handleRelationshipSelection(
                                  rel.id,
                                  checked === true
                                )
                              }
                            />
                          </td>
                          {getOrderedVisibleColumns('relationships').map(
                            (columnKey) => {
                              const column = relationshipColumns.find(
                                (c) => c.key === columnKey
                              );
                              if (!column) return null;

                              return (
                                <td
                                  key={columnKey}
                                  className={`px-6 py-4 ${column.width}`}
                                >
                                  {columnKey === 'relationship' && (
                                    <div className="flex items-center gap-2 min-h-[2.5rem]">
                                      <div className="text-sm font-medium">
                                        {sourceNode?.title || 'Unknown'}
                                      </div>
                                      <div className="text-muted-foreground">
                                        →
                                      </div>
                                      <div className="text-sm font-medium">
                                        {targetNode?.title || 'Unknown'}
                                      </div>
                                    </div>
                                  )}
                                  {columnKey === 'notes' && (
                                    <div className="text-sm text-muted-foreground max-w-xs truncate min-h-[2.5rem] flex items-center">
                                      {rel.notes || 'No notes'}
                                    </div>
                                  )}
                                  {columnKey === 'type' && (
                                    <div className="min-h-[2.5rem] flex items-center">
                                      <Badge
                                        variant="outline"
                                        className={getRelationshipTypeColor(
                                          rel.type
                                        )}
                                      >
                                        {rel.type}
                                      </Badge>
                                    </div>
                                  )}
                                  {columnKey === 'confidence' && (
                                    <div className="flex items-center gap-2 min-h-[2.5rem]">
                                      {rel.confidence === 'High' && (
                                        <CheckCircle className="h-4 w-4 text-success" />
                                      )}
                                      {rel.confidence === 'Medium' && (
                                        <AlertTriangle className="h-4 w-4 text-warning" />
                                      )}
                                      {rel.confidence === 'Low' && (
                                        <Clock className="h-4 w-4 text-destructive" />
                                      )}
                                      <span className="text-sm">
                                        {rel.confidence}
                                      </span>
                                    </div>
                                  )}
                                  {columnKey === 'evidence' && (
                                    <div className="flex items-center gap-1 min-h-[2.5rem]">
                                      <FileText className="h-3 w-3 text-muted-foreground" />
                                      <span className="text-sm">
                                        {rel.evidence.length} items
                                      </span>
                                    </div>
                                  )}
                                  {columnKey === 'updated' && (
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground min-h-[2.5rem]">
                                      <Calendar className="h-3 w-3" />
                                      {formatDate(rel.updatedAt)}
                                    </div>
                                  )}
                                  {columnKey === 'weight' && (
                                    <div className="text-sm font-medium min-h-[2.5rem] flex items-center">
                                      {rel.weight || 0}
                                    </div>
                                  )}
                                  {columnKey === 'tags' && (
                                    <div className="flex flex-wrap gap-1 min-h-[2.5rem] items-center">
                                      {isLoadingTags ? (
                                        <span className="text-xs text-muted-foreground">
                                          Loading...
                                        </span>
                                      ) : (
                                        <>
                                          {relationshipTags[rel.id]
                                            ?.slice(0, 2)
                                            .map(
                                              (tag: string, index: number) => (
                                                <Badge
                                                  key={index}
                                                  variant="secondary"
                                                  className="text-xs"
                                                >
                                                  {tag}
                                                </Badge>
                                              )
                                            )}
                                          {relationshipTags[rel.id] &&
                                            relationshipTags[rel.id].length >
                                              2 && (
                                              <Badge
                                                variant="secondary"
                                                className="text-xs"
                                              >
                                                +
                                                {relationshipTags[rel.id]
                                                  .length - 2}
                                              </Badge>
                                            )}
                                        </>
                                      )}
                                    </div>
                                  )}
                                  {columnKey === 'actions' && (
                                    <div className="flex items-center justify-center min-h-[2.5rem]">
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button variant="ghost" size="sm">
                                            <MoreVertical className="h-4 w-4" />
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                          <DropdownMenuItem
                                            onClick={() =>
                                              handleOpenRelationshipSheet(
                                                rel.id
                                              )
                                            }
                                          >
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit
                                          </DropdownMenuItem>
                                          <DropdownMenuSeparator />
                                          <DropdownMenuItem
                                            className="text-destructive"
                                            onClick={() =>
                                              handleDeleteRelationship(rel.id)
                                            }
                                          >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </div>
                                  )}
                                </td>
                              );
                            }
                          )}
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={
                          getOrderedVisibleColumns('relationships').length + 1
                        }
                        className="px-6 py-8 text-center text-muted-foreground"
                      >
                        <AssetsEmptyState
                          type="relationships"
                          onCreateAsset={() => {
                            setNewAssetType('relationship');
                            setIsAddAssetOpen(true);
                          }}
                        />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
      </>
      )}

      {/* Sheet Components */}
      <CardSettingsSheet
        isOpen={isCardSettingsOpen}
        onClose={handleCloseCardSettings}
        cardId={selectedCardId}
      />

      <RelationshipSheet
        isOpen={isRelationshipSheetOpen}
        onClose={handleCloseRelationshipSheet}
        relationshipId={selectedRelationshipId}
      />

      {/* Tag Dialog */}
      <Dialog
        open={isTagDialogOpen}
        onOpenChange={(open) => !open && handleCloseTagDialog()}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Tags</DialogTitle>
            <DialogDescription>
              Adding to{' '}
              {activeTab === 'metrics'
                ? selectedMetricIds.size
                : selectedRelationshipIds.size}{' '}
              selected {activeTab === 'metrics' ? 'metrics' : 'relationships'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <EnhancedTagInput
              tags={selectedTags}
              onAdd={(tag) =>
                setSelectedTags([...new Set([...selectedTags, tag])])
              }
              onRemove={(tag) =>
                setSelectedTags(selectedTags.filter((t) => t !== tag))
              }
              placeholder="Add tags..."
              className="min-h-[2.5rem]"
            />

            {selectedTags.length > 0 && (
              <div className="text-sm text-muted-foreground">
                Selected tags: {selectedTags.join(', ')}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCloseTagDialog}
              disabled={isAddingTags}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitTags}
              disabled={isAddingTags || selectedTags.length === 0}
            >
              {isAddingTags ? 'Adding...' : 'Add Tags'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tag Management Dialog */}
      <Dialog open={isTagManagementOpen} onOpenChange={setIsTagManagementOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Project Tags</DialogTitle>
            <DialogDescription>
              {tags.length} tag{tags.length === 1 ? '' : 's'} in this project
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            {tags.map((tag: any) => (
              <div
                key={tag.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    {tag.name}
                  </Badge>
                  {tag.description && (
                    <span className="text-sm text-muted-foreground">
                      {tag.description}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <AccessTagControls
                    tagId={tag.id}
                    isAccess={tag.is_access}
                    redactionMode={tag.redaction_mode}
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={async () => {
                      const confirmed = await confirm({
                        title: `Delete tag "${tag.name}"?`,
                        description: 'This action cannot be undone.',
                        actionLabel: 'Delete',
                        destructive: true,
                      });
                      if (!confirmed) return;
                      try {
                        await deleteProjectTag(tag.id);
                      } catch (error) {
                        console.error('Failed to delete tag:', error);
                        toast.error('Failed to delete tag. Please try again.');
                      }
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}

            {tags.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Tag className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No tags created yet</p>
                <p className="text-sm">Create your first tag to get started</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsTagManagementOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Asset Dialog */}
      <Dialog open={isAddAssetOpen} onOpenChange={setIsAddAssetOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Asset</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Asset Type</label>
              <Select
                value={newAssetType}
                onValueChange={(value) =>
                  setNewAssetType(value as 'metric' | 'relationship')
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="metric">Metric</SelectItem>
                  <SelectItem value="relationship">Relationship</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm text-muted-foreground">
              {newAssetType === 'metric' ? (
                <p>
                  Create a new metric card that will appear on the canvas and in
                  the metrics table.
                </p>
              ) : (
                <p>
                  Create a new relationship between existing metrics on the
                  canvas.
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddAssetOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                // TODO: Implement actual asset creation
                console.log('Creating new', newAssetType);
                toast.info(`${newAssetType} creation functionality coming soon!`);
                setIsAddAssetOpen(false);
              }}
            >
              Create {newAssetType === 'metric' ? 'Metric' : 'Relationship'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
