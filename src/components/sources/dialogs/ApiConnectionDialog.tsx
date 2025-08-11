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
import type { ApiConnection } from '@/types/source';
import { useEffect, useState } from 'react';

interface ApiConnectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    connection: Omit<ApiConnection, 'id'> | ApiConnection
  ) => Promise<void>;
  apiConnection?: ApiConnection; // For editing
  mode: 'create' | 'edit' | 'view';
}

const DEFAULT_FORM_DATA = {
  name: '',
  type: 'REST',
  status: 'Disconnected' as const,
  lastPing: '',
  responseTime: null,
  uptime: 99.0,
  requestsToday: 0,
  errorRate: 0,
  version: '',
};

export default function ApiConnectionDialog({
  isOpen,
  onClose,
  onSave,
  apiConnection,
  mode,
}: ApiConnectionDialogProps) {
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (apiConnection) {
      setFormData({
        name: apiConnection.name,
        type: apiConnection.type,
        status: apiConnection.status,
        lastPing: apiConnection.lastPing,
        responseTime: apiConnection.responseTime,
        uptime: apiConnection.uptime,
        requestsToday: apiConnection.requestsToday,
        errorRate: apiConnection.errorRate,
        version: apiConnection.version,
      });
    } else {
      setFormData({
        ...DEFAULT_FORM_DATA,
        lastPing: new Date().toISOString(),
      });
    }
  }, [apiConnection]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (mode === 'edit' && apiConnection) {
        await onSave({ ...apiConnection, ...formData });
      } else {
        await onSave(formData);
      }

      onClose();
    } catch (error) {
      console.error('Failed to save API connection:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isViewMode = mode === 'view';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' && 'Create API Connection'}
            {mode === 'edit' && 'Edit API Connection'}
            {mode === 'view' && 'View API Connection'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' &&
              'Add a new API connection for data monitoring.'}
            {mode === 'edit' && 'Update the API connection configuration.'}
            {mode === 'view' && 'View API connection details and status.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Connection Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="e.g., Analytics API"
                disabled={isViewMode}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">API Type</Label>
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
                  <SelectItem value="REST">REST</SelectItem>
                  <SelectItem value="GraphQL">GraphQL</SelectItem>
                  <SelectItem value="WebSocket">WebSocket</SelectItem>
                  <SelectItem value="gRPC">gRPC</SelectItem>
                  <SelectItem value="SOAP">SOAP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Status and Version */}
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
                  <SelectItem value="Connected">Connected</SelectItem>
                  <SelectItem value="Warning">Warning</SelectItem>
                  <SelectItem value="Disconnected">Disconnected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="version">API Version</Label>
              <Input
                id="version"
                value={formData.version}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, version: e.target.value }))
                }
                placeholder="e.g., v2.1, 1.0.0"
                disabled={isViewMode}
              />
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="responseTime">Response Time (ms)</Label>
              <Input
                id="responseTime"
                type="number"
                min="0"
                value={formData.responseTime || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    responseTime: e.target.value
                      ? parseInt(e.target.value)
                      : null,
                  }))
                }
                disabled={isViewMode}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="uptime">Uptime (%)</Label>
              <Input
                id="uptime"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.uptime}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    uptime: parseFloat(e.target.value) || 0,
                  }))
                }
                disabled={isViewMode}
              />
            </div>
          </div>

          {/* Usage Statistics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="requestsToday">Requests Today</Label>
              <Input
                id="requestsToday"
                type="number"
                min="0"
                value={formData.requestsToday}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    requestsToday: parseInt(e.target.value) || 0,
                  }))
                }
                disabled={isViewMode}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="errorRate">Error Rate (%)</Label>
              <Input
                id="errorRate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.errorRate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    errorRate: parseFloat(e.target.value) || 0,
                  }))
                }
                disabled={isViewMode}
              />
            </div>
          </div>

          {/* Last Ping (read-only in edit mode) */}
          {(mode === 'view' || mode === 'edit') && (
            <div className="space-y-2">
              <Label htmlFor="lastPing">Last Ping</Label>
              <Input
                id="lastPing"
                value={new Date(formData.lastPing).toLocaleString()}
                disabled
              />
            </div>
          )}
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
