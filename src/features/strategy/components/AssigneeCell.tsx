import type { ProjectMember } from '@/features/canvas/hooks/useProjectMembers';
import type { UserLite } from '@/shared/lib/supabase/services/users';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/shared/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';
import { Check, UserPlus } from 'lucide-react';

// People column: an overlapping avatar stack of assignees, with a member
// picker on click. Read-only stack when disabled.

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || '?';
}

function labelFor(id: string, userMap: Record<string, UserLite>): string {
  const u = userMap[id];
  return u?.name || u?.email || 'Unknown';
}

interface AssigneeCellProps {
  assigneeIds: string[];
  userMap: Record<string, UserLite>;
  members: ProjectMember[];
  onChange: (ids: string[]) => void;
  disabled?: boolean;
  max?: number;
}

function AvatarStack({
  ids,
  userMap,
  max,
}: {
  ids: string[];
  userMap: Record<string, UserLite>;
  max: number;
}) {
  if (ids.length === 0) {
    return (
      <span className="flex h-6 w-6 items-center justify-center rounded-full border border-dashed border-border text-muted-foreground">
        <UserPlus className="h-3 w-3" />
      </span>
    );
  }
  const shown = ids.slice(0, max);
  const overflow = ids.length - shown.length;
  return (
    <TooltipProvider>
      <div className="flex items-center -space-x-2">
        {shown.map((id) => {
          const u = userMap[id];
          const name = labelFor(id, userMap);
          return (
            <Tooltip key={id}>
              <TooltipTrigger asChild>
                <Avatar className="h-6 w-6 border-2 border-background">
                  {u?.avatar_url && <AvatarImage src={u.avatar_url} alt={name} />}
                  <AvatarFallback className="text-[10px]">
                    {initials(name)}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>{name}</TooltipContent>
            </Tooltip>
          );
        })}
        {overflow > 0 && (
          <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-medium text-muted-foreground">
            +{overflow}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}

export function AssigneeCell({
  assigneeIds,
  userMap,
  members,
  onChange,
  disabled,
  max = 3,
}: AssigneeCellProps) {
  const stack = <AvatarStack ids={assigneeIds} userMap={userMap} max={max} />;

  if (disabled) return stack;

  const toggle = (id: string) => {
    onChange(
      assigneeIds.includes(id)
        ? assigneeIds.filter((x) => x !== id)
        : [...assigneeIds, id]
    );
  };

  return (
    <Popover>
      <PopoverTrigger
        className="rounded outline-none focus-visible:ring-2 focus-visible:ring-ring"
        onClick={(e) => e.stopPropagation()}
      >
        {stack}
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-56 p-0"
        onClick={(e) => e.stopPropagation()}
      >
        <Command>
          <CommandInput placeholder="Assign people…" />
          <CommandList>
            <CommandEmpty>No members found.</CommandEmpty>
            <CommandGroup>
              {members.map((m) => {
                const active = assigneeIds.includes(m.id);
                return (
                  <CommandItem
                    key={m.id}
                    value={`${m.name} ${m.email}`}
                    onSelect={() => toggle(m.id)}
                    className="gap-2"
                  >
                    <Avatar className="h-6 w-6">
                      {m.avatarUrl && (
                        <AvatarImage src={m.avatarUrl} alt={m.name} />
                      )}
                      <AvatarFallback className="text-[10px]">
                        {initials(m.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="flex-1 truncate text-sm">
                      {m.name}
                      {m.isSelf ? ' (you)' : ''}
                    </span>
                    {active && <Check className="h-4 w-4" />}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
