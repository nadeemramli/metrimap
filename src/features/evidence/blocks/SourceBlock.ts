// Custom EditorJS block: /source — cite a source (CVS-34 slice 4.5). URL, doc,
// interview, dataset or external research. Plain DOM.

type SourceKind = 'url' | 'doc' | 'interview' | 'dataset' | 'research';

interface SourceData {
  kind: SourceKind;
  label: string;
  url: string;
}

const KINDS: Record<SourceKind, string> = {
  url: 'Link',
  doc: 'Document',
  interview: 'Interview',
  dataset: 'Dataset',
  research: 'Research',
};

interface BlockToolArgs {
  data: Partial<SourceData>;
  readOnly?: boolean;
}

export default class SourceBlock {
  static get toolbox() {
    return {
      title: 'Source',
      icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 007 0l2-2a5 5 0 00-7-7l-1 1"/><path d="M14 11a5 5 0 00-7 0l-2 2a5 5 0 007 7l1-1"/></svg>',
    };
  }
  static get isReadOnlySupported() {
    return true;
  }
  static get sanitize() {
    return { kind: false, label: false, url: false };
  }

  private data: SourceData;
  private readOnly: boolean;

  constructor({ data, readOnly }: BlockToolArgs) {
    this.data = {
      kind: (data?.kind as SourceKind) ?? 'url',
      label: data?.label ?? '',
      url: data?.url ?? '',
    };
    this.readOnly = Boolean(readOnly);
  }

  private renderReadonly(): HTMLElement {
    const chip = document.createElement(this.data.url ? 'a' : 'div');
    chip.style.cssText =
      'display:inline-flex;align-items:center;gap:8px;padding:6px 10px;border:1px solid #e2e8f0;border-radius:8px;background:#fff;font-size:14px;color:#0f172a;text-decoration:none;';
    if (this.data.url) {
      (chip as HTMLAnchorElement).href = this.data.url;
      (chip as HTMLAnchorElement).target = '_blank';
      (chip as HTMLAnchorElement).rel = 'noopener noreferrer';
    }
    const kind = document.createElement('span');
    kind.textContent = KINDS[this.data.kind];
    kind.style.cssText =
      'font-size:11px;color:#64748b;background:#f1f5f9;padding:1px 6px;border-radius:9999px;';
    chip.appendChild(kind);
    const label = document.createElement('span');
    label.textContent = this.data.label || this.data.url || 'Untitled source';
    label.style.fontWeight = '600';
    chip.appendChild(label);
    return chip;
  }

  private renderEditor(): HTMLElement {
    const box = document.createElement('div');
    box.style.cssText =
      'border:1px solid #e5e7eb;border-radius:8px;padding:10px;background:#fff;display:flex;flex-direction:column;gap:6px;';

    const select = document.createElement('select');
    select.style.cssText =
      'padding:5px 8px;border:1px solid #e2e8f0;border-radius:6px;font-size:13px;width:150px;';
    (Object.keys(KINDS) as SourceKind[]).forEach((k) => {
      const o = document.createElement('option');
      o.value = k;
      o.textContent = KINDS[k];
      if (k === this.data.kind) o.selected = true;
      select.appendChild(o);
    });
    select.onchange = () => {
      this.data.kind = select.value as SourceKind;
    };
    box.appendChild(select);

    const label = document.createElement('input');
    label.type = 'text';
    label.placeholder = 'Label (e.g. Q3 pricing analysis)';
    label.value = this.data.label;
    label.className = 'cm-src-label';
    label.style.cssText =
      'padding:6px 8px;border:1px solid #e2e8f0;border-radius:6px;font-size:14px;';
    label.oninput = () => {
      this.data.label = label.value;
    };
    box.appendChild(label);

    const url = document.createElement('input');
    url.type = 'url';
    url.placeholder = 'https://… (optional)';
    url.value = this.data.url;
    url.className = 'cm-src-url';
    url.style.cssText =
      'padding:6px 8px;border:1px solid #e2e8f0;border-radius:6px;font-size:13px;color:#2563eb;';
    url.oninput = () => {
      this.data.url = url.value;
    };
    box.appendChild(url);
    return box;
  }

  render(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.style.margin = '6px 0';
    wrapper.appendChild(
      this.readOnly ? this.renderReadonly() : this.renderEditor()
    );
    return wrapper;
  }

  save(): SourceData {
    return this.data;
  }
}
