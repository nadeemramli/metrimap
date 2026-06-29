import AdvancedSearchModal from '@/features/canvas/components/search/AdvancedSearchModal';
import QuickSearchCommand, {
  useQuickSearch,
} from '@/features/canvas/components/search/QuickSearchCommand';
import { useAppStore, useProjectsStore } from '@/lib/stores';
import FeedbackButton from '@/shared/components/common/feedback/FeedbackButton';
import { OrganizationSwitcher } from '@clerk/react-router';
import { Database, Folder } from 'lucide-react';
import { UserMenu } from '@/shared/components/layout/UserMenu';
import { cn } from '@/shared/utils';
import {
  createShortcut,
  useKeyboardShortcuts,
} from '@/shared/hooks/useKeyboardShortcuts';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Custom hooks and components
import { useProjectActions } from '@/shared/hooks/useProjectActions';
import {
  useProjectFiltering,
  type ViewFilter,
} from '@/shared/hooks/useProjectFiltering2';
import { EmptyState } from '../components/EmptyState';
import { ProjectCard } from '../components/ProjectCard';
import { ShowcaseSection } from '../components/ShowcaseSection';
import { ProjectControls } from '../components/ProjectControls';
import { ProjectTable } from '../components/ProjectTable';

type SortOption = 'name' | 'updated' | 'created' | 'nodes' | 'edges';
type ViewMode = 'grid' | 'list';

