"use client";

import { memo, useState } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Settings,
  CalendarIcon,
  Calculator,
  ToggleLeft,
  GripVertical,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type OperatorNodeData = {
  label: string;
  operationType: "formula" | "boolean" | "datePicker";
  isActive: boolean;
  formula?: string;
  booleanValue?: boolean;
  dateValue?: string;
};

const OperatorNodeInner = memo(({ data, selected }: NodeProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localData, setLocalData] = useState((data || {}) as OperatorNodeData);

  const getOperationIcon = () => {
    switch (localData.operationType) {
      case "formula":
        return <Calculator className="w-4 h-4" />;
      case "boolean":
        return <ToggleLeft className="w-4 h-4" />;
      case "datePicker":
        return <CalendarIcon className="w-4 h-4" />;
      default:
        return <Settings className="w-4 h-4" />;
    }
  };

  const getOperationColor = () => {
    switch (localData.operationType) {
      case "formula":
        return "bg-blue-500";
      case "boolean":
        return "bg-green-500";
      case "datePicker":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card
      className={cn(
        "min-w-[220px] bg-card border-2 rounded-lg shadow-lg transition-all duration-200",
        selected && "ring-2 ring-blue-500",
        localData.isActive ? "opacity-100" : "opacity-60"
      )}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-gray-400"
      />

      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">
            {localData.label}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-6 w-6 p-0"
          >
            <Settings className="w-3 h-3" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <div className={cn("w-2 h-2 rounded-full", getOperationColor())} />
          <Badge variant="secondary" className="text-xs">
            {getOperationIcon()}
            <span className="ml-1 capitalize">{localData.operationType}</span>
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {isExpanded && (
          <div className="space-y-3 mt-2">
            <Select
              value={localData.operationType}
              onValueChange={(value: "formula" | "boolean" | "datePicker") =>
                setLocalData({ ...localData, operationType: value })
              }
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="formula">Formula</SelectItem>
                <SelectItem value="boolean">Boolean</SelectItem>
                <SelectItem value="datePicker">Date Picker</SelectItem>
              </SelectContent>
            </Select>

            {localData.operationType === "formula" && (
              <Input
                placeholder="Enter formula (e.g., x * 2)"
                value={localData.formula || ""}
                onChange={(e) =>
                  setLocalData({ ...localData, formula: e.target.value })
                }
                className="h-8 text-xs"
              />
            )}

            {localData.operationType === "boolean" && (
              <div className="flex items-center space-x-2">
                <Switch
                  checked={localData.booleanValue || false}
                  onCheckedChange={(checked) =>
                    setLocalData({ ...localData, booleanValue: checked })
                  }
                />
                <span className="text-xs">
                  {localData.booleanValue ? "True" : "False"}
                </span>
              </div>
            )}

            {localData.operationType === "datePicker" && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-8 text-xs justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-3 w-3" />
                    {localData.dateValue
                      ? format(new Date(localData.dateValue), "PPP")
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={
                      localData.dateValue
                        ? new Date(localData.dateValue)
                        : undefined
                    }
                    onSelect={(date) =>
                      setLocalData({
                        ...localData,
                        dateValue: date?.toISOString() || "",
                      })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            )}
          </div>
        )}

        <div className="mt-2 text-xs text-gray-500">
          Status: {localData.isActive ? "Active" : "Inactive"}
        </div>
      </CardContent>

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-gray-400"
      />
      {/* Drag Section */}
      <div className="p-2 border-t border-border/30 bg-muted/20">
        <div className="drag-handle__custom flex justify-center cursor-grab active:cursor-grabbing">
          <div className="flex items-center gap-1 px-3 py-1.5 bg-muted/80 backdrop-blur-sm rounded-full text-xs text-muted-foreground hover:bg-muted/90 transition-colors border border-border/50 shadow-sm">
            <GripVertical className="w-3 h-3" />
            <span className="font-medium select-none">Drag</span>
            <GripVertical className="w-3 h-3" />
          </div>
        </div>
      </div>
    </Card>
  );
});

OperatorNodeInner.displayName = "OperatorNode";
export default OperatorNodeInner;
