import AutoSaveIndicator from '@/features/canvas/components/header/AutoSaveIndicator';
import CanvasModeToggle from '@/features/canvas/components/header/CanvasModeToggle';
import CanvasTitleEditor from '@/features/canvas/components/header/CanvasTitleEditor';
import {
  LeftDockHost,
  RightDockHost,
} from '@/features/canvas/components/dock';
import {
  useCanvasPanelStore,
  type CollabTab,
} from '@/features/canvas/stores/useCanvasPanelStore';
import { useProjectsStore } from '@/lib/stores';
import { PresenceAvatars } from '@/shared/components/PresenceAvatars';
import { UserMenu } from '@/shared/components/layout/UserMenu';
import { Button } from '@/shared/components/ui/button';
import { useCanvasHeader } from '@/shared/contexts/CanvasHeaderContext';
import { usePresence } from '@/shared/hooks/usePresence';
import { cn } from '@/shared/utils';
import { useUser } from '@clerk/react-router';
import { useMemo } from 'react';
import {
  Activity,
  ArrowLeft,
  BarChart3,
  Database,
  FileText,
  Grid3X3,
  Home,
  Keyboard,
  MessageSquare,
  Settings,
  SquareKanban,
  Users,
} from 'lucide-react';
import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { CollaborationPanel } from './collaboration/CollaborationPanel';

const sidebarItems = [
  {
    icon: Home,
    label: 'Home',
    path: '/',
    isHome: true,
  },
  {
    icon: Grid3X3,
    label: 'Canvas',
    path: '',
    isDefault: true,
  },
  {
    icon: BarChart3,
    label: 'Dashboard',
    path: '/dashboard',
  },
  {
    icon: SquareKanban,
    label: 'Strategy',
    path: '/strategy',
  },
  {
    icon: Database,
    label: 'Assets',
    path: '/assets',
  },
  {
    icon: FileText,
    label: 'Evidence',
    path: '/evidence',
  },
  {
    icon: Settings,
    label: 'Settings',
    path: '/settings',
    isBottom: true,
  },
];

