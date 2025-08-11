import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAppStore } from '@/lib/stores/appStore';
import type { EvidenceItem } from '@/lib/types';
import { BookOpen, FileText, FlaskConical, Globe, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

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

interface EvidenceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (evidence: EvidenceItem) => void;
  evidence?: EvidenceItem | null;
  title?: string;
  description?: string;
}

export default function EvidenceDialog({
  isOpen,
  onClose,
  onSave,
  evidence,
  title,
  description,
}: EvidenceDialogProps) {
  const { user } = useAppStore();
  const [formData, setFormData] = useState<Partial<EvidenceItem>>({
    title: '',
    type: 'Analysis',
    date: new Date().toISOString().split('T')[0],
    owner: '',
    summary: '',
    link: '',
    hypothesis: '',
    impactOnConfidence: '',
  });

  // Reset form when evidence changes or dialog opens
  useEffect(() => {
    if (evidence) {
      setFormData({
        title: evidence.title,
        type: evidence.type,
        date: evidence.date,
        owner: evidence.owner,
        summary: evidence.summary,
        link: evidence.link,
        hypothesis: evidence.hypothesis,
        impactOnConfidence: evidence.impactOnConfidence,
      });
    } else if (isOpen) {
      // Reset to default values when creating new evidence
      setFormData({
        title: '',
        type: 'Analysis',
        date: new Date().toISOString().split('T')[0],
        owner: '',
        summary: '',
        link: '',
        hypothesis: '',
        impactOnConfidence: '',
      });
    }
  }, [evidence, isOpen]);

  const handleSave = () => {
    if (!formData.title || !formData.summary) return;

    const evidenceData: EvidenceItem = {
      id: evidence?.id || `evidence_${Date.now()}`,
      title: formData.title!,
      type: formData.type as any,
      date: formData.date!,
      owner: formData.owner || 'Unknown',
      summary: formData.summary!,
      link: formData.link,
      hypothesis: formData.hypothesis,
      impactOnConfidence: formData.impactOnConfidence,
      createdAt: evidence?.createdAt || new Date().toISOString(),
      createdBy: evidence?.createdBy || user?.id || 'anonymous-user',
    };

    onSave(evidenceData);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {title || (evidence ? 'Edit Evidence' : 'Create New Evidence')}
          </DialogTitle>
          <DialogDescription>
            {description ||
              (evidence
                ? 'Update the evidence details below'
                : 'Add new evidence to support your relationships')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Evidence title"
              />
            </div>
            <div>
              <Label htmlFor="type">Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, type: value as any }))
                }
              >
                <SelectTrigger>
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
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="owner">Owner</Label>
              <Input
                id="owner"
                value={formData.owner}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, owner: e.target.value }))
                }
                placeholder="Evidence owner"
              />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, date: e.target.value }))
                }
              />
            </div>
          </div>

          <div>
            <Label htmlFor="summary">Summary *</Label>
            <Textarea
              id="summary"
              value={formData.summary}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, summary: e.target.value }))
              }
              placeholder="Evidence summary and key findings"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="hypothesis">Hypothesis</Label>
            <Textarea
              id="hypothesis"
              value={formData.hypothesis}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  hypothesis: e.target.value,
                }))
              }
              placeholder="Hypothesis being tested (optional)"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="link">External Link</Label>
            <Input
              id="link"
              type="url"
              value={formData.link}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, link: e.target.value }))
              }
              placeholder="https://..."
            />
          </div>

          <div>
            <Label htmlFor="impact">Impact on Confidence</Label>
            <Textarea
              id="impact"
              value={formData.impactOnConfidence}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  impactOnConfidence: e.target.value,
                }))
              }
              placeholder="How this evidence affects relationship confidence"
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!formData.title || !formData.summary}
          >
            {evidence ? 'Update Evidence' : 'Create Evidence'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
