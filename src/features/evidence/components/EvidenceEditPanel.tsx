// Side-panel evidence notepad: write into an evidence item without leaving
// the canvas. Docks into the shared right slot (DockPanel) as a wide,
// resizable notebook — full EditorJS block set, collapsed metadata, and
// autosave (with a flush on close so the last keystrokes are never lost).
// "View full" remains for the immersive full-page notebook.
import { useEvidenceStore } from '@/features/evidence/stores/useEvidenceStore';
import {
  DockPanel,
  clampDockWidth,
  dockMaxWidth,
  saveDockWidth,
} from '@/features/canvas/components/dock';
import { useCanvasPanelStore } from '@/features/canvas/stores/useCanvasPanelStore';
import { Button } from '@/shared/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shared/components/ui/collapsible';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import {
  createEditorJSInstance,
  validateAndMigrateEditorData,
} from '@/lib/editorjs-config';
import type { EvidenceItem } from '@/shared/types';
import type EditorJS from '@editorjs/editorjs';
import type { OutputData } from '@editorjs/editorjs';
import EvidenceLinkChips from './EvidenceLinkChips';
import { ChevronDown, FileText } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const EVIDENCE_TYPES = [
  'Experiment',
  'Analysis',
  'Notebook',
  'External Research',
  'User Interview',
] as const;

const WIDTH_PRESETS = [
  { label: 'Narrow', px: 480 },
  { label: 'Wide', px: 720 },
] as const;

const WIDTH_STORAGE_KEY = 'evidenceEdit';

/** Rough word count over the text-bearing block fields. */
function countWords(data: OutputData | undefined): number {
  if (!data?.blocks) return 0;
  let text = '';
  for (const block of data.blocks) {
    const d = (block.data ?? {}) as Record<string, unknown>;
    for (const field of ['text', 'message', 'caption', 'title', 'code']) {
      if (typeof d[field] === 'string') text += ` ${d[field]}`;
    }
    if (Array.isArray(d.items)) {
      for (const item of d.items) {
        if (typeof item === 'string') text += ` ${item}`;
        else if (item && typeof item === 'object') {
          const it = item as Record<string, unknown>;
          if (typeof it.text === 'string') text += ` ${it.text}`;
          if (typeof it.content === 'string') text += ` ${it.content}`;
        }
      }
    }
  }
  const plain = text
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .trim();
  return plain ? plain.split(/\s+/).length : 0;
}

function persistContent(evidenceId: string, data: OutputData) {
  useEvidenceStore.getState().updateEvidence(evidenceId, {
    content: data,
    updatedAt: new Date().toISOString(),
  } as Partial<EvidenceItem>);
}

interface EvidenceEditPanelProps {
  evidenceId: string;
  open: boolean;
  onClose: () => void;
}

