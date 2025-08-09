// Type declarations for EditorJS plugins
declare module '@editorjs/marker' {
  import { BlockTool } from '@editorjs/editorjs';
  export default class Marker implements BlockTool {
    static get toolbox(): any;
    constructor(config: any);
    render(): HTMLElement;
    save(blockContent: HTMLElement): any;
  }
}

declare module '@editorjs/checklist' {
  import { BlockTool } from '@editorjs/editorjs';
  export default class Checklist implements BlockTool {
    static get toolbox(): any;
    constructor(config: any);
    render(): HTMLElement;
    save(blockContent: HTMLElement): any;
  }
}

declare module '@editorjs/link' {
  import { BlockTool } from '@editorjs/editorjs';
  export default class LinkTool implements BlockTool {
    static get toolbox(): any;
    constructor(config: any);
    render(): HTMLElement;
    save(blockContent: HTMLElement): any;
  }
}

declare module '@editorjs/embed' {
  import { BlockTool } from '@editorjs/editorjs';
  export default class Embed implements BlockTool {
    static get toolbox(): any;
    constructor(config: any);
    render(): HTMLElement;
    save(blockContent: HTMLElement): any;
  }
}

declare module 'editorjs-alert' {
  import { BlockTool } from '@editorjs/editorjs';
  export default class Alert implements BlockTool {
    static get toolbox(): any;
    constructor(config: any);
    render(): HTMLElement;
    save(blockContent: HTMLElement): any;
  }
}

declare module 'editorjs-toggle-block' {
  import { BlockTool } from '@editorjs/editorjs';
  export default class ToggleBlock implements BlockTool {
    static get toolbox(): any;
    constructor(config: any);
    render(): HTMLElement;
    save(blockContent: HTMLElement): any;
  }
}

declare module 'editorjs-color-picker' {
  import { BlockTool } from '@editorjs/editorjs';
  export default class ColorPicker implements BlockTool {
    static get toolbox(): any;
    constructor(config: any);
    render(): HTMLElement;
    save(blockContent: HTMLElement): any;
  }
}

declare module '@editorjs/simple-image' {
  import { BlockTool } from '@editorjs/editorjs';
  export default class SimpleImage implements BlockTool {
    static get toolbox(): any;
    constructor(config: any);
    render(): HTMLElement;
    save(blockContent: HTMLElement): any;
  }
}

declare module '@editorjs/attaches' {
  import { BlockTool } from '@editorjs/editorjs';
  export default class Attaches implements BlockTool {
    static get toolbox(): any;
    constructor(config: any);
    render(): HTMLElement;
    save(blockContent: HTMLElement): any;
  }
}

declare module 'editorjs-hyperlink' {
  import { BlockTool } from '@editorjs/editorjs';
  export default class Hyperlink implements BlockTool {
    static get toolbox(): any;
    constructor(config: any);
    render(): HTMLElement;
    save(blockContent: HTMLElement): any;
  }
}

declare module 'editorjs-style' {
  import { BlockTool } from '@editorjs/editorjs';
  export default class EditorJSStyle implements BlockTool {
    static get toolbox(): any;
    constructor(config: any);
    render(): HTMLElement;
    save(blockContent: HTMLElement): any;
  }
}

declare module 'editorjs-change-case' {
  import { BlockTool } from '@editorjs/editorjs';
  export default class ChangeCase implements BlockTool {
    static get toolbox(): any;
    constructor(config: any);
    render(): HTMLElement;
    save(blockContent: HTMLElement): any;
  }
}

declare module 'editorjs-latex' {
  import { BlockTool } from '@editorjs/editorjs';
  export default class EJLaTeX implements BlockTool {
    static get toolbox(): any;
    constructor(config: any);
    render(): HTMLElement;
    save(blockContent: HTMLElement): any;
  }
}

declare module 'editorjs-drag-drop' {
  export default class DragDrop {
    constructor(editor: any);
  }
}

declare module 'editorjs-undo' {
  export default class Undo {
    constructor(editor: any);
  }
}

declare module '@editorjs/text-variant-tune' {
  import { BlockTune } from '@editorjs/editorjs';
  export default class TextVariantTune implements BlockTune {
    static get isTune(): boolean;
    constructor(config: any);
    render(): HTMLElement;
    save(): any;
  }
}

declare module '@phigoro/editorjs-toc' {
  import { BlockTool } from '@editorjs/editorjs';
  export default class TOC implements BlockTool {
    static get toolbox(): any;
    constructor(config: any);
    render(): HTMLElement;
    save(blockContent: HTMLElement): any;
  }
}

declare module '@calumk/editorjs-nested-checklist' {
  import { BlockTool } from '@editorjs/editorjs';
  export default class NestedChecklist implements BlockTool {
    static get toolbox(): any;
    constructor(config: any);
    render(): HTMLElement;
    save(blockContent: HTMLElement): any;
  }
}

declare module 'editorjs-header-with-alignment' {
  import { BlockTool } from '@editorjs/editorjs';
  export default class HeaderWithAlignment implements BlockTool {
    static get toolbox(): any;
    constructor(config: any);
    render(): HTMLElement;
    save(blockContent: HTMLElement): any;
  }
}

declare module 'editorjs-paragraph-with-alignment' {
  import { BlockTool } from '@editorjs/editorjs';
  export default class ParagraphWithAlignment implements BlockTool {
    static get toolbox(): any;
    constructor(config: any);
    render(): HTMLElement;
    save(blockContent: HTMLElement): any;
  }
}
