import AssetsFilters from '@/components/assets/AssetsFilters';
import AssetsHeader from '@/components/assets/AssetsHeader';
import AssetsStatsCards from '@/components/assets/AssetsStatsCards';
import AssetsTabNavigation from '@/components/assets/AssetsTabNavigation';
import MetricsTable from '@/components/assets/MetricsTable';
import RelationshipsTable from '@/components/assets/RelationshipsTable';
import SelectionToolbar from '@/components/assets/SelectionToolbar';
import CardSettingsSheet from '@/components/canvas/right-sidepanel/metric-panel/CardSettingsSheet';
import RelationshipSheet from '@/components/canvas/right-sidepanel/relationship-panel/RelationshipSheet';
import { useAuthenticatedSupabase } from '@/lib/contexts/AuthenticatedSupabaseContext';
import { useCanvasStore, useTagStore } from '@/lib/stores';
import {
  addTagsToMetricCard,
  addTagsToRelationship,
} from '@/lib/supabase/services/tags';
import { useCallback, useEffect, useState } from 'react';

// Custom hooks and components
import { useAssetsData } from '@/hooks/useAssetsData';
import { useAssetsFiltering } from '@/hooks/useAssetsFiltering';

type TabType = 'metrics' | 'relationships';
type SortField =
  | 'name'
  | 'category'
  | 'updated'
  | 'connections'
  | 'confidence'
  | 'type';
type SortOrder = 'asc' | 'desc';

