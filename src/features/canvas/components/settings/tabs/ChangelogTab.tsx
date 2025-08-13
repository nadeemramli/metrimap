import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import type { ChangelogEntry } from '@/shared/lib/supabase/services/changelog';
import { Clock, MoreVertical } from 'lucide-react';

interface Props {
  filteredChangelog: ChangelogEntry[];
  isLoading: boolean;
}

function getTimeAgo(timestamp: string) {
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function getActionIcon(action: string) {
  // simple placeholder; real mapping can live in a utils module
  return <span className="inline-block w-2 h-2 rounded-full bg-muted" />;
}

export function ChangelogTab({ filteredChangelog, isLoading }: Props) {
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

export default ChangelogTab;
