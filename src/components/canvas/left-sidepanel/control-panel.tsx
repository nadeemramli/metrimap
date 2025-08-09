"use client";

import { useState } from "react";
import type { Node } from "@xyflow/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Play,
  CalendarIcon,
  ToggleLeft,
  Calculator,
  Code,
  Settings,
  Type,
} from "lucide-react";
import { format } from "date-fns";

type OperatorNodeData = {
  label: string;
  operationType: "formula" | "boolean" | "datePicker";
  isActive: boolean;
  formula?: string;
  booleanValue?: boolean;
  dateValue?: string;
};

interface ControlPanelProps {
  operatorNodes: Node<OperatorNodeData>[];
  onUpdateNode: (nodeId: string, updates: Partial<OperatorNodeData>) => void;
  onBulkUpdate: (updates: Partial<OperatorNodeData>) => void;
  onSimulate: () => void;
  isSimulating: boolean;
}

export function ControlPanel({
  operatorNodes,
  onUpdateNode,
  onBulkUpdate,
  onSimulate,
  isSimulating,
}: ControlPanelProps) {
  const [bulkFormula, setBulkFormula] = useState("");
  const [bulkBoolean, setBulkBoolean] = useState(false);
  const [bulkDate, setBulkDate] = useState<Date>();
  const [ifStatement, setIfStatement] = useState("");
  const [dynamicText, setDynamicText] = useState("");

  return (
    <div className="p-4 space-y-4">
      {/* Simulate Control */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Play className="w-4 h-4" />
            Simulate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={onSimulate}
            disabled={isSimulating}
            className="w-full"
            variant={isSimulating ? "secondary" : "default"}
          >
            {isSimulating ? "Simulating..." : "Run Simulation"}
          </Button>
        </CardContent>
      </Card>

      {/* Date Picker All */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            Date Picker All
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {bulkDate ? format(bulkDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={bulkDate}
                onSelect={setBulkDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button
            onClick={() =>
              onBulkUpdate({
                operationType: "datePicker",
                dateValue: bulkDate?.toISOString(),
              })
            }
            className="w-full mt-2"
            size="sm"
            disabled={!bulkDate}
          >
            Apply to All
          </Button>
        </CardContent>
      </Card>

      {/* Toggle Control */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <ToggleLeft className="w-4 h-4" />
            Toggle
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <Switch checked={bulkBoolean} onCheckedChange={setBulkBoolean} />
            <Label className="text-sm">{bulkBoolean ? "True" : "False"}</Label>
          </div>
          <Button
            onClick={() =>
              onBulkUpdate({
                operationType: "boolean",
                booleanValue: bulkBoolean,
              })
            }
            className="w-full"
            size="sm"
          >
            Apply to All
          </Button>
        </CardContent>
      </Card>

      {/* Formula Control */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            Formula
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="Enter formula (e.g., x * 2 + 1)"
            value={bulkFormula}
            onChange={(e) => setBulkFormula(e.target.value)}
          />
          <Button
            onClick={() =>
              onBulkUpdate({
                operationType: "formula",
                formula: bulkFormula,
              })
            }
            className="w-full"
            size="sm"
            disabled={!bulkFormula}
          >
            Apply to All
          </Button>
        </CardContent>
      </Card>

      {/* If Statement */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Code className="w-4 h-4" />
            If Statement
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            placeholder="if (x > 0) { return x * 2; } else { return 0; }"
            value={ifStatement}
            onChange={(e) => setIfStatement(e.target.value)}
            rows={3}
          />
          <Button
            onClick={() =>
              onBulkUpdate({
                formula: ifStatement,
              })
            }
            className="w-full"
            size="sm"
            disabled={!ifStatement}
          >
            Apply Logic
          </Button>
        </CardContent>
      </Card>

      {/* Operator Control */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Operator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Select
            onValueChange={(value: "formula" | "boolean" | "datePicker") =>
              onBulkUpdate({ operationType: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select operation type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="formula">Formula</SelectItem>
              <SelectItem value="boolean">Boolean</SelectItem>
              <SelectItem value="datePicker">Date Picker</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center space-x-2">
            <Switch
              onCheckedChange={(checked) => onBulkUpdate({ isActive: checked })}
            />
            <Label className="text-sm">Enable All Operators</Label>
          </div>
        </CardContent>
      </Card>

      {/* Dynamic Text */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Type className="w-4 h-4" />
            Dynamic Text
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="Enter dynamic label"
            value={dynamicText}
            onChange={(e) => setDynamicText(e.target.value)}
          />
          <Button
            onClick={() =>
              onBulkUpdate({
                label: dynamicText || "Operator",
              })
            }
            className="w-full"
            size="sm"
            disabled={!dynamicText}
          >
            Update Labels
          </Button>
        </CardContent>
      </Card>

      <Separator />

      {/* Individual Node Controls */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700">Individual Nodes</h3>
        {operatorNodes.map((node) => (
          <Card key={node.id} className="p-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">{node.data.label}</span>
              <Switch
                checked={node.data.isActive}
                onCheckedChange={(checked) =>
                  onUpdateNode(node.id, { isActive: checked })
                }
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Type: {node.data.operationType}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