export default function AssetsPageRefactored() {
  const supabaseClient = useAuthenticatedSupabase();
  const { persistNodeDelete, persistEdgeDelete } = useCanvasStore();

  const [activeTab, setActiveTab] = useState<TabType>('metrics');
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
    setProject,
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

  // Sheet state
  const [isCardSettingsOpen, setIsCardSettingsOpen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | undefined>();
  const [isRelationshipSheetOpen, setIsRelationshipSheetOpen] = useState(false);
  const [selectedRelationshipId, setSelectedRelationshipId] = useState<
    string | undefined
  >();

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

  // Tag store
  const { loadProjectTags, tags, deleteProjectTag } = useTagStore();

  // Selection state
  const [selectedMetricIds, setSelectedMetricIds] = useState<Set<string>>(
    new Set()
  );
  const [selectedRelationshipIds, setSelectedRelationshipIds] = useState<
    Set<string>
  >(new Set());

  // Column visibility state
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

  // Tab configuration
  const tabs = [
    {
      id: 'metrics' as TabType,
      label: 'Metrics',
      count: filteredMetrics.length,
    },
    {
      id: 'relationships' as TabType,
      label: 'Relationships',
      count: filteredRelationships.length,
    },
  ];

  // Event handlers
  const handleOpenCardSettings = (cardId: string) => {
    setSelectedCardId(cardId);
    setIsCardSettingsOpen(true);
  };

  const handleCloseCardSettings = () => {
    setIsCardSettingsOpen(false);
    setSelectedCardId(undefined);
  };

  const handleOpenRelationshipSheet = (relationshipId: string) => {
    setSelectedRelationshipId(relationshipId);
    setIsRelationshipSheetOpen(true);
  };

  const handleCloseRelationshipSheet = () => {
    setIsRelationshipSheetOpen(false);
    setSelectedRelationshipId(undefined);
  };

  const handleDeleteMetric = async (metricId: string) => {
    if (confirm('Are you sure you want to delete this metric?')) {
      try {
        await persistNodeDelete(metricId);
      } catch (error) {
        console.error('Failed to delete metric:', error);
        alert('Failed to delete metric. Please try again.');
      }
    }
  };

  const handleDeleteRelationship = async (relationshipId: string) => {
    if (confirm('Are you sure you want to delete this relationship?')) {
      try {
        await persistEdgeDelete(relationshipId);
      } catch (error) {
        console.error('Failed to delete relationship:', error);
        alert('Failed to delete relationship. Please try again.');
      }
    }
  };

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
      setSelectedMetricIds(new Set(filteredMetrics.map((m) => m.id)));
    } else {
      setSelectedMetricIds(new Set());
    }
  };

  const handleSelectAllRelationships = (checked: boolean) => {
    if (checked) {
      setSelectedRelationshipIds(
        new Set(filteredRelationships.map((r) => r.id))
      );
    } else {
      setSelectedRelationshipIds(new Set());
    }
  };

  // Sort handler
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field as SortField);
      setSortOrder('asc');
    }
  };

  const handleSortChange = (field: SortField, order: SortOrder) => {
    setSortField(field);
    setSortOrder(order);
  };

  // Column management
  const handleColumnVisibilityChange = (
    columnKey: string,
    visible: boolean
  ) => {
    const currentColumns =
      activeTab === 'metrics'
        ? visibleColumns.metrics
        : visibleColumns.relationships;
    const newColumns = new Set(currentColumns);

    if (visible) {
      newColumns.add(columnKey);
      // Also add to column order if not present
      const currentOrder = columnOrder[activeTab];
      if (!currentOrder.includes(columnKey)) {
        setColumnOrder((prev) => ({
          ...prev,
          [activeTab]: [...currentOrder, columnKey],
        }));
      }
    } else {
      newColumns.delete(columnKey);
    }

    setVisibleColumns((prev) => ({
      ...prev,
      [activeTab]: newColumns,
    }));
  };

  const handleColumnOrderChange = (columnKey: string, newIndex: number) => {
    const currentOrder = [...columnOrder[activeTab]];
    const currentIndex = currentOrder.indexOf(columnKey);

    if (currentIndex !== -1) {
      currentOrder.splice(currentIndex, 1);
      currentOrder.splice(newIndex, 0, columnKey);

      setColumnOrder((prev) => ({
        ...prev,
        [activeTab]: currentOrder,
      }));
    }
  };

  const getOrderedVisibleColumns = () => {
    const currentColumns =
      activeTab === 'metrics'
        ? visibleColumns.metrics
        : visibleColumns.relationships;
    return columnOrder[activeTab].filter((col) => currentColumns.has(col));
  };

  // Tag handlers
  const handleAddTagsToMetric = async (metricId: string, tags: string[]) => {
    try {
      if (supabaseClient && canvasId) {
        await addTagsToMetricCard(metricId, tags, supabaseClient);
        setMetricTags((prev) => ({ ...prev, [metricId]: tags }));
      }
    } catch (error) {
      console.error('Failed to add tags to metric:', error);
    }
  };

  const handleAddTagsToRelationship = async (
    relationshipId: string,
    tags: string[]
  ) => {
    try {
      if (supabaseClient && canvasId) {
        await addTagsToRelationship(relationshipId, tags, supabaseClient);
        setRelationshipTags((prev) => ({ ...prev, [relationshipId]: tags }));
      }
    } catch (error) {
      console.error('Failed to add tags to relationship:', error);
    }
  };

  // Bulk operations
  const handleBulkDeleteMetrics = async () => {
    if (
      confirm(
        `Are you sure you want to delete ${selectedMetricIds.size} metrics?`
      )
    ) {
      try {
        for (const metricId of selectedMetricIds) {
          await persistNodeDelete(metricId);
        }
        setSelectedMetricIds(new Set());
      } catch (error) {
        console.error('Failed to delete metrics:', error);
        alert('Failed to delete some metrics. Please try again.');
      }
    }
  };

  const handleBulkDeleteRelationships = async () => {
    if (
      confirm(
        `Are you sure you want to delete ${selectedRelationshipIds.size} relationships?`
      )
    ) {
      try {
        for (const relationshipId of selectedRelationshipIds) {
          await persistEdgeDelete(relationshipId);
        }
        setSelectedRelationshipIds(new Set());
      } catch (error) {
        console.error('Failed to delete relationships:', error);
        alert('Failed to delete some relationships. Please try again.');
      }
    }
  };

  // Toolbar handlers
  const handleClearSelection = () => {
    if (activeTab === 'metrics') {
      setSelectedMetricIds(new Set());
    } else {
      setSelectedRelationshipIds(new Set());
    }
  };

  const handleOpenTagDialog = () => {
    setIsTagDialogOpen(true);
  };

  const handleBulkDelete = () => {
    if (activeTab === 'metrics') {
      handleBulkDeleteMetrics();
    } else {
      handleBulkDeleteRelationships();
    }
  };

  const handleEditSelected = () => {
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
  };

  // Header handlers
  const handleOpenTagManagement = () => {
    setIsTagManagementOpen(true);
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export functionality not yet implemented');
  };

  const handleAddAsset = () => {
    setIsAddAssetOpen(true);
  };

  if (isLoadingProject) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading project data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <AssetsHeader
        onOpenTagManagement={handleOpenTagManagement}
        onExport={handleExport}
        onAddAsset={handleAddAsset}
      />

      <AssetsStatsCards
        metrics={metrics}
        relationships={relationships}
        metricCategories={metricCategories}
      />

      <AssetsTabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={tabs}
      />

      <AssetsFilters
        activeTab={activeTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
        confidenceFilter={confidenceFilter}
        onConfidenceChange={setConfidenceFilter}
        sortField={sortField}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        metricCategories={metricCategories}
        relationshipTypes={relationshipTypes}
        confidenceLevels={confidenceLevels}
        visibleColumns={
          activeTab === 'metrics'
            ? visibleColumns.metrics
            : visibleColumns.relationships
        }
        columnOrder={columnOrder[activeTab]}
        onColumnVisibilityChange={handleColumnVisibilityChange}
        onColumnOrderChange={handleColumnOrderChange}
        getOrderedVisibleColumns={getOrderedVisibleColumns}
      />

      <SelectionToolbar
        activeTab={activeTab}
        selectedMetricIds={selectedMetricIds}
        selectedRelationshipIds={selectedRelationshipIds}
        onClearSelection={handleClearSelection}
        onOpenTagDialog={handleOpenTagDialog}
        onBulkDelete={handleBulkDelete}
        onEditSelected={handleEditSelected}
      />

      <div className="space-y-4">
        {activeTab === 'metrics' ? (
          <MetricsTable
            metrics={filteredMetrics}
            visibleColumns={visibleColumns.metrics}
            columnOrder={columnOrder.metrics}
            selectedMetricIds={selectedMetricIds}
            metricTags={metricTags}
            isLoadingTags={isLoadingTags}
            onMetricSelection={handleMetricSelection}
            onOpenCardSettings={handleOpenCardSettings}
            onDeleteMetric={handleDeleteMetric}
            onSelectAllMetrics={handleSelectAllMetrics}
            onSort={handleSort}
            onAddTagsToMetric={handleAddTagsToMetric}
          />
        ) : (
          <RelationshipsTable
            relationships={filteredRelationships}
            visibleColumns={visibleColumns.relationships}
            columnOrder={columnOrder.relationships}
            selectedRelationshipIds={selectedRelationshipIds}
            relationshipTags={relationshipTags}
            isLoadingTags={isLoadingTags}
            getNodeById={getNodeById}
            onRelationshipSelection={handleRelationshipSelection}
            onOpenRelationshipSheet={handleOpenRelationshipSheet}
            onDeleteRelationship={handleDeleteRelationship}
            onSelectAllRelationships={handleSelectAllRelationships}
            onSort={handleSort}
            onAddTagsToRelationship={handleAddTagsToRelationship}
          />
        )}
      </div>

      {/* Sheets */}
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
    </div>
  );
}
