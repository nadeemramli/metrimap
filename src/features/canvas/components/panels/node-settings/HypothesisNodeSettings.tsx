/**
 * Hypothesis Node Settings Panel
 * Settings for Hypothesis Node with confidence, assumptions, and success criteria
 */

import { useState, useEffect } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Badge } from '@/shared/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Separator } from '@/shared/components/ui/separator';
import { Switch } from '@/shared/components/ui/switch';
import { 
  X, 
  Plus, 
  Lightbulb, 
  Target, 
  CheckSquare,
  AlertTriangle,
  Save,
  Trash2
} from 'lucide-react';
import type { HypothesisNode } from '@/shared/types';
import { cn } from '@/shared/utils';

interface HypothesisNodeSettingsProps {
  node: HypothesisNode;
  onSave: (updatedNode: Partial<HypothesisNode>) => void;
  onClose: () => void;
  isOpen: boolean;
}

const HypothesisNodeSettings = ({ node, onSave, onClose, isOpen }: HypothesisNodeSettingsProps) => {
  const [formData, setFormData] = useState<Partial<HypothesisNode>>({
    title: node.title || '',
    description: node.description || '',
    hypothesisType: node.hypothesisType || 'Factor',
    confidence: node.confidence || 'Medium',
    testable: node.testable || false,
    assumptions: node.assumptions || [],
    successCriteria: node.successCriteria || [],
    tags: node.tags || [],
  });

  const [newAssumption, setNewAssumption] = useState('');
  const [newCriteria, setNewCriteria] = useState('');
  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: node.title || '',
        description: node.description || '',
        hypothesisType: node.hypothesisType || 'Factor',
        confidence: node.confidence || 'Medium',
        testable: node.testable || false,
        assumptions: node.assumptions || [],
        successCriteria: node.successCriteria || [],
        tags: node.tags || [],
      });
      setErrors({});
    }
  }, [isOpen, node]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.hypothesisType) {
      newErrors.hypothesisType = 'Hypothesis type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  const addAssumption = () => {
    if (newAssumption.trim()) {
      setFormData(prev => ({
        ...prev,
        assumptions: [...(prev.assumptions || []), newAssumption.trim()]
      }));
      setNewAssumption('');
    }
  };

  const removeAssumption = (index: number) => {
    setFormData(prev => ({
      ...prev,
      assumptions: prev.assumptions?.filter((_, i) => i !== index) || []
    }));
  };

  const addCriteria = () => {
    if (newCriteria.trim()) {
      setFormData(prev => ({
        ...prev,
        successCriteria: [...(prev.successCriteria || []), newCriteria.trim()]
      }));
      setNewCriteria('');
    }
  };

  const removeCriteria = (index: number) => {
    setFormData(prev => ({
      ...prev,
      successCriteria: prev.successCriteria?.filter((_, i) => i !== index) || []
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(t => t !== tag) || []
    }));
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'High': return 'text-green-600';
      case 'Medium': return 'text-yellow-600';
      case 'Low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100">
              <Lightbulb className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <CardTitle>Hypothesis Node Settings</CardTitle>
              <CardDescription>Configure brainstorming and idea capture</CardDescription>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-sm font-medium">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter hypothesis title"
                className={cn(errors.title && "border-red-500")}
              />
              {errors.title && (
                <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                  <AlertTriangle className="w-3 h-3" />
                  {errors.title}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-medium">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe this hypothesis or idea"
                rows={3}
              />
            </div>
          </div>

          <Separator />

          {/* Hypothesis Configuration */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Hypothesis Configuration</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hypothesisType" className="text-sm font-medium">
                  Hypothesis Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.hypothesisType}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, hypothesisType: value as any }))}
                >
                  <SelectTrigger className={cn(errors.hypothesisType && "border-red-500")}>
                    <SelectValue placeholder="Select hypothesis type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Factor">Factor</SelectItem>
                    <SelectItem value="Seller Solution">Seller Solution</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="confidence" className="text-sm font-medium">Confidence Level</Label>
                <Select
                  value={formData.confidence}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, confidence: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select confidence" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">
                      <div className={cn("flex items-center gap-2", getConfidenceColor('High'))}>
                        <CheckSquare className="w-3 h-3" />
                        High Confidence
                      </div>
                    </SelectItem>
                    <SelectItem value="Medium">
                      <div className={cn("flex items-center gap-2", getConfidenceColor('Medium'))}>
                        <CheckSquare className="w-3 h-3" />
                        Medium Confidence
                      </div>
                    </SelectItem>
                    <SelectItem value="Low">
                      <div className={cn("flex items-center gap-2", getConfidenceColor('Low'))}>
                        <CheckSquare className="w-3 h-3" />
                        Low Confidence
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="testable"
                checked={formData.testable}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, testable: checked }))}
              />
              <Label htmlFor="testable" className="text-sm font-medium">
                This hypothesis is testable
              </Label>
            </div>
          </div>

          <Separator />

          {/* Assumptions */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-semibold text-gray-900">Assumptions</h3>
            </div>
            
            <div className="flex gap-2">
              <Input
                value={newAssumption}
                onChange={(e) => setNewAssumption(e.target.value)}
                placeholder="Add assumption"
                onKeyPress={(e) => e.key === 'Enter' && addAssumption()}
              />
              <Button onClick={addAssumption} size="sm">
                <Plus className="w-3 h-3" />
              </Button>
            </div>

            {formData.assumptions && formData.assumptions.length > 0 && (
              <div className="space-y-2">
                {formData.assumptions.map((assumption, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 bg-amber-50 rounded-md">
                    <span className="text-sm text-gray-700 flex-1">• {assumption}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAssumption(index)}
                      className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Success Criteria */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-green-500" />
              <h3 className="text-sm font-semibold text-gray-900">Success Criteria</h3>
            </div>
            
            <div className="flex gap-2">
              <Input
                value={newCriteria}
                onChange={(e) => setNewCriteria(e.target.value)}
                placeholder="Add success criteria"
                onKeyPress={(e) => e.key === 'Enter' && addCriteria()}
              />
              <Button onClick={addCriteria} size="sm">
                <Plus className="w-3 h-3" />
              </Button>
            </div>

            {formData.successCriteria && formData.successCriteria.length > 0 && (
              <div className="space-y-2">
                {formData.successCriteria.map((criteria, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 bg-green-50 rounded-md">
                    <span className="text-sm text-gray-700 flex-1">• {criteria}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCriteria(index)}
                      className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Tags */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Tags</h3>
            
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add tag"
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
              />
              <Button onClick={addTag} size="sm">
                <Plus className="w-3 h-3" />
              </Button>
            </div>

            {formData.tags && formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex items-center gap-2">
              <Save className="w-3 h-3" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HypothesisNodeSettings;
