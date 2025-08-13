import AdvancedSearchModal from '@/features/canvas/components/search/AdvancedSearchModal';
import QuickSearchCommand, {
  useQuickSearch,
} from '@/features/canvas/components/search/QuickSearchCommand';
import { useAppStore, useProjectsStore } from '@/lib/stores';
import FeedbackButton from '@/shared/components/common/feedback/FeedbackButton';
import { UserMenu } from '@/shared/components/layout/UserMenu';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui/tabs';
import {
  createShortcut,
  useKeyboardShortcuts,
} from '@/shared/hooks/useKeyboardShortcuts';
import { isDevelopmentEnvironment } from '@/shared/lib/supabase/client';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Custom hooks and components
import { useProjectActions } from '@/shared/hooks/useProjectActions';
import { useProjectFiltering } from '@/shared/hooks/useProjectFiltering2';
import { EmptyState } from '../components/EmptyState';
import { ProjectCard } from '../components/ProjectCard';
import { ProjectControls } from '../components/ProjectControls';
import { ProjectTable } from '../components/ProjectTable';

type SortOption = 'name' | 'updated' | 'created' | 'nodes' | 'edges';
type ViewMode = 'grid' | 'list';

export default function HomePage() {
  const navigate = useNavigate();
  const isDevelopment = isDevelopmentEnvironment();
  const { projects, initializeProjects } = useProjectsStore();
  const safeProjects = Array.isArray(projects) ? projects : [];
  const { user } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('updated');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [activeTab, setActiveTab] = useState('all');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  // Custom hooks
  const quickSearch = useQuickSearch();
  const {
    isCreatingCanvas,
    handleCreateCanvas,
    handleOpenCanvas,
    handleDuplicateProject,
    handleDeleteProject,
    toggleStar,
  } = useProjectActions();

  const { filteredAndSortedProjects, recentProjects, starredProjects } =
    useProjectFiltering({
      projects: safeProjects,
      searchQuery,
      selectedTags,
      sortBy,
      sortOrder,
      activeTab,
    });

  // Global keyboard shortcuts
  const shortcuts = useMemo(
    () => [
      createShortcut('k', 'Open quick search', quickSearch.open, {
        meta: true,
      }),
      createShortcut('?', 'Open quick search', quickSearch.open, {}),
      createShortcut(
        'f',
        'Open advanced search',
        () => setShowAdvancedSearch(true),
        { shift: true }
      ),
    ],
    [quickSearch.open]
  );

  useKeyboardShortcuts(shortcuts, { enabled: true });

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
            <h1 className="text-xl font-bold transition-all duration-300 hover:scale-105 cursor-pointer">
              Metrimap
            </h1>
            <div className="flex items-center gap-3">
              {isDevelopment && <FeedbackButton variant="outline" size="sm" />}
              <UserMenu />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-8 max-w-19/20 mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-6">
            <TabsList className="bg-gray-100 rounded-lg p-[3px] shadow-sm">
              <TabsTrigger
                value="all"
                className="h-[calc(100%-1px)] flex-1 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-foreground data-[state=inactive]:text-foreground data-[state=inactive]:bg-transparent transition-all duration-300"
              >
                All Projects
                <span className="inline-flex items-center justify-center rounded-full bg-gray-300 text-secondary-foreground text-xs font-medium w-5 h-5 min-w-5 min-h-5 p-0">
                  {safeProjects.length}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="recent"
                className="h-[calc(100%-1px)] flex-1 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-foreground data-[state=inactive]:text-foreground data-[state=inactive]:bg-transparent transition-all duration-300"
              >
                Recent
                <span className="inline-flex items-center justify-center rounded-full bg-gray-300 text-secondary-foreground text-xs font-medium w-5 h-5 min-w-5 min-h-5 p-0">
                  {recentProjects.length}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="starred"
                className="h-[calc(100%-1px)] flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-foreground data-[state=inactive]:text-foreground data-[state=inactive]:bg-transparent transition-all duration-300"
              >
                Starred
                <span className="inline-flex items-center justify-center rounded-full bg-gray-300 text-secondary-foreground text-xs font-medium w-5 h-5 min-w-5 min-h-5 p-0">
                  {starredProjects.length}
                </span>
              </TabsTrigger>
            </TabsList>
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
            filteredProjectsCount={filteredAndSortedProjects.length}
            totalProjectsCount={safeProjects.length}
          />

          {/* Project Lists */}
          <TabsContent value="all" className="mt-0">
            {filteredAndSortedProjects.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAndSortedProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onOpenCanvas={handleOpenCanvas}
                      onDuplicateProject={handleDuplicateProject}
                      onToggleStar={toggleStar}
                      onDeleteProject={handleDeleteProject}
                    />
                  ))}
                </div>
              ) : (
                <ProjectTable
                  projects={filteredAndSortedProjects}
                  onOpenCanvas={handleOpenCanvas}
                  onDuplicateProject={handleDuplicateProject}
                  onToggleStar={toggleStar}
                  onDeleteProject={handleDeleteProject}
                />
              )
            ) : (
              <EmptyState
                type={safeProjects.length === 0 ? 'no-projects' : 'no-results'}
                onCreateCanvas={handleCreateCanvas}
                isCreatingCanvas={isCreatingCanvas}
              />
            )}
          </TabsContent>

          <TabsContent value="recent" className="mt-0">
            {recentProjects.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recentProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onOpenCanvas={handleOpenCanvas}
                      onDuplicateProject={handleDuplicateProject}
                      onToggleStar={toggleStar}
                      onDeleteProject={handleDeleteProject}
                    />
                  ))}
                </div>
              ) : (
                <ProjectTable
                  projects={recentProjects}
                  onOpenCanvas={handleOpenCanvas}
                  onDuplicateProject={handleDuplicateProject}
                  onToggleStar={toggleStar}
                  onDeleteProject={handleDeleteProject}
                />
              )
            ) : (
              <EmptyState type="no-recent" />
            )}
          </TabsContent>

          <TabsContent value="starred" className="mt-0">
            {starredProjects.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {starredProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onOpenCanvas={handleOpenCanvas}
                      onDuplicateProject={handleDuplicateProject}
                      onToggleStar={toggleStar}
                      onDeleteProject={handleDeleteProject}
                    />
                  ))}
                </div>
              ) : (
                <ProjectTable
                  projects={starredProjects}
                  onOpenCanvas={handleOpenCanvas}
                  onDuplicateProject={handleDuplicateProject}
                  onToggleStar={toggleStar}
                  onDeleteProject={handleDeleteProject}
                />
              )
            ) : (
              <EmptyState type="no-starred" />
            )}
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
            case 'metric':
              // Navigate to canvas containing the metric
              navigate(`/canvas/1`); // TODO: Get actual canvas ID
              break;
            case 'relationship':
              // Navigate to canvas containing the relationship
              navigate(`/canvas/1`); // TODO: Get actual canvas ID
              break;
            case 'evidence':
              navigate('/evidence');
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
