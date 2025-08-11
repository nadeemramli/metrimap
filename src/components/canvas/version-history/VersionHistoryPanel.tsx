import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useCanvasStore } from '@/lib/stores';
import { useVersionHistoryStore } from '@/lib/stores/version-history/useVersionHistoryStore';
import type { CanvasSnapshot } from '@/lib/types/version-history';
import { format, formatDistanceToNow } from 'date-fns';
import {
  AlertCircle,
  BarChart3,
  Calendar,
  Camera,
  Clock,
  GitBranch,
  History,
  RotateCcw,
  Save,
  Trash2,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface VersionHistoryPanelProps {
  canvasId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function VersionHistoryPanel({
  canvasId,
  isOpen,
  onClose,
}: VersionHistoryPanelProps) {
  const {
    snapshots,
    isLoading,
    error,
    config,
    createSnapshot,
    loadSnapshots,
    restoreSnapshot,
    deleteSnapshot,
    updateConfig,
    getHistoryStats,
    checkAutoSnapshot,
  } = useVersionHistoryStore();

  const { canvas } = useCanvasStore();

  const [isCreatingSnapshot, setIsCreatingSnapshot] = useState(false);
  const [snapshotTitle, setSnapshotTitle] = useState('');
  const [snapshotDescription, setSnapshotDescription] = useState('');
  const [selectedSnapshot, setSelectedSnapshot] =
    useState<CanvasSnapshot | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  // Load snapshots when panel opens
  useEffect(() => {
    if (isOpen && canvasId) {
      loadSnapshots(canvasId);
    }
  }, [isOpen, canvasId, loadSnapshots]);

  // Auto-snapshot check
  useEffect(() => {
    if (config.autoSnapshotEnabled && canvasId) {
      const interval = setInterval(
        () => {
          checkAutoSnapshot(canvasId);
        },
        config.autoSnapshotInterval * 60 * 1000
      );

      return () => clearInterval(interval);
    }
  }, [
    config.autoSnapshotEnabled,
    config.autoSnapshotInterval,
    canvasId,
    checkAutoSnapshot,
  ]);

  const handleCreateSnapshot = async () => {
    if (!snapshotTitle.trim()) return;

    setIsCreatingSnapshot(true);
    try {
      await createSnapshot(
        canvasId,
        snapshotTitle,
        snapshotDescription || undefined
      );
      setSnapshotTitle('');
      setSnapshotDescription('');
    } catch (error) {
      console.error('Failed to create snapshot:', error);
    } finally {
      setIsCreatingSnapshot(false);
    }
  };

  const handleRestoreSnapshot = async (snapshot: CanvasSnapshot) => {
    if (
      !window.confirm(
        `Are you sure you want to restore to "${snapshot.title}"? This will replace your current canvas state.`
      )
    ) {
      return;
    }

    try {
      await restoreSnapshot(snapshot.id);
      onClose();
    } catch (error) {
      console.error('Failed to restore snapshot:', error);
    }
  };

  const handleDeleteSnapshot = async (snapshot: CanvasSnapshot) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the snapshot "${snapshot.title}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await deleteSnapshot(snapshot.id);
    } catch (error) {
      console.error('Failed to delete snapshot:', error);
    }
  };

  const getTriggerIcon = (triggerType: string) => {
    switch (triggerType) {
      case 'manual':
        return <Camera className="h-4 w-4" />;
      case 'auto':
        return <Clock className="h-4 w-4" />;
      case 'milestone':
        return <GitBranch className="h-4 w-4" />;
      default:
        return <Save className="h-4 w-4" />;
    }
  };

  const getTriggerColor = (triggerType: string) => {
    switch (triggerType) {
      case 'manual':
        return 'blue';
      case 'auto':
        return 'gray';
      case 'milestone':
        return 'purple';
      default:
        return 'gray';
    }
  };

  const stats = getHistoryStats();

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Canvas Version History
          </DialogTitle>
          <DialogDescription>
            Create snapshots and restore previous versions of your canvas
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="snapshots" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="snapshots">Snapshots</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent
            value="snapshots"
            className="flex-1 flex flex-col space-y-4"
          >
            {/* Create Snapshot Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Create New Snapshot</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  placeholder="Snapshot title (required)"
                  value={snapshotTitle}
                  onChange={(e) => setSnapshotTitle(e.target.value)}
                />
                <Textarea
                  placeholder="Description (optional)"
                  value={snapshotDescription}
                  onChange={(e) => setSnapshotDescription(e.target.value)}
                  rows={2}
                />
                <Button
                  onClick={handleCreateSnapshot}
                  disabled={!snapshotTitle.trim() || isCreatingSnapshot}
                  className="w-full"
                >
                  {isCreatingSnapshot ? (
                    <>Creating...</>
                  ) : (
                    <>
                      <Camera className="h-4 w-4 mr-2" />
                      Create Snapshot
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Error Display */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Snapshots List */}
            <Card className="flex-1">
              <CardHeader>
                <CardTitle className="text-sm flex items-center justify-between">
                  <span>Snapshots ({snapshots.length})</span>
                  {config.autoSnapshotEnabled && (
                    <Badge variant="outline" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      Auto-save ON
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[400px]">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                  ) : snapshots.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No snapshots created yet</p>
                      <p className="text-sm">
                        Create your first snapshot above
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 p-4">
                      {snapshots.map((snapshot) => (
                        <div
                          key={snapshot.id}
                          className="border rounded-lg p-3 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge
                                  variant="outline"
                                  className={`text-xs bg-${getTriggerColor(snapshot.metadata.triggerType)}-50`}
                                >
                                  {getTriggerIcon(
                                    snapshot.metadata.triggerType
                                  )}
                                  v{snapshot.version}
                                </Badge>
                                <span className="font-medium truncate">
                                  {snapshot.title}
                                </span>
                              </div>

                              {snapshot.description && (
                                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                  {snapshot.description}
                                </p>
                              )}

                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {formatDistanceToNow(
                                    new Date(snapshot.createdAt),
                                    { addSuffix: true }
                                  )}
                                </span>
                                <span className="flex items-center gap-1">
                                  <BarChart3 className="h-3 w-3" />
                                  {snapshot.metadata.nodeCount} nodes,{' '}
                                  {snapshot.metadata.edgeCount} edges
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 ml-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRestoreSnapshot(snapshot)}
                                title="Restore this snapshot"
                              >
                                <RotateCcw className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedSnapshot(snapshot)}
                                title="View details"
                              >
                                <BarChart3 className="h-3 w-3" />
                              </Button>
                              {snapshot.metadata.triggerType !== 'auto' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteSnapshot(snapshot)}
                                  title="Delete snapshot"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="statistics" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Total Snapshots</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.totalSnapshots}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {stats.snapshotsByType.manual} manual,{' '}
                    {stats.snapshotsByType.auto} auto,{' '}
                    {stats.snapshotsByType.milestone} milestones
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Total Changes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.totalCanvasChanges}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Tracked across all snapshots
                  </div>
                </CardContent>
              </Card>

              {stats.oldestSnapshot && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">History Range</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm">
                      <div>
                        From:{' '}
                        {format(new Date(stats.oldestSnapshot), 'MMM d, yyyy')}
                      </div>
                      <div>
                        To:{' '}
                        {format(new Date(stats.newestSnapshot!), 'MMM d, yyyy')}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {stats.averageTimeBetweenSnapshots && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Average Frequency</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-semibold">
                      {Math.round(stats.averageTimeBetweenSnapshots)}h
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Between snapshots
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Snapshot Types</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Manual Snapshots</span>
                    <span>{stats.snapshotsByType.manual}</span>
                  </div>
                  <Progress
                    value={
                      (stats.snapshotsByType.manual /
                        Math.max(stats.totalSnapshots, 1)) *
                      100
                    }
                    className="h-2"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Auto Snapshots</span>
                    <span>{stats.snapshotsByType.auto}</span>
                  </div>
                  <Progress
                    value={
                      (stats.snapshotsByType.auto /
                        Math.max(stats.totalSnapshots, 1)) *
                      100
                    }
                    className="h-2"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Milestones</span>
                    <span>{stats.snapshotsByType.milestone}</span>
                  </div>
                  <Progress
                    value={
                      (stats.snapshotsByType.milestone /
                        Math.max(stats.totalSnapshots, 1)) *
                      100
                    }
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">
                  Auto-Snapshot Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">
                    Enable Auto-Snapshots
                  </label>
                  <Button
                    variant={config.autoSnapshotEnabled ? 'default' : 'outline'}
                    size="sm"
                    onClick={() =>
                      updateConfig({
                        autoSnapshotEnabled: !config.autoSnapshotEnabled,
                      })
                    }
                  >
                    {config.autoSnapshotEnabled ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Interval (minutes)
                  </label>
                  <Input
                    type="number"
                    value={config.autoSnapshotInterval}
                    onChange={(e) =>
                      updateConfig({
                        autoSnapshotInterval: parseInt(e.target.value) || 30,
                      })
                    }
                    min="5"
                    max="1440"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Max Auto-Snapshots
                  </label>
                  <Input
                    type="number"
                    value={config.maxAutoSnapshots}
                    onChange={(e) =>
                      updateConfig({
                        maxAutoSnapshots: parseInt(e.target.value) || 20,
                      })
                    }
                    min="1"
                    max="100"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Retention Policy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Retention Days</label>
                  <Input
                    type="number"
                    value={config.retentionDays}
                    onChange={(e) =>
                      updateConfig({
                        retentionDays: parseInt(e.target.value) || 90,
                      })
                    }
                    min="1"
                    max="365"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Max Manual Snapshots
                  </label>
                  <Input
                    type="number"
                    value={config.maxManualSnapshots}
                    onChange={(e) =>
                      updateConfig({
                        maxManualSnapshots: parseInt(e.target.value) || 50,
                      })
                    }
                    min="1"
                    max="200"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Snapshot Details Modal */}
      {selectedSnapshot && (
        <Dialog
          open={!!selectedSnapshot}
          onOpenChange={() => setSelectedSnapshot(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Snapshot Details</DialogTitle>
              <DialogDescription>
                Version {selectedSnapshot.version} - {selectedSnapshot.title}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Canvas State</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-lg font-semibold">
                      {selectedSnapshot.metadata.nodeCount}
                    </div>
                    <div className="text-muted-foreground">Nodes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">
                      {selectedSnapshot.metadata.edgeCount}
                    </div>
                    <div className="text-muted-foreground">Edges</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">
                      {selectedSnapshot.metadata.groupCount}
                    </div>
                    <div className="text-muted-foreground">Groups</div>
                  </div>
                </div>
              </div>

              {selectedSnapshot.metadata.changesSinceLastSnapshot && (
                <div>
                  <h4 className="font-medium mb-2">Changes from Previous</h4>
                  <div className="text-sm space-y-1">
                    <div>
                      Nodes: +
                      {
                        selectedSnapshot.metadata.changesSinceLastSnapshot
                          .nodesAdded
                      }{' '}
                      -
                      {
                        selectedSnapshot.metadata.changesSinceLastSnapshot
                          .nodesDeleted
                      }{' '}
                      ~
                      {
                        selectedSnapshot.metadata.changesSinceLastSnapshot
                          .nodesModified
                      }
                    </div>
                    <div>
                      Edges: +
                      {
                        selectedSnapshot.metadata.changesSinceLastSnapshot
                          .edgesAdded
                      }{' '}
                      -
                      {
                        selectedSnapshot.metadata.changesSinceLastSnapshot
                          .edgesDeleted
                      }{' '}
                      ~
                      {
                        selectedSnapshot.metadata.changesSinceLastSnapshot
                          .edgesModified
                      }
                    </div>
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-medium mb-2">Metadata</h4>
                <div className="text-sm space-y-1">
                  <div>
                    Created:{' '}
                    {format(new Date(selectedSnapshot.createdAt), 'PPpp')}
                  </div>
                  <div>Type: {selectedSnapshot.metadata.triggerType}</div>
                  {selectedSnapshot.metadata.triggerReason && (
                    <div>Reason: {selectedSnapshot.metadata.triggerReason}</div>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setSelectedSnapshot(null)}
              >
                Close
              </Button>
              <Button onClick={() => handleRestoreSnapshot(selectedSnapshot)}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Restore This Version
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  );
}
