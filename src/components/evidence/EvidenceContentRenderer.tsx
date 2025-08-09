import { useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import { createReadOnlyEditorJSInstance } from "@/lib/editorjs-config";
import type { EvidenceItem } from "@/lib/types";

interface EvidenceContentRendererProps {
  evidence: EvidenceItem;
  className?: string;
}

export default function EvidenceContentRenderer({
  evidence,
  className = "",
}: EvidenceContentRendererProps) {
  const editorRef = useRef<EditorJS | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && evidence.content && !editorRef.current) {
      try {
        console.log("🔍 Rendering evidence content with stable tools...");

        const editor = createReadOnlyEditorJSInstance({
          holder: containerRef.current,
          data: evidence.content,
          onReady: () => {
            console.log("🎨 ReadOnly EditorJS ready with stable toolkit");
          },
          onError: (error) => {
            console.warn("⚠️ ReadOnly EditorJS error:", error);
          },
        });

        editorRef.current = editor;
      } catch (error) {
        console.error("❌ Failed to initialize readonly editor:", error);
      }
    }

    return () => {
      if (editorRef.current) {
        try {
          editorRef.current.destroy();
          editorRef.current = null;
        } catch (error) {
          console.warn("Error destroying readonly editor:", error);
          editorRef.current = null;
        }
      }
    };
  }, [evidence.content]);

  if (!evidence.content) {
    return (
      <div className={`codex-editor codex-editor--readonly ${className}`}>
        <p className="text-gray-500 italic">
          {evidence.summary || "No content available"}
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`codex-editor codex-editor--readonly ${className}`}
    />
  );
}
