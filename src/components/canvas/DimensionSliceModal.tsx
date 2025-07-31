import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Layers, TrendingUp, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { MetricCard } from "@/lib/types";

interface DimensionSliceModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentCard: MetricCard;
  onSlice: (dimensions: string[], historyOption: HistoryOption) => void;
}

type HistoryOption = "manual" | "forfeit";

export default function DimensionSliceModal({
  isOpen,
  onClose,
  parentCard,
  onSlice,
}: DimensionSliceModalProps) {
  const [dimensions, setDimensions] = useState<string[]>([]);
  const [newDimension, setNewDimension] = useState("");
  const [historyOption, setHistoryOption] = useState<HistoryOption>("manual");
  const [isLoading, setIsLoading] = useState(false);

  const handleAddDimension = () => {
    const trimmed = newDimension.trim();
    if (trimmed && !dimensions.includes(trimmed)) {
      setDimensions([...dimensions, trimmed]);
      setNewDimension("");
    }
  };

  const handleRemoveDimension = (dimension: string) => {
    setDimensions(dimensions.filter((d) => d !== dimension));
  };

  const handleSlice = async () => {
    if (dimensions.length === 0) return;

    setIsLoading(true);
    try {
      await onSlice(dimensions, historyOption);
      onClose();
      // Reset form
      setDimensions([]);
      setNewDimension("");
      setHistoryOption("manual");
    } catch (error) {
      console.error("Error slicing metric:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddDimension();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Slice by Dimension
          </DialogTitle>
          <DialogDescription>
            Decompose "{parentCard.title}" into its constituent dimensions. This
            will create new metric cards for each dimension and convert the
            parent to a calculated metric.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Metric Info */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <span className="font-medium">Parent Metric</span>
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">{parentCard.title}</span>
              {parentCard.description && (
                <span className="block mt-1">{parentCard.description}</span>
              )}
            </p>
          </div>

          {/* Dimension Input */}
          <div className="space-y-3">
            <Label htmlFor="dimension-input">
              Dimensions to slice by <span className="text-destructive">*</span>
            </Label>
            <div className="flex gap-2">
              <Input
                id="dimension-input"
                placeholder="Enter dimension name (e.g., Paid, Organic, Viral)"
                value={newDimension}
                onChange={(e) => setNewDimension(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddDimension}
                disabled={!newDimension.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Current dimensions */}
            {dimensions.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Dimensions ({dimensions.length})
                </Label>
                <div className="flex flex-wrap gap-2">
                  {dimensions.map((dimension) => (
                    <Badge
                      key={dimension}
                      variant="secondary"
                      className="gap-1 pr-1"
                    >
                      {dimension}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0"
                        onClick={() => handleRemoveDimension(dimension)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Preview of new cards */}
          {dimensions.length > 0 && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                New metric cards that will be created:
              </Label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {dimensions.map((dimension) => (
                  <div
                    key={dimension}
                    className="text-sm p-2 bg-green-50 border border-green-200 rounded flex items-center gap-2"
                  >
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    <span className="font-medium">
                      {parentCard.title} ({dimension})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Historical Data Options */}
          <div className="space-y-3">
            <Label htmlFor="history-option">
              Historical Data Handling{" "}
              <span className="text-destructive">*</span>
            </Label>
            <Select
              value={historyOption}
              onValueChange={(value: HistoryOption) => setHistoryOption(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">
                  Manual Entry - New cards start empty, populate manually
                </SelectItem>
                <SelectItem value="forfeit">
                  Forfeit History - Archive parent data, start fresh from today
                </SelectItem>
              </SelectContent>
            </Select>

            <div className="text-xs text-muted-foreground">
              {historyOption === "manual" && (
                <p>
                  The new dimension cards will be created with no historical
                  data. You'll need to populate their values manually.
                </p>
              )}
              {historyOption === "forfeit" && (
                <p>
                  The parent metric's historical data will be archived and all
                  new dimension metrics will start collecting data from today
                  forward.
                </p>
              )}
            </div>
          </div>

          {/* Warning */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              This action will:
              <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                <li>Create {dimensions.length} new metric cards</li>
                <li>Convert "{parentCard.title}" to a calculated metric</li>
                <li>
                  Generate automatic sum formula:{" "}
                  {dimensions.map((d) => `[${d}]`).join(" + ")}
                </li>
                <li>
                  Create deterministic relationships between new cards and
                  parent
                </li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSlice}
            disabled={dimensions.length === 0 || isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <>Loading...</>
            ) : (
              <>
                <Layers className="h-4 w-4" />
                Slice Metric ({dimensions.length} dimension
                {dimensions.length === 1 ? "" : "s"})
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
