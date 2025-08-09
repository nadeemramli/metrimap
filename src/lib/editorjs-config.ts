// EditorJS configuration with all tools properly set up
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import Checklist from "@editorjs/checklist";
import Table from "@editorjs/table";
import Image from "@editorjs/image";
import LinkTool from "@editorjs/link";
import Embed from "@editorjs/embed";
import Warning from "@editorjs/warning";
import Delimiter from "@editorjs/delimiter";
import Alert from "editorjs-alert";
import ToggleBlock from "editorjs-toggle-block";
import ColorPicker from "editorjs-color-picker";
import SimpleImage from "@editorjs/simple-image";
import Attaches from "@editorjs/attaches";
import InlineCode from "@editorjs/inline-code";
import Underline from "@editorjs/underline";
// Note: editorjs-hyperlink uses eval() which causes security warnings
// These warnings are suppressed in vite.config.ts via onwarn configuration
import Hyperlink from "editorjs-hyperlink";
import ChangeCase from "editorjs-change-case";
import Code from "@editorjs/code";
import Paragraph from "@editorjs/paragraph";
import EJLaTeX from "editorjs-latex";
import TOC from "@phigoro/editorjs-toc";
import NestedChecklist from "@calumk/editorjs-nested-checklist";
// Note: DragDrop and Undo are problematic, we'll implement them later

export interface EditorJSConfigOptions {
  holder: HTMLElement;
  data?: any;
  placeholder?: string;
  minHeight?: number;
  onChange?: () => void;
  onReady?: () => void;
  onError?: (error: any) => void;
  readOnly?: boolean;
}

// All valid block types that our editor supports
export const VALID_BLOCK_TYPES = [
  "header",
  "paragraph", 
  "list",
  "quote",
  "table",
  "checklist",
  "nestedChecklist",
  "code",
  "warning",
  "delimiter",
  "marker",
  "inlineCode",
  "underline",
  "alert",
  "toggle",
  "colorPicker",
  "image",
  "simpleImage",
  "attaches",
  "link",
  "embed",
  "hyperlink",
  "changeCase",
  "latex",
  "toc"
] as const;

export type ValidBlockType = typeof VALID_BLOCK_TYPES[number];

// Comprehensive tools configuration for a full-featured notebook experience
export const createEditorJSTools = () => {
  return {
    // Text blocks
    header: {
      class: Header as any,
      inlineToolbar: ['link', 'marker', 'bold', 'italic'],
      config: {
        placeholder: "Enter a header",
        levels: [1, 2, 3, 4, 5, 6],
        defaultLevel: 2,
      }
    },
    paragraph: {
      class: Paragraph as any,
      inlineToolbar: true,
      config: {
        placeholder: "Start writing or press '/' for commands...",
      }
    },
    
    // Lists and organization
    list: {
      class: List as any,
      inlineToolbar: true,
      config: {
        defaultStyle: "unordered",
      },
    },
    checklist: {
      class: Checklist as any,
      inlineToolbar: true,
    },
    nestedChecklist: {
      class: NestedChecklist as any,
      inlineToolbar: true,
    },
    
    // Data visualization
    table: {
      class: Table as any,
      inlineToolbar: true,
      config: {
        rows: 2,
        cols: 3,
        withHeadings: true,
      },
    },
    
    // Code and technical content
    code: {
      class: Code as any,
      config: {
        placeholder: "Enter code here (specify language for syntax highlighting)",
      },
    },
    latex: {
      class: EJLaTeX as any,
      config: {
        placeholder: "Enter LaTeX formula here...",
      },
    },
    
    // Media and attachments
    image: {
      class: Image as any,
      config: {
        endpoints: {
          byFile: '/api/upload', // You'll need to implement this
          byUrl: '/api/fetch-url', // You'll need to implement this
        },
        additionalRequestHeaders: {
          // Add auth headers as needed
        },
      },
    },
    simpleImage: {
      class: SimpleImage as any,
      inlineToolbar: true,
    },
    attaches: {
      class: Attaches as any,
      config: {
        endpoint: '/api/upload-file', // You'll need to implement this
        additionalRequestHeaders: {
          // Add auth headers as needed
        },
      },
    },
    embed: {
      class: Embed as any,
      config: {
        services: {
          youtube: true,
          coub: true,
          codepen: true,
          github: true,
        }
      },
    },
    
    // Interactive elements
    toggle: {
      class: ToggleBlock as any,
      inlineToolbar: true,
      config: {
        placeholder: "Toggle content",
      },
    },
    alert: {
      class: Alert as any,
      inlineToolbar: true,
      config: {
        messagePlaceholder: "Enter alert message",
        defaultType: "info",
        types: ["info", "warning", "error", "success"],
      },
    },
    warning: {
      class: Warning as any,
      inlineToolbar: true,
      config: {
        messagePlaceholder: "Enter a warning message",
        titlePlaceholder: "Enter a warning title",
      },
    },
    
    // Links and references
    link: {
      class: LinkTool as any,
      config: {
        endpoint: '/api/fetch-url', // You'll need to implement this for link previews
      },
    },
    hyperlink: {
      class: Hyperlink as any,
      config: {
        shortcut: 'CMD+L',
        target: '_blank',
        rel: 'nofollow',
        availableTargets: ['_blank', '_self'],
        availableRels: ['author', 'noreferrer'],
        validate: false,
      },
    },
    
    // Content structure
    delimiter: {
      class: Delimiter as any,
    },
    quote: {
      class: Quote as any,
      inlineToolbar: true,
      config: {
        quotePlaceholder: "Enter a quote",
        captionPlaceholder: "Quote's author",
      },
    },
    toc: {
      class: TOC as any,
      config: {
        placeholder: "Table of Contents will be generated automatically",
      },
    },
    
    // Formatting tools (inline)
    marker: {
      class: Marker as any,
      shortcut: "CMD+SHIFT+M",
    },
    inlineCode: {
      class: InlineCode as any,
      shortcut: "CMD+SHIFT+C",
    },
    underline: {
      class: Underline as any,
      shortcut: "CMD+U",
    },
    
    // Advanced formatting
    colorPicker: {
      class: ColorPicker as any,
      config: {
        colorCollections: [
          "#EC7878", "#9C88FF", "#F8D852", "#A9E03F", "#51A8FF",
          "#FA8072", "#DDA0DD", "#FFE4B5", "#90EE90", "#87CEEB"
        ],
        defaultColor: '#FF1300',
        type: 'text',
        customPicker: true,
      },
    },
    changeCase: {
      class: ChangeCase as any,
      config: {
        showLocaleOption: true,
        locale: 'en'
      },
    },
  };
};

