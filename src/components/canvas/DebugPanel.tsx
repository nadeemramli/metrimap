import { useState } from "react";
import { Panel } from "@xyflow/react";
import { cn } from "@/lib/utils";

interface DebugPanelProps {
  title: string;
  children: React.ReactNode;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  className?: string;
}

export default function DebugPanel({
  title,
  children,
  position = "top-left",
  className,
}: DebugPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Panel position={position} className={cn("z-10", className)}>
      <div className="bg-black/80 text-white rounded-lg text-xs font-mono">
        <div className="flex items-center justify-between p-2 border-b border-gray-600">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">?</span>
            <span className="font-bold">{title}</span>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {isExpanded ? "−" : "+"}
          </button>
        </div>
        {isExpanded && <div className="p-3 space-y-1">{children}</div>}
      </div>
    </Panel>
  );
}
