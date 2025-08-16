/**
 * Value Node Settings Panel
 * Comprehensive settings for Value Node with all properties and validation
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
import { X, Plus, Target, Users, TrendingUp, Save, AlertCircle } from 'lucide-react';
import type { ValueNode } from '@/shared/types';
import { cn } from '@/shared/utils';

interface ValueNodeSettingsProps {
  node: ValueNode;
  onSave: (updatedNode: Partial<ValueNode>) => void;
  onClose: () => void;
  isOpen: boolean;
}

const ValueNodeSettings = ({ node, onSave, onClose, isOpen }: ValueNodeSettingsProps) => {
  const [formData, setFormData] = useState<Partial<ValueNode>>({
    title: node.title || '',
    description: node.description || '',
    valueType: node.valueType || 'Journey Step',
    businessImpact: node.businessImpact || 'Medium',
    stakeholders: node.stakeholders || [],
    tags: node.tags || [],
  });

  const [newStakeholder, setNewStakeholder] = useState('');
  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: node.title || '',
        description: node.description || '',
        valueType: node.valueType || 'Journey Step',
        businessImpact: node.businessImpact || 'Medium',
        stakeholders: node.stakeholders || [],
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

    if (!formData.valueType) {
      newErrors.valueType = 'Value type is required';
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

  const addStakeholder = () => {
    if (newStakeholder.trim() && !formData.stakeholders?.includes(newStakeholder.trim())) {
      setFormData(prev => ({
        ...prev,
        stakeholders: [...(prev.stakeholders || []), newStakeholder.trim()]
      }));
      setNewStakeholder('');
    }
  };

  const removeStakeholder = (stakeholder: string) => {
    setFormData(prev => ({
      ...prev,
      stakeholders: prev.stakeholders?.filter(s => s !== stakeholder) || []
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
              <Target className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <CardTitle>Value Node Settings</CardTitle>
              <CardDescription>Configure core business value chain component</CardDescription>
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
                placeholder="Enter value node title"
                className={cn(errors.title && "border-red-500")}
              />
              {errors.title && (
                <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                  <AlertCircle className="w-3 h-3" />
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
                placeholder="Describe this value component"
                rows={3}
              />
            </div>
          </div>

          <Separator />

          {/* Value Configuration */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Value Configuration</h3>
            
            <div>
              <Label htmlFor="valueType" className="text-sm font-medium">
                Value Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.valueType}
                onValueChange={(value) => setFormData(prev => ({ ...prev, valueType: value as any }))}
              >
                <SelectTrigger className={cn(errors.valueType && "border-red-500")}>
                  <SelectValue placeholder="Select value type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Journey Step">Journey Step</SelectItem>
                  <SelectItem value="Value Chain">Value Chain</SelectItem>
                  <SelectItem value="Critical Path">Critical Path</SelectItem>
                </SelectContent>
              </Select>
              {errors.valueType && (
                <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                  <AlertCircle className="w-3 h-3" />
                  {errors.valueType}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="businessImpact" className="text-sm font-medium">Business Impact</Label>
              <Select
                value={formData.businessImpact}
                onValueChange={(value) => setFormData(prev => ({ ...prev, businessImpact: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select business impact" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-3 h-3 text-red-600" />
                      High Impact
                    </div>
                  </SelectItem>
                  <SelectItem value="Medium">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-3 h-3 text-yellow-600" />
                      Medium Impact
                    </div>
                  </SelectItem>
                  <SelectItem value="Low">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-3 h-3 text-green-600" />
                      Low Impact
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Stakeholders */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              <h3 className="text-sm font-semibold text-gray-900">Stakeholders</h3>
            </div>
            
            <div className="flex gap-2">
              <Input
                value={newStakeholder}
                onChange={(e) => setNewStakeholder(e.target.value)}
                placeholder="Add stakeholder"
                onKeyPress={(e) => e.key === 'Enter' && addStakeholder()}
              />
              <Button onClick={addStakeholder} size="sm">
                <Plus className="w-3 h-3" />
              </Button>
            </div>

            {formData.stakeholders && formData.stakeholders.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.stakeholders.map((stakeholder, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {stakeholder}
                    <button
                      onClick={() => removeStakeholder(stakeholder)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
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

export default ValueNodeSettings;
