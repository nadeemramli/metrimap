import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  MoreVertical,
  Trash2,
  Copy,
  Edit3,
  Tag,
  User,
  Download,
  X,
  Check,
  AlertTriangle,
  Settings,
  FileText,
  Link,
} from "lucide-react";
import {
  useBulkOperations,
  type BulkUpdateData,
} from "@/hooks/useBulkOperations";
import { useAccessibility } from "@/hooks/useAccessibility";
import type {
  CardCategory,
  RelationshipType,
  ConfidenceLevel,
} from "@/lib/types";

interface BulkOperationsToolbarProps {
  className?: string;
}

export default function BulkOperationsToolbar({
  className,
}: BulkOperationsToolbarProps) {
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [updateType, setUpdateType] = useState<"metrics" | "relationships">(
    "metrics"
  );
  const [updateData, setUpdateData] = useState<BulkUpdateData>({});
  const [newTags, setNewTags] = useState("");

  const {
    hasSelection,
    selectionCount,
    isMultiSelect,
    selectedMetrics,
    selectedRelationships,
    isProcessing,
    lastResult,
    bulkUpdateMetrics,
    bulkUpdateRelationships,
    bulkDelete,
    bulkDuplicate,
    bulkAddTags,
    bulkRemoveTags,
    exportSelection,
    clearLastResult,
  } = useBulkOperations();

  const { announce, getARIAProps } = useAccessibility();

  if (!hasSelection) return null;

  const handleBulkUpdate = async () => {
    try {
      let result;
      if (updateType === "metrics") {
        result = await bulkUpdateMetrics(updateData);
      } else {
        result = await bulkUpdateRelationships(updateData);
      }

      if (result.success) {
        announce(`Successfully updated ${result.processed} ${updateType}`);
        setShowUpdateDialog(false);
        setUpdateData({});
      } else {
        announce(`Failed to update ${updateType}: ${result.errors.join(", ")}`);
      }
    } catch (error) {
      announce(`Error updating ${updateType}: ${error}`);
    }
  };

  const handleBulkDelete = async () => {
    try {
      const result = await bulkDelete();
      if (result.success) {
        announce(`Successfully deleted ${result.processed} items`);
        setShowDeleteConfirm(false);
      } else {
        announce(`Failed to delete items: ${result.errors.join(", ")}`);
      }
    } catch (error) {
      announce(`Error deleting items: ${error}`);
    }
  };

  const handleDuplicate = async () => {
    try {
      const result = await bulkDuplicate();
      if (result.success) {
        announce(`Successfully duplicated ${result.processed} items`);
      } else {
        announce(`Failed to duplicate items: ${result.errors.join(", ")}`);
      }
    } catch (error) {
      announce(`Error duplicating items: ${error}`);
    }
  };

  const handleAddTags = async () => {
    if (!newTags.trim()) return;

    try {
      const tags = newTags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
      const result = await bulkAddTags(tags);

      if (result.success) {
        announce(`Successfully added tags to ${result.processed} items`);
        setNewTags("");
      } else {
        announce(`Failed to add tags: ${result.errors.join(", ")}`);
      }
    } catch (error) {
      announce(`Error adding tags: ${error}`);
    }
  };

  const handleExport = async (format: "json" | "csv") => {
    try {
      await exportSelection(format);
      announce(`Exported ${selectionCount} items as ${format.toUpperCase()}`);
    } catch (error) {
      announce(`Error exporting: ${error}`);
    }
  };

  return (
    <>
      <div
        className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-background border rounded-lg shadow-lg p-4 flex items-center gap-3 z-40 ${className}`}
        {...getARIAProps({
          label: `${selectionCount} items selected`,
          role: "toolbar",
        })}
      >
        {/* Selection Info */}
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-sm">
            {selectionCount} selected
          </Badge>
          <span className="text-sm text-muted-foreground">
            {selectedMetrics.length > 0 && `${selectedMetrics.length} metrics`}
            {selectedMetrics.length > 0 &&
              selectedRelationships.length > 0 &&
              " • "}
            {selectedRelationships.length > 0 &&
              `${selectedRelationships.length} relationships`}
          </span>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          {selectedMetrics.length > 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleDuplicate}
              disabled={isProcessing}
              className="gap-2"
            >
              <Copy className="h-4 w-4" />
              Duplicate
            </Button>
          )}

          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowUpdateDialog(true)}
            disabled={isProcessing}
            className="gap-2"
          >
            <Edit3 className="h-4 w-4" />
            Edit
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isProcessing}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* More Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="outline">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Tag className="h-4 w-4 mr-2" />
                Tags
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <div className="p-2 space-y-2">
                  <div className="flex gap-1">
                    <Input
                      placeholder="Add tags (comma-separated)"
                      value={newTags}
                      onChange={(e) => setNewTags(e.target.value)}
                      className="h-8 text-xs"
                    />
                    <Button
                      size="sm"
                      onClick={handleAddTags}
                      disabled={!newTags.trim()}
                    >
                      <Check className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSeparator />

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Download className="h-4 w-4 mr-2" />
                Export
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => handleExport("json")}>
                  <FileText className="h-4 w-4 mr-2" />
                  Export as JSON
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("csv")}>
                  <FileText className="h-4 w-4 mr-2" />
                  Export as CSV
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => clearLastResult()}>
              <X className="h-4 w-4 mr-2" />
              Clear Selection
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Loading/Result Indicator */}
        {isProcessing && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
            Processing...
          </div>
        )}

        {lastResult && !isProcessing && (
          <div
            className={`flex items-center gap-2 text-sm ${lastResult.success ? "text-green-600" : "text-red-600"}`}
          >
            {lastResult.success ? (
              <Check className="h-4 w-4" />
            ) : (
              <AlertTriangle className="h-4 w-4" />
            )}
            {lastResult.success
              ? `${lastResult.processed} items updated`
              : `${lastResult.errors.length} errors`}
          </div>
        )}
      </div>

      {/* Bulk Update Dialog */}
      <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
        <DialogContent className="sm:max-w-[500px] bg-background border-border z-[100]">
          <DialogHeader>
            <DialogTitle>Bulk Update</DialogTitle>
            <DialogDescription>
              Update {selectionCount} selected item
              {selectionCount === 1 ? "" : "s"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Update Type Selection */}
            <div className="flex gap-2">
              <Button
                variant={updateType === "metrics" ? "default" : "outline"}
                size="sm"
                onClick={() => setUpdateType("metrics")}
                disabled={selectedMetrics.length === 0}
              >
                Metrics ({selectedMetrics.length})
              </Button>
              <Button
                variant={updateType === "relationships" ? "default" : "outline"}
                size="sm"
                onClick={() => setUpdateType("relationships")}
                disabled={selectedRelationships.length === 0}
              >
                Relationships ({selectedRelationships.length})
              </Button>
            </div>

            {/* Metrics Update Fields */}
            {updateType === "metrics" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={updateData.category || ""}
                    onValueChange={(value) =>
                      setUpdateData((prev) => ({
                        ...prev,
                        category: value || undefined,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No change</SelectItem>
                      <SelectItem value="Core/Value">Core/Value</SelectItem>
                      <SelectItem value="Data/Metric">Data/Metric</SelectItem>
                      <SelectItem value="Work/Action">Work/Action</SelectItem>
                      <SelectItem value="Ideas/Hypothesis">
                        Ideas/Hypothesis
                      </SelectItem>
                      <SelectItem value="Metadata">Metadata</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="owner">Owner</Label>
                  <Input
                    id="owner"
                    value={updateData.owner || ""}
                    onChange={(e) =>
                      setUpdateData((prev) => ({
                        ...prev,
                        owner: e.target.value || undefined,
                      }))
                    }
                    placeholder="Enter owner name"
                  />
                </div>

                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={updateData.tags?.join(", ") || ""}
                    onChange={(e) =>
                      setUpdateData((prev) => ({
                        ...prev,
                        tags: e.target.value
                          ? e.target.value.split(",").map((t) => t.trim())
                          : undefined,
                      }))
                    }
                    placeholder="Enter tags"
                  />
                </div>
              </div>
            )}

            {/* Relationships Update Fields */}
            {updateType === "relationships" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="rel-type">Relationship Type</Label>
                  <Select
                    value={updateData.type || ""}
                    onValueChange={(value) =>
                      setUpdateData((prev) => ({
                        ...prev,
                        type: value || undefined,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No change</SelectItem>
                      <SelectItem value="Causal">Causal</SelectItem>
                      <SelectItem value="Correlational">
                        Correlational
                      </SelectItem>
                      <SelectItem value="Probabilistic">
                        Probabilistic
                      </SelectItem>
                      <SelectItem value="Hierarchical">Hierarchical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="confidence">Confidence Level</Label>
                  <Select
                    value={updateData.confidence || ""}
                    onValueChange={(value) =>
                      setUpdateData((prev) => ({
                        ...prev,
                        confidence: value || undefined,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select confidence" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No change</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="weight">Weight (0-1)</Label>
                  <Input
                    id="weight"
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={updateData.weight || ""}
                    onChange={(e) =>
                      setUpdateData((prev) => ({
                        ...prev,
                        weight: e.target.value
                          ? parseFloat(e.target.value)
                          : undefined,
                      }))
                    }
                    placeholder="Enter weight"
                  />
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowUpdateDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleBulkUpdate} disabled={isProcessing}>
              {isProcessing ? "Updating..." : "Update All"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="bg-background border-border z-[100]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectionCount} selected item
              {selectionCount === 1 ? "" : "s"}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {selectedMetrics.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Metrics to delete:</h4>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {selectedMetrics.slice(0, 10).map((metric) => (
                  <div
                    key={metric.id}
                    className="text-sm text-muted-foreground"
                  >
                    • {metric.title}
                  </div>
                ))}
                {selectedMetrics.length > 10 && (
                  <div className="text-sm text-muted-foreground">
                    ... and {selectedMetrics.length - 10} more
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedRelationships.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Relationships to delete:</h4>
              <div className="text-sm text-muted-foreground">
                {selectedRelationships.length} relationship
                {selectedRelationships.length === 1 ? "" : "s"}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleBulkDelete}
              disabled={isProcessing}
            >
              {isProcessing ? "Deleting..." : "Delete All"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
