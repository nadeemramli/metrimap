import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { Switch } from '@/components/ui/switch';
import { AlertTriangle, Bell, Clock, Settings } from 'lucide-react';
import { useState } from 'react';

interface MonitoringSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: MonitoringSettings) => Promise<void>;
  currentSettings?: MonitoringSettings;
}

export interface MonitoringSettings {
  // Global monitoring settings
  enabled: boolean;
  refreshInterval: number; // minutes

  // API monitoring
  apiMonitoring: {
    enabled: boolean;
    healthCheckInterval: number; // minutes
    timeoutThreshold: number; // milliseconds
    errorRateThreshold: number; // percentage
  };

  // Data quality monitoring
  dataQualityMonitoring: {
    enabled: boolean;
    checkInterval: number; // hours
    qualityThreshold: number; // percentage
    recordCountVarianceThreshold: number; // percentage
  };

  // Alerts and notifications
  notifications: {
    enabled: boolean;
    emailAlerts: boolean;
    slackNotifications: boolean;
    webhookUrl?: string;
  };

  // Alert thresholds
  alertThresholds: {
    dataQualityBelow: number; // percentage
    apiResponseTimeAbove: number; // milliseconds
    errorRateAbove: number; // percentage
    uptimeBelow: number; // percentage
  };
}

const DEFAULT_SETTINGS: MonitoringSettings = {
  enabled: true,
  refreshInterval: 5,
  apiMonitoring: {
    enabled: true,
    healthCheckInterval: 2,
    timeoutThreshold: 5000,
    errorRateThreshold: 5,
  },
  dataQualityMonitoring: {
    enabled: true,
    checkInterval: 4,
    qualityThreshold: 95,
    recordCountVarianceThreshold: 20,
  },
  notifications: {
    enabled: true,
    emailAlerts: true,
    slackNotifications: false,
  },
  alertThresholds: {
    dataQualityBelow: 90,
    apiResponseTimeAbove: 1000,
    errorRateAbove: 5,
    uptimeBelow: 99,
  },
};

