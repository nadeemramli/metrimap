import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import {
  Activity,
  Plus,
  RefreshCw,
  Settings,
  TrendingUp,
  Wifi,
  WifiOff,
} from 'lucide-react';

interface MonitoringTabProps {
  onRefresh?: () => void;
  onSettings?: () => void;
  onAddMonitor?: () => void;
}

export function MonitoringTab({
  onRefresh,
  onSettings,
  onAddMonitor,
}: MonitoringTabProps) {
  return (
    <div className="space-y-4">
      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Wifi className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Operational</div>
            <p className="text-xs text-muted-foreground">
              All systems running normally
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.9%</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Monitors
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Across all services</p>
          </CardContent>
        </Card>
      </div>

      {/* Monitoring Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Health Monitors</h3>
          <p className="text-sm text-muted-foreground">
            Real-time monitoring of your data sources and API connections
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={onSettings}>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button size="sm" onClick={onAddMonitor}>
            <Plus className="h-4 w-4 mr-2" />
            Add Monitor
          </Button>
        </div>
      </div>

      {/* Monitoring Dashboard Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Service Health Dashboard</CardTitle>
          <CardDescription>
            Monitor the health and performance of your data infrastructure
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Example monitoring entries */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Database Connection</span>
                <Badge className="bg-green-50 border-green-200 text-green-900">
                  <Wifi className="h-3 w-3 mr-1" />
                  Online
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                Response time: 12ms • Last check: 30s ago
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Analytics API</span>
                <Badge className="bg-green-50 border-green-200 text-green-900">
                  <Wifi className="h-3 w-3 mr-1" />
                  Online
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                Response time: 145ms • Last check: 1m ago
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Data Warehouse</span>
                <Badge className="bg-yellow-50 border-yellow-200 text-yellow-900">
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Syncing
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                Response time: 250ms • Last check: 2m ago
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">External API</span>
                <Badge className="bg-red-50 border-red-200 text-red-900">
                  <WifiOff className="h-3 w-3 mr-1" />
                  Offline
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                Timeout error • Last check: 5m ago
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
