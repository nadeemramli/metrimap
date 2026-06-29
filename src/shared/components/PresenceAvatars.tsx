import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';
import type { PresenceUser } from '@/shared/hooks/usePresence';
import { cn } from '@/shared/utils';

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || '?';
}

/**
 * Overlapping avatar stack of who's live in the canvas. Hidden when nobody
 * (other than nothing to show) is present. Tooltip shows name + current page.
 */
export function PresenceAvatars({
  roster,
  max = 5,
  className,
}: {
  roster: PresenceUser[];
  max?: number;
  className?: string;
}) {
  if (roster.length === 0) return null;
  const shown = roster.slice(0, max);
  const overflow = roster.length - shown.length;

  return (
    <TooltipProvider>
      <div className={cn('flex items-center -space-x-2', className)}>
        {shown.map((u) => (
          <Tooltip key={u.userId}>
            <TooltipTrigger asChild>
              <Avatar className="h-6 w-6 border-2 border-background">
                {u.avatar && <AvatarImage src={u.avatar} alt={u.name} />}
                <AvatarFallback className="text-[10px]">
                  {initials(u.name)}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              {u.name}
              {u.page ? ` · ${u.page}` : ''}
            </TooltipContent>
          </Tooltip>
        ))}
        {overflow > 0 && (
          <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-medium text-muted-foreground">
            +{overflow}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
