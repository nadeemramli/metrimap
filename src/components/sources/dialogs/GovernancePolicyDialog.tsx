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
import type { GovernancePolicy } from '@/types/source';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface GovernancePolicyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    policy: Omit<GovernancePolicy, 'id'> | GovernancePolicy
  ) => Promise<void>;
  governancePolicy?: GovernancePolicy; // For editing
  mode: 'create' | 'edit' | 'view';
}

const DEFAULT_FORM_DATA = {
  name: '',
  type: 'Retention',
  status: 'Under Review' as const,
  coverage: 0,
  lastReview: '',
  nextReview: '',
  owner: '',
  compliance: [] as string[],
};

export default function GovernancePolicyDialog({
  isOpen,
  onClose,
  onSave,
  governancePolicy,
  mode,
}: GovernancePolicyDialogProps) {
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [newCompliance, setNewCompliance] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (governancePolicy) {
      setFormData({
        name: governancePolicy.name,
        type: governancePolicy.type,
        status: governancePolicy.status,
        coverage: governancePolicy.coverage,
        lastReview: governancePolicy.lastReview.split('T')[0], // Convert to date input format
        nextReview: governancePolicy.nextReview.split('T')[0],
        owner: governancePolicy.owner,
        compliance: governancePolicy.compliance,
      });
    } else {
      // Set default dates
      const today = new Date();
      const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

      setFormData({
        ...DEFAULT_FORM_DATA,
        lastReview: today.toISOString().split('T')[0],
        nextReview: nextMonth.toISOString().split('T')[0],
      });
    }
  }, [governancePolicy]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const policyData = {
        ...formData,
        lastReview: formData.lastReview
          ? new Date(formData.lastReview).toISOString()
          : new Date().toISOString(),
        nextReview: formData.nextReview
          ? new Date(formData.nextReview).toISOString()
          : new Date().toISOString(),
      };

      if (mode === 'edit' && governancePolicy) {
        await onSave({ ...governancePolicy, ...policyData });
      } else {
        await onSave(policyData);
      }

      onClose();
    } catch (error) {
      console.error('Failed to save governance policy:', error);
    } finally {
      setIsLoading(false);
    }
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' && 'Create Governance Policy'}
            {mode === 'edit' && 'Edit Governance Policy'}
            {mode === 'view' && 'View Governance Policy'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' &&
              'Add a new governance policy for data compliance.'}
            {mode === 'edit' && 'Update the governance policy configuration.'}
            {mode === 'view' &&
              'View governance policy details and compliance status.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Policy Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="e.g., Data Retention Policy"
                disabled={isViewMode}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Policy Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, type: value }))
                }
                disabled={isViewMode}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Retention">Data Retention</SelectItem>
                  <SelectItem value="Access Control">Access Control</SelectItem>
                  <SelectItem value="Privacy">Privacy Protection</SelectItem>
                  <SelectItem value="Security">Security</SelectItem>
                  <SelectItem value="Quality">Data Quality</SelectItem>
                  <SelectItem value="Compliance">Compliance</SelectItem>
                  <SelectItem value="Governance">Data Governance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Status and Coverage */}
          <div className="grid grid-cols-2 gap-4">
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
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Under Review">Under Review</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="coverage">Coverage (%)</Label>
              <Input
                id="coverage"
                type="number"
                min="0"
                max="100"
                value={formData.coverage}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    coverage: parseInt(e.target.value) || 0,
                  }))
                }
                disabled={isViewMode}
              />
            </div>
          </div>

          {/* Review Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lastReview">Last Review Date</Label>
              <Input
                id="lastReview"
                type="date"
                value={formData.lastReview}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    lastReview: e.target.value,
                  }))
                }
                disabled={isViewMode}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nextReview">Next Review Date</Label>
              <Input
                id="nextReview"
                type="date"
                value={formData.nextReview}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    nextReview: e.target.value,
                  }))
                }
                disabled={isViewMode}
              />
            </div>
          </div>

          {/* Owner */}
          <div className="space-y-2">
            <Label htmlFor="owner">Policy Owner</Label>
            <Input
              id="owner"
              value={formData.owner}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, owner: e.target.value }))
              }
              placeholder="e.g., Data Governance Team, Legal Department"
              disabled={isViewMode}
            />
          </div>

          {/* Compliance Requirements */}
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
                <Select value={newCompliance} onValueChange={setNewCompliance}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select compliance requirement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GDPR">GDPR</SelectItem>
                    <SelectItem value="CCPA">CCPA</SelectItem>
                    <SelectItem value="HIPAA">HIPAA</SelectItem>
                    <SelectItem value="SOX">SOX</SelectItem>
                    <SelectItem value="PCI-DSS">PCI-DSS</SelectItem>
                    <SelectItem value="ISO 27001">ISO 27001</SelectItem>
                    <SelectItem value="SOC 2">SOC 2</SelectItem>
                    <SelectItem value="FERPA">FERPA</SelectItem>
                  </SelectContent>
                </Select>
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
            <Button onClick={handleSave} disabled={isLoading || !formData.name}>
              {isLoading ? 'Saving...' : mode === 'edit' ? 'Update' : 'Create'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
