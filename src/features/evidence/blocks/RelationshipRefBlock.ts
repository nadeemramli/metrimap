// Custom EditorJS block: /relationship — embed a reference to a relationship/edge
// (CVS-34 slice 4.2). Stores the relationship id + a snapshot (endpoints/type/
// confidence) so it survives deletion; resolves live from the canvas store.
import { useCanvasStore } from '@/lib/stores';

interface RelationshipRefData {
  relationshipId: string;
  source?: string;
  target?: string;
  type?: string;
  confidence?: string;
}

interface BlockToolArgs {
  data: Partial<RelationshipRefData>;
  readOnly?: boolean;
}

function edges(): any[] {
  return useCanvasStore.getState().canvas?.edges ?? [];
}
function nodeTitle(id: string): string {
  const n = (useCanvasStore.getState().canvas?.nodes ?? []).find(
    (c: any) => c.id === id
  ) as any;
  return n?.title || 'Unknown';
}

export default class RelationshipRefBlock {
  static get toolbox() {
    return {
      title: 'Relationship',
      icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="5" cy="12" r="2.5"/><circle cx="19" cy="12" r="2.5"/><path d="M7.5 12h9"/></svg>',
    };
  }

  static get isReadOnlySupported() {
    return true;
  }

  static get sanitize() {
    return {
      relationshipId: false,
      source: false,
      target: false,
      type: false,
      confidence: false,
    };
  }

  private data: RelationshipRefData;
  private readOnly: boolean;
  private wrapper: HTMLElement | null = null;

  constructor({ data, readOnly }: BlockToolArgs) {
    this.data = { relationshipId: data?.relationshipId ?? '', ...data };
    this.readOnly = Boolean(readOnly);
  }

  private rebuild() {
    if (!this.wrapper) return;
    this.wrapper.innerHTML = '';
    this.wrapper.appendChild(
      !this.readOnly && !this.data.relationshipId
        ? this.renderPicker()
        : this.renderChip()
    );
  }

  private renderPicker(): HTMLElement {
    const list = edges();
    const box = document.createElement('div');
    box.style.cssText =
      'padding:8px;border:1px dashed #cbd5e1;border-radius:8px;background:#f8fafc;';
    if (list.length === 0) {
      box.textContent = 'No relationships on this canvas to reference.';
      box.style.cssText += 'color:#94a3b8;font-size:13px;';
      return box;
    }
    const select = document.createElement('select');
    select.style.cssText =
      'width:100%;padding:6px 8px;border:1px solid #e2e8f0;border-radius:6px;font-size:14px;background:#fff;';
    const ph = document.createElement('option');
    ph.value = '';
    ph.textContent = 'Select a relationship…';
    select.appendChild(ph);
    list.forEach((e: any) => {
      const opt = document.createElement('option');
      opt.value = e.id;
      opt.textContent = `${nodeTitle(e.sourceId)} → ${nodeTitle(e.targetId)}`;
      select.appendChild(opt);
    });
    select.onchange = () => {
      const e = list.find((x: any) => x.id === select.value);
      if (e) {
        this.data = {
          relationshipId: e.id,
          source: nodeTitle(e.sourceId),
          target: nodeTitle(e.targetId),
          type: e.type,
          confidence: e.confidence,
        };
        this.rebuild();
      }
    };
    box.appendChild(select);
    return box;
  }

  private renderChip(): HTMLElement {
    const live = edges().find(
      (e: any) => e.id === this.data.relationshipId
    ) as any;
    const source = live ? nodeTitle(live.sourceId) : this.data.source || '—';
    const target = live ? nodeTitle(live.targetId) : this.data.target || '—';
    const type = live?.type || this.data.type || '';
    const confidence = live?.confidence || this.data.confidence || '';

    const chip = document.createElement('div');
    chip.style.cssText =
      'display:inline-flex;align-items:center;gap:8px;padding:6px 10px;border:1px solid #e2e8f0;border-radius:8px;background:#fff;font-size:14px;color:#0f172a;';

    const flow = document.createElement('span');
    flow.style.fontWeight = '600';
    flow.textContent = `${source} → ${target}`;
    chip.appendChild(flow);

    if (type) {
      const t = document.createElement('span');
      t.textContent = type;
      t.style.cssText =
        'font-size:11px;color:#64748b;background:#f1f5f9;padding:1px 6px;border-radius:9999px;';
      chip.appendChild(t);
    }
    if (confidence) {
      const c = document.createElement('span');
      c.textContent = confidence;
      c.style.cssText =
        'font-size:11px;color:#0369a1;background:#e0f2fe;padding:1px 6px;border-radius:9999px;';
      chip.appendChild(c);
    }
    if (!this.readOnly) {
      const change = document.createElement('button');
      change.type = 'button';
      change.textContent = 'change';
      change.style.cssText =
        'margin-left:4px;font-size:11px;color:#94a3b8;background:none;border:none;cursor:pointer;';
      change.onclick = (ev) => {
        ev.preventDefault();
        this.data = { relationshipId: '' };
        this.rebuild();
      };
      chip.appendChild(change);
    }
    return chip;
  }

  render(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.style.margin = '6px 0';
    this.wrapper = wrapper;
    this.rebuild();
    return wrapper;
  }

  save(): RelationshipRefData {
    return this.data;
  }
}
