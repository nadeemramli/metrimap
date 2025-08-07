"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Database, BarChart3, LineChart, PieChart, Grip } from "lucide-react";

interface Column {
  id: string;
  name: string;
  type: "string" | "number";
}

interface DataSource {
  id: string;
  name: string;
  columns: Column[];
  data: any[];
}

interface ConfigPanelProps {
  selectedNode: string | null;
  selectedNodeData: any;
  dataSources: DataSource[];
  selectedDataSource: DataSource;
  onDataSourceChange: (dataSource: DataSource) => void;
  onNodeDataUpdate: (nodeId: string, data: any) => void;
}

export function ConfigPanel({
  selectedNode,
  selectedNodeData,
  dataSources,
  selectedDataSource,
  onDataSourceChange,
  onNodeDataUpdate,
}: ConfigPanelProps) {
  const handleDragStart = (e: React.DragEvent, column: Column) => {
    e.dataTransfer.setData("application/json", JSON.stringify(column));
  };

  const handleDrop = (e: React.DragEvent, axis: "xAxis" | "yAxis") => {
    e.preventDefault();
    const columnData = JSON.parse(e.dataTransfer.getData("application/json"));

    if (selectedNode) {
      const updatedData = {
        [axis]: columnData.id,
        data: selectedDataSource.data,
      };
      onNodeDataUpdate(selectedNode, updatedData);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const updateChartType = (chartType: string) => {
    if (selectedNode) {
      onNodeDataUpdate(selectedNode, { chartType });
    }
  };

  const updateTitle = (title: string) => {
    if (selectedNode) {
      onNodeDataUpdate(selectedNode, { title });
    }
  };

  if (!selectedNode) {
    return (
      <div className="w-80 bg-white border-l p-6 flex items-center justify-center text-gray-500">
        <p>Select a chart node to configure</p>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-l overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Chart Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Chart Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-xs">
                Chart Title
              </Label>
              <Input
                id="title"
                value={selectedNodeData?.title || ""}
                onChange={(e) => updateTitle(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-xs">Chart Type</Label>
              <Select
                value={selectedNodeData?.chartType}
                onValueChange={updateChartType}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Bar Chart
                    </div>
                  </SelectItem>
                  <SelectItem value="line">
                    <div className="flex items-center gap-2">
                      <LineChart className="w-4 h-4" />
                      Line Chart
                    </div>
                  </SelectItem>
                  <SelectItem value="pie">
                    <div className="flex items-center gap-2">
                      <PieChart className="w-4 h-4" />
                      Pie Chart
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Data Source */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Database className="w-4 h-4" />
              Data Source
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={selectedDataSource.id}
              onValueChange={(value) => {
                const dataSource = dataSources.find((ds) => ds.id === value);
                if (dataSource) onDataSourceChange(dataSource);
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {dataSources.map((ds) => (
                  <SelectItem key={ds.id} value={ds.id}>
                    {ds.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Chart Axes Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Chart Axes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xs">X-Axis (Dimension)</Label>
              <div
                className="mt-1 p-3 border-2 border-dashed border-gray-200 rounded-md min-h-[40px] flex items-center justify-center text-sm text-gray-500 hover:border-gray-300 transition-colors"
                onDrop={(e) => handleDrop(e, "xAxis")}
                onDragOver={handleDragOver}
              >
                {selectedNodeData?.xAxis ? (
                  <Badge variant="secondary">{selectedNodeData.xAxis}</Badge>
                ) : (
                  "Drop dimension here"
                )}
              </div>
            </div>

            <div>
              <Label className="text-xs">Y-Axis (Measure)</Label>
              <div
                className="mt-1 p-3 border-2 border-dashed border-gray-200 rounded-md min-h-[40px] flex items-center justify-center text-sm text-gray-500 hover:border-gray-300 transition-colors"
                onDrop={(e) => handleDrop(e, "yAxis")}
                onDragOver={handleDragOver}
              >
                {selectedNodeData?.yAxis ? (
                  <Badge variant="secondary">{selectedNodeData.yAxis}</Badge>
                ) : (
                  "Drop measure here"
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Available Columns */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Available Fields</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {selectedDataSource.columns.map((column) => (
                <div
                  key={column.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, column)}
                  className="flex items-center gap-2 p-2 bg-gray-50 rounded cursor-move hover:bg-gray-100 transition-colors"
                >
                  <Grip className="w-3 h-3 text-gray-400" />
                  <span className="text-sm flex-1">{column.name}</span>
                  <Badge
                    variant={column.type === "number" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {column.type === "number" ? "123" : "ABC"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Data Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Data Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs space-y-1">
              <div className="font-medium text-gray-600">
                {selectedDataSource.data.length} rows
              </div>
              <div className="max-h-32 overflow-y-auto">
                {selectedDataSource.data.slice(0, 3).map((row, index) => (
                  <div key={index} className="text-gray-500 truncate">
                    {Object.entries(row)
                      .slice(0, 2)
                      .map(([key, value]) => (
                        <span key={key} className="mr-2">
                          {key}: {String(value)}
                        </span>
                      ))}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
