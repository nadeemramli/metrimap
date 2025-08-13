import type { DataSource } from '@/features/sources/source';
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
  Clock,
  Database,
  Edit,
  Eye,
  MoreVertical,
  Plus,
  Trash2,
} from 'lucide-react';

interface DataSourcesTabProps {
  sources: DataSource[];
  onEdit: (source: DataSource) => void;
  onDelete: (sourceId: string) => void;
  onView: (source: DataSource) => void;
}

const getStatusIcon = (status: DataSource['status']) => {
  switch (status) {
    case 'Live':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'Instrumented':
      return <Database className="h-4 w-4 text-blue-500" />;
    case 'Needs QA':
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    case 'Planned':
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusColor = (status: DataSource['status']) => {
  switch (status) {
    case 'Live':
      return 'bg-green-50 border-green-200 text-green-900';
    case 'Instrumented':
      return 'bg-blue-50 border-blue-200 text-blue-900';
    case 'Needs QA':
      return 'bg-yellow-50 border-yellow-200 text-yellow-900';
    case 'Planned':
    default:
      return 'bg-gray-50 border-gray-200 text-gray-900';
  }
};

const getQualityColor = (quality: DataSource['dataQuality']) => {
  if (quality == null) return 'bg-gray-50 border-gray-200 text-gray-900';
  if (quality >= 80) return 'bg-green-50 border-green-200 text-green-900';
  if (quality >= 50) return 'bg-yellow-50 border-yellow-200 text-yellow-900';
  return 'bg-red-50 border-red-200 text-red-900';
};

export function DataSourcesTab({
  sources,
  onEdit,
  onDelete,
  onView,
}: DataSourcesTabProps) {
  if (sources.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No data sources found</h3>
          <p className="text-muted-foreground mb-4">
            Get started by adding your first data source to track metrics and
            events.
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Data Source
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
                  Data Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  System
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Quality
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Records Today
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Last Sync
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sources.map((source) => (
                <tr
                  key={source.id}
                  className="hover:bg-muted/30 transition-colors duration-150"
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-foreground">
                        {source.metricName}
                      </div>
                      {source.description && (
                        <div className="text-sm text-muted-foreground">
                          {source.description}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="secondary">{source.sourceSystem}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(source.status)}
                      <Badge
                        variant="outline"
                        className={getStatusColor(source.status)}
                      >
                        {source.status}
                      </Badge>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant="outline"
                      className={getQualityColor(source.dataQuality)}
                    >
                      {source.dataQuality != null
                        ? `${source.dataQuality}%`
                        : 'Unknown'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium">
                      {source.recordsToday.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {source.lastSync
                      ? new Date(source.lastSync).toLocaleString()
                      : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onView(source)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(source)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => onDelete(source.id)}
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
