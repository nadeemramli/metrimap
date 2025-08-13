"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Network,
  Plus,
  Save,
} from "lucide-react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Edge,
  type Node,
} from "reactflow";
import "reactflow/dist/style.css";
import { useCanvasStore } from "@/lib/stores";

interface Correlation {
  id: string;
  metric: string;
  coefficient: number;
  significance: number;
}

const initialNodes: Node[] = [
  {
    id: "current-metric",
    type: "default",
    position: { x: 250, y: 200 },
    data: { label: "Current Metric" },
    style: {
      background: "hsl(var(--primary))",
      color: "white",
      border: "2px solid hsl(var(--primary))",
    },
  },
];

const initialEdges: Edge[] = [];

const relationshipTypes = [
  { value: "influences", label: "Influences", color: "blue" },
  { value: "correlates", label: "Correlates", color: "green" },
  { value: "causes", label: "Causes", color: "red" },
  { value: "depends_on", label: "Depends On", color: "purple" },
];

const availableMetrics = [
  "User Engagement",
  "Marketing Spend",
  "Customer Satisfaction",
  "Support Tickets",
  "Page Load Time",
  "Conversion Rate",
  "Revenue",
  "Active Users",
];

interface CorrelationsTabProps {
  cardId?: string;
  onSave?: () => void;
  isModified?: boolean;
  onFieldChange?: (field: string, value: any) => void;
}

export function CorrelationsTab({
  cardId,
  onSave,
  isModified,
  onFieldChange,
}: CorrelationsTabProps) {
  const { getNodeById, persistNodeUpdate } = useCanvasStore();
  const card = cardId ? getNodeById(cardId) : null;

  // Adapter function to match the v0 interface
  const updateCorrelations = (correlations: any) => {
    if (card && cardId) {
      persistNodeUpdate(cardId, {
        correlations,
        updatedAt: new Date().toISOString(),
      } as any);
      // Notify parent about changes
      if (onFieldChange) {
        onFieldChange("correlations", correlations);
      }
    }
  };
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isComputing, setIsComputing] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState("");
  const [selectedRelationType, setSelectedRelationType] =
    useState("correlates");
  const [hasDefinedRelationships, setHasDefinedRelationships] = useState(false);

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        type: "smoothstep",
        animated: true,
        style: { stroke: "#3b82f6", strokeWidth: 2 },
        label: selectedRelationType,
      };
      setEdges((eds) => addEdge(newEdge, eds));
      setHasDefinedRelationships(true);
    },
    [setEdges, selectedRelationType]
  );

  const addMetricNode = () => {
    if (!selectedMetric) return;

    const newNode: Node = {
      id: `metric-${Date.now()}`,
      type: "default",
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
      data: { label: selectedMetric },
      style: { background: "#f3f4f6", border: "2px solid #d1d5db" },
    };

    setNodes((nds) => [...nds, newNode]);
    setSelectedMetric("");
  };

  const handleComputeCorrelations = async () => {
    if (!hasDefinedRelationships) {
      alert(
        "Please define at least one relationship before computing correlations."
      );
      return;
    }

    setIsComputing(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock correlation data based on defined relationships
    const mockCorrelations: Correlation[] = edges.map((edge, index) => {
      const targetNode = nodes.find((node) => node.id === edge.target);
      return {
        id: `correlation-${index}`,
        metric: targetNode?.data.label || "Unknown Metric",
        coefficient: Math.random() * 2 - 1, // Random coefficient between -1 and 1
        significance: Math.random() * 0.05, // Random significance up to 0.05
      };
    });

    updateCorrelations(mockCorrelations);
    setIsComputing(false);
  };

  const getCorrelationIcon = (coefficient: number) => {
    if (coefficient > 0.3)
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (coefficient < -0.3)
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  const getCorrelationStrength = (coefficient: number) => {
    const abs = Math.abs(coefficient);
    if (abs >= 0.7) return "Strong";
    if (abs >= 0.4) return "Moderate";
    if (abs >= 0.2) return "Weak";
    return "Very Weak";
  };

  const getSignificanceLevel = (significance: number) => {
    if (significance <= 0.001) return "Very High";
    if (significance <= 0.01) return "High";
    if (significance <= 0.05) return "Moderate";
    return "Low";
  };

  if (!card) return <></>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Network className="h-5 w-5" />
            Relationship Mapping & Correlations
          </h3>
          <p className="text-sm text-muted-foreground">
            Define relationships between metrics before computing correlations
          </p>
        </div>
        <Button
          onClick={handleComputeCorrelations}
          disabled={isComputing || !hasDefinedRelationships}
        >
          {isComputing ? "Computing..." : "Compute Correlations"}
        </Button>
      </div>

      {/* Relationship Builder */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Step 1: Define Relationships</CardTitle>
            {onSave && (
              <Button
                size="sm"
                onClick={onSave}
                disabled={!isModified}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Add Metric</label>
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a metric" />
                </SelectTrigger>
                <SelectContent>
                  {availableMetrics.map((metric) => (
                    <SelectItem key={metric} value={metric}>
                      {metric}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Relationship Type</label>
              <Select
                value={selectedRelationType}
                onValueChange={setSelectedRelationType}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {relationshipTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={addMetricNode}
                disabled={!selectedMetric}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Metric
              </Button>
            </div>
          </div>

          <div className="h-[400px] border rounded-lg">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              fitView
            >
              <Controls />
              <MiniMap />
              <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            </ReactFlow>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>
              <strong>Instructions:</strong> Add metrics using the dropdown
              above, then drag from the connection points to create
              relationships. You must define at least one relationship before
              computing correlations.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Correlation Results */}
      {((card as any).correlations || []).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 2: Correlation Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {((card as any).correlations || []).map((correlation: any) => (
                <div
                  key={correlation.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getCorrelationIcon(correlation.coefficient)}
                    <div>
                      <h4 className="font-medium">{correlation.metric}</h4>
                      <p className="text-sm text-muted-foreground">
                        Correlation: {correlation.coefficient.toFixed(3)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <Badge variant="outline">
                      {getCorrelationStrength(correlation.coefficient)}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      Significance:{" "}
                      {getSignificanceLevel(correlation.significance)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {((card as any).correlations || []).length === 0 &&
        hasDefinedRelationships && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8 text-muted-foreground">
                Relationships defined! Click "Compute Correlations" to analyze
                the statistical relationships.
              </div>
            </CardContent>
          </Card>
        )}

      {!hasDefinedRelationships && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 text-muted-foreground">
              Add metrics and define relationships using the flow diagram above
              to enable correlation analysis.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
