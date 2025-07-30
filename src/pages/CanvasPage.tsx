import { useEffect, useCallback, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type Connection,
  Background,
  Controls,
  MiniMap,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCanvasStore, useProjectsStore, useAppStore } from "@/lib/stores";
import type { MetricCard as MetricCardType, Relationship } from "@/lib/types";
import {
  MetricCard,
  AddNodeButton,
  CardSettingsSheet,
} from "@/components/canvas";

// Convert MetricCard to ReactFlow Node with onOpenSettings callback
const convertToNode = (
  card: MetricCardType,
  onOpenSettings: (cardId: string) => void
): Node => ({
  id: card.id,
  position: card.position,
  data: {
    card: card, // Store full card data for our custom component
    onOpenSettings, // Pass the callback
  },
  type: "metricCard", // Use our custom node type
});

// Convert Relationship to ReactFlow Edge
const convertToEdge = (relationship: Relationship): Edge => ({
  id: relationship.id,
  source: relationship.sourceId,
  target: relationship.targetId,
  type: "smoothstep",
  data: { relationship }, // Store full relationship data
  style: {
    strokeWidth:
      relationship.confidence === "High"
        ? 3
        : relationship.confidence === "Medium"
          ? 2
          : 1,
    strokeDasharray:
      relationship.confidence === "High"
        ? "0"
        : relationship.confidence === "Medium"
          ? "5,5"
          : "2,2",
  },
});

// Define custom node types
const nodeTypes = {
  metricCard: MetricCard,
};

export default function CanvasPage() {
  const { canvasId } = useParams();
  const [settingsCardId, setSettingsCardId] = useState<string | undefined>();

  // Zustand stores
  const {
    canvas,
    loadCanvas,
    updateNode,
    addEdge: addCanvasEdge,
  } = useCanvasStore();
  const { getProjectById } = useProjectsStore();
  const { currentCanvasId } = useAppStore();

  // Handle opening settings sheet
  const handleOpenSettings = useCallback((cardId: string) => {
    setSettingsCardId(cardId);
  }, []);

  // Convert canvas data to ReactFlow format
  const nodes = useMemo(
    () =>
      canvas?.nodes.map((card) => convertToNode(card, handleOpenSettings)) ||
      [],
    [canvas?.nodes, handleOpenSettings]
  );
  const edges = useMemo(
    () => canvas?.edges.map(convertToEdge) || [],
    [canvas?.edges]
  );

  // Load canvas when component mounts or canvasId changes
  useEffect(() => {
    if (canvasId) {
      const project = getProjectById(canvasId);
      if (project) {
        loadCanvas(project);
      }
    }
  }, [canvasId, getProjectById, loadCanvas]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      changes.forEach((change) => {
        if (change.type === "position" && change.position && canvas) {
          const node = canvas.nodes.find((n) => n.id === change.id);
          if (node) {
            updateNode(change.id, { position: change.position });
          }
        }
      });
    },
    [canvas, updateNode]
  );

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    // Handle edge changes
    // For now, we'll implement basic edge deletion
    console.log("Edge changes:", changes);
  }, []);

  const onConnect = useCallback(
    (params: Connection) => {
      if (params.source && params.target) {
        const newRelationship: Relationship = {
          id: `${params.source}-${params.target}-${Date.now()}`,
          sourceId: params.source,
          targetId: params.target,
          type: "Probabilistic", // Default type
          confidence: "Low", // Default confidence
          evidence: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        addCanvasEdge(newRelationship);
      }
    },
    [addCanvasEdge]
  );

  return (
    <div className="w-full h-full bg-background">
      {/* Canvas Header */}
      <div className="h-14 border-b border-border bg-card px-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-card-foreground">
            {canvas?.name || `Canvas ${canvasId}`}
          </h2>
          <p className="text-sm text-muted-foreground">
            {canvas?.description || "Visual business architecture workspace"}
          </p>
        </div>

        {/* Canvas Controls */}
        <div className="flex items-center gap-4">
          <AddNodeButton />
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {canvas?.nodes.length || 0} nodes • {canvas?.edges.length || 0}{" "}
              edges
            </span>
            <span className="text-sm text-muted-foreground">
              Auto-saved •{" "}
              {canvas?.updatedAt
                ? new Date(canvas.updatedAt).toLocaleTimeString()
                : new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>

      {/* React Flow Canvas */}
      <div className="h-[calc(100%-3.5rem)]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          className="bg-background"
        >
          <Background />
          <Controls className="bg-card border border-border" />
          <MiniMap
            className="bg-card border border-border"
            maskColor="rgb(0, 0, 0, 0.1)"
          />
        </ReactFlow>
      </div>

      {/* Card Settings Sheet */}
      <CardSettingsSheet
        isOpen={!!settingsCardId}
        onClose={() => setSettingsCardId(undefined)}
        cardId={settingsCardId}
      />
    </div>
  );
}
