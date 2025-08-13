import type { ApiConnection } from '@/features/sources/source';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import {
  AlertTriangle,
  CheckCircle,
  Edit,
  Eye,
  Link,
  MoreVertical,
  Plus,
  Trash2,
  TrendingUp,
  XCircle,
} from 'lucide-react';

interface ApiConnectionsTabProps {
  apis: ApiConnection[];
  onEdit: (api: ApiConnection) => void;
  onDelete: (apiId: string) => void;
  onView: (api: ApiConnection) => void;
}

const getStatusIcon = (status: ApiConnection['status']) => {
  switch (status) {
    case 'Connected':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'Disconnected':
      return <XCircle className="h-4 w-4 text-gray-500" />;
    case 'Warning':
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    default:
      return <XCircle className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusColor = (status: ApiConnection['status']) => {
  switch (status) {
    case 'Connected':
      return 'bg-green-50 border-green-200 text-green-900';
    case 'Disconnected':
      return 'bg-gray-50 border-gray-200 text-gray-900';
    case 'Warning':
      return 'bg-red-50 border-red-200 text-red-900';
    default:
      return 'bg-gray-50 border-gray-200 text-gray-900';
  }
};

const getPerformanceColor = (uptime: number) => {
  if (uptime >= 99) return 'bg-green-50 border-green-200 text-green-900';
  if (uptime >= 95) return 'bg-yellow-50 border-yellow-200 text-yellow-900';
  return 'bg-red-50 border-red-200 text-red-900';
};

export function ApiConnectionsTab({
  apis,
  onEdit,
  onDelete,
  onView,
}: ApiConnectionsTabProps) {
  if (apis.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Link className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No API connections found</h3>
          <p className="text-muted-foreground mb-4">
            Connect to external APIs to enrich your data and automate workflows.
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add API Connection
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  API Connection
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Response Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Uptime
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Last Ping
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {apis.map((api) => (
                <tr
                  key={api.id}
                  className="hover:bg-muted/30 transition-colors duration-150"
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-foreground">
                        {api.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {api.type} • v{api.version}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(api.status)}
                      <Badge
                        variant="outline"
                        className={getStatusColor(api.status)}
                      >
                        {api.status}
                      </Badge>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="secondary">{api.type}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">
                        {api.responseTime != null
                          ? `${api.responseTime}ms`
                          : '-'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant="outline"
                      className={getPerformanceColor(api.uptime)}
                    >
                      {api.uptime}%
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(api.lastPing).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onView(api)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(api)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => onDelete(api.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
