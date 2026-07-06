import { Section } from '@/features/canvas/components/settings/Section';
import { CheckpointManager } from '@/features/canvas/components/version-history/CheckpointManager';
import { Badge } from '@/shared/components/ui/badge';
import type { ChangelogEntry } from '@/shared/lib/supabase/services/changelog';
import { Clock, Flag, History } from 'lucide-react';

interface Props {
  canvasId: string;
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

export function ChangelogTab({ canvasId, filteredChangelog, isLoading }: Props) {
  return (
    <div className="space-y-5">
      {/* Checkpoints — the curated, game-style save timeline */}
      <Section
        icon={Flag}
        title="Checkpoints"
        description="Deliberate saves of this canvas. Save when the tree reaches a state worth keeping; load one to bring it back (the present is backed up automatically)."
      >
        <CheckpointManager canvasId={canvasId} />
      </Section>

      {/* Activity — the raw changelog entries behind the timeline */}
      <Section
        icon={History}
        title="Activity"
        description="Everything recorded on this canvas — checkpoint markers and granular changes."
      >
        {isLoading ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Loading activity…
          </p>
        ) : filteredChangelog.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No activity yet.
          </p>
        ) : (
          <ul className="space-y-1.5">
            {filteredChangelog.map((entry) => {
              const isCheckpoint = entry.action === 'checkpoint';
              return (
                <li
                  key={entry.id}
                  className={`flex items-start gap-3 rounded-md border px-3 py-2.5 ${
                    isCheckpoint ? 'border-primary/40' : 'border-border'
                  }`}
                >
                  <span className="mt-0.5 flex-shrink-0">
                    {isCheckpoint ? (
                      <Flag className="h-4 w-4 text-primary" />
                    ) : (
                      <span className="mt-1.5 block h-2 w-2 rounded-full bg-muted-foreground/40" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="text-sm font-medium">
                        {entry.targetName}
                      </span>
                      <Badge variant="outline" className="text-xs capitalize">
                        {isCheckpoint ? 'checkpoint' : entry.action}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {entry.description}
                    </p>
                  </div>
                  <span className="flex flex-shrink-0 items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {getTimeAgo(entry.timestamp || '')}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </Section>
    </div>
  );
}

export default ChangelogTab;
