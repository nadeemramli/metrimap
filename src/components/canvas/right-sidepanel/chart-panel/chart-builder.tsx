"use client";

import React, { useState, useCallback, useMemo } from "react";
import ReactFlow, {
  addEdge,
  Background,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  Controls,
  type Node,
  type Edge,
  type Connection,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { ChartNode } from "./chart-node";
import { ConfigPanel } from "./config-panel";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const nodeTypes = {
  chartNode: ChartNode,
};

const initialNodes: Node[] = [
  {
    id: "chart-1",
    type: "chartNode",
    position: { x: 250, y: 100 },
    data: {
      chartType: "bar",
      xAxis: null,
      yAxis: null,
      title: "Sales Chart",
    },
  },
];

const initialEdges: Edge[] = [];

// Mock data sources
const mockDataSources = [
  {
    id: "sales-data",
    name: "Sales Data",
    columns: [
      { id: "month", name: "Month", type: "string" },
      { id: "revenue", name: "Revenue", type: "number" },
      { id: "orders", name: "Orders", type: "number" },
      { id: "customers", name: "Customers", type: "number" },
      { id: "region", name: "Region", type: "string" },
    ],
    data: [
      {
        month: "Jan",
        revenue: 12000,
        orders: 150,
        customers: 120,
        region: "North",
      },
      {
        month: "Feb",
        revenue: 15000,
        orders: 180,
        customers: 145,
        region: "North",
      },
      {
        month: "Mar",
        revenue: 18000,
        orders: 220,
        customers: 180,
        region: "South",
      },
      {
        month: "Apr",
        revenue: 22000,
        orders: 280,
        customers: 220,
        region: "South",
      },
      {
        month: "May",
        revenue: 25000,
        orders: 320,
        customers: 250,
        region: "East",
      },
      {
        month: "Jun",
        revenue: 28000,
        orders: 350,
        customers: 280,
        region: "East",
      },
    ],
  },
  {
    id: "user-data",
    name: "User Analytics",
    columns: [
      { id: "date", name: "Date", type: "string" },
      { id: "users", name: "Active Users", type: "number" },
      { id: "sessions", name: "Sessions", type: "number" },
      { id: "bounceRate", name: "Bounce Rate", type: "number" },
    ],
    data: [
      { date: "2024-01", users: 1200, sessions: 1800, bounceRate: 0.35 },
      { date: "2024-02", users: 1350, sessions: 2100, bounceRate: 0.32 },
      { date: "2024-03", users: 1500, sessions: 2400, bounceRate: 0.28 },
      { date: "2024-04", users: 1680, sessions: 2700, bounceRate: 0.25 },
    ],
  },
];

export function ChartBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<string | null>("chart-1");
  const [dataSources] = useState(mockDataSources);
  const [selectedDataSource, setSelectedDataSource] = useState(
    mockDataSources[0]
  );

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node.id);
  }, []);

  const updateNodeData = useCallback(
    (nodeId: string, newData: any) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, ...newData } }
            : node
        )
      );
    },
    [setNodes]
  );

  const addChartNode = useCallback(() => {
    const newNode: Node = {
      id: `chart-${Date.now()}`,
      type: "chartNode",
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
      data: {
        chartType: "bar",
        xAxis: null,
        yAxis: null,
        title: "New Chart",
      },
    };
    setNodes((nds) => [...nds, newNode]);
    setSelectedNode(newNode.id);
  }, [setNodes]);

  const selectedNodeData = useMemo(() => {
    return nodes.find((node) => node.id === selectedNode)?.data as any;
  }, [nodes, selectedNode]);

  return (
    <div className="flex h-full">
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          className="bg-gray-50"
        >
          <Background variant="dots" gap={20} size={1} />
          <Controls />
        </ReactFlow>

        <div className="absolute top-4 left-4">
          <Button onClick={addChartNode} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Chart
          </Button>
        </div>
      </div>

      <ConfigPanel
        selectedNode={selectedNode}
        selectedNodeData={selectedNodeData}
        dataSources={dataSources}
        selectedDataSource={selectedDataSource}
        onDataSourceChange={setSelectedDataSource}
        onNodeDataUpdate={updateNodeData}
      />
    </div>
  );
}

export default function ChartBuilderWrapper() {
  return (
    <ReactFlowProvider>
      <ChartBuilder />
    </ReactFlowProvider>
  );
}
