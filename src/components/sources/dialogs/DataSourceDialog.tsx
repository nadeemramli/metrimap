import { Badge } from '@/components/ui/badge';
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
import type { DataSource } from '@/types/source';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface DataSourceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (source: Omit<DataSource, 'id'> | DataSource) => Promise<void>;
  dataSource?: DataSource; // For editing
  mode: 'create' | 'edit' | 'view';
}

const DEFAULT_FORM_DATA = {
  metricName: '',
  sourceSystem: '',
  eventName: '',
  actor: '',
  trigger: '',
  status: 'Planned' as const,
  lastSync: null,
  dataQuality: null,
  recordsToday: 0,
  owner: '',
  description: '',
  tags: [] as string[],
  compliance: [] as string[],
};

export default function DataSourceDialog({
  isOpen,
  onClose,
  onSave,
  dataSource,
  mode,
}: DataSourceDialogProps) {
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [newTag, setNewTag] = useState('');
  const [newCompliance, setNewCompliance] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (dataSource) {
      setFormData({
        metricName: dataSource.metricName,
        sourceSystem: dataSource.sourceSystem,
        eventName: dataSource.eventName,
        actor: dataSource.actor,
        trigger: dataSource.trigger,
        status: dataSource.status,
        lastSync: dataSource.lastSync,
        dataQuality: dataSource.dataQuality,
        recordsToday: dataSource.recordsToday,
        owner: dataSource.owner,
        description: dataSource.description,
        tags: dataSource.tags,
        compliance: dataSource.compliance,
      });
    } else {
      setFormData(DEFAULT_FORM_DATA);
    }
  }, [dataSource]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const sourceData = {
        ...formData,
        lastSync: formData.lastSync || new Date().toISOString(),
      };

      if (mode === 'edit' && dataSource) {
        await onSave({ ...dataSource, ...sourceData });
      } else {
        await onSave(sourceData);
      }

      onClose();
    } catch (error) {
      console.error('Failed to save data source:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const addCompliance = () => {
    if (
      newCompliance.trim() &&
      !formData.compliance.includes(newCompliance.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        compliance: [...prev.compliance, newCompliance.trim()],
      }));
      setNewCompliance('');
    }
  };

  const removeCompliance = (complianceToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      compliance: prev.compliance.filter((c) => c !== complianceToRemove),
    }));
  };

  const isViewMode = mode === 'view';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' && 'Create Data Source'}
            {mode === 'edit' && 'Edit Data Source'}
            {mode === 'view' && 'View Data Source'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' &&
              'Add a new data source to track metrics and instrumentation.'}
            {mode === 'edit' &&
              'Update the data source configuration and settings.'}
            {mode === 'view' && 'View data source details and current status.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="metricName">Metric Name *</Label>
              <Input
                id="metricName"
                value={formData.metricName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    metricName: e.target.value,
                  }))
                }
                placeholder="e.g., User Signup Rate"
                disabled={isViewMode}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sourceSystem">Source System *</Label>
              <Input
                id="sourceSystem"
                value={formData.sourceSystem}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    sourceSystem: e.target.value,
                  }))
                }
                placeholder="e.g., Analytics Platform"
                disabled={isViewMode}
              />
            </div>
          </div>

          {/* Event Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="eventName">Event Name</Label>
              <Input
                id="eventName"
                value={formData.eventName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    eventName: e.target.value,
                  }))
                }
                placeholder="e.g., user_signup"
                disabled={isViewMode}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="actor">Actor</Label>
              <Input
                id="actor"
                value={formData.actor}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, actor: e.target.value }))
                }
                placeholder="e.g., User, System"
                disabled={isViewMode}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="trigger">Trigger</Label>
            <Input
              id="trigger"
              value={formData.trigger}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, trigger: e.target.value }))
              }
              placeholder="e.g., Form submission, Button click"
              disabled={isViewMode}
            />
          </div>

          {/* Status and Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, status: value as any }))
                }
                disabled={isViewMode}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planned">Planned</SelectItem>
                  <SelectItem value="Instrumented">Instrumented</SelectItem>
                  <SelectItem value="Needs QA">Needs QA</SelectItem>
                  <SelectItem value="Live">Live</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dataQuality">Data Quality (%)</Label>
              <Input
                id="dataQuality"
                type="number"
                min="0"
                max="100"
                value={formData.dataQuality || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    dataQuality: e.target.value
                      ? parseInt(e.target.value)
                      : null,
                  }))
                }
                disabled={isViewMode}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recordsToday">Records Today</Label>
              <Input
                id="recordsToday"
                type="number"
                min="0"
                value={formData.recordsToday}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    recordsToday: parseInt(e.target.value) || 0,
                  }))
                }
                disabled={isViewMode}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="owner">Owner</Label>
            <Input
              id="owner"
              value={formData.owner}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, owner: e.target.value }))
              }
              placeholder="e.g., Product Team, Engineering"
              disabled={isViewMode}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Describe what this data source tracks..."
              rows={3}
              disabled={isViewMode}
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {tag}
                  {!isViewMode && (
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeTag(tag)}
                    />
                  )}
                </Badge>
              ))}
            </div>
            {!isViewMode && (
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add tag..."
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                />
                <Button type="button" variant="outline" onClick={addTag}>
                  Add
                </Button>
              </div>
            )}
          </div>

          {/* Compliance */}
          <div className="space-y-2">
            <Label>Compliance Requirements</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.compliance.map((comp) => (
                <Badge
                  key={comp}
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  {comp}
                  {!isViewMode && (
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeCompliance(comp)}
                    />
                  )}
                </Badge>
              ))}
            </div>
            {!isViewMode && (
              <div className="flex gap-2">
                <Input
                  value={newCompliance}
                  onChange={(e) => setNewCompliance(e.target.value)}
                  placeholder="e.g., GDPR, CCPA, HIPAA"
                  onKeyPress={(e) => e.key === 'Enter' && addCompliance()}
                />
                <Button type="button" variant="outline" onClick={addCompliance}>
                  Add
                </Button>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {isViewMode ? 'Close' : 'Cancel'}
          </Button>
          {!isViewMode && (
            <Button
              onClick={handleSave}
              disabled={
                isLoading || !formData.metricName || !formData.sourceSystem
              }
            >
              {isLoading ? 'Saving...' : mode === 'edit' ? 'Update' : 'Create'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
