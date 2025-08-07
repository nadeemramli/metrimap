import { useState, useRef, useCallback, useEffect } from "react";
import { Handle, Position } from "@xyflow/react";
import type { Node, NodeProps } from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FileText,
  MapPin,
  ChevronUp,
  Edit,
  Trash2,
  Calendar,
  User,
  ExternalLink,
  FlaskConical,
  BookOpen,
  Globe,
  Users,
  Save,
  X,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { useEvidenceStore } from "@/lib/stores/evidenceStore";
import type { EvidenceItem, EvidenceComment } from "@/lib/types";
import EvidenceContentRenderer from "@/components/evidence/EvidenceContentRenderer";
import { EnhancedTagInput } from "@/components/ui/enhanced-tag-input";
import {
  createEditorJSInstance,
  validateAndMigrateEditorData,
} from "@/lib/editorjs-config";
import EditorJS from "@editorjs/editorjs";
import { toast } from "sonner";

interface EvidenceNodeData extends Record<string, unknown> {
  evidence: EvidenceItem;
  onUpdateEvidence: (id: string, updates: Partial<EvidenceItem>) => void;
  onDeleteEvidence: (id: string) => void;
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

type EvidenceFlowNode = Node<EvidenceNodeData, "evidence">;

export default function EvidenceNode({ data }: NodeProps<EvidenceFlowNode>) {
  if (!data) return null;
  const { evidence, onUpdateEvidence, onDeleteEvidence } = data;
  const { addComment } = useEvidenceStore();

  const editorRef = useRef<EditorJS | null>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(evidence.isExpanded || false);
  const [isEditing, setIsEditing] = useState(false);
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [editForm, setEditForm] = useState<Partial<EvidenceItem>>({
    title: evidence.title,
    type: evidence.type,
    date: evidence.date,
    owner: evidence.owner,
    summary: evidence.summary,
    hypothesis: evidence.hypothesis,
    impactOnConfidence: evidence.impactOnConfidence,
    link: evidence.link,
    tags: evidence.tags || [],
  });

  const getTypeIcon = (type: string) => {
    const option = evidenceTypeOptions.find((opt) => opt.value === type);
    return option ? option.icon : FileText;
  };

  const getTypeColor = (type: string) => {
    const option = evidenceTypeOptions.find((opt) => opt.value === type);
    return option ? option.color : "bg-gray-50 text-gray-700";
  };

  // Auto-save function with debouncing
  const autoSave = useCallback(
    debounce(async (content: any, metadata: Partial<EvidenceItem>) => {
      const saveTime = new Date().toLocaleTimeString();
      console.log(
        `[${saveTime}] 💾 NODE AUTO-SAVE: Starting auto-save process`
      );

      if (!editorRef.current) {
        console.log(
          `[${saveTime}] ⚠️ NODE AUTO-SAVE: Editor not available, skipping`
        );
        return;
      }

      try {
        setIsAutoSaving(true);
        console.log(`[${saveTime}] 🔄 NODE AUTO-SAVE: Validating content`);

        const validatedContent = validateAndMigrateEditorData(content);

        const updatedEvidence: EvidenceItem = {
          ...evidence,
          ...metadata,
          content: validatedContent,
          updatedAt: new Date().toISOString(),
        };

        console.log(`[${saveTime}] 📤 NODE AUTO-SAVE: Saving to store`);
        onUpdateEvidence(evidence.id, updatedEvidence);
        setLastSaved(new Date());

        console.log(`[${saveTime}] ✅ NODE AUTO-SAVE: Success`);
      } catch (error) {
        const errorTime = new Date().toLocaleTimeString();
        console.error(`[${errorTime}] ❌ NODE AUTO-SAVE ERROR:`, error);
        toast.error("Auto-save failed", {
          duration: 2000,
          position: "bottom-right",
        });
      } finally {
        setIsAutoSaving(false);
      }
    }, 3000),
    [evidence, onUpdateEvidence]
  );

  // Handle editor changes for auto-save
  const handleEditorChange = useCallback(async () => {
    const changeTime = new Date().toLocaleTimeString();
    console.log(`[${changeTime}] ⚡ NODE CHANGE: Editor content changed`);

    if (!editorRef.current) {
      console.log(`[${changeTime}] ⚠️ NODE CHANGE: Editor not available`);
      return;
    }

    try {
      setTimeout(async () => {
        try {
          const content = await editorRef.current!.save();
          console.log(
            `[${new Date().toLocaleTimeString()}] 📝 NODE CHANGE: Content saved, triggering auto-save`
          );
          autoSave(content, editForm);
        } catch (error) {
          console.error(
            `[${new Date().toLocaleTimeString()}] ❌ NODE CHANGE ERROR:`,
            error
          );
        }
      }, 100);
    } catch (error) {
      console.error(`[${changeTime}] ❌ NODE CHANGE ERROR:`, error);
    }
  }, [autoSave, editForm]);

  const handleToggleExpanded = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    onUpdateEvidence(evidence.id, { isExpanded: newExpanded });
  };