export default function CanvasLayout() {
  const { canvasId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { getProjectById } = useProjectsStore();
  const { headerInfo } = useCanvasHeader();

  // Docked-panel state — one right panel at a time, shared with CanvasPage.
  const rightPanel = useCanvasPanelStore((s) => s.rightPanel);
  const openRight = useCanvasPanelStore((s) => s.openRight);
  const closeRight = useCanvasPanelStore((s) => s.closeRight);
  const resetPanels = useCanvasPanelStore((s) => s.reset);
  const isCollabOpen = rightPanel?.kind === 'collaboration';
  const collabTab: CollabTab = isCollabOpen ? rightPanel.tab : 'comments';
  // Open the collaboration panel directly to one of its sections.
  const openCollab = (tab: CollabTab) =>
    openRight({ kind: 'collaboration', tab });

  // Close any open panels when switching canvases or leaving canvas routes.
  useEffect(() => resetPanels, [canvasId, resetPanels]);

  // Navigating between sub-pages (canvas ↔ dashboard ↔ strategy …) unmounts
  // the page that owns the open panel; clear the stale open-state so it
  // doesn't linger (the hosts already collapse via content tracking).
  // Collaboration is layout-owned — its content survives navigation, keep it.
  useEffect(() => {
    const s = useCanvasPanelStore.getState();
    if (s.rightPanel && s.rightPanel.kind !== 'collaboration') s.closeRight();
    if (s.leftPanel) s.closeLeft();
  }, [location.pathname]);

  const project = canvasId ? getProjectById(canvasId) : null;

  // Live presence — which teammates are in this canvas and on which page.
  const { user } = useUser();
  const pageLabel = useMemo(() => {
    const p = location.pathname;
    if (p.includes('/dashboard')) return 'Dashboard';
    if (p.includes('/strategy')) return 'Strategy';
    if (p.includes('/assets')) return 'Assets';
    if (p.includes('/evidence')) return 'Evidence';
    if (p.includes('/settings')) return 'Settings';
    return 'Canvas';
  }, [location.pathname]);
  const me = useMemo(
    () =>
      user
        ? {
            userId: user.id,
            name: user.fullName || user.firstName || 'Someone',
            avatar: user.imageUrl,
            page: pageLabel,
          }
        : null,
    [user, pageLabel]
  );
  const roster = usePresence(canvasId, me);

  const handleNavigation = (item: (typeof sidebarItems)[0]) => {
    if (item.isHome) {
      navigate('/');
    } else if (item.isDefault) {
      navigate(`/canvas/${canvasId}`);
    } else {
      navigate(`/canvas/${canvasId}${item.path}`);
    }
  };

  const isActiveRoute = (item: (typeof sidebarItems)[0]) => {
    if (item.isHome) return false; // Home is never active in canvas layout

    const currentPath = location.pathname;
    if (item.isDefault) {
      return currentPath === `/canvas/${canvasId}`;
    }
    return currentPath === `/canvas/${canvasId}${item.path}`;
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-12 bg-background border-r border-border flex flex-col">
        {/* Logo/Brand */}
        <div className="h-12 flex items-center justify-center">
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 p-0 rounded-md hover:bg-accent/50"
            onClick={() => navigate('/')}
            title="Back to Home"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>
        </div>

        {/* Navigation Items */}
        <div className="flex flex-col gap-0.5 px-1.5 py-2 flex-1">
          {sidebarItems
            .filter((item) => !item.isBottom && !item.isHome)
            .map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item);

              return (
                <Button
                  key={item.label}
                  variant="ghost"
                  size="sm"
                  data-tour={`rail-${item.label.toLowerCase()}`}
                  className={cn(
                    'w-9 h-9 p-0 rounded-md transition-all duration-150',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'hover:bg-accent/50 text-muted-foreground hover:text-foreground'
                  )}
                  onClick={() => handleNavigation(item)}
                  title={item.label}
                >
                  <Icon className="h-4 w-4" />
                </Button>
              );
            })}
        </div>

        {/* Keyboard Shortcuts */}
        <div className="px-1.5 py-1">
          <Button
            variant="ghost"
            size="sm"
            className="w-9 h-9 p-0 rounded-md transition-all duration-150 hover:bg-accent/50 text-muted-foreground hover:text-foreground"
            onClick={() => {
              // This will be handled by the CanvasPage component
              window.dispatchEvent(new CustomEvent('openKeyboardShortcuts'));
            }}
            title="Keyboard Shortcuts"
          >
            <Keyboard className="h-4 w-4" />
          </Button>
        </div>

        {/* Settings */}
        <div className="px-1.5 py-2">
          {sidebarItems
            .filter((item) => item.isBottom)
            .map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item);

              return (
                <Button
                  key={item.label}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'w-9 h-9 p-0 rounded-md transition-all duration-150',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'hover:bg-accent/50 text-muted-foreground hover:text-foreground'
                  )}
                  onClick={() => handleNavigation(item)}
                >
                  <Icon className="h-4 w-4" />
                </Button>
              );
            })}
        </div>

        {/* Profile — moved out of the top bar to the bottom of the rail, below
            the Settings gear, so the header's right side stays clean. */}
        <div className="flex justify-center px-1.5 pb-2">
          {/* Opens to the right (into the canvas) — the rail hugs the viewport
              edge, so the default left-aligned menu would clip off-screen. */}
          <UserMenu side="right" align="end" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="h-10 bg-background border-b border-border flex items-center justify-between px-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Left header: title/description and collaboration */}

            {/* Title — editable on the canvas itself, static on sub-pages */}
            {headerInfo?.editableTitle ? (
              <CanvasTitleEditor
                title={headerInfo.title}
                canvasId={canvasId}
              />
            ) : (
              <span className="text-sm font-medium text-foreground truncate">
                {headerInfo?.title ?? project?.name ?? 'Canvas'}
              </span>
            )}

            {/* Description */}
            {headerInfo?.description && (
              <>
                <span className="text-muted-foreground text-xs">•</span>
                <span className="text-xs text-muted-foreground truncate max-w-48">
                  {headerInfo.description}
                </span>
              </>
            )}

            {/* Canvas Mode Toggle (canvas page only) */}
            {headerInfo?.canvasMode && (
              <CanvasModeToggle
                mode={headerInfo.canvasMode.mode}
                onChangeMode={headerInfo.canvasMode.onChangeMode}
              />
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Per-page action buttons */}
            {headerInfo?.actions}

            {/* Live presence — who else is in this canvas */}
            <PresenceAvatars roster={roster} />

            {/* Collaboration entry points — People / Comments / Activity, each
                opening the shared panel to its section (share link lives inside). */}
            <div className="inline-flex items-center rounded-md border border-border bg-background p-0.5">
              {(
                [
                  { tab: 'people', Icon: Users, label: 'People' },
                  { tab: 'comments', Icon: MessageSquare, label: 'Comments' },
                  { tab: 'activity', Icon: Activity, label: 'Activity' },
                ] as const
              ).map(({ tab, Icon, label }) => {
                const active = isCollabOpen && collabTab === tab;
                return (
                  <Button
                    key={tab}
                    variant="ghost"
                    size="sm"
                    className={`h-6 w-7 rounded-[5px] p-0 transition-colors ${
                      active
                        ? 'bg-accent text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    onClick={() => openCollab(tab)}
                    title={label}
                    aria-label={label}
                    aria-pressed={active}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </Button>
                );
              })}
            </div>

            {/* Auto-save indicator (canvas page only) */}
            {headerInfo?.autoSaveStatus && <AutoSaveIndicator />}
          </div>
        </div>

        {/* Page Content + dock slots — panels dock below the top bar and the
            page shrinks to make room (never overlapped, Figma-style). */}
        <div className="flex-1 flex overflow-hidden min-h-0">
          <LeftDockHost />
          <div className="flex-1 overflow-auto min-w-0">
            <Outlet />
          </div>
          <RightDockHost />
        </div>
      </div>

      {/* Right-side collaboration panel (docked, non-modal: canvas stays interactive) */}
      <CollaborationPanel
        projectId={canvasId}
        open={isCollabOpen}
        onOpenChange={(open) => {
          if (open) openCollab(collabTab);
          else closeRight();
        }}
        activeTab={collabTab}
        onTabChange={openCollab}
        presence={roster}
        currentPage={pageLabel}
      />
    </div>
  );
}
