/**
 * Action Node Settings Panel
 * Settings for Action Node with status, priority, assignee, and due date management
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
import { Calendar } from '@/shared/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { 
  X, 
  Plus, 
  Zap, 
  User, 
  Calendar as CalendarIcon, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  Pause, 
  Save,
  AlertTriangle
} from 'lucide-react';
import type { ActionNode } from '@/shared/types';
import { cn } from '@/shared/utils';
import { format } from 'date-fns';

interface ActionNodeSettingsProps {
  node: ActionNode;
  onSave: (updatedNode: Partial<ActionNode>) => void;
  onClose: () => void;
  isOpen: boolean;
}

const ActionNodeSettings = ({ node, onSave, onClose, isOpen }: ActionNodeSettingsProps) => {
  const [formData, setFormData] = useState<Partial<ActionNode>>({
    title: node.title || '',
    description: node.description || '',
    actionType: node.actionType || 'Initiative',
    status: node.status || 'Planning',
    priority: node.priority || 'Medium',
    assignee: node.assignee || '',
    dueDate: node.dueDate || '',
    effort: node.effort || 0,
    tags: node.tags || [],
  });

  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [calendarOpen, setCalendarOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: node.title || '',
        description: node.description || '',
        actionType: node.actionType || 'Initiative',
        status: node.status || 'Planning',
        priority: node.priority || 'Medium',
        assignee: node.assignee || '',
        dueDate: node.dueDate || '',
        effort: node.effort || 0,
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

    if (!formData.actionType) {
      newErrors.actionType = 'Action type is required';
    }

    if (formData.effort && formData.effort < 0) {
      newErrors.effort = 'Effort must be positive';
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Planning': return <Clock className="w-3 h-3" />;
      case 'In Progress': return <AlertCircle className="w-3 h-3" />;
      case 'Completed': return <CheckCircle className="w-3 h-3" />;
      case 'On Hold': return <Pause className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-600';
      case 'Medium': return 'text-yellow-600';
      case 'Low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100">
              <Zap className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <CardTitle>Action Node Settings</CardTitle>
              <CardDescription>Configure tasks and initiatives</CardDescription>
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
                placeholder="Enter action title"
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
                placeholder="Describe this action or initiative"
                rows={3}
              />
            </div>
          </div>

          <Separator />

          {/* Action Configuration */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Action Configuration</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="actionType" className="text-sm font-medium">
                  Action Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.actionType}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, actionType: value as any }))}
                >
                  <SelectTrigger className={cn(errors.actionType && "border-red-500")}>
                    <SelectValue placeholder="Select action type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Experiment">Experiment</SelectItem>
                    <SelectItem value="BAU">Business as Usual</SelectItem>
                    <SelectItem value="Initiative">Initiative</SelectItem>
                    <SelectItem value="Scope/Function">Scope/Function</SelectItem>
                    <SelectItem value="Business Driver">Business Driver</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status" className="text-sm font-medium">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Planning">
                      <div className="flex items-center gap-2">
                        {getStatusIcon('Planning')}
                        Planning
                      </div>
                    </SelectItem>
                    <SelectItem value="In Progress">
                      <div className="flex items-center gap-2">
                        {getStatusIcon('In Progress')}
                        In Progress
                      </div>
                    </SelectItem>
                    <SelectItem value="Completed">
                      <div className="flex items-center gap-2">
                        {getStatusIcon('Completed')}
                        Completed
                      </div>
                    </SelectItem>
                    <SelectItem value="On Hold">
                      <div className="flex items-center gap-2">
                        {getStatusIcon('On Hold')}
                        On Hold
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="priority" className="text-sm font-medium">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">
                      <div className={cn("flex items-center gap-2", getPriorityColor('High'))}>
                        <AlertTriangle className="w-3 h-3" />
                        High Priority
                      </div>
                    </SelectItem>
                    <SelectItem value="Medium">
                      <div className={cn("flex items-center gap-2", getPriorityColor('Medium'))}>
                        <AlertTriangle className="w-3 h-3" />
                        Medium Priority
                      </div>
                    </SelectItem>
                    <SelectItem value="Low">
                      <div className={cn("flex items-center gap-2", getPriorityColor('Low'))}>
                        <AlertTriangle className="w-3 h-3" />
                        Low Priority
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="effort" className="text-sm font-medium">Effort (Story Points)</Label>
                <Input
                  id="effort"
                  type="number"
                  min="0"
                  value={formData.effort || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, effort: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                  className={cn(errors.effort && "border-red-500")}
                />
                {errors.effort && (
                  <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                    <AlertTriangle className="w-3 h-3" />
                    {errors.effort}
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Assignment & Timeline */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Assignment & Timeline</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="assignee" className="text-sm font-medium">
                  <User className="w-3 h-3 inline mr-1" />
                  Assignee
                </Label>
                <Input
                  id="assignee"
                  value={formData.assignee}
                  onChange={(e) => setFormData(prev => ({ ...prev, assignee: e.target.value }))}
                  placeholder="Enter assignee name"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">
                  <CalendarIcon className="w-3 h-3 inline mr-1" />
                  Due Date
                </Label>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.dueDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.dueDate ? format(new Date(formData.dueDate), "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.dueDate ? new Date(formData.dueDate) : undefined}
                      onSelect={(date) => {
                        setFormData(prev => ({ ...prev, dueDate: date?.toISOString() || '' }));
                        setCalendarOpen(false);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
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

export default ActionNodeSettings;
