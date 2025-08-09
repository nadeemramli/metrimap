import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertCircle, WifiOff } from "lucide-react";
import { useCanvasStore } from "@/lib/stores/canvasStore";
import { cn } from "@/lib/utils";

interface PersistenceStatusProps {
  className?: string;
}

/**
 * Shows the real-time persistence status of canvas changes
 * Useful for debugging and user feedback
 */
export function PersistenceStatus({ className }: PersistenceStatusProps) {
  const { pendingChanges, isSaving, lastSaved, error } = useCanvasStore();

  const getStatus = () => {
    if (error)
      return { type: "error", message: "Save failed", icon: AlertCircle };
    if (isSaving) return { type: "saving", message: "Saving...", icon: Clock };
    if (pendingChanges.size > 0)
      return {
        type: "pending",
        message: `${pendingChanges.size} unsaved`,
        icon: WifiOff,
      };
    return { type: "saved", message: "All saved", icon: CheckCircle };
  };

  const status = getStatus();
  const Icon = status.icon;

  const getVariant = () => {
    switch (status.type) {
      case "error":
        return "destructive";
      case "saving":
        return "secondary";
      case "pending":
        return "outline";
      case "saved":
        return "default";
      default:
        return "secondary";
    }
  };

  const getLastSavedText = () => {
    if (!lastSaved) return "";

    const diff = Date.now() - new Date(lastSaved).getTime();
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    if (minutes > 0) return ` • ${minutes}m ago`;
    if (seconds > 30) return ` • ${seconds}s ago`;
    return " • just now";
  };

  return (
    <div className={cn("flex items-center gap-2 text-xs", className)}>
      <Badge variant={getVariant()} className="flex items-center gap-1.5">
        <Icon
          className={cn("h-3 w-3", status.type === "saving" && "animate-spin")}
        />
        {status.message}
      </Badge>
      <span className="text-muted-foreground">{getLastSavedText()}</span>
    </div>
  );
}

export default PersistenceStatus;
