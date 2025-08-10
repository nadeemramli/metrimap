import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { ChangelogEntry } from '@/lib/supabase/services/changelog';
import { Clock, MoreVertical } from 'lucide-react';
import { getActionIcon } from '../utils/actionIcons';
import { getTimeAgo } from '../utils/timeUtils';

interface ChangelogTabProps {
  filteredChangelog: ChangelogEntry[];
  isLoading: boolean;
}

export function ChangelogTab({
  filteredChangelog,
  isLoading,
}: ChangelogTabProps) {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Loading changelog...</p>
      </div>
    );
  }

  if (filteredChangelog.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No activity yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredChangelog.map((entry) => (
        <Card key={entry.id}>
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">{getActionIcon(entry.action)}</div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-foreground">
                    {entry.userId || 'Unknown'}
                  </span>
                  <span className="text-muted-foreground">{entry.action}</span>
                  <Badge variant="outline" className="text-xs">
                    {entry.target}
                  </Badge>
                  <span className="font-mono text-sm bg-muted px-2 py-0.5 rounded">
                    {entry.targetName}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {entry.description}
                </p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {getTimeAgo(entry.timestamp || '')}
                </div>
              </div>

              <div className="flex-shrink-0">
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
