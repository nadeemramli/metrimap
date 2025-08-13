import {
  createEditorJSInstance,
  validateAndMigrateEditorData,
} from '@/lib/editorjs-config';
import { Button } from '@/shared/components/ui/button';
import { EnhancedTagInput } from '@/shared/components/ui/enhanced-tag-input';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { useAppStore } from '@/shared/stores/useAppStore';
import type { EvidenceItem } from '@/shared/types';
import EditorJS from '@editorjs/editorjs';
import {
  BookOpen,
  Calendar,
  FileText,
  FlaskConical,
  Globe,
  Maximize2,
  Minimize2,
  Save,
  User,
  Users,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

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
    value: 'Experiment',
    icon: FlaskConical,
    color: 'bg-blue-50 text-blue-700',
  },
  { value: 'Analysis', icon: FileText, color: 'bg-green-50 text-green-700' },
  { value: 'Notebook', icon: BookOpen, color: 'bg-purple-50 text-purple-700' },
  {
    value: 'External Research',
    icon: Globe,
    color: 'bg-orange-50 text-orange-700',
  },
  { value: 'User Interview', icon: Users, color: 'bg-pink-50 text-pink-700' },
];

// Debounce helper
function debounce<T extends (...args: any[]) => any>(func: T, wait: number) {
  let timeout: ReturnType<typeof setTimeout>;
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
  const { user } = useAppStore();
  const editorRef = useRef<EditorJS | null>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [formData, setFormData] = useState<Partial<EvidenceItem>>({
    id: evidence?.id || `evidence_${Date.now()}`,
    title: evidence?.title || '',
    type: evidence?.type || 'Analysis',
    date: evidence?.date || new Date().toISOString().split('T')[0],
    owner: evidence?.owner || '',
    link: evidence?.link || '',
    hypothesis: evidence?.hypothesis || '',
    impactOnConfidence: evidence?.impactOnConfidence || '',
    tags: evidence?.tags || [],
  });

  const autoSave = useCallback(
    debounce(async (content: any, metadata: Partial<EvidenceItem>) => {
      if (!editorRef.current) return;
      try {
        setIsAutoSaving(true);
        const validatedContent = validateAndMigrateEditorData(content);
        const updated: EvidenceItem = {
          id: evidence?.id || formData.id || `evidence_${Date.now()}`,
          title: metadata.title || '',
          type: metadata.type || 'Analysis',
          date: metadata.date || new Date().toISOString().split('T')[0],
          owner: metadata.owner || '',
          link: metadata.link || '',
          hypothesis: metadata.hypothesis || '',
          impactOnConfidence: metadata.impactOnConfidence || '',
          summary: metadata.title || '',
          createdBy: user?.id || 'anonymous-user',
          createdAt: evidence?.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          content: validatedContent,
          context: evidence?.context || {
            type: 'general',
            targetId: undefined,
            targetName: undefined,
          },
          position: evidence?.position || { x: 0, y: 0 },
          isVisible: evidence?.isVisible ?? true,
          isExpanded: evidence?.isExpanded ?? false,
          comments: evidence?.comments || [],
        };
        onSave(updated, { autoSave: true });
        setLastSaved(new Date());
      } finally {
        setIsAutoSaving(false);
      }
    }, 3000),
    [evidence, onSave]
  );

  const handleEditorChange = useCallback(async () => {
    if (!editorRef.current) return;
    setTimeout(async () => {
      try {
        const content = await editorRef.current!.save();
        autoSave(content, formData);
      } catch {}
    }, 100);
  }, [autoSave, formData]);

  const handleFormDataChange = useCallback(
    (newFormData: Partial<EvidenceItem>) => {
      setFormData(newFormData);
      if (editorRef.current) {
        setTimeout(() => {
          editorRef.current
            ?.save()
            .then((content) => autoSave(content, newFormData));
        }, 200);
      }
    },
    [autoSave]
  );

  useEffect(() => {
    if (isOpen && editorContainerRef.current && !editorRef.current) {
      const container = editorContainerRef.current;
      try {
        const editor = createEditorJSInstance({
          holder: container,
          data: evidence?.content,
          placeholder:
            "Start writing your evidence notebook... Press '/' for commands",
          minHeight: 300,
          onChange: handleEditorChange,
          onReady: () =>
            toast.success('📝 Editor ready!', {
              duration: 1500,
              position: 'bottom-right',
            }),
          onError: () =>
            toast.error('Editor error occurred. Auto-save remains active.'),
        });
        editorRef.current = editor;
      } catch (error) {
        // Fallback init
        const fallback = createEditorJSInstance({
          holder: container,
          data: {
            time: Date.now(),
            blocks: [
              {
                type: 'paragraph',
                data: { text: '✨ Welcome to your evidence notebook!' },
              },
            ],
            version: '2.30.8',
          },
          placeholder: "Start writing... Press '/' for the full command menu",
          minHeight: 300,
          onChange: handleEditorChange,
        });
        editorRef.current = fallback;
      }
    }
    return () => {
      if (editorRef.current) {
        try {
          editorRef.current.destroy();
        } catch {}
        editorRef.current = null;
      }
    };
  }, [isOpen, evidence?.content, handleEditorChange]);

  const handleSave = async () => {
    if (!editorRef.current) return;
    setIsLoading(true);
    try {
      const outputData = await editorRef.current.save();
      const validated = validateAndMigrateEditorData(outputData);
      const updated: EvidenceItem = {
        id: evidence?.id || formData.id || `evidence_${Date.now()}`,
        title: formData.title || '',
        type: formData.type || 'Analysis',
        date: formData.date || new Date().toISOString().split('T')[0],
        owner: formData.owner || '',
        link: formData.link || '',
        hypothesis: formData.hypothesis || '',
        impactOnConfidence: formData.impactOnConfidence || '',
        summary: formData.title || '',
        createdBy: user?.id || 'anonymous-user',
        createdAt: evidence?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        content: validated,
        context: evidence?.context || {
          type: 'general',
          targetId: undefined,
          targetName: undefined,
        },
        position: evidence?.position || { x: 0, y: 0 },
        isVisible: evidence?.isVisible ?? true,
        isExpanded: evidence?.isExpanded ?? false,
        comments: evidence?.comments || [],
      };
      onSave(updated);
      setLastSaved(new Date());
      toast.success('Evidence saved successfully!');
    } catch (error) {
      toast.error('Failed to save evidence');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;
  const TypeIcon =
    evidenceTypeOptions.find((o) => o.value === (formData.type || 'Analysis'))
      ?.icon || FileText;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className={`w-full h-[90vh] bg-white rounded-lg shadow-xl flex flex-col ${isFullscreen ? 'max-w-[95vw]' : 'max-w-6xl'} transition-all duration-300`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-4">
            <div className={`p-2 rounded-lg bg-gray-50`}>
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
                title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
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
                {isLoading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </div>

        {/* Metadata */}
        <div
          className={`px-6 py-4 border-b bg-gray-50 ${isFullscreen ? 'py-2' : 'py-4'}`}
        >
          <div
            className={`grid gap-4 ${isFullscreen ? 'grid-cols-1 md:grid-cols-6' : 'grid-cols-1 md:grid-cols-3'}`}
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

        {/* Editor */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full p-6">
            <div
              ref={editorContainerRef}
              className="h-full codex-editor"
              style={{ minHeight: '400px' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
