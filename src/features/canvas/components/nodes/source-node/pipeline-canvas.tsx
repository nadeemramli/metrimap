"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Plus, GitBranch, Play } from "lucide-react";
import DataTransformationNode from "./data-transformation-node";

interface PipelineNode {
  id: string;
  type: "transformation" | "source" | "destination";
  name: string;
  position: { x: number; y: number };
  data?: any[];
}

export default function PipelineCanvas() {
  const [nodes, setNodes] = useState<PipelineNode[]>([
    {
      id: "1",
      type: "transformation",
      name: "step_progression",
      position: { x: 100, y: 100 },
    },
  ]);

  const addNode = () => {
    const newNode: PipelineNode = {
      id: Date.now().toString(),
      type: "transformation",
      name: `node_${nodes.length + 1}`,
      position: { x: 100, y: 200 + nodes.length * 150 },
    };
    setNodes([...nodes, newNode]);
  };

  const runPipeline = () => {
    console.log("Running entire pipeline...");
    // Execute all nodes in sequence
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Data Pipeline Canvas
          </h1>
          <div className="flex gap-2">
            <Button onClick={addNode} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Node
            </Button>
            <Button
              onClick={runPipeline}
              className="bg-green-600 hover:bg-green-700"
            >
              <Play className="h-4 w-4 mr-2" />
              Run Pipeline
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {nodes.map((node, index) => (
            <div key={node.id} className="relative">
              {index > 0 && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <GitBranch className="h-6 w-6 text-blue-500 bg-white rounded-full p-1 border-2 border-blue-200" />
                </div>
              )}
              <DataTransformationNode
                nodeName={node.name}
                onDataTransform={(data) => {
                  console.log(`Node ${node.name} transformed data:`, data);
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
