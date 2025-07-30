import { useState, useCallback } from "react";
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

type NodeData = {
  label: string;
};

const initialNodes: Node<NodeData>[] = [
  { id: "n1", position: { x: 100, y: 100 }, data: { label: "Revenue" } },
  { id: "n2", position: { x: 300, y: 200 }, data: { label: "Customer Acquisition" } },
  { id: "n3", position: { x: 500, y: 100 }, data: { label: "Ad Spend" } },
];

const initialEdges: Edge[] = [
  { id: "n3-n2", source: "n3", target: "n2", type: "smoothstep" },
  { id: "n2-n1", source: "n2", target: "n1", type: "smoothstep" },
];

export default function CanvasPage() {
  const { canvasId } = useParams();
  const [nodes, setNodes] = useState<Node<NodeData>[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes(
        (nodesSnapshot) =>
          applyNodeChanges(changes, nodesSnapshot) as Node<NodeData>[]
      ),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges(
        (edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot) as Edge[]
      ),
    []
  );

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );

  return (
    <div className="w-full h-full bg-background">
      {/* Canvas Header */}
      <div className="h-14 border-b border-border bg-card px-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-card-foreground">
            Canvas {canvasId}
          </h2>
          <p className="text-sm text-muted-foreground">
            Visual business architecture workspace
          </p>
        </div>
        
        {/* Canvas Controls will go here */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Auto-saved • {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* React Flow Canvas */}
      <div className="h-[calc(100%-3.5rem)]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
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
    </div>
  );
}