export function EvidenceEditPanel({
  evidenceId,
  open,
  onClose,
}: EvidenceEditPanelProps) {
  const evidence = useEvidenceStore((s) =>
    s.evidence.find((e) => e.id === evidenceId)
  );
  const updateEvidence = useEvidenceStore((s) => s.updateEvidence);

  const editorRef = useRef<EditorJS | null>(null);
  const holderRef = useRef<HTMLDivElement>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>(
    'idle'
  );
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [wordCount, setWordCount] = useState<number>(() =>
    countWords(evidence?.content as OutputData | undefined)
  );
  const [detailsOpen, setDetailsOpen] = useState(false);

  const save = (updates: Partial<EvidenceItem>) => {
    if (!evidence) return;
    updateEvidence(evidence.id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    } as Partial<EvidenceItem>);
    setSaveState('saved');
    setLastSavedAt(new Date());
  };

  const applyWidth = (px: number) => {
    const clamped = clampDockWidth(px);
    useCanvasPanelStore.getState().setPanelWidth('right', clamped);
    saveDockWidth(WIDTH_STORAGE_KEY, clamped);
  };

  // EditorJS lifecycle — init when the panel opens; on close/switch, flush
  // any pending debounced content for THIS item before tearing down.
  useEffect(() => {
    if (!open || !holderRef.current || editorRef.current) return;
    const itemId = evidenceId;
    let destroyed = false;
    const editor = createEditorJSInstance({
      holder: holderRef.current,
      data: validateAndMigrateEditorData(
        useEvidenceStore.getState().evidence.find((e) => e.id === itemId)
          ?.content
      ),
      placeholder: 'Write your analysis…',
      minHeight: 240,
      onChange: () => {
        setSaveState('saving');
        if (saveTimer.current) clearTimeout(saveTimer.current);
        saveTimer.current = setTimeout(async () => {
          try {
            const data = await editorRef.current?.save();
            if (!destroyed && data) {
              persistContent(itemId, data);
              setWordCount(countWords(data));
              setSaveState('saved');
              setLastSavedAt(new Date());
            }
          } catch (e) {
            console.error('Evidence editor save failed', e);
          }
        }, 800);
      },
    });
    editorRef.current = editor;
    return () => {
      destroyed = true;
      const hadPendingSave = saveTimer.current !== null;
      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
        saveTimer.current = null;
      }
      const closingEditor = editorRef.current;
      editorRef.current = null;
      // Flush-then-destroy: without this, anything typed in the last 800ms
      // debounce window is silently dropped on close.
      void (async () => {
        try {
          if (hadPendingSave && closingEditor) {
            const data = await closingEditor.save();
            if (data) persistContent(itemId, data);
          }
        } catch {
          /* editor may not have finished initializing */
        }
        try {
          closingEditor?.destroy?.();
        } catch {
          /* already torn down */
        }
      })();
    };
    // Re-init only per item/panel-open — content changes flow through the editor.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, evidenceId]);

  if (!evidence) return null;

  return (
    <DockPanel
      open={open}
      width="xl"
      widthStorageKey={WIDTH_STORAGE_KEY}
      icon={<FileText className="h-4 w-4" />}
      eyebrow="Evidence"
      title={evidence.title || 'Untitled evidence'}
      headerActions={
        <div className="mr-1 hidden items-center gap-0.5 rounded-md border border-border p-0.5 sm:flex">
          {WIDTH_PRESETS.map((p) => (
            <Button
              key={p.label}
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-[11px] text-muted-foreground hover:text-foreground"
              onClick={() => applyWidth(p.px)}
            >
              {p.label}
            </Button>
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-[11px] text-muted-foreground hover:text-foreground"
            onClick={() => applyWidth(dockMaxWidth())}
          >
            Max
          </Button>
        </div>
      }
      footer={
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {wordCount} {wordCount === 1 ? 'word' : 'words'}
          </span>
          <span>
            {saveState === 'saving'
              ? 'Saving…'
              : lastSavedAt
                ? `Saved ${lastSavedAt.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}`
                : 'All changes saved'}
          </span>
        </div>
      }
      onClose={onClose}
    >
      <div className="mx-auto w-full max-w-[70ch] space-y-3">
        <Input
          value={evidence.title}
          onChange={(e) => save({ title: e.target.value })}
          placeholder="Untitled evidence"
          className="h-auto border-0 bg-transparent px-0 text-xl font-semibold shadow-none focus-visible:ring-0"
          aria-label="Evidence title"
        />

        <Collapsible open={detailsOpen} onOpenChange={setDetailsOpen}>
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${detailsOpen ? '' : '-rotate-90'}`}
              />
              Details
              <span className="ml-1 font-normal">
                {evidence.type} · {evidence.date}
              </span>
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-3 space-y-4 rounded-md border border-border bg-muted/30 p-3">
              <EvidenceLinkChips evidence={evidence} />
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Type</Label>
                  <Select
                    value={evidence.type}
                    onValueChange={(v) =>
                      save({ type: v as EvidenceItem['type'] })
                    }
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EVIDENCE_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Date</Label>
                  <Input
                    type="date"
                    className="h-9"
                    value={evidence.date}
                    onChange={(e) => save({ date: e.target.value })}
                  />
                </div>
                <div className="col-span-2 space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    External link
                  </Label>
                  <Input
                    value={evidence.link || ''}
                    onChange={(e) => save({ link: e.target.value })}
                    placeholder="https://…"
                  />
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <div ref={holderRef} className="min-h-[60vh] pb-8 text-sm" />
      </div>
    </DockPanel>
  );
}

export default EvidenceEditPanel;
