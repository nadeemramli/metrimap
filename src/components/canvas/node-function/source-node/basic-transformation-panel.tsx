"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Filter, Group, ArrowUpDown, Merge } from "lucide-react";

interface BasicTransformation {
  id: string;
  type: "filter" | "groupby" | "sort" | "join";
  config: any;
}

interface BasicTransformationPanelProps {
  columns: string[];
  onTransformationsChange: (transformations: BasicTransformation[]) => void;
  onSwitchToAdvanced: () => void;
}

export default function BasicTransformationPanel({
  columns,
  onTransformationsChange,
  onSwitchToAdvanced,
}: BasicTransformationPanelProps) {
  const [transformations, setTransformations] = useState<BasicTransformation[]>(
    []
  );

  const addTransformation = (type: BasicTransformation["type"]) => {
    const newTransformation: BasicTransformation = {
      id: Date.now().toString(),
      type,
      config: getDefaultConfig(type),
    };
    const updated = [...transformations, newTransformation];
    setTransformations(updated);
    onTransformationsChange(updated);
  };

  const removeTransformation = (id: string) => {
    const updated = transformations.filter((t) => t.id !== id);
    setTransformations(updated);
    onTransformationsChange(updated);
  };

  const updateTransformation = (id: string, config: any) => {
    const updated = transformations.map((t) =>
      t.id === id ? { ...t, config } : t
    );
    setTransformations(updated);
    onTransformationsChange(updated);
  };

  const getDefaultConfig = (type: BasicTransformation["type"]) => {
    switch (type) {
      case "filter":
        return { column: "", operator: "equals", value: "" };
      case "groupby":
        return { columns: [], aggregations: [] };
      case "sort":
        return { column: "", direction: "asc" };
      case "join":
        return { table: "", joinType: "inner", leftKey: "", rightKey: "" };
      default:
        return {};
    }
  };

  const renderTransformationConfig = (transformation: BasicTransformation) => {
    switch (transformation.type) {
      case "filter":
        return (
          <div className="grid grid-cols-3 gap-2">
            <Select
              value={transformation.config.column}
              onValueChange={(value) =>
                updateTransformation(transformation.id, {
                  ...transformation.config,
                  column: value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Column" />
              </SelectTrigger>
              <SelectContent>
                {columns.map((col) => (
                  <SelectItem key={col} value={col}>
                    {col}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={transformation.config.operator}
              onValueChange={(value) =>
                updateTransformation(transformation.id, {
                  ...transformation.config,
                  operator: value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="equals">Equals</SelectItem>
                <SelectItem value="not_equals">Not Equals</SelectItem>
                <SelectItem value="greater_than">Greater Than</SelectItem>
                <SelectItem value="less_than">Less Than</SelectItem>
                <SelectItem value="contains">Contains</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Value"
              value={transformation.config.value}
              onChange={(e) =>
                updateTransformation(transformation.id, {
                  ...transformation.config,
                  value: e.target.value,
                })
              }
            />
          </div>
        );
      case "groupby":
        return (
          <div className="space-y-2">
            <Label>Group by columns:</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select columns" />
              </SelectTrigger>
              <SelectContent>
                {columns.map((col) => (
                  <SelectItem key={col} value={col}>
                    {col}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      case "sort":
        return (
          <div className="grid grid-cols-2 gap-2">
            <Select
              value={transformation.config.column}
              onValueChange={(value) =>
                updateTransformation(transformation.id, {
                  ...transformation.config,
                  column: value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Column" />
              </SelectTrigger>
              <SelectContent>
                {columns.map((col) => (
                  <SelectItem key={col} value={col}>
                    {col}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={transformation.config.direction}
              onValueChange={(value) =>
                updateTransformation(transformation.id, {
                  ...transformation.config,
                  direction: value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      default:
        return null;
    }
  };

  const getTransformationIcon = (type: BasicTransformation["type"]) => {
    switch (type) {
      case "filter":
        return <Filter className="h-4 w-4" />;
      case "groupby":
        return <Group className="h-4 w-4" />;
      case "sort":
        return <ArrowUpDown className="h-4 w-4" />;
      case "join":
        return <Merge className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Basic Transformations</h3>
        <Button variant="outline" size="sm" onClick={onSwitchToAdvanced}>
          Switch to Advanced
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => addTransformation("filter")}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filter
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => addTransformation("groupby")}
          className="flex items-center gap-2"
        >
          <Group className="h-4 w-4" />
          Group By
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => addTransformation("sort")}
          className="flex items-center gap-2"
        >
          <ArrowUpDown className="h-4 w-4" />
          Sort
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => addTransformation("join")}
          className="flex items-center gap-2"
        >
          <Merge className="h-4 w-4" />
          Join
        </Button>
      </div>

      <div className="space-y-3">
        {transformations.map((transformation, index) => (
          <Card
            key={transformation.id}
            className="border-l-4 border-l-blue-500"
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {getTransformationIcon(transformation.type)}
                    {transformation.type.charAt(0).toUpperCase() +
                      transformation.type.slice(1)}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    Step {index + 1}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTransformation(transformation.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {renderTransformationConfig(transformation)}
            </CardContent>
          </Card>
        ))}
      </div>

      {transformations.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <Plus className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">
                Add your first transformation above
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
