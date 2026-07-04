// Custom EditorJS block: /metric — embed a metric card's current value (CVS-34
// slice 4.2). Stores cardId + a snapshot of the latest value/trend; resolves the
// live latest value from the canvas store (card.data: MetricValue[]) when present.
import { useCanvasStore } from '@/lib/stores';

interface MetricRefData {
  cardId: string;
  title?: string;
  value?: number;
  trend?: string;
  period?: string;
}

interface BlockToolArgs {
  data: Partial<MetricRefData>;
  readOnly?: boolean;
}

function nodes(): any[] {
  return useCanvasStore.getState().canvas?.nodes ?? [];
}
function latest(card: any): { value?: number; trend?: string; period?: string } {
  const arr = (card?.data ?? []) as any[];
  return arr.length ? arr[arr.length - 1] : {};
}
const TREND: Record<string, string> = { up: '▲', down: '▼', neutral: '—' };

export default class MetricRefBlock {
  static get toolbox() {
    return {
      title: 'Metric',
      icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 17l6-6 4 4 7-7"/></svg>',
    };
  }

  static get isReadOnlySupported() {
    return true;
  }

  static get sanitize() {
    return {
      cardId: false,
      title: false,
      value: false,
      trend: false,
      period: false,
    };
  }

  private data: MetricRefData;
  private readOnly: boolean;
  private wrapper: HTMLElement | null = null;

  constructor({ data, readOnly }: BlockToolArgs) {
    this.data = { cardId: data?.cardId ?? '', ...data };
    this.readOnly = Boolean(readOnly);
  }

  private rebuild() {
    if (!this.wrapper) return;
    this.wrapper.innerHTML = '';
    this.wrapper.appendChild(
      !this.readOnly && !this.data.cardId
        ? this.renderPicker()
        : this.renderChip()
    );
  }

  private renderPicker(): HTMLElement {
    const list = nodes();
    const box = document.createElement('div');
    box.style.cssText =
      'padding:8px;border:1px dashed #cbd5e1;border-radius:8px;background:#f8fafc;';
    if (list.length === 0) {
      box.textContent = 'No metric cards on this canvas to reference.';
      box.style.cssText += 'color:#94a3b8;font-size:13px;';
      return box;
    }
    const select = document.createElement('select');
    select.style.cssText =
      'width:100%;padding:6px 8px;border:1px solid #e2e8f0;border-radius:6px;font-size:14px;background:#fff;';
    const ph = document.createElement('option');
    ph.value = '';
    ph.textContent = 'Select a metric…';
    select.appendChild(ph);
    list.forEach((c: any) => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = c.title || 'Untitled';
      select.appendChild(opt);
    });
    select.onchange = () => {
      const c = list.find((x: any) => x.id === select.value);
      if (c) {
        const l = latest(c);
        this.data = {
          cardId: c.id,
          title: c.title,
          value: l.value,
          trend: l.trend,
          period: l.period,
        };
        this.rebuild();
      }
    };
    box.appendChild(select);
    return box;
  }

  private renderChip(): HTMLElement {
    const live = nodes().find((c: any) => c.id === this.data.cardId) as any;
    const l = live ? latest(live) : {};
    const title = live?.title || this.data.title || 'Unknown metric';
    const value = l.value ?? this.data.value;
    const trend = l.trend || this.data.trend;

    const chip = document.createElement('div');
    chip.style.cssText =
      'display:inline-flex;align-items:baseline;gap:8px;padding:6px 12px;border:1px solid #e2e8f0;border-radius:8px;background:#fff;font-size:14px;color:#0f172a;';

    const name = document.createElement('span');
    name.textContent = title;
    name.style.color = '#64748b';
    chip.appendChild(name);

    const val = document.createElement('span');
    val.style.cssText = 'font-weight:700;font-size:16px;';
    val.textContent =
      value === undefined || value === null
        ? '—'
        : value.toLocaleString();
    chip.appendChild(val);

    if (trend && TREND[trend]) {
      const tr = document.createElement('span');
      tr.textContent = TREND[trend];
      tr.style.color =
        trend === 'up' ? '#16a34a' : trend === 'down' ? '#dc2626' : '#94a3b8';
      chip.appendChild(tr);
    }
    if (!this.readOnly) {
      const change = document.createElement('button');
      change.type = 'button';
      change.textContent = 'change';
      change.style.cssText =
        'margin-left:4px;font-size:11px;color:#94a3b8;background:none;border:none;cursor:pointer;';
      change.onclick = (ev) => {
        ev.preventDefault();
        this.data = { cardId: '' };
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

  save(): MetricRefData {
    return this.data;
  }
}
