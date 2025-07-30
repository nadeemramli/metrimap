import { Outlet, useParams, useLocation, useNavigate } from "react-router-dom";
import { 
  Home, 
  Grid3X3, 
  BarChart3, 
  Database, 
  Server, 
  Settings 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const sidebarItems = [
  {
    icon: Home,
    label: "Home",
    path: "/",
    isHome: true
  },
  {
    icon: Grid3X3,
    label: "Canvas",
    path: "",
    isDefault: true
  },
  {
    icon: BarChart3,
    label: "Dashboard", 
    path: "/dashboard"
  },
  {
    icon: Database,
    label: "Assets",
    path: "/assets"
  },
  {
    icon: Server,
    label: "Source",
    path: "/source"
  },
  {
    icon: Settings,
    label: "Settings",
    path: "/settings",
    isBottom: true
  }
];

export default function CanvasLayout() {
  const { canvasId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (item: typeof sidebarItems[0]) => {
    if (item.isHome) {
      navigate("/");
    } else if (item.isDefault) {
      navigate(`/canvas/${canvasId}`);
    } else {
      navigate(`/canvas/${canvasId}${item.path}`);
    }
  };

  const isActiveRoute = (item: typeof sidebarItems[0]) => {
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
      <div className="w-16 bg-card border-r border-border flex flex-col items-center py-4">
        {/* Regular Navigation Items */}
        <div className="flex flex-col gap-2 flex-1">
          {sidebarItems.filter(item => !item.isBottom).map((item) => {
            const Icon = item.icon;
            const isActive = isActiveRoute(item);
            
            return (
              <Button
                key={item.label}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                className={cn(
                  "w-10 h-10 p-0",
                  isActive && "bg-primary text-primary-foreground"
                )}
                onClick={() => handleNavigation(item)}
                title={item.label}
              >
                <Icon className="h-4 w-4" />
              </Button>
            );
          })}
        </div>

        {/* Bottom Items */}
        <div className="flex flex-col gap-2">
          {sidebarItems.filter(item => item.isBottom).map((item) => {
            const Icon = item.icon;
            const isActive = isActiveRoute(item);
            
            return (
              <Button
                key={item.label}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                className={cn(
                  "w-10 h-10 p-0",
                  isActive && "bg-primary text-primary-foreground"
                )}
                onClick={() => handleNavigation(item)}
                title={item.label}
              >
                <Icon className="h-4 w-4" />
              </Button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}