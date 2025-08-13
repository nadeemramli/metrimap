import EditorJS, { type OutputData } from '@editorjs/editorjs';

export function createEditorJSInstance(opts: {
  holder: HTMLElement;
  data?: any;
  placeholder?: string;
  minHeight?: number;
  onChange?: () => void;
  onReady?: () => void;
  onError?: (e: unknown) => void;
}): EditorJS {
  const editor = new EditorJS({
    holder: opts.holder,
    data: (opts.data || {}) as OutputData,
    placeholder: opts.placeholder,
    minHeight: opts.minHeight,
    onChange: opts.onChange,
    onReady: opts.onReady,
  } as any);
  return editor;
}

export function validateAndMigrateEditorData(data: any): OutputData {
  return (data || {}) as OutputData;
}