// (No top-level tunes registration due to type incompatibilities in current EditorJS types)

// Data validation function that knows about ALL our tools
export function validateAndMigrateEditorData(data: any): any {
  console.log("🔍 Validating comprehensive editor data:", data);
  
  if (!data || !data.blocks) {
    console.log("📝 No data or blocks found, creating default content");
    return {
      time: Date.now(),
      blocks: [
        {
          type: "paragraph",
          data: {
            text: "",
          },
        },
      ],
      version: "2.30.8",
    };
  }

  console.log("📊 Original blocks count:", data.blocks.length);
  console.log("📋 Valid block types:", VALID_BLOCK_TYPES);

  // Filter out invalid blocks and migrate data
  const validBlocks = data.blocks.filter((block: any) => {
    if (!VALID_BLOCK_TYPES.includes(block.type as ValidBlockType)) {
      console.warn(`⚠️ Skipping invalid block type: ${block.type}`);
      return false;
    }
    console.log(`✅ Keeping valid block: ${block.type}`);
    return true;
  });

  console.log("📊 Valid blocks count:", validBlocks.length);

  // If no valid blocks remain, create a default paragraph
  if (validBlocks.length === 0) {
    console.log("📝 No valid blocks found, creating default paragraph");
    validBlocks.push({
      type: "paragraph",
      data: {
        text: "Welcome to your evidence notebook! Start writing or press '/' for commands.",
      },
    });
  }

  const result = {
    time: data.time || Date.now(),
    blocks: validBlocks,
    version: "2.30.8",
  };

  console.log("✅ Final validated data:", result);
  return result;
}

// Create EditorJS instance with comprehensive configuration
export function createEditorJSInstance(options: EditorJSConfigOptions): EditorJS {
  const config = {
    holder: options.holder,
    tools: createEditorJSTools(),
    data: options.data ? validateAndMigrateEditorData(options.data) : undefined,
    placeholder: options.placeholder || "Start writing or press '/' for commands...",
    minHeight: options.minHeight || 200,
    onChange: options.onChange,
    onReady: () => {
      console.log("🎉 EditorJS ready with comprehensive tools");
      if (options.onReady) options.onReady();
    },
    onError: (error: any) => {
      console.error("❌ EditorJS error:", error);
      if (options.onError) options.onError(error);
    },
    readOnly: options.readOnly || false,
    autofocus: !options.readOnly,
  };

  return new EditorJS(config);
}

// Create a simpler configuration for readonly/display mode
export function createReadOnlyEditorJSInstance(options: EditorJSConfigOptions): EditorJS {
  const config = {
    holder: options.holder,
    tools: createEditorJSTools(), // Same tools for consistency
    data: options.data ? validateAndMigrateEditorData(options.data) : undefined,
    readOnly: true,
    onReady: () => {
      console.log("🎉 ReadOnly EditorJS ready");
      if (options.onReady) options.onReady();
    },
    onError: (error: any) => {
      console.error("❌ ReadOnly EditorJS error:", error);
      if (options.onError) options.onError(error);
    },
  };

  return new EditorJS(config);
}
