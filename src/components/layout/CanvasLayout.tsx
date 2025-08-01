import { Outlet, useParams, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Grid3X3,
  BarChart3,
  Database,
  FileText,
  Server,
  Settings,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useProjectsStore } from "@/lib/stores";
import { UserMenu } from "@/components/layout/UserMenu";
import { useCanvasHeader } from "@/contexts/CanvasHeaderContext";

const sidebarItems = [
  {
    icon: Home,
    label: "Home",
    path: "/",
    isHome: true,
  },
  {
    icon: Grid3X3,
    label: "Canvas",
    path: "",
    isDefault: true,
  },
  {
    icon: BarChart3,
    label: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: Database,
    label: "Assets",
    path: "/assets",
  },
  {
    icon: FileText,
    label: "Evidence",
    path: "/evidence",
  },
  {
    icon: Server,
    label: "Source",
    path: "/source",
  },
  {
    icon: Settings,
    label: "Settings",
    path: "/settings",
    isBottom: true,
  },
];

export default function CanvasLayout() {
  const { canvasId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { getProjectById } = useProjectsStore();
  const { headerInfo } = useCanvasHeader();

  const project = canvasId ? getProjectById(canvasId) : null;

  const handleNavigation = (item: (typeof sidebarItems)[0]) => {
    if (item.isHome) {
      navigate("/");
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

  const getPageTitle = () => {
    const currentPath = location.pathname;
    if (currentPath.includes("/dashboard")) return "Dashboard";
    if (currentPath.includes("/assets")) return "Assets";
    if (currentPath.includes("/evidence")) return "Evidence";
    if (currentPath.includes("/source")) return "Source";
    if (currentPath.includes("/settings")) return "Settings";
    return "Canvas";
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
            onClick={() => navigate("/")}
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
                    "w-9 h-9 p-0 rounded-md transition-all duration-150",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "hover:bg-accent/50 text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => handleNavigation(item)}
                >
                  <Icon className="h-4 w-4" />
                </Button>
              );
            })}
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
                    "w-9 h-9 p-0 rounded-md transition-all duration-150",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "hover:bg-accent/50 text-muted-foreground hover:text-foreground"
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
            {headerInfo ? (
              <>
                {/* Canvas Title */}
                <span className="text-sm font-medium text-foreground truncate">
                  {headerInfo.title}
                </span>

                {/* Canvas Description */}
                {headerInfo.description && (
                  <>
                    <span className="text-muted-foreground text-xs">•</span>
                    <span className="text-xs text-muted-foreground truncate max-w-48">
                      {headerInfo.description}
                    </span>
                  </>
                )}
              </>
            ) : (
              <>
                {/* Fallback to generic page title */}
                <span className="text-sm font-medium text-foreground">
                  {getPageTitle()}
                </span>
                {project && (
                  <>
                    <span className="text-muted-foreground text-xs">•</span>
                    <span className="text-xs text-muted-foreground truncate max-w-32">
                      {project.name}
                    </span>
                  </>
                )}
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Beautiful Auto-save Status */}
            {headerInfo?.autoSaveStatus && (
              <div
                className={cn(
                  "flex items-center gap-1.5 px-2 py-1 rounded-md border text-xs font-medium transition-all duration-200",
                  headerInfo.autoSaveStatus.bgClassName,
                  headerInfo.autoSaveStatus.className
                )}
              >
                {/* Status Dot */}
                <div className="relative flex items-center">
                  <div
                    className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      headerInfo.autoSaveStatus.dotClassName
                    )}
                  />
                  {headerInfo.autoSaveStatus.className.includes(
                    "animate-ping"
                  ) && (
                    <div
                      className={cn(
                        "absolute w-1.5 h-1.5 rounded-full",
                        headerInfo.autoSaveStatus.dotClassName
                      )}
                    />
                  )}
                </div>

                {/* Status Icon */}
                <headerInfo.autoSaveStatus.icon className="h-3 w-3" />

                {/* Status Text */}
                <span>{headerInfo.autoSaveStatus.text}</span>
              </div>
            )}

            <UserMenu />
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
