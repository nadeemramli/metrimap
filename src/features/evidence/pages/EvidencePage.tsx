import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import {
  createEditorJSInstance,
  validateAndMigrateEditorData,
} from '@/lib/editorjs-config';
import { useAppStore } from '@/shared/stores/useAppStore';
import { useEvidenceStore } from '@/features/evidence/stores/useEvidenceStore';
import type { EvidenceItem } from '@/shared/types';
import EditorJS from '@editorjs/editorjs';
import { ArrowLeft, Maximize2, Minimize2, Save } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

export default function EvidencePage() {
  const { evidenceId } = useParams();
  const navigate = useNavigate();
  const { getEvidenceById, addEvidence, updateEvidence } = useEvidenceStore();
  const { user } = useAppStore();

  const initialEvidence = evidenceId ? getEvidenceById(evidenceId) : null;

  const editorRef = useRef<EditorJS | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(true);
  const [formData, setFormData] = useState<Partial<EvidenceItem>>({
    id: initialEvidence?.id || `evidence_${Date.now()}`,
    title: initialEvidence?.title || '',
    type: initialEvidence?.type || 'Analysis',
    date: initialEvidence?.date || new Date().toISOString().split('T')[0],
    owner: initialEvidence?.owner || '',
    link: initialEvidence?.link || '',
    hypothesis: initialEvidence?.hypothesis || '',
    impactOnConfidence: initialEvidence?.impactOnConfidence || '',
  });

  const handleSave = useCallback(async () => {
    if (!editorRef.current) return;
    setIsLoading(true);
    try {
      const outputData = await editorRef.current.save();
      const validatedContent = validateAndMigrateEditorData(outputData);

      const updated: EvidenceItem = {
        id: initialEvidence?.id || (formData.id as string),
        title: formData.title || '',
        type: formData.type || 'Analysis',
        date: formData.date || new Date().toISOString().split('T')[0],
        owner: formData.owner || '',
        link: formData.link || '',
        hypothesis: formData.hypothesis || '',
        impactOnConfidence: formData.impactOnConfidence || '',
        summary: formData.title || '',
        createdBy: initialEvidence?.createdBy || user?.id || 'anonymous-user',
        createdAt: initialEvidence?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        content: validatedContent,
        context: initialEvidence?.context || { type: 'general' },
        position: initialEvidence?.position,
        isVisible: initialEvidence?.isVisible ?? true,
        isExpanded: initialEvidence?.isExpanded ?? false,
        comments: initialEvidence?.comments || [],
      };

      if (initialEvidence) {
        updateEvidence(initialEvidence.id, updated);
      } else {
        addEvidence(updated);
      }

      toast.success('Evidence saved successfully');
    } catch (error) {
      console.error('Error saving evidence:', error);
      toast.error('Failed to save evidence');
    } finally {
      setIsLoading(false);
    }
  }, [
    editorRef.current,
    formData,
    initialEvidence,
    addEvidence,
    updateEvidence,
  ]);

  useEffect(() => {
    if (!containerRef.current || editorRef.current) return;

    try {
      const editor = createEditorJSInstance({
        holder: containerRef.current,
        data: initialEvidence?.content,
        placeholder: "Write your evidence... Press '/' for commands",
        minHeight: 400,
        onReady: () => console.log('Evidence full page editor ready'),
        onError: (e) => console.error('Editor error:', e),
      });
      editorRef.current = editor;
    } catch (e) {
      console.error('Failed to init editor:', e);
    }

    return () => {
      if (editorRef.current) {
        try {
          editorRef.current.destroy();
          editorRef.current = null;
        } catch {}
      }
    };
  }, [containerRef.current, initialEvidence?.content]);

  return (
    <div className="w-full min-h-screen flex flex-col">
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Input
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="Evidence title"
            className="text-xl font-semibold border-none p-0 focus:ring-0"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={formData.type}
            onValueChange={(value) =>
              setFormData({ ...formData, type: value as any })
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[
                'Experiment',
                'Analysis',
                'Notebook',
                'External Research',
                'User Interview',
              ].map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => setIsFullscreen((s) => !s)}
            title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
          <Button onClick={handleSave} disabled={isLoading || !formData.title}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      <div className="p-4 border-b bg-gray-50">
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <div>
            <Label className="text-xs font-medium text-gray-600">Owner</Label>
            <Input
              value={formData.owner}
              onChange={(e) =>
                setFormData({ ...formData, owner: e.target.value })
              }
              placeholder="Owner"
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs font-medium text-gray-600">Date</Label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
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
                setFormData({ ...formData, link: e.target.value })
              }
              placeholder="https://..."
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <div className="flex-1">
        <div
          ref={containerRef}
          className="h-full codex-editor"
          style={{ minHeight: '70vh' }}
        />
      </div>
    </div>
  );
}
