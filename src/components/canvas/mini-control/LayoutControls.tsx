import { useState } from "react";
import { ControlButton } from "@xyflow/react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutGrid,
  ArrowUpDown,
  ArrowDownUp,
  ArrowLeftRight,
  ArrowRightLeft,
  Play,
} from "lucide-react";
import { type LayoutDirection } from "@/lib/utils/autoLayout";

interface LayoutControlsProps {
  onApplyLayout: (direction: LayoutDirection) => void;
  currentDirection?: LayoutDirection;
}

const LAYOUT_OPTIONS = [
  { value: "TB", label: "Top to Bottom", icon: ArrowUpDown },
  { value: "BT", label: "Bottom to Top", icon: ArrowDownUp },
  { value: "LR", label: "Left to Right", icon: ArrowLeftRight },
  { value: "RL", label: "Right to Left", icon: ArrowRightLeft },
] as const;

export default function LayoutControls({
  onApplyLayout,
  currentDirection = "TB",
}: LayoutControlsProps) {
  const [isApplying, setIsApplying] = useState(false);

  const handleApplyLayout = async (direction: LayoutDirection) => {
    setIsApplying(true);
    try {
      onApplyLayout(direction);
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div>
          <ControlButton title="Layout Options">
            {isApplying ? (
              <Play className="h-4 w-4 animate-spin" />
            ) : (
              <LayoutGrid className="h-4 w-4" />
            )}
          </ControlButton>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="p-2">
          <div className="text-sm font-medium mb-2">Layout Direction</div>
          <div className="space-y-1">
            {LAYOUT_OPTIONS.map((option) => {
              const Icon = option.icon;
              return (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => handleApplyLayout(option.value)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Icon className="h-4 w-4" />
                  <span>{option.label}</span>
                  {option.value === currentDirection && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      Current
                    </Badge>
                  )}
                </DropdownMenuItem>
              );
            })}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
