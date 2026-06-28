'use client';

// Data Source Phase 3 UI — bind a card's data to a SQL query against a saved
// warehouse connection. All credential handling happens in the warehouse-proxy
// edge function; this component only ever sends/receives non-secret data plus a
// one-time password on save/test. See services/sourceConnections.ts.

import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Textarea } from '@/shared/components/ui/textarea';
import { useClerkSupabase } from '@/shared/hooks/useClerkSupabase';
import type { MetricValue } from '@/shared/types';
import {
  deleteConnection,
  listConnections,
  runWarehouseQuery,
  saveConnection,
  testConnection,
  type SourceConnection,
} from '@/shared/lib/supabase/services/sourceConnections';
import { Database, Loader2, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface WarehouseSourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // meta carries the connection + SQL so callers that persist (the Source Node)
  // can re-run later; callers that just bind once (card Data tab) ignore it.
  onApply: (
    series: MetricValue[],
    meta: { connectionId: string; sql: string }
  ) => void;
}

const EMPTY_FORM = {
  name: '',
  host: '',
  port: 5432,
  database: '',
  username: '',
  password: '',
  ssl: true,
};

export function WarehouseSourceDialog({
  open,
  onOpenChange,
  onApply,
}: WarehouseSourceDialogProps) {
  const client = useClerkSupabase();

  const [connections, setConnections] = useState<SourceConnection[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [sql, setSql] = useState(
    'select period, value from your_table order by period'
  );
  const [busy, setBusy] = useState<null | 'load' | 'run' | 'save' | 'test'>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const authedClient = client ?? undefined;

  const refresh = async () => {
    if (!client) return;
    setBusy('load');
    setError(null);
    try {
      const list = await listConnections(authedClient);
      setConnections(list);
      if (list.length && !selectedId) setSelectedId(list[0].id);
      setShowNewForm(list.length === 0);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load connections.');
    } finally {
      setBusy(null);
    }
  };

  useEffect(() => {
    if (open) refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, client]);

  const handleTest = async () => {
    setBusy('test');
    setError(null);
    try {
      await testConnection(form, form.password, authedClient);
      setError('✓ Connection succeeded.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Connection failed.');
    } finally {
      setBusy(null);
    }
  };

  const handleSave = async () => {
    setBusy('save');
    setError(null);
    try {
      const id = await saveConnection(form, form.password, authedClient);
      setForm(EMPTY_FORM);
      setShowNewForm(false);
      await refresh();
      setSelectedId(id);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save connection.');
    } finally {
      setBusy(null);
    }
  };

  const handleRun = async () => {
    if (!selectedId) return;
    setBusy('run');
    setError(null);
    try {
      const series = await runWarehouseQuery(selectedId, sql, authedClient);
      onApply(series, { connectionId: selectedId, sql });
      onOpenChange(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Query failed.');
    } finally {
      setBusy(null);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteConnection(id, authedClient);
      if (selectedId === id) setSelectedId('');
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete.');
    }
  };

  const set = (key: keyof typeof form, value: string | number | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Query a Warehouse
          </DialogTitle>
          <DialogDescription>
            Run SQL against a saved connection. Return columns aliased{' '}
            <code>period</code> and <code>value</code>. Replaces current data.
          </DialogDescription>
        </DialogHeader>

        {!client && (
          <p className="text-sm text-muted-foreground">
            Sign in to use warehouse connections.
          </p>
        )}

        <div className="space-y-4">
          {/* Connection picker */}
          {connections.length > 0 && (
            <div className="space-y-2">
              <Label>Connection</Label>
              <div className="flex items-center gap-2">
                <Select value={selectedId} onValueChange={setSelectedId}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Pick a connection" />
                  </SelectTrigger>
                  <SelectContent>
                    {connections.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name} ({c.host}/{c.database})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedId && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(selectedId)}
                    title="Delete connection"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* New-connection form */}
          {client && !showNewForm && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowNewForm(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              New connection
            </Button>
          )}

          {showNewForm && (
            <div className="space-y-3 rounded-lg border p-3">
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                />
                <Input
                  placeholder="Database"
                  value={form.database}
                  onChange={(e) => set('database', e.target.value)}
                />
                <Input
                  placeholder="Host"
                  value={form.host}
                  onChange={(e) => set('host', e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Port"
                  value={form.port}
                  onChange={(e) => set('port', parseInt(e.target.value) || 5432)}
                />
                <Input
                  placeholder="Username"
                  value={form.username}
                  onChange={(e) => set('username', e.target.value)}
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) => set('password', e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleTest}
                  disabled={busy !== null}
                >
                  {busy === 'test' && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  Test
                </Button>
                <Button size="sm" onClick={handleSave} disabled={busy !== null}>
                  {busy === 'save' && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  Save
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNewForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* SQL */}
          {connections.length > 0 && (
            <div className="space-y-2">
              <Label>SQL</Label>
              <Textarea
                value={sql}
                onChange={(e) => setSql(e.target.value)}
                className="min-h-28 font-mono text-sm"
              />
            </div>
          )}

          {error && (
            <p
              className={
                error.startsWith('✓')
                  ? 'text-sm text-green-600'
                  : 'text-sm text-destructive'
              }
            >
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleRun}
              disabled={!selectedId || busy !== null}
            >
              {busy === 'run' && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Run &amp; bind
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
