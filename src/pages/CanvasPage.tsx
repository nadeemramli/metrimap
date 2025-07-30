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
  CanvasControls,
  NodeToolbar,
  DynamicEdge,
  RelationshipSheet,
} from "@/components/canvas";

// Convert MetricCard to ReactFlow Node with callbacks
const convertToNode = (
  card: MetricCardType,
  onOpenSettings: (cardId: string) => void,
  onNodeClick: (cardId: string, position: { x: number; y: number }) => void,
  selectedNodeIds: string[] = []
): Node => ({
  id: card.id,
  position: card.position,
  data: {
    card: card, // Store full card data for our custom component
    onOpenSettings, // Pass the settings callback
    onNodeClick, // Pass the click callback
  },
  type: "metricCard", // Use our custom node type
  selected: selectedNodeIds.includes(card.id),
});

// Convert Relationship to ReactFlow Edge with DynamicEdge
const convertToEdge = (
  relationship: Relationship,
  onOpenRelationshipSheet: (relationshipId: string) => void
): Edge => ({
  id: relationship.id,
  source: relationship.sourceId,
  target: relationship.targetId,
  type: "dynamicEdge",
  data: {
    relationship,
    onOpenRelationshipSheet,
  },
  markerEnd: {
    type: "arrowclosed",
    color: "#64748b",
  },
});

// Define custom node and edge types
const nodeTypes = {
  metricCard: MetricCard,
};

const edgeTypes = {
  dynamicEdge: DynamicEdge,
};

export default function CanvasPage() {
  const { canvasId } = useParams();
  const [settingsCardId, setSettingsCardId] = useState<string | undefined>();
  const [toolbarNodeId, setToolbarNodeId] = useState<string | undefined>();
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
  const [relationshipSheetId, setRelationshipSheetId] = useState<
    string | undefined
  >();

  // Zustand stores
  const {
    canvas,
    loadCanvas,
    updateNode,
    addEdge: addCanvasEdge,
    selectedNodeIds,
  } = useCanvasStore();
  const { getProjectById } = useProjectsStore();
  const { currentCanvasId } = useAppStore();

  // Handle opening settings sheet
  const handleOpenSettings = useCallback((cardId: string) => {
    setSettingsCardId(cardId);
  }, []);

  // Handle node click for toolbar
  const handleNodeClick = useCallback(
    (cardId: string, position: { x: number; y: number }) => {
      setToolbarNodeId(cardId);
      setToolbarPosition({
        x: position.x + 160, // Center of MetricCard (width: 320px)
        y: position.y,
      });
    },
    []
  );

  // Handle opening relationship sheet
  const handleOpenRelationshipSheet = useCallback((relationshipId: string) => {
    setRelationshipSheetId(relationshipId);
  }, []);

  // Handle auto-layout from controls
  const handleNodesChange = useCallback(
    (newNodes: Node[]) => {
      newNodes.forEach((node) => {
        const card = canvas?.nodes.find((n) => n.id === node.id);
        if (card && node.position) {
          updateNode(node.id, { position: node.position });
        }
      });
    },
    [canvas?.nodes, updateNode]
  );

  // Convert canvas data to ReactFlow format
  const nodes = useMemo(
    () =>
      canvas?.nodes.map((card) =>
        convertToNode(
          card,
          handleOpenSettings,
          handleNodeClick,
          selectedNodeIds
        )
      ) || [],
    [canvas?.nodes, handleOpenSettings, handleNodeClick, selectedNodeIds]
  );
  const edges = useMemo(
    () =>
      canvas?.edges.map((edge) =>
        convertToEdge(edge, handleOpenRelationshipSheet)
      ) || [],
    [canvas?.edges, handleOpenRelationshipSheet]
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
        // Handle selection changes for toolbar
        if (change.type === "select" && change.selected) {
          const node = nodes.find((n) => n.id === change.id);
          if (node) {
            setToolbarNodeId(change.id);
            setToolbarPosition({
              x: node.position.x + 160, // Center of MetricCard (width: 320px)
              y: node.position.y,
            });
          }
        } else if (change.type === "select" && !change.selected) {
          setToolbarNodeId(undefined);
        }
      });
    },
    [canvas, updateNode, nodes]
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
          edgeTypes={edgeTypes}
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

          {/* Canvas Controls */}
          <CanvasControls
            nodes={nodes}
            edges={edges}
            onNodesChange={handleNodesChange}
          />

          {/* Node Toolbar */}
          {toolbarNodeId && (
            <NodeToolbar
              nodeId={toolbarNodeId}
              position={toolbarPosition}
              isVisible={!!toolbarNodeId}
              onOpenSettings={handleOpenSettings}
            />
          )}
        </ReactFlow>
      </div>

      {/* Card Settings Sheet */}
      <CardSettingsSheet
        isOpen={!!settingsCardId}
        onClose={() => setSettingsCardId(undefined)}
        cardId={settingsCardId}
      />

      {/* Relationship Sheet */}
      <RelationshipSheet
        isOpen={!!relationshipSheetId}
        onClose={() => setRelationshipSheetId(undefined)}
        relationshipId={relationshipSheetId}
      />
    </div>
  );
}
