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
  Users,
  Calendar,
  Dot,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { cn } from "@/lib/utils";
import { useProjectsStore, useAppStore } from "@/lib/stores";
import { UserMenu } from "@/components/layout/UserMenu";

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
  const { currentCanvasId } = useAppStore();

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
      <TooltipProvider>
        {/* Sidebar */}
        <div className="w-16 bg-card border-r border-border flex flex-col">
          {/* Logo/Brand */}
          <div className="h-16 flex items-center justify-center border-b border-border">
            <Button
              variant="ghost"
              size="sm"
              className="w-10 h-10 p-0 rounded-lg"
              onClick={() => navigate("/")}
              title="Back to Home"
            >
              <ArrowLeft className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>

          {/* Project Context */}
          {project && (
            <div className="px-2 py-3 border-b border-border">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center mb-2 mx-auto">
                <Grid3X3 className="h-5 w-5 text-primary" />
              </div>
              <div className="text-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-xs font-medium text-foreground truncate w-12 mx-auto">
                      {project.name}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <div className="text-sm">
                      <div className="font-medium">{project.name}</div>
                      <div className="text-muted-foreground">
                        {project.description}
                      </div>
                      <Separator className="my-2" />
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1">
                          <BarChart3 className="h-3 w-3" />
                          {project.nodes.length} metrics
                        </div>
                        <div className="flex items-center gap-1">
                          <Database className="h-3 w-3" />
                          {project.edges.length} relationships
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                        <Users className="h-3 w-3" />
                        {project.collaborators.length} collaborators
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          )}

          {/* Navigation Items */}
          <div className="flex flex-col gap-1 px-2 py-3 flex-1">
            {sidebarItems
              .filter((item) => !item.isBottom && !item.isHome)
              .map((item) => {
                const Icon = item.icon;
                const isActive = isActiveRoute(item);

                return (
                  <Tooltip key={item.label}>
                    <TooltipTrigger asChild>
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        size="sm"
                        className={cn(
                          "w-12 h-12 p-0 rounded-lg transition-all duration-200",
                          isActive
                            ? "bg-primary text-primary-foreground shadow-md scale-105"
                            : "hover:bg-accent hover:scale-105"
                        )}
                        onClick={() => handleNavigation(item)}
                      >
                        <Icon className="h-5 w-5" />
                        {isActive && (
                          <div className="absolute -right-0.5 top-1/2 w-1 h-6 bg-primary rounded-l-sm transform -translate-y-1/2" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <div className="text-sm">
                        <div className="font-medium">{item.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.label === "Canvas" && "Visual metric mapping"}
                          {item.label === "Dashboard" && "Analytics overview"}
                          {item.label === "Assets" && "Metrics & relationships"}
                          {item.label === "Evidence" && "Research repository"}
                          {item.label === "Source" && "Data governance"}
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
          </div>

          {/* Status Indicator */}
          <div className="px-2 py-2 border-t border-border">
            <div className="flex items-center justify-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1">
                    <Dot className="h-4 w-4 text-green-500 animate-pulse" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <div className="text-sm">
                    <div className="text-green-500 font-medium">Online</div>
                    <div className="text-xs text-muted-foreground">
                      Auto-saving enabled
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Settings */}
          <div className="px-2 py-3">
            {sidebarItems
              .filter((item) => item.isBottom)
              .map((item) => {
                const Icon = item.icon;
                const isActive = isActiveRoute(item);

                return (
                  <Tooltip key={item.label}>
                    <TooltipTrigger asChild>
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        size="sm"
                        className={cn(
                          "w-12 h-12 p-0 rounded-lg transition-all duration-200",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-accent hover:scale-105"
                        )}
                        onClick={() => handleNavigation(item)}
                      >
                        <Icon className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <div className="text-sm">
                        <div className="font-medium">{item.label}</div>
                        <div className="text-xs text-muted-foreground">
                          Canvas configuration
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar with Breadcrumb */}
          <div className="h-14 bg-card/50 backdrop-blur-sm border-b border-border flex items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-auto text-muted-foreground hover:text-foreground"
                  onClick={() => navigate("/")}
                >
                  Metrimap
                </Button>
                <span className="text-muted-foreground">/</span>
                {project && (
                  <>
                    <span className="text-muted-foreground">
                      {project.name}
                    </span>
                    <span className="text-muted-foreground">/</span>
                  </>
                )}
                <span className="font-medium text-foreground">
                  {getPageTitle()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {project && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>
                      Updated {new Date(project.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{project.collaborators.length} collaborators</span>
                  </div>
                </div>
              )}
              <Badge variant="outline" className="text-xs">
                Auto-saved
              </Badge>

              {/* User Menu */}
              <UserMenu />
            </div>
          </div>

          {/* Page Content */}
          <div className="flex-1 overflow-hidden">
            <Outlet />
          </div>
        </div>
      </TooltipProvider>
    </div>
  );
}
