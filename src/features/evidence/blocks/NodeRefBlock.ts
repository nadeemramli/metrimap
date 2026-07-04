// Custom EditorJS block: /node — embed a reference to a metric card/node (CVS-34
// slice 4.1). Stores the card id + a snapshot (title/category) so it still renders
// if the card is later deleted; resolves live from the canvas store when present.
// Plain DOM; reads the store via getState() (works outside React).
import { useCanvasStore } from '@/lib/stores';

interface NodeRefData {
  cardId: string;
  title?: string;
  category?: string;
}

interface BlockToolArgs {
  data: Partial<NodeRefData>;
  readOnly?: boolean;
}

function cards() {
  return useCanvasStore.getState().canvas?.nodes ?? [];
}

export default class NodeRefBlock {
  static get toolbox() {
    return {
      title: 'Node',
      icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="8" width="18" height="8" rx="2"/><path d="M7 12h.01M11 12h6"/></svg>',
    };
  }

  static get isReadOnlySupported() {
    return true;
  }

  static get sanitize() {
    return { cardId: false, title: false, category: false };
  }

  private data: NodeRefData;
  private readOnly: boolean;
  private wrapper: HTMLElement | null = null;

  constructor({ data, readOnly }: BlockToolArgs) {
    this.data = {
      cardId: data?.cardId ?? '',
      title: data?.title,
      category: data?.category,
    };
    this.readOnly = Boolean(readOnly);
  }

  private rebuild() {
    if (!this.wrapper) return;
    this.wrapper.innerHTML = '';
    if (!this.readOnly && !this.data.cardId) {
      this.wrapper.appendChild(this.renderPicker());
    } else {
      this.wrapper.appendChild(this.renderChip());
    }
  }

  private renderPicker(): HTMLElement {
    const list = cards();
    const box = document.createElement('div');
    box.style.cssText =
      'padding:8px;border:1px dashed #cbd5e1;border-radius:8px;background:#f8fafc;';
    if (list.length === 0) {
      box.textContent = 'No nodes on this canvas to reference.';
      box.style.color = '#94a3b8';
      box.style.fontSize = '13px';
      return box;
    }
    const label = document.createElement('div');
    label.textContent = 'Reference a node';
    label.style.cssText =
      'font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:#94a3b8;margin-bottom:4px;';
    box.appendChild(label);

    const select = document.createElement('select');
    select.style.cssText =
      'width:100%;padding:6px 8px;border:1px solid #e2e8f0;border-radius:6px;font-size:14px;background:#fff;';
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Select a node…';
    select.appendChild(placeholder);
    list.forEach((c: any) => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = c.title || 'Untitled';
      select.appendChild(opt);
    });
    select.onchange = () => {
      const card = list.find((c: any) => c.id === select.value);
      if (card) {
        this.data = {
          cardId: card.id,
          title: (card as any).title,
          category: (card as any).category,
        };
        this.rebuild();
      }
    };
    box.appendChild(select);
    return box;
  }

  private renderChip(): HTMLElement {
    const live = cards().find((c: any) => c.id === this.data.cardId) as any;
    const title = live?.title || this.data.title || 'Unknown node';
    const category = live?.category || this.data.category || 'Node';
    const projectId = useCanvasStore.getState().canvas?.id;

    const chip = document.createElement(this.readOnly ? 'a' : 'div');
    chip.className = 'cm-node-ref';
    chip.style.cssText =
      'display:inline-flex;align-items:center;gap:8px;padding:6px 10px;border:1px solid #e2e8f0;border-radius:8px;background:#fff;font-size:14px;color:#0f172a;text-decoration:none;max-width:100%;';
    if (this.readOnly && projectId) {
      (chip as HTMLAnchorElement).href = `/canvas/${projectId}?focus=card:${this.data.cardId}`;
    }

    const dot = document.createElement('span');
    dot.style.cssText =
      'width:8px;height:8px;border-radius:9999px;background:#6366f1;flex:0 0 auto;';
    chip.appendChild(dot);

    const text = document.createElement('span');
    text.style.cssText = 'font-weight:600;';
    text.textContent = title;
    chip.appendChild(text);

    const cat = document.createElement('span');
    cat.textContent = category;
    cat.style.cssText =
      'font-size:11px;color:#64748b;background:#f1f5f9;padding:1px 6px;border-radius:9999px;';
    chip.appendChild(cat);

    if (!this.readOnly) {
      const change = document.createElement('button');
      change.type = 'button';
      change.textContent = 'change';
      change.style.cssText =
        'margin-left:4px;font-size:11px;color:#94a3b8;background:none;border:none;cursor:pointer;';
      change.onclick = (e) => {
        e.preventDefault();
        this.data = { cardId: '' };
        this.rebuild();
      };
      chip.appendChild(change);
    }
    return chip;
  }

  render(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'cm-node-ref-block';
    wrapper.style.cssText = 'margin:6px 0;';
    this.wrapper = wrapper;
    this.rebuild();
    return wrapper;
  }

  save(): NodeRefData {
    return this.data;
  }
}
