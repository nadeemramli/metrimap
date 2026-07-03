import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Bell, Loader2, Plus, Trash2, TriangleAlert } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Switch } from '@/shared/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { useClerkSupabase } from '@/shared/hooks/useClerkSupabase';
import { useCanvasStore } from '@/lib/stores';
import { useAlertRulesStore } from '@/features/canvas/stores/useAlertRulesStore';
import {
  createAlertRule,
  deleteAlertRule,
  describeRule,
  listAlertRules,
  updateAlertRule,
  type AlertConfig,
  type AlertRule,
  type AlertRuleType,
  type Comparator,
} from '@/shared/lib/supabase/services/alertRules';

interface AlertsTabProps {
  cardId: string;
}

const emptyDraft = {
  ruleType: 'threshold' as AlertRuleType,
  comparator: 'gt' as Comparator,
  value: '',
  direction: 'down' as 'up' | 'down',
  pct: '',
  min: '',
  max: '',
};

export default function AlertsTab({ cardId }: AlertsTabProps) {
  const client = useClerkSupabase();
  const projectId = useCanvasStore((s) => s.canvas?.id);
  const [rules, setRules] = useState<AlertRule[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState({ ...emptyDraft });

  const load = useCallback(async () => {
    if (!client) return;
    setLoading(true);
    try {
      setRules(await listAlertRules(cardId, client));
    } catch (e) {
      console.error('Failed to load alert rules', e);
    } finally {
      setLoading(false);
    }
  }, [client, cardId]);

  useEffect(() => {
    void load();
  }, [load]);

  const buildConfig = (): AlertConfig | null => {
    if (draft.ruleType === 'threshold') {
      const value = parseFloat(draft.value);
      if (Number.isNaN(value)) return null;
      return { comparator: draft.comparator, value };
    }
    if (draft.ruleType === 'change') {
      const pct = parseFloat(draft.pct);
      if (Number.isNaN(pct)) return null;
      return { direction: draft.direction, pct: Math.abs(pct) };
    }
    const min = parseFloat(draft.min);
    const max = parseFloat(draft.max);
    if (Number.isNaN(min) || Number.isNaN(max) || min > max) return null;
    return { min, max };
  };

  const addRule = async () => {
    if (!client || !projectId) return;
    const config = buildConfig();
    if (!config) {
      toast.error('Enter valid numbers for the rule');
      return;
    }
    setBusy(true);
    try {
      const rule = await createAlertRule(
        { projectId, cardId, ruleType: draft.ruleType, config },
        client
      );
      setRules((prev) => [...prev, rule]);
      useAlertRulesStore.getState().upsertLocal(rule);
      setDraft({ ...emptyDraft });
      toast.success('Alert rule added');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to add rule');
    } finally {
      setBusy(false);
    }
  };

  const toggle = async (rule: AlertRule) => {
    const next = !rule.enabled;
    setRules((prev) =>
      prev.map((r) => (r.id === rule.id ? { ...r, enabled: next } : r))
    );
    useAlertRulesStore.getState().setEnabledLocal(rule.card_id, rule.id, next);
    try {
      await updateAlertRule(rule.id, { enabled: next }, client ?? undefined);
    } catch {
      setRules((prev) =>
        prev.map((r) => (r.id === rule.id ? { ...r, enabled: rule.enabled } : r))
      );
      toast.error('Failed to update rule');
    }
  };

  const remove = async (rule: AlertRule) => {
    setRules((prev) => prev.filter((r) => r.id !== rule.id));
    useAlertRulesStore.getState().removeLocal(rule.card_id, rule.id);
    try {
      await deleteAlertRule(rule.id, client ?? undefined);
    } catch {
      toast.error('Failed to delete rule');
      void load();
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="flex items-center gap-2 text-lg font-medium">
          <Bell className="h-4 w-4" /> Alerts
        </h3>
        <p className="text-sm text-muted-foreground">
          Get notified when this metric's latest value crosses a threshold,
          moves sharply, or leaves a healthy range. Checked when the value
          changes.
        </p>
      </div>

      {/* Existing rules */}
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      ) : rules.length === 0 ? (
        <p className="text-sm text-muted-foreground/70">No alerts yet.</p>
      ) : (
        <div className="space-y-2">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="flex items-center gap-3 rounded-md border border-border px-3 py-2"
            >
              <TriangleAlert
                className={`h-4 w-4 shrink-0 ${rule.enabled ? 'text-amber-500' : 'text-muted-foreground/40'}`}
              />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium">{describeRule(rule)}</div>
                {rule.last_triggered_at && (
                  <div className="text-[11px] text-muted-foreground">
                    Last fired{' '}
                    {new Date(rule.last_triggered_at).toLocaleString()} at{' '}
                    {rule.last_triggered_value}
                  </div>
                )}
              </div>
              <Switch
                checked={rule.enabled}
                onCheckedChange={() => void toggle(rule)}
              />
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                onClick={() => void remove(rule)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Add rule */}
      <div className="space-y-3 rounded-md border border-dashed border-border p-3">
        <Select
          value={draft.ruleType}
          onValueChange={(v) =>
            setDraft((d) => ({ ...d, ruleType: v as AlertRuleType }))
          }
        >
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="threshold">Value threshold</SelectItem>
            <SelectItem value="change">Sharp change (%)</SelectItem>
            <SelectItem value="band">Outside a range</SelectItem>
          </SelectContent>
        </Select>

        {draft.ruleType === 'threshold' && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Alert when value</span>
            <Select
              value={draft.comparator}
              onValueChange={(v) =>
                setDraft((d) => ({ ...d, comparator: v as Comparator }))
              }
            >
              <SelectTrigger className="h-9 w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gt">&gt;</SelectItem>
                <SelectItem value="gte">&ge;</SelectItem>
                <SelectItem value="lt">&lt;</SelectItem>
                <SelectItem value="lte">&le;</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              className="h-9 w-32"
              placeholder="100"
              value={draft.value}
              onChange={(e) => setDraft((d) => ({ ...d, value: e.target.value }))}
            />
          </div>
        )}

        {draft.ruleType === 'change' && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Alert when it</span>
            <Select
              value={draft.direction}
              onValueChange={(v) =>
                setDraft((d) => ({ ...d, direction: v as 'up' | 'down' }))
              }
            >
              <SelectTrigger className="h-9 w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="down">drops</SelectItem>
                <SelectItem value="up">rises</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">by ≥</span>
            <Input
              type="number"
              className="h-9 w-24"
              placeholder="10"
              value={draft.pct}
              onChange={(e) => setDraft((d) => ({ ...d, pct: e.target.value }))}
            />
            <span className="text-sm text-muted-foreground">%</span>
          </div>
        )}

        {draft.ruleType === 'band' && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Healthy range</span>
            <Input
              type="number"
              className="h-9 w-24"
              placeholder="min"
              value={draft.min}
              onChange={(e) => setDraft((d) => ({ ...d, min: e.target.value }))}
            />
            <span className="text-sm text-muted-foreground">to</span>
            <Input
              type="number"
              className="h-9 w-24"
              placeholder="max"
              value={draft.max}
              onChange={(e) => setDraft((d) => ({ ...d, max: e.target.value }))}
            />
          </div>
        )}

        <Button
          size="sm"
          className="gap-1"
          disabled={busy || !projectId}
          onClick={() => void addRule()}
        >
          <Plus className="h-3.5 w-3.5" />
          Add alert
        </Button>
      </div>
    </div>
  );
}
