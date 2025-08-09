import { useEffect, useRef, useState, useCallback } from "react";
import EditorJS from "@editorjs/editorjs";
import {
  createEditorJSInstance,
  validateAndMigrateEditorData,
} from "@/lib/editorjs-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { EnhancedTagInput } from "@/components/ui/enhanced-tag-input";
import {
  FileText,
  Calendar,
  User,
  FlaskConical,
  BookOpen,
  Globe,
  Users,
  Save,
  X,
  Maximize2,
  Minimize2,
} from "lucide-react";
import type { EvidenceItem } from "@/lib/types";
import { toast } from "sonner";

interface EvidenceEditorProps {
  evidence: EvidenceItem | null;
  onSave: (evidence: EvidenceItem, options?: { autoSave?: boolean }) => void;
  onCancel: () => void;
  isOpen: boolean;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

const evidenceTypeOptions = [
  {
    value: "Experiment",
    icon: FlaskConical,
    color: "bg-blue-50 text-blue-700",
  },
  { value: "Analysis", icon: FileText, color: "bg-green-50 text-green-700" },
  { value: "Notebook", icon: BookOpen, color: "bg-purple-50 text-purple-700" },
  {
    value: "External Research",
    icon: Globe,
    color: "bg-orange-50 text-orange-700",
  },
  { value: "User Interview", icon: Users, color: "bg-pink-50 text-pink-700" },
];

// Debounce function for auto-save
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default function EvidenceEditor({
  evidence,
  onSave,
  onCancel,
  isOpen,
  isFullscreen = false,
  onToggleFullscreen,
}: EvidenceEditorProps) {
  const editorRef = useRef<EditorJS | null>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [formData, setFormData] = useState<Partial<EvidenceItem>>({
    id: evidence?.id || `evidence_${Date.now()}`,
    title: evidence?.title || "",
    type: evidence?.type || "Analysis",
    date: evidence?.date || new Date().toISOString().split("T")[0],
    owner: evidence?.owner || "",
    link: evidence?.link || "",
    hypothesis: evidence?.hypothesis || "",
    impactOnConfidence: evidence?.impactOnConfidence || "",
    tags: evidence?.tags || [],
  });

  // Graceful auto-save function with improved debouncing
  const autoSave = useCallback(
    debounce(async (content: any, metadata: Partial<EvidenceItem>) => {
      const saveTime = new Date().toLocaleTimeString();
      console.log(`[${saveTime}] 💾 AUTO-SAVE: Starting auto-save process`);

      if (!editorRef.current) {
        console.log(
          `[${saveTime}] ⚠️ AUTO-SAVE: Editor not available, skipping`
        );
        return;
      }

      try {
        setIsAutoSaving(true);
        console.log(`[${saveTime}] 🔄 AUTO-SAVE: Validating content`);

        // Validate content without interrupting user
        const validatedContent = validateAndMigrateEditorData(content);

        const updatedEvidence: EvidenceItem = {
          id: evidence?.id || formData.id || `evidence_${Date.now()}`,
          title: metadata.title || "",
          type: metadata.type || "Analysis",
          date: metadata.date || new Date().toISOString().split("T")[0],
          owner: metadata.owner || "",
          link: metadata.link || "",
          hypothesis: metadata.hypothesis || "",
          impactOnConfidence: metadata.impactOnConfidence || "",
          summary: metadata.title || "",
          createdBy: "current-user",
          createdAt: evidence?.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          content: validatedContent,
          context: evidence?.context || {
            type: "general",
            targetId: undefined,
            targetName: undefined,
          },
          position: evidence?.position || { x: 0, y: 0 },
          isVisible: evidence?.isVisible ?? true,
          isExpanded: evidence?.isExpanded ?? false,
          comments: evidence?.comments || [],
        };

        console.log(`[${saveTime}] 📤 AUTO-SAVE: Saving to store`);
        onSave(updatedEvidence, { autoSave: true });
        setLastSaved(new Date());

        console.log(`[${saveTime}] ✅ AUTO-SAVE: Success`);
      } catch (error) {
        const errorTime = new Date().toLocaleTimeString();
        console.error(`[${errorTime}] ❌ AUTO-SAVE ERROR:`, error);
        toast.error("Auto-save failed", {
          duration: 2000,
          position: "bottom-right",
        });
      } finally {
        setIsAutoSaving(false);
      }
    }, 3000), // Increased to 3 seconds for smoother typing
    [evidence, onSave]
  );

  // Handle editor changes for auto-save (non-intrusive)
  const handleEditorChange = useCallback(async () => {
    const changeTime = new Date().toLocaleTimeString();
    console.log(`[${changeTime}] ⚡ CHANGE: Editor content changed`);

    if (!editorRef.current) {
      console.log(`[${changeTime}] ⚠️ CHANGE: Editor not available`);
      return;
    }

    try {
      // Use a timeout to avoid blocking the UI during content retrieval
      setTimeout(async () => {
        try {
          const content = await editorRef.current!.save();
          console.log(
            `[${new Date().toLocaleTimeString()}] 📝 CHANGE: Content saved, triggering auto-save`
          );
          autoSave(content, formData);
        } catch (error) {
          console.error(
            `[${new Date().toLocaleTimeString()}] ❌ CHANGE ERROR:`,
            error
          );
        }
      }, 100); // Small delay to prevent UI blocking
    } catch (error) {
      console.error(`[${changeTime}] ❌ CHANGE ERROR:`, error);
    }
  }, [autoSave, formData]);

  // Handle form data changes for auto-save (graceful)
  const handleFormDataChange = useCallback(
    (newFormData: Partial<EvidenceItem>) => {
      const formTime = new Date().toLocaleTimeString();
      console.log(`[${formTime}] 📝 FORM: Form data changed`);

      setFormData(newFormData);

      if (editorRef.current) {
        // Use setTimeout to avoid blocking UI
        setTimeout(() => {
          if (editorRef.current) {
            editorRef.current
              .save()
              .then((content) => {
                console.log(
                  `[${new Date().toLocaleTimeString()}] 📋 FORM: Triggering auto-save from form change`
                );
                autoSave(content, newFormData);
              })
              .catch((error) => {
                console.error(
                  `[${new Date().toLocaleTimeString()}] ❌ FORM ERROR:`,
                  error
                );
              });
          }
        }, 200);
      }
    },
    [autoSave]
  );

  // Initialize Editor.js with comprehensive configuration
  useEffect(() => {
    if (isOpen && editorContainerRef.current && !editorRef.current) {
      const container = editorContainerRef.current;
      if (!container) {
        console.warn("Editor container not found");
        return;
      }

      try {
        const initTime = new Date().toLocaleTimeString();
        console.log(`[${initTime}] 🚀 INIT: Starting EditorJS initialization`);

        const editor = createEditorJSInstance({
          holder: container,
          data: evidence?.content,
          placeholder:
            "Start writing your evidence notebook... Press '/' for commands",
          minHeight: 300,
          onChange: handleEditorChange,
          onReady: () => {
            const readyTime = new Date().toLocaleTimeString();
            console.log(`[${readyTime}] 🎉 INIT: Editor ready and operational`);
            toast.success("📝 Editor ready!", {
              duration: 1500,
              position: "bottom-right",
            });
          },
          onError: (error: unknown) => {
            console.error("❌ EditorJS error:", error);

            // Enhanced error handling
            if (error && typeof error === "string") {
              if (error.includes("paragraph") && error.includes("skipped")) {
                console.warn(
                  "🔄 Block validation error detected, content will be migrated"
                );
                toast.warning("Content migrated to new format", {
                  duration: 2000,
                  position: "bottom-right",
                });
                return;
              }

              if (error.includes("Tool") && error.includes("not found")) {
                console.warn(
                  "🔧 Tool configuration issue, attempting recovery"
                );
                toast.warning("Some content features were updated", {
                  duration: 2000,
                  position: "bottom-right",
                });
                return;
              }
            }

            toast.error("Editor error occurred. Auto-saving is still active.", {
              duration: 3000,
              position: "bottom-right",
            });
          },
        });

        editorRef.current = editor;
      } catch (error) {
        console.error("❌ Failed to initialize stable EditorJS:", error);

        // Enhanced fallback with better UX
        try {
          console.log("🔄 Attempting fallback initialization...");

          const fallbackEditor = createEditorJSInstance({
            holder: container,
            data: {
              time: Date.now(),
              blocks: [
                {
                  type: "paragraph",
                  data: {
                    text: "✨ Welcome to your evidence notebook! Editor loaded successfully.",
                  },
                },
              ],
              version: "2.30.8",
            },
            placeholder: "Start writing... Press '/' for the full command menu",
            minHeight: 300,
            onChange: handleEditorChange,
            onReady: () => console.log("✅ Fallback EditorJS ready"),
            onError: (error: unknown) =>
              console.error("Fallback error:", error),
          });

          editorRef.current = fallbackEditor;
          toast.success("Editor initialized with clean state", {
            duration: 3000,
            position: "bottom-right",
          });
        } catch (fallbackError) {
          console.error("💥 Complete initialization failure:", fallbackError);
          toast.error(
            "Editor initialization failed. Please refresh the page.",
            {
              duration: 5000,
              position: "bottom-right",
            }
          );
        }
      }
    }

    return () => {
      if (editorRef.current) {
        try {
          editorRef.current.destroy();
          editorRef.current = null;
        } catch (error) {
          console.warn("Error destroying editor:", error);
          editorRef.current = null;
        }
      }
    };
  }, [isOpen, evidence?.content, handleEditorChange]);

  // Keyboard shortcut for save (Ctrl+S or Cmd+S)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault();
        handleSave();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen]);

  const handleSave = async () => {
    if (!editorRef.current) return;

    setIsLoading(true);
    try {
      const outputData = await editorRef.current.save();

      // Validate content before saving
      const validatedContent = validateAndMigrateEditorData(outputData);

      const updatedEvidence: EvidenceItem = {
        id: evidence?.id || formData.id || `evidence_${Date.now()}`,
        title: formData.title || "",
        type: formData.type || "Analysis",
        date: formData.date || new Date().toISOString().split("T")[0],
        owner: formData.owner || "",
        link: formData.link || "",
        hypothesis: formData.hypothesis || "",
        impactOnConfidence: formData.impactOnConfidence || "",
        summary: formData.title || "",
        createdBy: "current-user", // TODO: Get from auth context
        createdAt: evidence?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        content: validatedContent,
        context: evidence?.context || {
          type: "general",
          targetId: undefined,
          targetName: undefined,
        },
        position: evidence?.position || { x: 0, y: 0 },
        isVisible: evidence?.isVisible ?? true,
        isExpanded: evidence?.isExpanded ?? false,
        comments: evidence?.comments || [],
      };

      onSave(updatedEvidence);
      setLastSaved(new Date());
      toast.success("Evidence saved successfully!");
    } catch (error) {
      console.error("Error saving evidence:", error);
      toast.error("Failed to save evidence");
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    const option = evidenceTypeOptions.find((opt) => opt.value === type);
    return option?.icon || FileText;
  };

  const getTypeColor = (type: string) => {
    const option = evidenceTypeOptions.find((opt) => opt.value === type);
    return option?.color || "bg-gray-50 text-gray-700";
  };

  if (!isOpen) return null;

  const TypeIcon = getTypeIcon(formData.type || "Analysis");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className={`w-full h-[90vh] bg-white rounded-lg shadow-xl flex flex-col ${
          isFullscreen ? "max-w-[95vw]" : "max-w-6xl"
        } transition-all duration-300`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-4">
            <div
              className={`p-2 rounded-lg ${getTypeColor(formData.type || "Analysis")}`}
            >
              <TypeIcon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <Input
                value={formData.title}
                onChange={(e) =>
                  handleFormDataChange({ ...formData, title: e.target.value })
                }
                placeholder="Evidence title"
                className="text-2xl font-bold border-none p-0 focus:ring-0"
              />
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <Input
                    value={formData.owner}
                    onChange={(e) =>
                      handleFormDataChange({
                        ...formData,
                        owner: e.target.value,
                      })
                    }
                    placeholder="Owner"
                    className="border-none p-0 text-sm focus:ring-0"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      handleFormDataChange({
                        ...formData,
                        date: e.target.value,
                      })
                    }
                    className="border-none p-0 text-sm focus:ring-0"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={formData.type}
              onValueChange={(value) =>
                handleFormDataChange({ ...formData, type: value as any })
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {evidenceTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {onToggleFullscreen && (
              <Button
                variant="outline"
                onClick={onToggleFullscreen}
                title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
            )}
            <Button variant="outline" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              {/* Auto-save status indicator */}
              {isAutoSaving && (
                <div className="flex items-center gap-1 text-xs text-blue-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>Auto-saving</span>
                </div>
              )}
              {lastSaved && !isAutoSaving && (
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Saved</span>
                </div>
              )}
              <Button
                onClick={handleSave}
                disabled={isLoading || !formData.title}
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>

        {/* Auto-save indicator */}
        {(isAutoSaving || lastSaved) && (
          <div className="px-6 py-2 bg-blue-50 border-b border-blue-200">
            <div className="flex items-center gap-2 text-sm text-blue-700">
              {isAutoSaving ? (
                <>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>Auto-saving...</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Last saved: {lastSaved?.toLocaleTimeString()}</span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Metadata Section */}
        <div
          className={`px-6 py-4 border-b bg-gray-50 ${isFullscreen ? "py-2" : "py-4"}`}
        >
          <div
            className={`grid gap-4 ${isFullscreen ? "grid-cols-1 md:grid-cols-6" : "grid-cols-1 md:grid-cols-3"}`}
          >
            <div>
              <Label className="text-xs font-medium text-gray-600">
                Hypothesis
              </Label>
              <Input
                value={formData.hypothesis}
                onChange={(e) =>
                  handleFormDataChange({
                    ...formData,
                    hypothesis: e.target.value,
                  })
                }
                placeholder="What hypothesis is being tested?"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs font-medium text-gray-600">
                External Link
              </Label>
              <Input
                value={formData.link}
                onChange={(e) =>
                  handleFormDataChange({ ...formData, link: e.target.value })
                }
                placeholder="https://..."
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs font-medium text-gray-600">
                Impact on Confidence
              </Label>
              <Input
                value={formData.impactOnConfidence}
                onChange={(e) =>
                  handleFormDataChange({
                    ...formData,
                    impactOnConfidence: e.target.value,
                  })
                }
                placeholder="How does this affect confidence?"
                className="mt-1"
              />
            </div>
            <div className="md:col-span-3">
              <Label className="text-xs font-medium text-gray-600">Tags</Label>
              <EnhancedTagInput
                tags={formData.tags || []}
                onAdd={(tag) =>
                  handleFormDataChange({
                    ...formData,
                    tags: [...(formData.tags || []), tag],
                  })
                }
                onRemove={(tag) =>
                  handleFormDataChange({
                    ...formData,
                    tags: (formData.tags || []).filter((t) => t !== tag),
                  })
                }
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Editor Content */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full p-6">
            <div
              ref={editorContainerRef}
              className="h-full codex-editor"
              style={{ minHeight: "400px" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
