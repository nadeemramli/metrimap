// Custom EditorJS block: /evidence — link to another evidence item (CVS-34 slice
// 4.5). Stores the evidence id + a title snapshot; resolves live from the evidence
// store. Plain DOM.
import { useEvidenceStore, useCanvasStore } from '@/lib/stores';

interface EvidenceLinkData {
  evidenceId: string;
  title?: string;
}

interface BlockToolArgs {
  data: Partial<EvidenceLinkData>;
  readOnly?: boolean;
}

function items(): any[] {
  return useEvidenceStore.getState().evidence ?? [];
}

export default class EvidenceLinkBlock {
  static get toolbox() {
    return {
      title: 'Evidence',
      icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h11l5 5v11H4z"/><path d="M15 4v5h5"/></svg>',
    };
  }
  static get isReadOnlySupported() {
    return true;
  }
  static get sanitize() {
    return { evidenceId: false, title: false };
  }

  private data: EvidenceLinkData;
  private readOnly: boolean;
  private wrapper: HTMLElement | null = null;

  constructor({ data, readOnly }: BlockToolArgs) {
    this.data = { evidenceId: data?.evidenceId ?? '', title: data?.title };
    this.readOnly = Boolean(readOnly);
  }

  private rebuild() {
    if (!this.wrapper) return;
    this.wrapper.innerHTML = '';
    this.wrapper.appendChild(
      !this.readOnly && !this.data.evidenceId
        ? this.renderPicker()
        : this.renderChip()
    );
  }

  private renderPicker(): HTMLElement {
    const list = items();
    const box = document.createElement('div');
    box.style.cssText =
      'padding:8px;border:1px dashed #cbd5e1;border-radius:8px;background:#f8fafc;';
    if (list.length === 0) {
      box.textContent = 'No other evidence to link.';
      box.style.cssText += 'color:#94a3b8;font-size:13px;';
      return box;
    }
    const select = document.createElement('select');
    select.style.cssText =
      'width:100%;padding:6px 8px;border:1px solid #e2e8f0;border-radius:6px;font-size:14px;background:#fff;';
    const ph = document.createElement('option');
    ph.value = '';
    ph.textContent = 'Link evidence…';
    select.appendChild(ph);
    list.forEach((e: any) => {
      const o = document.createElement('option');
      o.value = e.id;
      o.textContent = e.title || 'Untitled evidence';
      select.appendChild(o);
    });
    select.onchange = () => {
      const e = list.find((x: any) => x.id === select.value);
      if (e) {
        this.data = { evidenceId: e.id, title: e.title };
        this.rebuild();
      }
    };
    box.appendChild(select);
    return box;
  }

  private renderChip(): HTMLElement {
    const live = items().find((e: any) => e.id === this.data.evidenceId) as any;
    const title = live?.title || this.data.title || 'Untitled evidence';
    const projectId = useCanvasStore.getState().canvas?.id;

    const chip = document.createElement(this.readOnly ? 'a' : 'div');
    chip.style.cssText =
      'display:inline-flex;align-items:center;gap:8px;padding:6px 10px;border:1px solid #e2e8f0;border-radius:8px;background:#fff;font-size:14px;color:#0f172a;text-decoration:none;';
    if (this.readOnly) {
      (chip as HTMLAnchorElement).href = projectId
        ? `/canvas/${projectId}/evidence/${this.data.evidenceId}`
        : `/evidence/${this.data.evidenceId}`;
    }
    const icon = document.createElement('span');
    icon.textContent = '📄';
    chip.appendChild(icon);
    const t = document.createElement('span');
    t.style.fontWeight = '600';
    t.textContent = title;
    chip.appendChild(t);

    if (!this.readOnly) {
      const change = document.createElement('button');
      change.type = 'button';
      change.textContent = 'change';
      change.style.cssText =
        'margin-left:4px;font-size:11px;color:#94a3b8;background:none;border:none;cursor:pointer;';
      change.onclick = (ev) => {
        ev.preventDefault();
        this.data = { evidenceId: '' };
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

  save(): EvidenceLinkData {
    return this.data;
  }
}
