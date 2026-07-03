import AutoSaveIndicator from '@/features/canvas/components/header/AutoSaveIndicator';
import CanvasModeToggle from '@/features/canvas/components/header/CanvasModeToggle';
import CanvasTitleEditor from '@/features/canvas/components/header/CanvasTitleEditor';
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
  ArrowLeft,
  BarChart3,
  Database,
  FileText,
  Grid3X3,
  Home,
  Keyboard,
  Settings,
  SquareKanban,
  Users,
} from 'lucide-react';
import { useState } from 'react';
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
  const [isCollabOpen, setIsCollabOpen] = useState(false);

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

            {/* Unified collaboration entry point (comments, mentions, members,
                share link). Replaces the old split Collaborate + Share buttons. */}
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1.5 px-3 rounded-md"
              onClick={() => setIsCollabOpen(true)}
              title="Collaborate"
            >
              <Users className="h-3.5 w-3.5" />
              Collaborate
            </Button>

            {/* Auto-save indicator (canvas page only) */}
            {headerInfo?.autoSaveStatus && <AutoSaveIndicator />}

            {/* User menu at the far right of the header */}
            <UserMenu />
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>

      {/* Right-side collaboration panel (non-modal: canvas stays interactive) */}
      <CollaborationPanel
        projectId={canvasId}
        open={isCollabOpen}
        onOpenChange={setIsCollabOpen}
        presence={roster}
        currentPage={pageLabel}
      />
    </div>
  );
}