  const handleSaveEdit = async () => {
    if (!editorRef.current) return;

    setIsLoading(true);
    try {
      const outputData = await editorRef.current.save();
      const validatedContent = validateAndMigrateEditorData(outputData);

      const updatedEvidence: EvidenceItem = {
        ...evidence,
        ...editForm,
        content: validatedContent,
        updatedAt: new Date().toISOString(),
      };

      onUpdateEvidence(evidence.id, updatedEvidence);
      setLastSaved(new Date());
      setIsEditing(false);
      toast.success("Evidence saved successfully!");
    } catch (error) {
      console.error("Error saving evidence:", error);
      toast.error("Failed to save evidence");
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize Editor.js when editing starts
  useEffect(() => {
    if (isEditing && editorContainerRef.current && !editorRef.current) {
      const container = editorContainerRef.current;
      if (!container) {
        console.warn("Editor container not found");
        return;
      }

      try {
        const initTime = new Date().toLocaleTimeString();
        console.log(
          `[${initTime}] 🚀 NODE INIT: Starting EditorJS initialization`
        );

        const editor = createEditorJSInstance({
          holder: container,
          data: evidence?.content,
          placeholder:
            "Start writing your evidence notebook... Press '/' for commands",
          minHeight: 200,
          onChange: handleEditorChange,
          onReady: () => {
            const readyTime = new Date().toLocaleTimeString();
            console.log(
              `[${readyTime}] 🎉 NODE INIT: Editor ready and operational`
            );
          },
          onError: (error) => {
            console.error("❌ NODE EditorJS error:", error);
            toast.error("Editor error occurred. Auto-saving is still active.", {
              duration: 3000,
              position: "bottom-right",
            });
          },
        });

        editorRef.current = editor;
      } catch (error) {
        console.error("❌ Failed to initialize stable EditorJS:", error);
        toast.error("Editor initialization failed.", {
          duration: 3000,
          position: "bottom-right",
        });
      }
    }

    return () => {
      if (editorRef.current && !isEditing) {
        try {
          editorRef.current.destroy();
          editorRef.current = null;
        } catch (error) {
          console.warn("Error destroying editor:", error);
          editorRef.current = null;
        }
      }
    };
  }, [isEditing, evidence?.content, handleEditorChange]);

  const handleAddComment = () => {
    if (newComment.trim()) {
      addComment(evidence.id, {
        content: newComment,
        author: "Current User", // TODO: Get from auth
      });
      setNewComment("");
      setIsCommentDialogOpen(false);
    }
  };

  const handleDeleteEvidence = () => {
    if (confirm("Are you sure you want to delete this evidence?")) {
      onDeleteEvidence(evidence.id);
    }
  };

  const TypeIcon = getTypeIcon(evidence.type);

  // If collapsed, show just the pin
  if (!isExpanded) {
    return (
      <div className="relative">
        <Handle type="target" position={Position.Top} className="w-3 h-3" />
        <Handle type="source" position={Position.Bottom} className="w-3 h-3" />

        <div className="flex flex-col items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleExpanded}
            className="h-8 w-8 p-0 rounded-full bg-white border-2 border-blue-500 hover:bg-blue-50"
            title={`${evidence.title} - Click to expand`}
          >
            <MapPin className="h-4 w-4 text-blue-600" />
          </Button>
          <div className="mt-1 text-xs text-gray-500 max-w-16 text-center truncate">
            {evidence.title}
          </div>
        </div>
      </div>
    );
  }

  // If expanded, show the full evidence card with editor
  return (
    <div className="relative">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />

      <Card
        className={`bg-white shadow-lg border-2 border-blue-200 ${
          isFullscreen ? "w-[95vw] max-w-[95vw]" : "w-80"
        } transition-all duration-300`}
      >
        <CardHeader className="pb-3 cursor-move evidence-drag-handle">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${getTypeColor(evidence.type)}`}>
                <TypeIcon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-2">
                    <Input
                      value={editForm.title}
                      onChange={(e) =>
                        setEditForm({ ...editForm, title: e.target.value })
                      }
                      placeholder="Evidence title"
                      className="text-lg font-bold border-none p-0 focus:ring-0"
                    />
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <Input
                          value={editForm.owner}
                          onChange={(e) =>
                            setEditForm({ ...editForm, owner: e.target.value })
                          }
                          placeholder="Owner"
                          className="border-none p-0 text-sm focus:ring-0"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <Input
                          type="date"
                          value={editForm.date}
                          onChange={(e) =>
                            setEditForm({ ...editForm, date: e.target.value })
                          }
                          className="border-none p-0 text-sm focus:ring-0"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <CardTitle className="text-lg font-semibold">
                      {evidence.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {evidence.type}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(evidence.date).toLocaleDateString()}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              {isEditing && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    title={
                      isFullscreen ? "Exit fullscreen" : "Enter fullscreen"
                    }
                  >
                    {isFullscreen ? (
                      <Minimize2 className="h-3 w-3" />
                    ) : (
                      <Maximize2 className="h-3 w-3" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSaveEdit}
                    disabled={isLoading}
                  >
                    <Save className="h-3 w-3 mr-1" />
                    {isLoading ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(false)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleExpanded}
                className="h-6 w-6 p-0"
              >
                <ChevronUp className="h-3 w-3" />
              </Button>
              {!isEditing && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="h-6 w-6 p-0"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDeleteEvidence}
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                  <Link to={`/evidence/${evidence.id}`} title="Open full page">
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </CardHeader>

        {/* Auto-save indicator */}
        {(isAutoSaving || lastSaved) && isEditing && (
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
        {isEditing && (
          <div className="px-6 py-4 border-b bg-gray-50">
            <div
              className={`grid gap-4 ${isFullscreen ? "grid-cols-1 md:grid-cols-6" : "grid-cols-1 md:grid-cols-3"}`}
            >
              <div>
                <Label className="text-xs font-medium text-gray-600">
                  Hypothesis
                </Label>
                <Input
                  value={editForm.hypothesis}
                  onChange={(e) =>
                    setEditForm({ ...editForm, hypothesis: e.target.value })
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
                  value={editForm.link}
                  onChange={(e) =>
                    setEditForm({ ...editForm, link: e.target.value })
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
                  value={editForm.impactOnConfidence}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      impactOnConfidence: e.target.value,
                    })
                  }
                  placeholder="How does this affect confidence?"
                  className="mt-1"
                />
              </div>
              <div className="md:col-span-3">
                <Label className="text-xs font-medium text-gray-600">
                  Tags
                </Label>
                <EnhancedTagInput
                  tags={editForm.tags || []}
                  onAdd={(tag) =>
                    setEditForm({
                      ...editForm,
                      tags: [...(editForm.tags || []), tag],
                    })
                  }
                  onRemove={(tag) =>
                    setEditForm({
                      ...editForm,
                      tags: (editForm.tags || []).filter((t) => t !== tag),
                    })
                  }
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        )}

        <CardContent className="space-y-3">
          {/* Content */}
          <div>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              CONTENT
            </span>
            <div className="mt-2">
              {isEditing ? (
                <div
                  ref={editorContainerRef}
                  className="codex-editor"
                  style={{ minHeight: "300px" }}
                />
              ) : (
                <EvidenceContentRenderer evidence={evidence} />
              )}
            </div>
          </div>

          {/* Link */}
          {evidence.link && !isEditing && (
            <div className="pt-2">
              <a
                href={evidence.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                <ExternalLink className="h-3 w-3" />
                View Source
              </a>
            </div>
          )}

          {/* Comments */}
          <div className="border-t pt-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                COMMENTS ({evidence.comments?.length || 0})
              </span>
            </div>

            {evidence.comments && evidence.comments.length > 0 && (
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {evidence.comments.map((comment: EvidenceComment) => (
                  <div
                    key={comment.id}
                    className="text-xs bg-gray-50 p-2 rounded border"
                  >
                    <div className="flex items-center gap-1 mb-1">
                      <User className="h-3 w-3" />
                      <span className="font-medium">{comment.author}</span>
                      <span className="text-gray-400">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-2 flex gap-2">
              <Input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
              />
              <Button
                variant="outline"
                disabled={!newComment.trim()}
                onClick={() => {
                  if (!newComment.trim()) return;
                  addComment(evidence.id, {
                    content: newComment,
                    author: "Current User",
                  });
                  setNewComment("");
                }}
                className="text-xs"
              >
                Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Comment Dialog */}
      <Dialog open={isCommentDialogOpen} onOpenChange={setIsCommentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Comment</DialogTitle>
            <DialogDescription>
              Add a comment to this evidence item
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Enter your comment..."
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCommentDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddComment}>Add Comment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
