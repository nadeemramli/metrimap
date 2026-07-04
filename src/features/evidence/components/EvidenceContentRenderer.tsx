import { useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import { createReadOnlyEditorJSInstance } from "@/lib/editorjs-config";
import type { EvidenceItem } from "@/shared/types";

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
    // No EditorJS notebook yet — render whatever structured fields are populated
    // (summary / hypothesis / impact) rather than the bare placeholder, which
    // wrongly showed even for populated Analysis-type evidence (CVS-35).
    const sections = [
      { label: "Summary", value: evidence.summary },
      { label: "Hypothesis", value: evidence.hypothesis },
      { label: "Impact on confidence", value: evidence.impactOnConfidence },
    ].filter((s) => s.value && s.value.trim());

    return (
      <div className={`codex-editor codex-editor--readonly ${className}`}>
        {sections.length > 0 ? (
          <div className="space-y-2">
            {sections.map((s) => (
              <div key={s.label}>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  {s.label}
                </p>
                <p className="whitespace-pre-wrap text-sm text-gray-700">
                  {s.value}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No content available</p>
        )}
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
