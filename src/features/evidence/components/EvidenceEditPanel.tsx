// Side-panel evidence editor: write into an evidence item without leaving the
// canvas. Docks into the shared right slot (DockPanel) with title/meta fields
// and the EditorJS notebook, auto-saving as you type. "View full" remains for
// the immersive full-page notebook.
import { useEvidenceStore } from '@/features/evidence/stores/useEvidenceStore';
import {
  DockPanel,
} from '@/features/canvas/components/dock';
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
} from '@/shared/lib/editorjs-config';
import type { EvidenceItem } from '@/shared/types';
import type EditorJS from '@editorjs/editorjs';
import EvidenceLinkChips from './EvidenceLinkChips';
import { FileText } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const EVIDENCE_TYPES = [
  'Experiment',
  'Analysis',
  'Notebook',
  'External Research',
  'User Interview',
] as const;

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

  const save = (updates: Partial<EvidenceItem>) => {
    if (!evidence) return;
    updateEvidence(evidence.id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    } as Partial<EvidenceItem>);
    setSaveState('saved');
  };

  // EditorJS lifecycle — init when the panel opens, tear down on close.
  useEffect(() => {
    if (!open || !holderRef.current || editorRef.current) return;
    let destroyed = false;
    const editor = createEditorJSInstance({
      holder: holderRef.current,
      data: validateAndMigrateEditorData(evidence?.content),
      placeholder: 'Write your analysis…',
      minHeight: 180,
      onChange: () => {
        setSaveState('saving');
        if (saveTimer.current) clearTimeout(saveTimer.current);
        saveTimer.current = setTimeout(async () => {
          try {
            const data = await editorRef.current?.save();
            if (!destroyed && data) save({ content: data } as any);
          } catch (e) {
            console.error('Evidence editor save failed', e);
          }
        }, 800);
      },
    });
    editorRef.current = editor;
    return () => {
      destroyed = true;
      if (saveTimer.current) clearTimeout(saveTimer.current);
      try {
        editorRef.current?.destroy?.();
      } catch {
        /* editor may not have finished initializing */
      }
      editorRef.current = null;
    };
    // Re-init only per item/panel-open — content changes flow through the editor.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, evidenceId]);

  if (!evidence) return null;

  return (
    <DockPanel
      open={open}
      width="lg"
      icon={<FileText className="h-4 w-4" />}
      eyebrow="Evidence"
      title={evidence.title || 'Untitled evidence'}
      subtitle={
        saveState === 'saving'
          ? 'Saving…'
          : saveState === 'saved'
            ? 'All changes saved'
            : undefined
      }
      onClose={onClose}
    >
      <div className="space-y-4">
        <EvidenceLinkChips evidence={evidence} />
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 space-y-1.5">
            <Label className="text-xs text-muted-foreground">Title</Label>
            <Input
              value={evidence.title}
              onChange={(e) => save({ title: e.target.value })}
              placeholder="Evidence title…"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Type</Label>
            <Select
              value={evidence.type}
              onValueChange={(v) => save({ type: v as EvidenceItem['type'] })}
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

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Content</Label>
          <div
            ref={holderRef}
            className="min-h-[200px] rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
      </div>
    </DockPanel>
  );
}

export default EvidenceEditPanel;
