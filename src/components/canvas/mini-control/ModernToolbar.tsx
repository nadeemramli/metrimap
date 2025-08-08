"use client";

import { useMemo } from "react";
import {
  Edit3,
  Pen,
  MousePointer,
  Plus,
  Grid3X3,
  Filter as FilterIcon,
  Search as SearchIcon,
  Square,
  Circle,
  Diamond,
  ArrowRight,
  Minus,
  Type as TypeIcon,
  Image as ImageIcon,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AddNodeButton from "./AddNodeButton";

type ToolbarMode = "edit" | "draw";

export interface ModernToolbarProps {
  mode: ToolbarMode;
  onChangeMode: (m: ToolbarMode) => void;
  // Edit mode actions
  onOpenSearch: () => void;
  onOpenFilters: () => void;
  onAddEvidence?: () => void;
  onAddCustomNode?: (
    type: "sourceNode" | "chartNode" | "operatorNode" | "whiteboardNode"
  ) => void;
  // Layout
  currentLayoutDirection?: "TB" | "BT" | "LR" | "RL";
  onChangeLayoutDirection?: (dir: "TB" | "BT" | "LR" | "RL") => void;

  // Draw mode actions
  drawActiveTool?:
    | "hand"
    | "selection"
    | "rectangle"
    | "diamond"
    | "ellipse"
    | "arrow"
    | "line"
    | "freedraw"
    | "text"
    | "image"
    | "eraser";
  onSetDrawTool?: (tool: ModernToolbarProps["drawActiveTool"]) => void;
  onSetStrokeColor?: (hex: string) => void;
  strokeWidth?: number;
  onSetStrokeWidth?: (px: number) => void;
}

function ToolButton(props: {
  icon: React.ReactNode;
  shortcut?: string;
  active?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}) {
  const { icon, shortcut, active, onClick, children } = props;
  return (
    <Button
      variant={active ? "default" : "ghost"}
      size="sm"
      className={`relative rounded-lg group ${
        active ? "bg-blue-100 text-blue-700 hover:bg-blue-200" : ""
      }`}
      onClick={onClick}
    >
      {icon}
      {children}
      {shortcut && (
        <span className="absolute -top-1 -right-1 bg-gray-800 text-white text-xs px-1 py-0.5 rounded text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {shortcut}
        </span>
      )}
    </Button>
  );
}

export default function ModernToolbar(props: ModernToolbarProps) {
  const strokeWidthValue = useMemo(
    () => [props.strokeWidth ?? 2],
    [props.strokeWidth]
  );

  return (
    <div className="flex items-center gap-2">
      {/* Mode Toggle */}
      <div className="flex bg-gray-100 rounded-xl p-1 mr-1">
        <Button
          variant={props.mode === "edit" ? "default" : "ghost"}
          size="sm"
          onClick={() => props.onChangeMode("edit")}
          className={`rounded-lg transition-all duration-200 ${
            props.mode === "edit"
              ? "bg-white shadow-sm text-gray-900"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Edit3 className="w-4 h-4 mr-2" />
          Edit
        </Button>
        <Button
          variant={props.mode === "draw" ? "default" : "ghost"}
          size="sm"
          onClick={() => props.onChangeMode("draw")}
          className={`rounded-lg transition-all duration-200 ${
            props.mode === "draw"
              ? "bg-white shadow-sm text-gray-900"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Pen className="w-4 h-4 mr-2" />
          Draw
        </Button>
      </div>

      <Separator orientation="vertical" className="h-8 bg-gray-300 mx-1" />

      {/* Edit Mode */}
      {props.mode === "edit" && (
        <div className="flex items-center gap-2">
          <ToolButton
            icon={<MousePointer className="w-4 h-4" />}
            shortcut="V"
            active
          />

          {/* Add Card (uses existing AddNodeButton dropdown) */}
          <AddNodeButton
            asControlButton={false}
            onAddCustomNode={props.onAddCustomNode}
          />

          <Separator orientation="vertical" className="h-6" />

          <Popover>
            <PopoverTrigger asChild>
              <ToolButton icon={<Grid3X3 className="w-4 h-4" />} />
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2">
              <div className="text-sm font-medium px-2 py-1">
                Layout direction
              </div>
              <div className="flex flex-col gap-1 p-1">
                {[
                  { k: "TB", label: "Top → Bottom" },
                  { k: "BT", label: "Bottom → Top" },
                  { k: "LR", label: "Left → Right" },
                  { k: "RL", label: "Right → Left" },
                ].map((opt) => (
                  <Button
                    key={opt.k}
                    variant={
                      props.currentLayoutDirection === (opt.k as any)
                        ? "secondary"
                        : "ghost"
                    }
                    size="sm"
                    className="justify-start"
                    onClick={() =>
                      props.onChangeLayoutDirection?.(opt.k as any)
                    }
                  >
                    {opt.label}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          <ToolButton icon={<ImageIcon className="w-4 h-4" />} />
          <ToolButton
            icon={<FilterIcon className="w-4 h-4" />}
            onClick={props.onOpenFilters}
          />
          <ToolButton
            icon={<SearchIcon className="w-4 h-4" />}
            shortcut="⌘K"
            onClick={props.onOpenSearch}
          />
        </div>
      )}

      {/* Draw Mode */}
      {props.mode === "draw" && (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <ToolButton
              icon={<MousePointer className="w-4 h-4" />}
              shortcut="V"
              active={props.drawActiveTool === "selection"}
              onClick={() => props.onSetDrawTool?.("selection")}
            />
            <ToolButton
              icon={<Square className="w-4 h-4" />}
              shortcut="R"
              active={props.drawActiveTool === "rectangle"}
              onClick={() => props.onSetDrawTool?.("rectangle")}
            />
            <ToolButton
              icon={<Circle className="w-4 h-4" />}
              shortcut="O"
              active={props.drawActiveTool === "ellipse"}
              onClick={() => props.onSetDrawTool?.("ellipse")}
            />
            <ToolButton
              icon={<Diamond className="w-4 h-4" />}
              shortcut="D"
              active={props.drawActiveTool === "diamond"}
              onClick={() => props.onSetDrawTool?.("diamond")}
            />
            <ToolButton
              icon={<ArrowRight className="w-4 h-4" />}
              shortcut="A"
              active={props.drawActiveTool === "arrow"}
              onClick={() => props.onSetDrawTool?.("arrow")}
            />
            <ToolButton
              icon={<Minus className="w-4 h-4" />}
              shortcut="L"
              active={props.drawActiveTool === "line"}
              onClick={() => props.onSetDrawTool?.("line")}
            />
            <ToolButton
              icon={<Pen className="w-4 h-4" />}
              shortcut="P"
              active={props.drawActiveTool === "freedraw"}
              onClick={() => props.onSetDrawTool?.("freedraw")}
            />
            <ToolButton
              icon={<TypeIcon className="w-4 h-4" />}
              shortcut="T"
              active={props.drawActiveTool === "text"}
              onClick={() => props.onSetDrawTool?.("text")}
            />
            <ToolButton
              icon={<ImageIcon className="w-4 h-4" />}
              shortcut="I"
              active={props.drawActiveTool === "image"}
              onClick={() => props.onSetDrawTool?.("image")}
            />
          </div>

          <Separator orientation="vertical" className="h-8" />

          <div className="flex items-center gap-2">
            {/* Color Picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-lg w-8 h-8 p-0"
                >
                  <div className="w-4 h-4 bg-blue-500 rounded border border-gray-300"></div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-3">
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Color</h4>
                  <div className="grid grid-cols-6 gap-2">
                    {[
                      "#000000",
                      "#ef4444",
                      "#f97316",
                      "#eab308",
                      "#22c55e",
                      "#3b82f6",
                      "#8b5cf6",
                      "#ec4899",
                    ].map((color) => (
                      <button
                        key={color}
                        className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                        onClick={() => props.onSetStrokeColor?.(color)}
                      />
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Stroke & Width */}
            <Popover>
              <PopoverTrigger asChild>
                <ToolButton
                  icon={<Settings className="w-4 h-4" />}
                  shortcut="S"
                />
              </PopoverTrigger>
              <PopoverContent className="w-64 p-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Stroke Width: {strokeWidthValue[0]}px
                    </label>
                    <Slider
                      value={strokeWidthValue}
                      onValueChange={(arr) =>
                        props.onSetStrokeWidth?.(arr[0] ?? 2)
                      }
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Badge
              variant="secondary"
              className="bg-blue-100 text-blue-700 text-xs"
            >
              Drawing
            </Badge>
          </div>
        </div>
      )}
    </div>
  );
}
