import { Button } from '@/shared/components/ui/button';
import { useClerkSupabase } from '@/shared/hooks/useClerkSupabase';
import {
  deleteConnection,
  listConnections,
  type SourceConnection,
} from '@/shared/lib/supabase/services/sourceConnections';
import { Loader2, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

/**
 * Lists the workspace's saved warehouse connections (no secrets) with delete.
 * Connections are *added* from a Source Node's warehouse config (the credential
 * never touches the browser — see sourceConnections.ts). Shared by the Data hub
 * Connections tab and Workspace Settings.
 */
export function ConnectionsPanel() {
  const client = useClerkSupabase();
  const [connections, setConnections] = useState<SourceConnection[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!client) return;
    setBusy(true);
    listConnections(client)
      .then(setConnections)
      .catch(() => setConnections([]))
      .finally(() => setBusy(false));
  }, [client]);

  const removeConnection = async (id: string) => {
    if (!client) return;
    try {
      await deleteConnection(id, client);
      setConnections((prev) => prev.filter((c) => c.id !== id));
      toast.success('Connection removed');
    } catch {
      toast.error('Failed to remove connection');
    }
  };

  if (busy) {
    return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
  }

  if (connections.length === 0) {
    return (
      <p className="text-sm text-muted-foreground/70">
        No connections yet — add one from a Source Node’s warehouse config.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {connections.map((c) => (
        <div
          key={c.id}
          className="flex items-center justify-between rounded-md border border-border px-3 py-2"
        >
          <div className="min-w-0">
            <div className="truncate text-sm font-medium">{c.name}</div>
            <div className="truncate text-xs text-muted-foreground">
              {c.warehouse_type}
              {c.host ? ` · ${c.host}` : ''}
              {c.database ? ` / ${c.database}` : ''}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeConnection(c.id)}
            title="Remove connection"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ))}
    </div>
  );
}
