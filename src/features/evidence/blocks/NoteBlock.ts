// Custom EditorJS block: /note — a Metrimap callout for the analytical notebook
// (CVS-34 slice 4.1). Marks a note / decision / insight in the narrative. Plain
// DOM (no React) so it's robust inside EditorJS's DOM-based rendering and works
// identically in the editor and the read-only preview/renderer.

type NoteVariant = 'note' | 'decision' | 'insight';

interface NoteData {
  text: string;
  variant: NoteVariant;
}

const VARIANTS: Record<
  NoteVariant,
  { label: string; border: string; bg: string; fg: string }
> = {
  note: { label: 'Note', border: '#c7d2fe', bg: '#eef2ff', fg: '#4338ca' },
  decision: { label: 'Decision', border: '#bbf7d0', bg: '#f0fdf4', fg: '#15803d' },
  insight: { label: 'Insight', border: '#fde68a', bg: '#fffbeb', fg: '#b45309' },
};

interface BlockToolArgs {
  data: Partial<NoteData>;
  readOnly?: boolean;
}

export default class NoteBlock {
  static get toolbox() {
    return {
      title: 'Note',
      icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16v12H8l-4 4z"/></svg>',
    };
  }

  static get isReadOnlySupported() {
    return true;
  }

  static get sanitize() {
    return { text: { br: true, b: true, i: true, u: true, a: true }, variant: false };
  }

  private data: NoteData;
  private readOnly: boolean;
  private wrapper: HTMLElement | null = null;

  constructor({ data, readOnly }: BlockToolArgs) {
    this.data = {
      text: data?.text ?? '',
      variant: (data?.variant as NoteVariant) ?? 'note',
    };
    this.readOnly = Boolean(readOnly);
  }

  private applyStyles() {
    const v = VARIANTS[this.data.variant];
    const w = this.wrapper!;
    w.style.borderLeft = `3px solid ${v.border}`;
    w.style.background = v.bg;
    const label = w.querySelector<HTMLElement>('.cm-note-label');
    if (label) {
      label.textContent = v.label;
      label.style.color = v.fg;
    }
  }

  render(): HTMLElement {
    const wrapper = document.createElement('div');
    this.wrapper = wrapper;
    wrapper.className = 'cm-note-block';
    wrapper.style.cssText =
      'border-radius:8px;padding:10px 14px;margin:6px 0;font-size:14px;';

    const header = document.createElement('div');
    header.style.cssText =
      'display:flex;align-items:center;gap:8px;margin-bottom:4px;';

    const label = document.createElement('span');
    label.className = 'cm-note-label';
    label.style.cssText =
      'font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;';
    header.appendChild(label);

    if (!this.readOnly) {
      (Object.keys(VARIANTS) as NoteVariant[]).forEach((key) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = VARIANTS[key].label;
        btn.style.cssText =
          'font-size:10px;padding:1px 6px;border-radius:6px;border:1px solid #e5e7eb;background:#fff;cursor:pointer;color:#6b7280;';
        btn.onclick = (e) => {
          e.preventDefault();
          this.data.variant = key;
          this.applyStyles();
        };
        header.appendChild(btn);
      });
    }
    wrapper.appendChild(header);

    const text = document.createElement('div');
    text.className = 'cm-note-text';
    text.contentEditable = this.readOnly ? 'false' : 'true';
    text.innerHTML = this.data.text;
    text.dataset.placeholder = 'Write a note, decision or insight…';
    text.style.cssText = 'outline:none;color:#374151;line-height:1.55;';
    wrapper.appendChild(text);

    this.applyStyles();
    return wrapper;
  }

  save(block: HTMLElement): NoteData {
    const text = block.querySelector<HTMLElement>('.cm-note-text');
    return {
      text: text ? text.innerHTML : this.data.text,
      variant: this.data.variant,
    };
  }
}
