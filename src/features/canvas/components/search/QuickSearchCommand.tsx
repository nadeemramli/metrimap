import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/shared/components/ui/command';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { useClerkSupabase } from '@/shared/hooks/useClerkSupabase';
import { searchAcrossCanvases } from '@/shared/lib/supabase/services/search';
import { BarChart3, FileText } from 'lucide-react';
import { useEffect, useState } from 'react';

export interface QuickSearchResult {
  type: 'metric' | 'relationship' | 'evidence';
  id: string;
  title: string;
  subtitle?: string;
  // The owning canvas/project id of the result, threaded through so the
  // consumer can navigate to the correct canvas instead of a hardcoded one.
  data?: { canvasId?: string };
}

interface QuickSearchCommandProps {
  isOpen: boolean;
  onClose: () => void;
  onResultSelect: (result: QuickSearchResult) => void;
}

export function useQuickSearch() {
  const [isOpen, setIsOpen] = useState(false);

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  };
}

export default function QuickSearchCommand({
  isOpen,
  onClose,
  onResultSelect,
}: QuickSearchCommandProps) {
  const client = useClerkSupabase();
  const [term, setTerm] = useState('');
  const [results, setResults] = useState<QuickSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  // Reset state each time the palette closes so it opens fresh.
  useEffect(() => {
    if (!isOpen) {
      setTerm('');
      setResults([]);
      setLoading(false);
      setFailed(false);
    }
  }, [isOpen]);

  // Debounced cross-canvas search (CVS-83). RLS scopes results to accessible
  // canvases; cmdk filtering is disabled (shouldFilter=false) since the DB filters.
  useEffect(() => {
    if (!isOpen) return;
    const q = term.trim();
    if (q.length < 2) {
      setResults([]);
      setLoading(false);
      setFailed(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setFailed(false);
    const handle = setTimeout(async () => {
      try {
        const found = await searchAcrossCanvases(q, client ?? undefined);
        if (cancelled) return;
        setResults(
          found.map((r) => ({
            type: r.type,
            id: r.id,
            title: r.title,
            subtitle: r.subtitle,
            data: { canvasId: r.canvasId ?? undefined },
          }))
        );
      } catch (err) {
        console.error('Global search failed:', err);
        if (!cancelled) {
          setResults([]);
          setFailed(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [term, isOpen, client]);

  const metrics = results.filter((r) => r.type === 'metric');
  const evidence = results.filter((r) => r.type === 'evidence');
  const select = (r: QuickSearchResult) => {
    onResultSelect(r);
    onClose();
  };

  const trimmed = term.trim();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="overflow-hidden p-0" showCloseButton={false}>
        <DialogTitle className="sr-only">Search all canvases</DialogTitle>
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search all canvases — metrics, evidence…"
            value={term}
            onValueChange={setTerm}
          />
          <CommandList>
            {trimmed.length < 2 ? (
              <CommandEmpty>
                Type at least 2 characters to search across your canvases.
              </CommandEmpty>
            ) : loading ? (
              <CommandEmpty>Searching…</CommandEmpty>
            ) : failed ? (
              <CommandEmpty>Search failed — try again.</CommandEmpty>
            ) : results.length === 0 ? (
              <CommandEmpty>No matches for “{trimmed}”.</CommandEmpty>
            ) : (
              <>
                {metrics.length > 0 && (
                  <CommandGroup heading="Metrics">
                    {metrics.map((r) => (
                      <CommandItem
                        key={`m-${r.id}`}
                        value={`m-${r.id}`}
                        onSelect={() => select(r)}
                      >
                        <BarChart3 className="mr-2 h-4 w-4 text-blue-600" />
                        <span className="flex-1 truncate">{r.title}</span>
                        {r.subtitle && (
                          <span className="ml-2 shrink-0 truncate text-xs text-muted-foreground">
                            {r.subtitle}
                          </span>
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
                {evidence.length > 0 && (
                  <CommandGroup heading="Evidence">
                    {evidence.map((r) => (
                      <CommandItem
                        key={`e-${r.id}`}
                        value={`e-${r.id}`}
                        onSelect={() => select(r)}
                      >
                        <FileText className="mr-2 h-4 w-4 text-green-600" />
                        <span className="flex-1 truncate">{r.title}</span>
                        {r.subtitle && (
                          <span className="ml-2 shrink-0 truncate text-xs text-muted-foreground">
                            {r.subtitle}
                          </span>
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
