import { BaseEdge, EdgeLabelRenderer } from "@xyflow/react";
import type { EdgeProps } from "@xyflow/react";
import { Badge } from "@/components/ui/badge";

type OperativeEdgeData = {
  label?: string;
};

export default function OperativeEdge({
  path,
  selected,
  data,
}: EdgeProps<OperativeEdgeData>) {
  return (
    <>
      <BaseEdge
        path={path!}
        style={{
          stroke: selected ? "#2563eb" : "#6b7280",
          strokeWidth: 2,
          strokeDasharray: "4,2",
          opacity: selected ? 1 : 0.9,
        }}
      />
      <EdgeLabelRenderer>
        <div
          style={{ position: "absolute", transform: "translate(-50%, -50%)" }}
          className="pointer-events-none"
        >
          {data?.label && (
            <Badge variant="secondary" className="text-[10px]">
              {data.label}
            </Badge>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
