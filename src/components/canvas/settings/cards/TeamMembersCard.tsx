import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Collaborator } from '@/lib/supabase/services/collaborators';
import { Edit, MoreVertical, Plus, Settings, Trash2, User } from 'lucide-react';
import { getTimeAgo } from '../utils/timeUtils';

interface TeamMembersCardProps {
  collaborators?: Collaborator[];
  isLoading?: boolean;
}

export function TeamMembersCard({
  collaborators = [],
  isLoading = false,
}: TeamMembersCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>Manage access and permissions</CardDescription>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Invite Member
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading team members...</p>
            </div>
          ) : collaborators.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No team members yet. Invite someone to collaborate!
              </p>
            </div>
          ) : (
            collaborators.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">
                      {member.users?.name || member.users?.email}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {member.users?.email}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={member.role === 'owner' ? 'default' : 'secondary'}
                  >
                    {member.role}
                  </Badge>
                  <div className="text-sm text-muted-foreground">
                    {member.joined_at
                      ? `Joined ${getTimeAgo(member.joined_at)}`
                      : 'Invited'}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Change Role
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        Permissions
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
