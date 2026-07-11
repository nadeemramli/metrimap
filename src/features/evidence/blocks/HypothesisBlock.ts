// Custom EditorJS block: /hypothesis — a structured hypothesis (CVS-34 slice 4.5).
// Statement + prediction + status. Plain DOM; no external refs.

import DOMPurify from 'dompurify';

type HStatus = 'proposed' | 'validated' | 'invalidated';

// Stored content is untrusted (jsonb writable by any editor / MCP client) and
// EditorJS only sanitizes on save() — so strip scripts/handlers at render time.
function sanitizeFieldHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['br', 'b', 'i'],
    ALLOWED_ATTR: [],
  });
}

interface HypothesisData {
  statement: string;
  prediction: string;
  status: HStatus;
}

const STATUS: Record<HStatus, { label: string; bg: string; fg: string }> = {
  proposed: { label: 'Proposed', bg: '#eef2ff', fg: '#4338ca' },
  validated: { label: 'Validated', bg: '#f0fdf4', fg: '#15803d' },
  invalidated: { label: 'Invalidated', bg: '#fef2f2', fg: '#b91c1c' },
};

interface BlockToolArgs {
  data: Partial<HypothesisData>;
  readOnly?: boolean;
}

export default class HypothesisBlock {
  static get toolbox() {
    return {
      title: 'Hypothesis',
      icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18h6M10 21h4M12 3a6 6 0 00-4 10.5c.7.7 1 1.2 1 2.5h6c0-1.3.3-1.8 1-2.5A6 6 0 0012 3z"/></svg>',
    };
  }
  static get isReadOnlySupported() {
    return true;
  }
  static get sanitize() {
    return {
      statement: { br: true, b: true, i: true },
      prediction: { br: true, b: true, i: true },
      status: false,
    };
  }

  private data: HypothesisData;
  private readOnly: boolean;
  private wrapper: HTMLElement | null = null;

  constructor({ data, readOnly }: BlockToolArgs) {
    this.data = {
      statement: data?.statement ?? '',
      prediction: data?.prediction ?? '',
      status: (data?.status as HStatus) ?? 'proposed',
    };
    this.readOnly = Boolean(readOnly);
  }

  private field(cls: string, label: string, html: string, placeholder: string) {
    const box = document.createElement('div');
    box.style.marginBottom = '8px';
    const l = document.createElement('div');
    l.textContent = label;
    l.style.cssText =
      'font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:#94a3b8;margin-bottom:2px;';
    box.appendChild(l);
    const v = document.createElement('div');
    v.className = cls;
    v.contentEditable = this.readOnly ? 'false' : 'true';
    v.innerHTML = sanitizeFieldHtml(html);
    v.dataset.placeholder = placeholder;
    v.style.cssText = 'outline:none;color:#374151;line-height:1.5;';
    box.appendChild(v);
    return box;
  }

  private updateStatusBadge() {
    const s = STATUS[this.data.status];
    const badge = this.wrapper?.querySelector<HTMLElement>('.cm-hyp-status');
    if (badge) {
      badge.textContent = s.label;
      badge.style.background = s.bg;
      badge.style.color = s.fg;
    }
  }

  render(): HTMLElement {
    const wrapper = document.createElement('div');
    this.wrapper = wrapper;
    wrapper.style.cssText =
      'border:1px solid #e5e7eb;border-radius:10px;padding:12px 14px;margin:6px 0;background:#fff;';

    const head = document.createElement('div');
    head.style.cssText =
      'display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;';
    const title = document.createElement('span');
    title.textContent = 'Hypothesis';
    title.style.cssText = 'font-weight:700;color:#0f172a;';
    head.appendChild(title);
    const badge = document.createElement('span');
    badge.className = 'cm-hyp-status';
    badge.style.cssText =
      'font-size:11px;font-weight:600;padding:2px 8px;border-radius:9999px;';
    head.appendChild(badge);
    wrapper.appendChild(head);

    wrapper.appendChild(
      this.field(
        'cm-hyp-statement',
        'We believe that',
        this.data.statement,
        'state the hypothesis…'
      )
    );
    wrapper.appendChild(
      this.field(
        'cm-hyp-prediction',
        'We will know it is true when',
        this.data.prediction,
        'the measurable prediction…'
      )
    );

    if (!this.readOnly) {
      const row = document.createElement('div');
      row.style.cssText = 'display:flex;gap:6px;margin-top:4px;';
      (Object.keys(STATUS) as HStatus[]).forEach((k) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.textContent = STATUS[k].label;
        b.style.cssText =
          'font-size:11px;padding:2px 8px;border-radius:6px;border:1px solid #e5e7eb;background:#fff;color:#6b7280;cursor:pointer;';
        b.onclick = (e) => {
          e.preventDefault();
          this.data.status = k;
          this.updateStatusBadge();
        };
        row.appendChild(b);
      });
      wrapper.appendChild(row);
    }

    this.updateStatusBadge();
    return wrapper;
  }

  save(block: HTMLElement): HypothesisData {
    const g = (c: string) =>
      block.querySelector<HTMLElement>(c)?.innerHTML ?? '';
    return {
      statement: g('.cm-hyp-statement'),
      prediction: g('.cm-hyp-prediction'),
      status: this.data.status,
    };
  }
}
