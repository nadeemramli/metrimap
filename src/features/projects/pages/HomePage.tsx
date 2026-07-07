import AdvancedSearchModal from '@/features/canvas/components/search/AdvancedSearchModal';
import QuickSearchCommand, {
  useQuickSearch,
} from '@/features/canvas/components/search/QuickSearchCommand';
import { useAppStore, useProjectsStore } from '@/lib/stores';
import { useOrganization } from '@clerk/react-router';
import { useClerkSupabase } from '@/shared/hooks/useClerkSupabase';
import { useProjectsRealtime } from '../hooks/useProjectsRealtime';
import { TemplatePicker } from '../components/TemplatePicker';
import { toast } from 'sonner';
import {
  createShortcut,
  useKeyboardShortcuts,
} from '@/shared/hooks/useKeyboardShortcuts';
import { LayoutTemplate, Loader2, Plus, Sparkles, Workflow } from 'lucide-react';
import { ProductSystemFlowExplorer } from '@/features/product-system';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui/tabs';

// Custom hooks and components
import { useProjectActions } from '@/shared/hooks/useProjectActions';
import {
  useProjectFiltering,
  type ViewFilter,
} from '@/shared/hooks/useProjectFiltering2';
import { EmptyState } from '../components/EmptyState';
import { ProjectCard } from '../components/ProjectCard';
import { ShowcaseSection } from '../components/ShowcaseSection';
import { HomeControlBar } from '../components/HomeControlBar';
import { ProjectTable } from '../components/ProjectTable';

type SortOption = 'name' | 'updated' | 'created' | 'nodes' | 'edges';
type ViewMode = 'grid' | 'list';

export default function HomePage() {
  const navigate = useNavigate();

  // Explore / Operate home modes (CVS-156). The rail deep-links here via ?view;
  // Operate (the user's own canvases) is the default, Explore holds examples.
  const [searchParams, setSearchParams] = useSearchParams();
  const view = searchParams.get('view') === 'explore' ? 'explore' : 'operate';
  const setView = (v: string) => {
    const next = new URLSearchParams(searchParams);
    if (v === 'operate') next.delete('view');
    else next.set('view', v);
    setSearchParams(next, { replace: true });
  };

  const {
    projects,
    initializeProjects,
    spaces,
    createSpace,
    updateSpace,
    deleteSpace,
    moveProjectToSpace,
    saveAsTemplate,
  } = useProjectsStore();
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

  const [templatePickerOpen, setTemplatePickerOpen] = useState(false);
  const handleSaveAsTemplate = async (projectId: string) => {
    try {
      await saveAsTemplate(projectId);
      toast.success('Saved as template — find it under “From template”.');
    } catch {
      toast.error('Failed to save template');
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

  // (Re)load the workspace's projects on mount AND whenever the active org
  // changes — switching workspace must reload its canvases. force=true bypasses
  // the isInitialized guard so an in-session org switch always refetches.
  const { organization } = useOrganization();
  const activeOrgId = organization?.id ?? null;
  useEffect(() => {
    if (user) {
      console.log('Loading projects for workspace:', activeOrgId ?? 'personal');
      initializeProjects(true);
    }
  }, [initializeProjects, user, activeOrgId]);

  // Real-time: a teammate's create/rename/delete in this workspace refetches.
  const realtimeClient = useClerkSupabase();
  useProjectsRealtime({
    client: realtimeClient,
    activeOrgId,
    onChange: () => initializeProjects(true),
  });

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
    <div className="bg-background">
      {/* Main Content */}
      <div className="px-8 py-8 max-w-19/20 mx-auto">
        <Tabs value={view} onValueChange={setView} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="operate">Operate</TabsTrigger>
            <TabsTrigger value="explore">Explore</TabsTrigger>
          </TabsList>

          {/* Operate — the user's own canvases (their durable work). */}
          <TabsContent value="operate" className="mt-0">
            {/* One consolidated control bar: space · filter · search · sort · view · New */}
            <HomeControlBar
              spaces={spaces}
              spaceFilter={spaceFilter}
              onSpaceFilter={setSpaceFilter}
              onSpaceCreate={createSpace}
              onSpaceUpdate={updateSpace}
              onSpaceDelete={deleteSpace}
              viewFilter={viewFilter}
              onViewFilter={setViewFilter}
              counts={counts}
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
              onNewFromTemplate={() => setTemplatePickerOpen(true)}
            />

            {/* Single project list (driven by the control bar) */}
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
                        onSaveAsTemplate={handleSaveAsTemplate}
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
                    onSaveAsTemplate={handleSaveAsTemplate}
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
          </TabsContent>

          {/* Explore — start something new + learn the pattern from examples. */}
          <TabsContent value="explore" className="mt-0 space-y-8">
            <section>
              <div className="mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-semibold">Start a new tree</h2>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:max-w-2xl">
                <button
                  onClick={() => handleCreateCanvas()}
                  disabled={isCreatingCanvas}
                  className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-60"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    {isCreatingCanvas ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Plus className="h-5 w-5" />
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">
                      Blank canvas
                    </span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                      Start from an empty tree and build it your way.
                    </span>
                  </span>
                </button>

                <button
                  onClick={() => setTemplatePickerOpen(true)}
                  className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <LayoutTemplate className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">
                      From a template
                    </span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                      Adapt a pre-built structure to your business.
                    </span>
                  </span>
                </button>
              </div>
            </section>

            <ShowcaseSection onOpenCanvas={handleOpenCanvas} />

            {/* How Canvasm works — the product-system operating loops
                (CVS-301). Same registry the public site consumes. */}
            <section>
              <div className="mb-3 flex items-center gap-2">
                <Workflow className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-semibold">
                  How Canvasm works — operating loops
                </h2>
              </div>
              <p className="mb-4 max-w-2xl text-xs text-muted-foreground">
                Metrimap is an orchestrator for measurable strategy: it maps
                what the team believes, connects work to metrics, records what
                was learned, and controls who sees what. These are the loops
                the product is built around.
              </p>
              <ProductSystemFlowExplorer />
            </section>
          </TabsContent>
        </Tabs>
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
      <TemplatePicker
        open={templatePickerOpen}
        onOpenChange={setTemplatePickerOpen}
      />
    </div>
  );
}
