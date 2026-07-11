import { Button } from '@/shared/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/shared/components/ui/command';
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from '@/shared/components/ui/popover';
import { Textarea } from '@/shared/components/ui/textarea';
import { resolveMentionIds } from '@/features/canvas/utils/comments';
import type { ProjectMember } from '@/features/canvas/hooks/useProjectMembers';
import { AtSign, Send } from 'lucide-react';
import * as React from 'react';

interface CommentComposerProps {
  members: ProjectMember[];
  onPost: (content: string, mentionedIds: string[]) => void | Promise<void>;
  placeholder?: string;
  isPosting?: boolean;
  autoFocus?: boolean;
}

// Matches a trailing "@query" the user is actively typing (query may be empty,
// and may contain spaces so multi-word names can be searched).
const TRAILING_MENTION = /@([^@\n]*)$/;

export function CommentComposer({
  members,
  onPost,
  placeholder = 'Add a comment…  (type @ to mention)',
  isPosting = false,
  autoFocus = false,
}: CommentComposerProps) {
  const [content, setContent] = React.useState('');
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  // Members explicitly picked from the @-picker (id → name), so submit() can
  // resolve mention ids exactly instead of guessing from the text.
  const pickedRef = React.useRef(new Map<string, string>());

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setContent(value);
    const match = value.match(TRAILING_MENTION);
    if (match) {
      setQuery(match[1].toLowerCase());
      setPickerOpen(true);
    } else {
      setPickerOpen(false);
    }
  };

  const insertMention = (member: ProjectMember) => {
    pickedRef.current.set(member.id, member.name);
    setContent((prev) => prev.replace(TRAILING_MENTION, `@${member.name} `));
    setPickerOpen(false);
    // Return focus to the textarea after picking.
    requestAnimationFrame(() => textareaRef.current?.focus());
  };

  const filtered = React.useMemo(() => {
    if (!query) return members;
    return members.filter(
      (m) =>
        m.name.toLowerCase().includes(query) ||
        m.email.toLowerCase().includes(query)
    );
  }, [members, query]);

  const submit = async () => {
    const trimmed = content.trim();
    if (!trimmed) return;
    // Resolve against the picker-selected members when any were picked (still
    // verifying their "@Name" survives in the text, in case the user deleted
    // a mention); fall back to the full member list for hand-typed mentions.
    const picked = Array.from(pickedRef.current, ([id, name]) => ({
      id,
      name,
    }));
    const mentionedIds = resolveMentionIds(
      trimmed,
      picked.length > 0 ? picked : members
    );
    await onPost(trimmed, mentionedIds);
    pickedRef.current.clear();
    setContent('');
    setPickerOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Cmd/Ctrl+Enter posts; Escape closes the mention picker.
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      void submit();
    } else if (e.key === 'Escape' && pickerOpen) {
      e.preventDefault();
      setPickerOpen(false);
    }
  };

  return (
    <div className="space-y-2">
      <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
        <PopoverAnchor asChild>
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            autoFocus={autoFocus}
            className="min-h-[64px] resize-none"
          />
        </PopoverAnchor>
        <PopoverContent
          align="start"
          className="w-64 p-0"
          // Keep textarea focus; don't steal it when the list opens.
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <Command shouldFilter={false}>
            <CommandList>
              <CommandEmpty>No members</CommandEmpty>
              <CommandGroup heading="Mention">
                {filtered.map((m) => (
                  <CommandItem
                    key={m.id}
                    value={m.id}
                    onSelect={() => insertMention(m)}
                  >
                    <AtSign className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                    <span className="truncate">{m.name}</span>
                    {m.isSelf && (
                      <span className="ml-auto text-xs text-muted-foreground">
                        you
                      </span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <div className="flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground">
          ⌘/Ctrl+Enter to send
        </span>
        <Button
          size="sm"
          onClick={submit}
          disabled={isPosting || !content.trim()}
          className="gap-1.5"
        >
          <Send className="h-3.5 w-3.5" />
          {isPosting ? 'Posting…' : 'Send'}
        </Button>
      </div>
    </div>
  );
}

export default CommentComposer;
