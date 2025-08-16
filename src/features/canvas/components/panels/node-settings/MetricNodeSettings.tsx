/**
 * Metric Node Settings Panel
 * Settings for Metric Node with data source connections, formulas, and target values
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
import { 
  X, 
  Plus, 
  BarChart3, 
  Database, 
  Target,
  Calculator,
  TrendingUp,
  Save,
  AlertTriangle,
  Trash2
} from 'lucide-react';
import type { MetricNode } from '@/shared/types';
import { cn } from '@/shared/utils';

interface MetricNodeSettingsProps {
  node: MetricNode;
  onSave: (updatedNode: Partial<MetricNode>) => void;
  onClose: () => void;
  isOpen: boolean;
}

const MetricNodeSettings = ({ node, onSave, onClose, isOpen }: MetricNodeSettingsProps) => {
  const [formData, setFormData] = useState<Partial<MetricNode>>({
    title: node.title || '',
    description: node.description || '',
    metricType: node.metricType || 'Output Metric',
    sourceNodeId: node.sourceNodeId || '',
    unit: node.unit || '',
    targetValue: node.targetValue || 0,
    currentValue: node.currentValue || 0,
    formula: node.formula || '',
    dimensions: node.dimensions || [],
    segments: node.segments || [],
    tags: node.tags || [],
  });

  const [newDimension, setNewDimension] = useState('');
  const [newSegment, setNewSegment] = useState('');
  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: node.title || '',
        description: node.description || '',
        metricType: node.metricType || 'Output Metric',
        sourceNodeId: node.sourceNodeId || '',
        unit: node.unit || '',
        targetValue: node.targetValue || 0,
        currentValue: node.currentValue || 0,
        formula: node.formula || '',
        dimensions: node.dimensions || [],
        segments: node.segments || [],
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

    if (!formData.metricType) {
      newErrors.metricType = 'Metric type is required';
    }

    if (formData.targetValue && formData.targetValue < 0) {
      newErrors.targetValue = 'Target value must be positive';
    }

    if (formData.currentValue && formData.currentValue < 0) {
      newErrors.currentValue = 'Current value must be positive';
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

  const addDimension = () => {
    if (newDimension.trim() && !formData.dimensions?.includes(newDimension.trim())) {
      setFormData(prev => ({
        ...prev,
        dimensions: [...(prev.dimensions || []), newDimension.trim()]
      }));
      setNewDimension('');
    }
  };

  const removeDimension = (dimension: string) => {
    setFormData(prev => ({
      ...prev,
      dimensions: prev.dimensions?.filter(d => d !== dimension) || []
    }));
  };

  const addSegment = () => {
    if (newSegment.trim() && !formData.segments?.includes(newSegment.trim())) {
      setFormData(prev => ({
        ...prev,
        segments: [...(prev.segments || []), newSegment.trim()]
      }));
      setNewSegment('');
    }
  };

  const removeSegment = (segment: string) => {
    setFormData(prev => ({
      ...prev,
      segments: prev.segments?.filter(s => s !== segment) || []
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

  const getMetricTypeColor = (metricType: string) => {
    switch (metricType) {
      case 'North Star Metric': return 'text-yellow-600';
      case 'Leading KPI': return 'text-green-600';
      case 'Lagging KPI': return 'text-blue-600';
      case 'Input Metric': return 'text-purple-600';
      case 'Output Metric': return 'text-orange-600';
      case 'Diagnostic Metric': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
              <BarChart3 className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <CardTitle>Metric Node Settings</CardTitle>
              <CardDescription>Configure data-centric metric proxy</CardDescription>
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
                placeholder="Enter metric name"
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
                placeholder="Describe this metric"
                rows={3}
              />
            </div>
          </div>

          <Separator />

          {/* Metric Configuration */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Metric Configuration</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="metricType" className="text-sm font-medium">
                  Metric Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.metricType}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, metricType: value as any }))}
                >
                  <SelectTrigger className={cn(errors.metricType && "border-red-500")}>
                    <SelectValue placeholder="Select metric type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="North Star Metric">
                      <div className={cn("flex items-center gap-2", getMetricTypeColor('North Star Metric'))}>
                        <TrendingUp className="w-3 h-3" />
                        North Star Metric
                      </div>
                    </SelectItem>
                    <SelectItem value="Leading KPI">
                      <div className={cn("flex items-center gap-2", getMetricTypeColor('Leading KPI'))}>
                        <TrendingUp className="w-3 h-3" />
                        Leading KPI
                      </div>
                    </SelectItem>
                    <SelectItem value="Lagging KPI">
                      <div className={cn("flex items-center gap-2", getMetricTypeColor('Lagging KPI'))}>
                        <TrendingUp className="w-3 h-3" />
                        Lagging KPI
                      </div>
                    </SelectItem>
                    <SelectItem value="Input Metric">
                      <div className={cn("flex items-center gap-2", getMetricTypeColor('Input Metric'))}>
                        <TrendingUp className="w-3 h-3" />
                        Input Metric
                      </div>
                    </SelectItem>
                    <SelectItem value="Output Metric">
                      <div className={cn("flex items-center gap-2", getMetricTypeColor('Output Metric'))}>
                        <TrendingUp className="w-3 h-3" />
                        Output Metric
                      </div>
                    </SelectItem>
                    <SelectItem value="Diagnostic Metric">
                      <div className={cn("flex items-center gap-2", getMetricTypeColor('Diagnostic Metric'))}>
                        <TrendingUp className="w-3 h-3" />
                        Diagnostic Metric
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="unit" className="text-sm font-medium">Unit</Label>
                <Input
                  id="unit"
                  value={formData.unit}
                  onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                  placeholder="e.g., $, %, users"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="currentValue" className="text-sm font-medium">Current Value</Label>
                <Input
                  id="currentValue"
                  type="number"
                  value={formData.currentValue || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentValue: parseFloat(e.target.value) || 0 }))}
                  placeholder="0"
                  className={cn(errors.currentValue && "border-red-500")}
                />
              </div>

              <div>
                <Label htmlFor="targetValue" className="text-sm font-medium">
                  <Target className="w-3 h-3 inline mr-1" />
                  Target Value
                </Label>
                <Input
                  id="targetValue"
                  type="number"
                  value={formData.targetValue || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetValue: parseFloat(e.target.value) || 0 }))}
                  placeholder="0"
                  className={cn(errors.targetValue && "border-red-500")}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Data Source & Formula */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Data Source & Calculation</h3>
            
            <div>
              <Label htmlFor="sourceNodeId" className="text-sm font-medium">
                <Database className="w-3 h-3 inline mr-1" />
                Source Node ID
              </Label>
              <Input
                id="sourceNodeId"
                value={formData.sourceNodeId}
                onChange={(e) => setFormData(prev => ({ ...prev, sourceNodeId: e.target.value }))}
                placeholder="Connect to a Source Node"
              />
              <p className="text-xs text-gray-500 mt-1">
                Connect this metric to a Source Node for data pipeline
              </p>
            </div>

            <div>
              <Label htmlFor="formula" className="text-sm font-medium">
                <Calculator className="w-3 h-3 inline mr-1" />
                Formula
              </Label>
              <Textarea
                id="formula"
                value={formData.formula}
                onChange={(e) => setFormData(prev => ({ ...prev, formula: e.target.value }))}
                placeholder="e.g., SUM(revenue) / COUNT(customers)"
                rows={2}
                className="font-mono text-sm"
              />
            </div>
          </div>

          <Separator />

          {/* Dimensions */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Dimensions</h3>
            
            <div className="flex gap-2">
              <Input
                value={newDimension}
                onChange={(e) => setNewDimension(e.target.value)}
                placeholder="Add dimension (e.g., Region, Product)"
                onKeyPress={(e) => e.key === 'Enter' && addDimension()}
              />
              <Button onClick={addDimension} size="sm">
                <Plus className="w-3 h-3" />
              </Button>
            </div>

            {formData.dimensions && formData.dimensions.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.dimensions.map((dimension, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    {dimension}
                    <button
                      onClick={() => removeDimension(dimension)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Segments */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Segments</h3>
            
            <div className="flex gap-2">
              <Input
                value={newSegment}
                onChange={(e) => setNewSegment(e.target.value)}
                placeholder="Add segment (e.g., New Users, Premium)"
                onKeyPress={(e) => e.key === 'Enter' && addSegment()}
              />
              <Button onClick={addSegment} size="sm">
                <Plus className="w-3 h-3" />
              </Button>
            </div>

            {formData.segments && formData.segments.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.segments.map((segment, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {segment}
                    <button
                      onClick={() => removeSegment(segment)}
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

export default MetricNodeSettings;
