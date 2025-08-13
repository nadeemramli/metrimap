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
import type { GovernancePolicy } from '@/types/source';
import {
  Calendar,
  Edit,
  Eye,
  MoreVertical,
  Plus,
  Shield,
  Trash2,
  Users,
} from 'lucide-react';

interface GovernanceTabProps {
  policies: GovernancePolicy[];
  onEdit: (policy: GovernancePolicy) => void;
  onDelete: (policyId: string) => void;
  onView: (policy: GovernancePolicy) => void;
}

const getTypeColor = (type: GovernancePolicy['type']) => {
  switch (type) {
    case 'privacy':
      return 'bg-blue-50 border-blue-200 text-blue-900';
    case 'security':
      return 'bg-red-50 border-red-200 text-red-900';
    case 'compliance':
      return 'bg-green-50 border-green-200 text-green-900';
    case 'quality':
      return 'bg-yellow-50 border-yellow-200 text-yellow-900';
    default:
      return 'bg-gray-50 border-gray-200 text-gray-900';
  }
};

const getStatusColor = (status: GovernancePolicy['status']) => {
  switch (status) {
    case 'active':
      return 'bg-green-50 border-green-200 text-green-900';
    case 'draft':
      return 'bg-yellow-50 border-yellow-200 text-yellow-900';
    case 'archived':
      return 'bg-gray-50 border-gray-200 text-gray-900';
    default:
      return 'bg-gray-50 border-gray-200 text-gray-900';
  }
};

export function GovernanceTab({
  policies,
  onEdit,
  onDelete,
  onView,
}: GovernanceTabProps) {
  if (policies.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">
            No governance policies found
          </h3>
          <p className="text-muted-foreground mb-4">
            Establish data governance policies to ensure compliance and maintain
            data quality.
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Policy
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
                  Policy
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Last Review
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {policies.map((policy) => (
                <tr
                  key={policy.id}
                  className="hover:bg-muted/30 transition-colors duration-150"
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-foreground">
                        {policy.name}
                      </div>
                      {policy.description && (
                        <div className="text-sm text-muted-foreground">
                          {policy.description}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant="outline"
                      className={getTypeColor(policy.type)}
                    >
                      {policy.type}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant="outline"
                      className={getStatusColor(policy.status)}
                    >
                      {policy.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{policy.owner}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(policy.lastReview).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onView(policy)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(policy)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => onDelete(policy.id)}
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