export default function HomePage() {
  const navigate = useNavigate();
  const isDevelopment = import.meta.env.DEV;
  const { projects, initializeProjects, spaces, createSpace, moveProjectToSpace } =
    useProjectsStore();
  const safeProjects = Array.isArray(projects) ? projects : [];
  const { user } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('updated');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [viewFilter, setViewFilter] = useState<ViewFilter>('all');
  const [spaceFilter, setSpaceFilter] = useState<string>('all');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  const handleNewSpace = async () => {
    const name = window.prompt('New Space name')?.trim();
    if (name) {
      try {
        await createSpace(name);
      } catch {
        /* surfaced via store error */
      }
    }
  };

  // Custom hooks
  const quickSearch = useQuickSearch();
  const {
    isCreatingCanvas,
    handleCreateCanvas,
    handleOpenCanvas,
    handleDuplicateProject,
    handleDeleteProject,
    handleProjectSettings,
    toggleStar,
    archiveProject,
    restoreProject,
  } = useProjectActions();

  const { filteredProjects, counts } = useProjectFiltering({
    projects: safeProjects,
    searchQuery,
    selectedTags,
    sortBy,
    sortOrder,
    viewFilter,
    spaceFilter,
  });

  // Global keyboard shortcuts
  const shortcuts = useMemo(
    () => [
      // Quick search (Cmd+K / ?) is intentionally disabled — the palette is a
      // placeholder pending rebuild. Advanced Search (Shift+F) is fully wired.
      createShortcut(
        'f',
        'Open advanced search',
        () => setShowAdvancedSearch(true),
        { shift: true }
      ),
    ],
    []
  );

  useKeyboardShortcuts(shortcuts);

  // Initialize projects store on component mount, but only when user is available
  useEffect(() => {
    if (user) {
      console.log('User available, initializing projects');
      initializeProjects();
    }
  }, [initializeProjects, user]);

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    safeProjects.forEach((project) => {
      project.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).filter((tag) => tag !== 'starred');
  }, [safeProjects]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10 w-full">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold transition-all duration-300 hover:scale-105 cursor-pointer">
                Metrimap
              </h1>
              {/* Workspace switcher (Clerk org = workspace). Personal account +
                  auto-created org both appear here. */}
              <OrganizationSwitcher
                hidePersonal={false}
                afterCreateOrganizationUrl="/"
                afterSelectOrganizationUrl="/"
                afterLeaveOrganizationUrl="/"
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/catalog')}
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <Database className="h-4 w-4" />
                Metric Catalog
              </button>
              {isDevelopment && <FeedbackButton variant="outline" size="sm" />}
              <UserMenu />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-8 max-w-19/20 mx-auto">
        {/* Read-only examples showcase (can't be deleted from the UI) */}
        <ShowcaseSection onOpenCanvas={handleOpenCanvas} />

        {/* Spaces / Folders — filter canvases by Space (null = Uncategorized) */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {(
            [
              { id: 'all', label: 'All Canvases' },
              { id: 'uncategorized', label: 'Uncategorized' },
              ...spaces.map((s) => ({ id: s.id, label: s.name })),
            ] as { id: string; label: string }[]
          ).map((s) => (
            <button
              key={s.id}
              onClick={() => setSpaceFilter(s.id)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-md border px-3 py-1 text-sm transition-colors',
                spaceFilter === s.id
                  ? 'bg-secondary text-secondary-foreground border-secondary'
                  : 'bg-transparent text-muted-foreground border-border hover:bg-muted'
              )}
            >
              <Folder className="h-3.5 w-3.5" />
              {s.label}
            </button>
          ))}
          <button
            onClick={handleNewSpace}
            className="inline-flex items-center gap-1 rounded-md border border-dashed border-border px-3 py-1 text-sm text-muted-foreground hover:bg-muted transition-colors"
          >
            + New Space
          </button>
        </div>

        {/* View filter chips — Recent & Starred are filters over one list, not tabs */}
        <div className="flex items-center gap-2 mb-4">
          {(
            [
              { key: 'all', label: 'All' },
              { key: 'recent', label: 'Recent' },
              { key: 'starred', label: 'Starred' },
              // Archived chip only appears once something is archived.
              ...(counts.archived > 0 || viewFilter === 'archived'
                ? [{ key: 'archived' as const, label: 'Archived' }]
                : []),
            ] as { key: ViewFilter; label: string }[]
          ).map((chip) => (
            <button
              key={chip.key}
              onClick={() => setViewFilter(chip.key)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition-colors',
                viewFilter === chip.key
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-transparent text-muted-foreground border-border hover:bg-muted'
              )}
            >
              {chip.label}
              <span className="text-xs opacity-80">{counts[chip.key]}</span>
            </button>
          ))}
        </div>

        {/* Controls */}
        <ProjectControls
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          selectedTags={selectedTags}
          allTags={allTags}
          onToggleTag={toggleTag}
          onClearTags={() => setSelectedTags([])}
          isCreatingCanvas={isCreatingCanvas}
          onCreateCanvas={handleCreateCanvas}
          filteredProjectsCount={filteredProjects.length}
          totalProjectsCount={safeProjects.length}
        />

        {/* Single project list (driven by chips + controls) */}
        <div className="mt-0">
          {filteredProjects.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onOpenCanvas={handleOpenCanvas}
                    onDuplicateProject={handleDuplicateProject}
                    onToggleStar={toggleStar}
                    onDeleteProject={handleDeleteProject}
                    onProjectSettings={handleProjectSettings}
                    onArchive={archiveProject}
                    onRestore={restoreProject}
                    spaces={spaces}
                    onMoveToSpace={moveProjectToSpace}
                  />
                ))}
              </div>
            ) : (
              <ProjectTable
                projects={filteredProjects}
                onOpenCanvas={handleOpenCanvas}
                onDuplicateProject={handleDuplicateProject}
                onToggleStar={toggleStar}
                onDeleteProject={handleDeleteProject}
                onProjectSettings={handleProjectSettings}
                onArchive={archiveProject}
                onRestore={restoreProject}
                spaces={spaces}
                onMoveToSpace={moveProjectToSpace}
              />
            )
          ) : (
            <EmptyState
              type={
                safeProjects.length === 0
                  ? 'no-projects'
                  : viewFilter === 'starred'
                    ? 'no-starred'
                    : viewFilter === 'recent'
                      ? 'no-recent'
                      : 'no-results'
              }
              onCreateCanvas={handleCreateCanvas}
              isCreatingCanvas={isCreatingCanvas}
            />
          )}
        </div>
      </div>

      {/* Quick Search */}
      <QuickSearchCommand
        isOpen={quickSearch.isOpen}
        onClose={quickSearch.close}
        onResultSelect={(result) => {
          // Handle search result selection
          switch (result.type) {
            case 'metric': {
              // Navigate to the canvas that owns the metric
              const canvasId = (result.data as any)?.canvasId;
              if (canvasId) {
                navigate(`/canvas/${canvasId}`, {
                  state: { focusNode: result.id },
                });
              }
              break;
            }
            case 'relationship': {
              // Navigate to the canvas that owns the relationship
              const canvasId = (result.data as any)?.canvasId;
              if (canvasId) {
                navigate(`/canvas/${canvasId}`, {
                  state: { openRelationship: result.id },
                });
              }
              break;
            }
            case 'evidence':
              navigate('/evidence', { state: { focusEvidence: result.id } });
              break;
          }
        }}
      />

      {/* Advanced Search */}
      <AdvancedSearchModal
        isOpen={showAdvancedSearch}
        onClose={() => setShowAdvancedSearch(false)}
        onResultSelect={(result) => {
          switch (result.type) {
            case 'metric':
              navigate(`/canvas/${(result.data as any).canvasId || ''}`, {
                state: { focusNode: result.id },
              });
              break;
            case 'relationship':
              navigate(`/canvas/${(result.data as any).canvasId || ''}`, {
                state: { openRelationship: result.id },
              });
              break;
            case 'evidence':
              navigate('/evidence', { state: { focusEvidence: result.id } });
              break;
          }
          setShowAdvancedSearch(false);
        }}
      />
    </div>
  );
}
