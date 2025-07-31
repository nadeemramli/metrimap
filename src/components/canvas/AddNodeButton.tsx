import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ControlButton } from "@xyflow/react";
import { useCanvasStore } from "@/lib/stores";
import type { CardCategory } from "@/lib/types";

interface AddNodeButtonProps {
  position?: { x: number; y: number };
  asControlButton?: boolean;
}

const categoryTemplates: Array<{
  category: CardCategory;
  label: string;
  description: string;
  icon: string;
}> = [
  {
    category: "Core/Value",
    label: "Core/Value",
    description: "Foundational value delivery elements",
    icon: "🎯",
  },
  {
    category: "Data/Metric",
    label: "Data/Metric",
    description: "Quantifiable business measures",
    icon: "📊",
  },
  {
    category: "Work/Action",
    label: "Work/Action",
    description: "Business activities and initiatives",
    icon: "⚡",
  },
  {
    category: "Ideas/Hypothesis",
    label: "Ideas/Hypothesis",
    description: "Assumptions and potential drivers",
    icon: "💡",
  },
  {
    category: "Metadata",
    label: "Metadata",
    description: "Supplementary system information",
    icon: "📋",
  },
];

export default function AddNodeButton({
  position,
  asControlButton = false,
}: AddNodeButtonProps) {
  const { createNode } = useCanvasStore();

  const handleAddNode = async (category: CardCategory) => {
    const baseNodeData = {
      title: `New ${category.split("/")[1] || category}`,
      description: `A new ${category.toLowerCase()} card`,
      category,
      tags: [],
      causalFactors: [],
      dimensions: [],
      position: position || { x: Math.random() * 400, y: Math.random() * 400 },
      assignees: [],
    };

    // Add sample data for Data/Metric cards
    const nodeWithData = {
      ...baseNodeData,
      ...(category === "Data/Metric" && {
        data: [
          {
            period: "Past 7 days",
            value: Math.floor(Math.random() * 10000) + 1000,
            change_percent: (Math.random() - 0.5) * 20,
            trend: Math.random() > 0.5 ? ("up" as const) : ("down" as const),
          },
          {
            period: "Past 30 days",
            value: Math.floor(Math.random() * 50000) + 5000,
            change_percent: (Math.random() - 0.5) * 20,
            trend: Math.random() > 0.5 ? ("up" as const) : ("down" as const),
          },
          {
            period: "Past 90 days",
            value: Math.floor(Math.random() * 200000) + 20000,
            change_percent: (Math.random() - 0.5) * 20,
            trend: Math.random() > 0.5 ? ("up" as const) : ("down" as const),
          },
        ],
      }),
    };

    try {
      await createNode(nodeWithData);
    } catch (error) {
      console.error("Failed to create node:", error);
      alert("Failed to create card. Please try again.");
    }
  };

  const TriggerButton = asControlButton ? ControlButton : Button;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {asControlButton ? (
          <ControlButton title="Add Node">
            <Plus className="h-4 w-4" />
          </ControlButton>
        ) : (
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Card
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="start">
        <DropdownMenuLabel>Select Card Type</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {categoryTemplates.map((template) => (
          <DropdownMenuItem
            key={template.category}
            onClick={() => handleAddNode(template.category)}
            className="flex items-start gap-3 p-3"
          >
            <span className="text-lg mt-0.5">{template.icon}</span>
            <div className="flex-1">
              <div className="font-medium text-sm">{template.label}</div>
              <div className="text-xs text-muted-foreground leading-relaxed">
                {template.description}
              </div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
