"use client";

import { useRef, type ChangeEvent, useMemo } from "react";
import { Panel } from "@xyflow/react";
import { cn } from "@/lib/utils";
import {
  Square,
  Circle,
  Diamond,
  Minus,
  ArrowRight,
  Pencil,
  Image as ImageIcon,
  Link2,
  LayoutGrid,
  Filter,
  Search,
  FileText,
  Hand,
  MousePointer,
  ZoomIn,
  Lock,
  Eraser,
  Type as TypeIcon,
  ArrowUpDown,
  ArrowDownUp,
  ArrowLeftRight,
  ArrowRightLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import AddNodeButton from "./AddNodeButton";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Tool =
  | null
  | "rect"
  | "ellipse"
  | "diamond"
  | "arrow"
  | "line"
  | "freehand"
  | "image";

interface TopCanvasToolbarProps {
  activeTool: Tool;
  onSelectTool: (t: Tool) => void;
  onUploadImage: (file: File) => void;
  onOpenSearch: () => void;
  onOpenFilters: () => void;
  onAddEvidence: () => void;
  currentLayoutDirection: "TB" | "BT" | "LR" | "RL";
  onChangeLayoutDirection: (dir: "TB" | "BT" | "LR" | "RL") => void;
  navigationTool: "move" | "hand" | "scale";
  onChangeNavigationTool: (tool: "move" | "hand" | "scale") => void;
  onAddCustomNode?: (
    type: "sourceNode" | "chartNode" | "operatorNode" | "whiteboardNode"
  ) => void;
  onToggleWhiteboard?: () => void;
  isWhiteboardActive?: boolean;
  onExportWhiteboardPNG?: () => void;
  onExportWhiteboardSVG?: () => void;
  onClearWhiteboard?: () => void;
  mode: "edit" | "draw";
  onChangeMode: (m: "edit" | "draw") => void;
  // Draw mode quick controls
  onSetDrawTool?: (
    tool:
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
      | "eraser"
  ) => void;
  onSetStrokeColor?: (hex: string) => void;
  onSetStrokeWidth?: (px: number) => void;
  // Active draw state for highlighting & lock toggle
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
  keepToolActive?: boolean;
  onToggleKeepToolActive?: (next: boolean) => void;
}

export default function TopCanvasToolbar(props: TopCanvasToolbarProps) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const isActive = (
    tool:
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
      | "eraser"
  ) => props.drawActiveTool === tool;
  const activeBtn = (pressed: boolean) =>
    pressed
      ? "bg-primary/10 text-primary"
      : "hover:bg-muted/60 text-foreground/90";

  return (
    <Panel
      position="top-left"
      style={{
        top: 8,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 40,
        pointerEvents: "auto",
      }}
      className={cn("pointer-events-auto select-none")}
    >
      <div className="flex items-center gap-2 rounded-2xl bg-white/95 backdrop-blur-sm border border-gray-200 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_-1px_0_rgba(0,0,0,0.04)_inset,0_10px_24px_-12px_rgba(0,0,0,0.25)] px-3 py-2 pointer-events-auto">
        {/* Mode toggle */}
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
            <Pencil className="w-4 h-4 mr-2" />
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
            <Pencil className="w-4 h-4 mr-2" />
            Draw
          </Button>
        </div>

        <Separator orientation="vertical" className="h-8 bg-gray-300 mx-1" />

        {props.mode === "edit" && (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-lg"
              title="Select (V)"
            >
              <MousePointer className="w-4 h-4" />
            </Button>

            <AddNodeButton
              asControlButton={false}
              onAddCustomNode={props.onAddCustomNode}
            />

            <Separator orientation="vertical" className="h-6" />

            {/* Layout chooser popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="rounded-lg">
                  <LayoutGrid className="w-4 h-4" />
                </Button>
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
                        props.onChangeLayoutDirection(opt.k as any)
                      }
                    >
                      {opt.label}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <Button
              variant="ghost"
              size="sm"
              title="Filters"
              onClick={props.onOpenFilters}
            >
              <Filter className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              title="Search"
              onClick={props.onOpenSearch}
            >
              <Search className="w-4 h-4" />
            </Button>
          </div>
        )}

        {props.mode === "draw" && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {(
                [
                  "selection",
                  "rectangle",
                  "ellipse",
                  "diamond",
                  "arrow",
                  "line",
                  "freedraw",
                  "text",
                  "image",
                ] as const
              ).map((t) => (
                <Button
                  key={t}
                  variant={props.drawActiveTool === t ? "default" : "ghost"}
                  size="sm"
                  className="rounded-lg"
                  onClick={() => props.onSetDrawTool?.(t)}
                >
                  {t === "selection" && <MousePointer className="w-4 h-4" />}
                  {t === "rectangle" && <Square className="w-4 h-4" />}
                  {t === "ellipse" && <Circle className="w-4 h-4" />}
                  {t === "diamond" && <Diamond className="w-4 h-4" />}
                  {t === "arrow" && <ArrowRight className="w-4 h-4" />}
                  {t === "line" && <Minus className="w-4 h-4" />}
                  {t === "freedraw" && <Pencil className="w-4 h-4" />}
                  {t === "text" && <TypeIcon className="w-4 h-4" />}
                  {t === "image" && <ImageIcon className="w-4 h-4" />}
                </Button>
              ))}
            </div>

            <Separator orientation="vertical" className="h-8" />

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

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="rounded-lg">
                  <Settings className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Stroke Width
                    </label>
                    <Slider
                      value={[2]}
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
        )}
      </div>
    </Panel>
  );
}
