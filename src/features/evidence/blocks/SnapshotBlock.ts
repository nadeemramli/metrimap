// Custom EditorJS block: /snapshot — freeze a metric card's values at capture
// time with a timestamp (CVS-34 slice 4.4). Unlike /chart (live), the series is
// captured once and never updates — an audit record of what the metric looked
// like when the evidence was written. Plain-DOM SVG. (Screenshot-of-a-region
// capture is a future upgrade; this freezes the data instead.)
import { useCanvasStore } from '@/lib/stores';
import { sparklineSvg } from './sparkline';

interface SnapshotData {
  cardId: string;
  title?: string;
  series?: number[];
  value?: number;
  capturedAt?: string; // ISO
}

interface BlockToolArgs {
  data: Partial<SnapshotData>;
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

export default class SnapshotBlock {
  static get toolbox() {
    return {
      title: 'Snapshot',
      icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="6" width="18" height="14" rx="2"/><circle cx="12" cy="13" r="3.5"/><path d="M8 6l1.5-2h5L16 6"/></svg>',
    };
  }
  static get isReadOnlySupported() {
    return true;
  }
  static get sanitize() {
    return {
      cardId: false,
      title: false,
      series: false,
      value: false,
      capturedAt: false,
    };
  }

  private data: SnapshotData;
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
      !this.readOnly && !this.data.capturedAt
        ? this.renderPicker()
        : this.renderSnapshot()
    );
  }

  private renderPicker(): HTMLElement {
    const list = nodes();
    const box = document.createElement('div');
    box.style.cssText =
      'padding:8px;border:1px dashed #cbd5e1;border-radius:8px;background:#f8fafc;';
    if (list.length === 0) {
      box.textContent = 'No metric cards on this canvas to snapshot.';
      box.style.cssText += 'color:#94a3b8;font-size:13px;';
      return box;
    }
    const select = document.createElement('select');
    select.style.cssText =
      'width:100%;padding:6px 8px;border:1px solid #e2e8f0;border-radius:6px;font-size:14px;background:#fff;';
    const ph = document.createElement('option');
    ph.value = '';
    ph.textContent = 'Snapshot a metric (freeze it)…';
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
        const series = seriesOf(c);
        this.data = {
          cardId: c.id,
          title: c.title,
          series,
          value: series[series.length - 1],
          capturedAt: new Date().toISOString(),
        };
        this.rebuild();
      }
    };
    box.appendChild(select);
    return box;
  }

  private renderSnapshot(): HTMLElement {
    const series = this.data.series || [];
    const card = document.createElement('div');
    card.style.cssText =
      'border:1px solid #e2e8f0;border-radius:10px;padding:10px 12px;background:#fbfbfc;max-width:280px;';

    const head = document.createElement('div');
    head.style.cssText =
      'display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;';
    const name = document.createElement('span');
    name.textContent = this.data.title || 'Metric';
    name.style.cssText = 'font-weight:600;font-size:14px;color:#0f172a;';
    head.appendChild(name);
    const badge = document.createElement('span');
    badge.textContent = 'snapshot';
    badge.style.cssText =
      'font-size:10px;color:#64748b;background:#f1f5f9;padding:1px 6px;border-radius:9999px;';
    head.appendChild(badge);
    card.appendChild(head);

    if (series.length) {
      const svg = document.createElement('div');
      svg.innerHTML = sparklineSvg(series, { color: '#64748b' });
      card.appendChild(svg);
    }
    const val = document.createElement('div');
    val.textContent =
      this.data.value === undefined ? '—' : this.data.value.toLocaleString();
    val.style.cssText =
      'font-size:16px;font-weight:700;color:#0f172a;margin-top:2px;';
    card.appendChild(val);

    const ts = document.createElement('div');
    const when = this.data.capturedAt
      ? new Date(this.data.capturedAt).toLocaleString()
      : '';
    ts.textContent = when ? `Captured ${when}` : '';
    ts.style.cssText = 'font-size:11px;color:#94a3b8;margin-top:2px;';
    card.appendChild(ts);

    if (!this.readOnly) {
      const recapture = document.createElement('button');
      recapture.type = 'button';
      recapture.textContent = 're-capture';
      recapture.style.cssText =
        'margin-top:6px;font-size:11px;color:#94a3b8;background:none;border:none;cursor:pointer;';
      recapture.onclick = (e) => {
        e.preventDefault();
        this.data = { cardId: '' };
        this.rebuild();
      };
      card.appendChild(recapture);
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

  save(): SnapshotData {
    return this.data;
  }
}