export default function MonitoringSettingsDialog({
  isOpen,
  onClose,
  onSave,
  currentSettings,
}: MonitoringSettingsDialogProps) {
  const [settings, setSettings] = useState<MonitoringSettings>(
    currentSettings || DEFAULT_SETTINGS
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onSave(settings);
      onClose();
    } catch (error) {
      console.error('Failed to save monitoring settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Monitoring Settings
          </DialogTitle>
          <DialogDescription>
            Configure monitoring, alerts, and data quality thresholds for your
            sources.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Global Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Global Monitoring
              </CardTitle>
              <CardDescription>
                Overall monitoring configuration and refresh settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="enabled">Enable Monitoring</Label>
                <Switch
                  id="enabled"
                  checked={settings.enabled}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev,
                      enabled: checked,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="refreshInterval">
                  Dashboard Refresh Interval (minutes)
                </Label>
                <Select
                  value={settings.refreshInterval.toString()}
                  onValueChange={(value) =>
                    setSettings((prev) => ({
                      ...prev,
                      refreshInterval: parseInt(value),
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 minute</SelectItem>
                    <SelectItem value="2">2 minutes</SelectItem>
                    <SelectItem value="5">5 minutes</SelectItem>
                    <SelectItem value="10">10 minutes</SelectItem>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* API Monitoring */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">API Monitoring</CardTitle>
              <CardDescription>
                Settings for API health checks and connection monitoring.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="apiEnabled">Enable API Monitoring</Label>
                <Switch
                  id="apiEnabled"
                  checked={settings.apiMonitoring.enabled}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev,
                      apiMonitoring: {
                        ...prev.apiMonitoring,
                        enabled: checked,
                      },
                    }))
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="healthCheckInterval">
                    Health Check Interval (minutes)
                  </Label>
                  <Input
                    id="healthCheckInterval"
                    type="number"
                    min="1"
                    max="60"
                    value={settings.apiMonitoring.healthCheckInterval}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        apiMonitoring: {
                          ...prev.apiMonitoring,
                          healthCheckInterval: parseInt(e.target.value) || 2,
                        },
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeoutThreshold">
                    Timeout Threshold (ms)
                  </Label>
                  <Input
                    id="timeoutThreshold"
                    type="number"
                    min="1000"
                    max="30000"
                    value={settings.apiMonitoring.timeoutThreshold}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        apiMonitoring: {
                          ...prev.apiMonitoring,
                          timeoutThreshold: parseInt(e.target.value) || 5000,
                        },
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Quality Monitoring */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Data Quality Monitoring</CardTitle>
              <CardDescription>
                Configure data quality checks and thresholds.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="dataQualityEnabled">
                  Enable Data Quality Monitoring
                </Label>
                <Switch
                  id="dataQualityEnabled"
                  checked={settings.dataQualityMonitoring.enabled}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev,
                      dataQualityMonitoring: {
                        ...prev.dataQualityMonitoring,
                        enabled: checked,
                      },
                    }))
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="checkInterval">Check Interval (hours)</Label>
                  <Input
                    id="checkInterval"
                    type="number"
                    min="1"
                    max="24"
                    value={settings.dataQualityMonitoring.checkInterval}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        dataQualityMonitoring: {
                          ...prev.dataQualityMonitoring,
                          checkInterval: parseInt(e.target.value) || 4,
                        },
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="qualityThreshold">
                    Quality Threshold (%)
                  </Label>
                  <Input
                    id="qualityThreshold"
                    type="number"
                    min="0"
                    max="100"
                    value={settings.dataQualityMonitoring.qualityThreshold}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        dataQualityMonitoring: {
                          ...prev.dataQualityMonitoring,
                          qualityThreshold: parseInt(e.target.value) || 95,
                        },
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications & Alerts
              </CardTitle>
              <CardDescription>
                Configure how you want to be notified about issues.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="notificationsEnabled">
                  Enable Notifications
                </Label>
                <Switch
                  id="notificationsEnabled"
                  checked={settings.notifications.enabled}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev,
                      notifications: {
                        ...prev.notifications,
                        enabled: checked,
                      },
                    }))
                  }
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="emailAlerts">Email Alerts</Label>
                  <Switch
                    id="emailAlerts"
                    checked={settings.notifications.emailAlerts}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        notifications: {
                          ...prev.notifications,
                          emailAlerts: checked,
                        },
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="slackNotifications">
                    Slack Notifications
                  </Label>
                  <Switch
                    id="slackNotifications"
                    checked={settings.notifications.slackNotifications}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        notifications: {
                          ...prev.notifications,
                          slackNotifications: checked,
                        },
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="webhookUrl">Webhook URL (optional)</Label>
                  <Input
                    id="webhookUrl"
                    type="url"
                    placeholder="https://hooks.slack.com/..."
                    value={settings.notifications.webhookUrl || ''}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        notifications: {
                          ...prev.notifications,
                          webhookUrl: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alert Thresholds */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Alert Thresholds
              </CardTitle>
              <CardDescription>
                Set thresholds that will trigger alerts when exceeded.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dataQualityBelow">
                    Data Quality Below (%)
                  </Label>
                  <Input
                    id="dataQualityBelow"
                    type="number"
                    min="0"
                    max="100"
                    value={settings.alertThresholds.dataQualityBelow}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        alertThresholds: {
                          ...prev.alertThresholds,
                          dataQualityBelow: parseInt(e.target.value) || 90,
                        },
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apiResponseTimeAbove">
                    API Response Time Above (ms)
                  </Label>
                  <Input
                    id="apiResponseTimeAbove"
                    type="number"
                    min="100"
                    max="10000"
                    value={settings.alertThresholds.apiResponseTimeAbove}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        alertThresholds: {
                          ...prev.alertThresholds,
                          apiResponseTimeAbove:
                            parseInt(e.target.value) || 1000,
                        },
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="errorRateAbove">Error Rate Above (%)</Label>
                  <Input
                    id="errorRateAbove"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={settings.alertThresholds.errorRateAbove}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        alertThresholds: {
                          ...prev.alertThresholds,
                          errorRateAbove: parseFloat(e.target.value) || 5,
                        },
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="uptimeBelow">Uptime Below (%)</Label>
                  <Input
                    id="uptimeBelow"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={settings.alertThresholds.uptimeBelow}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        alertThresholds: {
                          ...prev.alertThresholds,
                          uptimeBelow: parseFloat(e.target.value) || 99,
                        },
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Settings'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
