// Custom EditorJS block: /chart — a live sparkline of a metric card's value
// history (CVS-34 slice 4.3). Stores cardId + a snapshot of the series; resolves
// the live series from the canvas store (card.data: MetricValue[]) when present.
// Plain-DOM SVG (no React / charting lib) — safe inside EditorJS.
import { useCanvasStore } from '@/lib/stores';
import { sparklineSvg } from './sparkline';

interface ChartData {
  cardId: string;
  title?: string;
  series?: number[];
}

interface BlockToolArgs {
  data: Partial<ChartData>;
  readOnly?: boolean;
}

function nodes(): any[] {
  return useCanvasStore.getState().canvas?.nodes ?? [];
}
function seriesOf(card: any): number[] {
  return ((card?.data ?? []) as any[])
    .map((d) => Number(d?.value))
    .filter((n) => !isNaN(n));
}

export default class ChartBlock {
  static get toolbox() {
    return {
      title: 'Chart',
      icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="M7 14l4-4 3 3 5-6"/></svg>',
    };
  }
  static get isReadOnlySupported() {
    return true;
  }
  static get sanitize() {
    return { cardId: false, title: false, series: false };
  }

  private data: ChartData;
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
        : this.renderChart()
    );
  }

  private renderPicker(): HTMLElement {
    const list = nodes();
    const box = document.createElement('div');
    box.style.cssText =
      'padding:8px;border:1px dashed #cbd5e1;border-radius:8px;background:#f8fafc;';
    if (list.length === 0) {
      box.textContent = 'No metric cards on this canvas to chart.';
      box.style.cssText += 'color:#94a3b8;font-size:13px;';
      return box;
    }
    const select = document.createElement('select');
    select.style.cssText =
      'width:100%;padding:6px 8px;border:1px solid #e2e8f0;border-radius:6px;font-size:14px;background:#fff;';
    const ph = document.createElement('option');
    ph.value = '';
    ph.textContent = 'Chart a metric…';
    select.appendChild(ph);
    list.forEach((c: any) => {
      const o = document.createElement('option');
      o.value = c.id;
      o.textContent = c.title || 'Untitled';
      select.appendChild(o);
    });
    select.onchange = () => {
      const c = list.find((x: any) => x.id === select.value);
      if (c) {
        this.data = { cardId: c.id, title: c.title, series: seriesOf(c) };
        this.rebuild();
      }
    };
    box.appendChild(select);
    return box;
  }

  private renderChart(): HTMLElement {
    const live = nodes().find((c: any) => c.id === this.data.cardId) as any;
    const title = live?.title || this.data.title || 'Metric';
    const series = live ? seriesOf(live) : this.data.series || [];

    const card = document.createElement('div');
    card.style.cssText =
      'border:1px solid #e2e8f0;border-radius:10px;padding:10px 12px;background:#fff;max-width:280px;';

    const head = document.createElement('div');
    head.style.cssText =
      'display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;';
    const name = document.createElement('span');
    name.textContent = title;
    name.style.cssText = 'font-weight:600;font-size:14px;color:#0f172a;';
    head.appendChild(name);
    if (!this.readOnly) {
      const change = document.createElement('button');
      change.type = 'button';
      change.textContent = 'change';
      change.style.cssText =
        'font-size:11px;color:#94a3b8;background:none;border:none;cursor:pointer;';
      change.onclick = (e) => {
        e.preventDefault();
        this.data = { cardId: '' };
        this.rebuild();
      };
      head.appendChild(change);
    }
    card.appendChild(head);

    if (series.length === 0) {
      const empty = document.createElement('div');
      empty.textContent = 'No values yet';
      empty.style.cssText = 'font-size:12px;color:#94a3b8;';
      card.appendChild(empty);
    } else {
      const svg = document.createElement('div');
      svg.innerHTML = sparklineSvg(series);
      card.appendChild(svg);
      const last = series[series.length - 1];
      const val = document.createElement('div');
      val.textContent = last.toLocaleString();
      val.style.cssText =
        'font-size:16px;font-weight:700;color:#0f172a;margin-top:2px;';
      card.appendChild(val);
    }
    return card;
  }

  render(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.style.margin = '6px 0';
    this.wrapper = wrapper;
    this.rebuild();
    return wrapper;
  }

  save(): ChartData {
    return this.data;
  }
}
