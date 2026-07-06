import { OrganizationSwitcher } from '@clerk/react-router';
import {
  Activity,
  Database,
  Home,
  Search,
  Sparkles,
  Star,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

import QuickSearchCommand from '@/features/canvas/components/search/QuickSearchCommand';
import { NotificationInbox } from '@/features/notifications/components/NotificationInbox';
import { useProjectsStore } from '@/lib/stores';
import { Logo } from '@/shared/components/layout/Logo';
import { UserMenu } from '@/shared/components/layout/UserMenu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from '@/shared/components/ui/sidebar';

// Primary workspace navigation. Operate/Explore live on the home page's own
// tab pill (and at the canvas level), so the rail keeps a single Home entry.
const NAV = [
  { label: 'Home', icon: Home, to: '/', match: (p: string) => p === '/' },
  { label: 'Data', icon: Database, to: '/catalog' },
  { label: 'Activity', icon: Activity, to: '/feed' },
  { label: 'Agent', icon: Sparkles, to: '/settings/connect' },
] as const;

/**
 * Workspace app shell (CVS-156): a sticky left rail — workspace switcher, search,
 * primary nav, pinned boards, user utilities — wrapping every top-level workspace
 * route via <Outlet/>. Canvas routes keep their own CanvasLayout.
 */
export default function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);

  // Shift+F opens global cross-canvas search (matches the sidebar tooltip).
  // Ignored while typing in an input/textarea/contenteditable.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (
        t &&
        (t.tagName === 'INPUT' ||
          t.tagName === 'TEXTAREA' ||
          t.isContentEditable)
      )
        return;
      if (
        e.shiftKey &&
        e.key.toLowerCase() === 'f' &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey
      ) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const projects = useProjectsStore((s) => s.projects);
  const pinned = (Array.isArray(projects) ? projects : [])
    .filter((p) => p.tags?.includes('starred'))
    .slice(0, 6);

  const isActive = (item: (typeof NAV)[number]) =>
    'match' in item && item.match
      ? item.match(location.pathname)
      : location.pathname + location.search === item.to;

  return (
    <SidebarProvider>
      <Sidebar collapsible="offcanvas">
        <SidebarHeader className="gap-2">
          <div className="flex items-center gap-2 px-1 py-1">
            <Link to="/" aria-label="Home" className="shrink-0">
              <Logo className="h-7 w-7 rounded-md" />
            </Link>
            <div className="min-w-0 flex-1">
              <OrganizationSwitcher
                hidePersonal
                afterCreateOrganizationUrl="/"
                afterSelectOrganizationUrl="/"
                afterLeaveOrganizationUrl="/"
              />
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setSearchOpen(true)}
                  tooltip="Search (Shift+F)"
                >
                  <Search />
                  <span>Search</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {NAV.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item)}
                    tooltip={item.label}
                  >
                    <Link to={item.to}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>

          {pinned.length > 0 && (
            <SidebarGroup>
              <SidebarGroupLabel>Pinned</SidebarGroupLabel>
              <SidebarMenu>
                {pinned.map((p) => (
                  <SidebarMenuItem key={p.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === `/canvas/${p.id}`}
                      tooltip={p.name}
                    >
                      <Link to={`/canvas/${p.id}`}>
                        <Star />
                        <span>{p.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          )}
        </SidebarContent>

        <SidebarFooter>
          <SidebarSeparator />
          <div className="flex items-center justify-between gap-2 px-1">
            <UserMenu />
            <NotificationInbox />
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-12 items-center gap-2 border-b border-border bg-background/80 px-4 backdrop-blur-sm">
          <SidebarTrigger className="-ml-1" />
        </header>
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </SidebarInset>

      <QuickSearchCommand
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onResultSelect={(result) => {
          const canvasId = (result.data as { canvasId?: string })?.canvasId;
          if (result.type === 'evidence') {
            navigate('/evidence', { state: { focusEvidence: result.id } });
          } else if (canvasId) {
            navigate(`/canvas/${canvasId}`, {
              state:
                result.type === 'relationship'
                  ? { openRelationship: result.id }
                  : { focusNode: result.id },
            });
          }
          setSearchOpen(false);
        }}
      />
    </SidebarProvider>
  );
}
