import { useEffect, useCallback, useMemo, useState, useRef } from "react";
import WhiteboardOverlay, {
  type WhiteboardOverlayHandle,
} from "@/components/canvas/WhiteboardOverlay";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  getIncomers,
  getOutgoers,
  getConnectedEdges,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type Connection,
  type ConnectionMode,
  Background,
  Controls,
  ControlButton,
  Panel,
} from "@xyflow/react";
import {
  Search,
  Save,
  Clock,
  Check,
  AlertCircle,
  Filter,
  FileText,
} from "lucide-react";

import "@xyflow/react/dist/style.css";
import { useCanvasStore } from "@/lib/stores";
import { useEvidenceStore } from "@/lib/stores/evidenceStore";
import { useClerkSupabase } from "@/lib/hooks/useClerkSupabase";
import { useCanvasHeader } from "@/contexts/CanvasHeaderContext";
import type {
  MetricCard as MetricCardType,
  Relationship,
  RelationshipType,
  GroupNode as GroupNodeType,
  CardCategory,
  CardSubCategory,
  MetricValue,
  SourceType,
  CausalFactor,
  Dimension,
  ConfidenceLevel,
  CanvasSettings,
  EvidenceItem,
} from "@/lib/types";
import {
  MetricCard,
  AddNodeButton,
  CardSettingsSheet,
  DynamicEdge,
  OperativeEdge,
  RelationshipSheet,
  GroupNode,
  WhiteboardNode,
} from "@/components/canvas";
import EvidenceNode from "@/components/canvas/node/EvidenceNode";
import ChartNode from "@/components/canvas/node/chart-node";
import SourceNode from "@/components/canvas/node/source-node/source-node";
import OperatorNode from "@/components/canvas/node/operator-node";
import {
  useKeyboardShortcuts,
  createShortcut,
} from "@/lib/hooks/useKeyboardShortcuts";
// import { useAccessibility } from "@/hooks/useAccessibility";
import KeyboardShortcutsHelp from "@/components/ui/KeyboardShortcutsHelp";
import QuickSearchCommand, {
  useQuickSearch,
} from "@/components/canvas/search/QuickSearchCommand";
import AdvancedSearchModal from "@/components/canvas/search/AdvancedSearchModal";
import useAutoSave from "@/lib/hooks/useAutoSave";
import { generateUUID } from "@/lib/utils/validation";
import { applyAutoLayout } from "@/lib/utils/autoLayout";
import { toast } from "sonner";
import { PortalContainerProvider } from "@/contexts/PortalContainerContext";
import {
  getAvailableFilterOptions,
  applyFilters,
  type FilterOptions,
} from "@/lib/utils/filterUtils";

import SelectionPanel from "@/components/canvas/grouping/SelectionPanel";
import FilterModal from "@/components/canvas/mini-control/FilterModal";
import LayoutControls from "@/components/canvas/mini-control/LayoutControls";
import DebugPanel from "@/components/canvas/left-sidepanel/DebugPanel";
import TopCanvasToolbar from "@/components/canvas/mini-control/TopCanvasToolbar";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

// Convert MetricCard to ReactFlow Node with callbacks
const convertToNode = (
  card: MetricCardType,
  onOpenSettings: (cardId: string, tab?: string) => void,
  onNodeClick: (cardId: string) => void,
  onSwitchToCard: (cardId: string, tab?: string) => void,
  isSettingsSheetOpen: boolean,
  selectedNodeIds: string[] = []
): Node => ({
  id: card.id,
  position: card.position,
  parentId: card.parentId, // React Flow subflow support
  data: {
    card: card, // Store full card data for our custom component
    onOpenSettings, // Pass the settings callback
    onNodeClick, // Pass the click callback
    onSwitchToCard, // Pass the switch callback for persistent sheets
    isSettingsSheetOpen, // Pass the sheet open state
  },
  type: "metricCard", // Use our custom node type
  selected: selectedNodeIds.includes(card.id),
  selectable: true, // Ensure nodes are selectable
  draggable: true, // Ensure nodes are draggable
  // Let React Flow handle layering naturally
  // Removed dragHandle to enable touch device + handle connections
  // The visual drag handle remains as UI guidance
});

// Convert Relationship to ReactFlow Edge with DynamicEdge
const convertToEdge = (
  relationship: Relationship,
  onOpenRelationshipSheet: (relationshipId: string) => void,
  onSwitchToRelationship: (relationshipId: string) => void,
  isRelationshipSheetOpen: boolean
): Edge => {
  // Determine if edge should be animated based on relationship type
  const shouldAnimate =
    relationship.type === "Probabilistic" ||
    relationship.type === "Compositional";

  // Set z-index based on relationship type for proper layering
  const getEdgeZIndex = (type: RelationshipType) => {
    switch (type) {
      case "Deterministic":
        return 1; // Base layer
      case "Probabilistic":
        return 2; // Above deterministic
      case "Causal":
        return 3; // Above probabilistic
      case "Compositional":
        return 4; // Above causal
      default:
        return 1;
    }
  };

  return {
    id: relationship.id,
    source: relationship.sourceId,
    target: relationship.targetId,
    type: "dynamicEdge",
    animated: shouldAnimate, // Animate dotted lines (Probabilistic and Compositional)
    zIndex: getEdgeZIndex(relationship.type), // Use React Flow's edge z-index system
    data: {
      relationship,
      onOpenRelationshipSheet,
      onSwitchToRelationship,
      isRelationshipSheetOpen,
      // Add a unique identifier to force re-rendering when relationship data changes
      renderKey: `${relationship.id}-${relationship.type}-${relationship.weight}-${relationship.confidence}`,
    },
  };
};

// Convert GroupNode to ReactFlow Node
const convertToEvidenceNode = (
  evidence: EvidenceItem,
  onUpdateEvidence: (id: string, updates: Partial<EvidenceItem>) => void,
  onDeleteEvidence: (id: string) => void
): Node => ({
  id: evidence.id,
  type: "evidenceNode",
  position: evidence.position || { x: 100, y: 100 },
  data: {
    evidence,
    onUpdateEvidence,
    onDeleteEvidence,
  },
  dragHandle: ".evidence-drag-handle",
});

const convertToGroupNode = (
  group: GroupNodeType,
  onEditGroup: (groupId: string) => void,
  onDeleteGroup: (groupId: string) => void,
  onToggleCollapse: (groupId: string) => void,
  onResizeGroup: (
    groupId: string,
    size: { width: number; height: number }
  ) => void
): Node => ({
  id: group.id,
  position: group.position,
  data: {
    group,
    onEditGroup,
    onDeleteGroup,
    onToggleCollapse,
    onResizeGroup,
  },
  type: "groupNode",
  style: {
    width: group.size.width,
    height: group.isCollapsed ? 60 : group.size.height,
  },
  draggable: true,
  selectable: true,
  // Configure as subflow container
  className: "group-node",
  // Ensure group is treated as a container
  extent: "parent",
});

// Define custom node and edge types
const nodeTypes = {
  metricCard: MetricCard,
  groupNode: GroupNode,
  evidenceNode: EvidenceNode,
  sourceNode: SourceNode,
  chartNode: ChartNode,
  operatorNode: OperatorNode,
  whiteboardNode: WhiteboardNode,
};

const edgeTypes = {
  dynamicEdge: DynamicEdge,
  operativeEdge: OperativeEdge,
};

function CanvasPageInner() {
  const { canvasId } = useParams();
  const [searchParams] = useSearchParams();
  const supabaseClient = useClerkSupabase();
  const navigate = useNavigate();
  const [settingsCardId, setSettingsCardId] = useState<string | undefined>();
  const [settingsInitialTab, setSettingsInitialTab] = useState<string>("data");
  const [relationshipSheetId, setRelationshipSheetId] = useState<
    string | undefined
  >();
  const [isSettingsSheetOpen, setIsSettingsSheetOpen] = useState(false);
  const [isRelationshipSheetOpen, setIsRelationshipSheetOpen] = useState(false);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  // Add Node on Edge Drop state
  const [pendingNodeDrop, setPendingNodeDrop] = useState<{
    position: { x: number; y: number };
    sourceNodeId: string;
  } | null>(null);
  // Ephemeral nodes for custom node types (source/chart/operator)
  const [extraNodes, setExtraNodes] = useState<Node[]>([]);
  // Ephemeral operative edges (UI-only for data flow)
  const [extraEdges, setExtraEdges] = useState<Edge[]>([]);

  // Proximity Connect - REMOVED for better drag/toolbar UX

  // Context Menu state

  // Selection state
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);

  // Debug panel state - now managed by DebugPanel component

  // Filter state
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<FilterOptions>({});
  const [visibleNodeIds, setVisibleNodeIds] = useState<Set<string>>(new Set());
  const [visibleEdgeIds, setVisibleEdgeIds] = useState<Set<string>>(new Set());

  // Layout state
  const [currentLayoutDirection, setCurrentLayoutDirection] = useState<
    "TB" | "BT" | "LR" | "RL"
  >("TB");

  const reactFlowRef = useRef<HTMLDivElement>(null);
  // Figma-style navigation tool: Move / Hand / Scale
  const [navigationTool, setNavigationTool] = useState<
    "move" | "hand" | "scale"
  >("move");
  const prevNavigationToolRef = useRef<"move" | "hand" | "scale">("move");
  const [isWhiteboardActive, setIsWhiteboardActive] = useState(false);
  const [toolbarMode, setToolbarMode] = useState<"edit" | "draw">("edit");
  const whiteboardRef = useRef<WhiteboardOverlayHandle | null>(null);
  const [whiteboardScene, setWhiteboardScene] = useState<any | null>(null);
  const [keepToolActive, setKeepToolActive] = useState(false);
  const [drawActiveTool, setDrawActiveTool] = useState<
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
    | undefined
  >(undefined);
  const [drawStrokeColor, setDrawStrokeColor] = useState<string | undefined>(
    undefined
  );
  const [drawStrokeWidth, setDrawStrokeWidth] = useState<number | undefined>(
    undefined
  );
  const [activeWbTool, setActiveWbTool] = useState<
    | null
    | "rect"
    | "ellipse"
    | "diamond"
    | "arrow"
    | "line"
    | "freehand"
    | "image"
  >(null);
  // Listen for temp node additions from AddNodeButton
  useEffect(() => {
    const handler = (e: any) => {
      const node = e?.detail as Node | undefined;
      if (node) {
        setExtraNodes((prev) => [...prev, node]);
      }
    };
    window.addEventListener("rf:addTempNode", handler as any);
    return () => window.removeEventListener("rf:addTempNode", handler as any);
  }, []);

  // Initialize auto-save functionality
  useAutoSave();

  // Search functionality
  const quickSearch = useQuickSearch();

  // Canvas header context
  const { setHeaderInfo } = useCanvasHeader();

  // React Flow hooks
  const { screenToFlowPosition, setCenter, getViewport } =
    useReactFlow() as any;
  const setViewport = useCanvasStore((s) => s.setViewport);
  const viewport = useCanvasStore((s) => s.viewport);

  // Accessibility hook - TODO: Implement accessibility announcements
  // const { announce } = useAccessibility();

  // Zustand stores
  const {
    canvas,
    loadCanvas,
    selectedNodeIds,
    updateNodePosition,
    addPendingChange,
    createNode,
    createEdge,
    deleteGroup,
    deleteNode,
    persistNodeDelete,
    addNode,
    selectNode,
    deselectNode,
    clearSelection,
    toggleGroupCollapse,
    updateGroupSize,
    groupSelectedNodes,
    ungroupSelectedGroups,
    updateCanvasSettings,
    pendingChanges,
    isSaving,
    lastSaved,
  } = useCanvasStore();

  const { addEvidence, updateEvidence, deleteEvidence, getGeneralEvidence } =
    useEvidenceStore();
  // Subscribe to evidence list so canvas re-renders when evidence content changes
  const evidenceList = useEvidenceStore((s) => s.evidence);

  // Debug: Log evidence store initialization
  console.log(
    "🔍 Evidence store initialized, addEvidence function:",
    addEvidence
  );

  const handlePaneClick = useCallback(() => {
    clearSelection(); // Clear node selection when clicking on empty space
    setSelectedGroupIds([]); // Clear group selection when clicking on empty space
  }, [clearSelection]);

  // Group management handlers
  const handleToggleCollapse = useCallback(
    (groupId: string) => {
      toggleGroupCollapse(groupId);
    },
    [toggleGroupCollapse]
  );

  const handleUpdateGroupSize = useCallback(
    (groupId: string, size: { width: number; height: number }) => {
      updateGroupSize(groupId, size);
    },
    [updateGroupSize]
  );

  // Selection Panel handlers
  const handleGroupSelectedNodes = useCallback(async () => {
    console.log("🎯 handleGroupSelectedNodes called with:", selectedNodeIds);

    if (selectedNodeIds.length < 2) {
      toast.error("At least 2 nodes must be selected to create a group");
      return;
    }

    try {
      await groupSelectedNodes(selectedNodeIds);
      toast.success(`✅ Grouped ${selectedNodeIds.length} nodes successfully`);
      clearSelection();
      setSelectedGroupIds([]);
    } catch (error) {
      console.error("❌ Failed to group nodes:", error);
      toast.error("Failed to group nodes. Please try again.");
    }
  }, [groupSelectedNodes, selectedNodeIds, clearSelection]);

  const handleUngroupSelectedGroups = useCallback(async () => {
    if (selectedGroupIds.length === 0) {
      toast.error("No groups selected for ungrouping");
      return;
    }

    try {
      await ungroupSelectedGroups(selectedGroupIds);
      toast.success(
        `✅ Ungrouped ${selectedGroupIds.length} groups successfully`
      );
      clearSelection();
      setSelectedGroupIds([]);
    } catch (error) {
      console.error("❌ Failed to ungroup nodes:", error);
      toast.error("Failed to ungroup nodes. Please try again.");
    }
  }, [ungroupSelectedGroups, selectedGroupIds, clearSelection]);

  const handleDeleteSelectedItems = useCallback(async () => {
    const allSelectedIds = [...selectedNodeIds];

    try {
      // Delete selected nodes
      for (const nodeId of allSelectedIds) {
        deleteNode(nodeId);
        await persistNodeDelete(nodeId);
      }

      // Delete selected groups
      for (const groupId of selectedGroupIds) {
        await deleteGroup(groupId);
      }

      const totalDeleted = allSelectedIds.length + selectedGroupIds.length;
      toast.success(
        `✅ Deleted ${totalDeleted} item${totalDeleted !== 1 ? "s" : ""} successfully`
      );

      clearSelection();
      setSelectedGroupIds([]);
    } catch (error) {
      console.error("❌ Failed to delete selected items:", error);
      toast.error("Failed to delete selected items. Please try again.");
    }
  }, [
    selectedNodeIds,
    selectedGroupIds,
    deleteNode,
    persistNodeDelete,
    deleteGroup,
    clearSelection,
  ]);

  const handleDuplicateSelectedItems = useCallback(() => {
    // TODO: Implement duplicate functionality
    console.log("Duplicate functionality not yet implemented");
  }, []);

  const handleOpenSelectedSettings = useCallback(() => {
    if (selectedNodeIds.length === 1) {
      setSettingsCardId(selectedNodeIds[0]);
    }
  }, [selectedNodeIds, setSettingsCardId]);

  // Filter handlers
  const handleOpenFilters = useCallback(() => {
    setFilterModalOpen(true);
  }, []);

  const handleAddEvidence = useCallback(() => {
    console.log("🔍 Evidence button clicked!");
    console.log("🔍 addEvidence function:", addEvidence);

    // Get current viewport center for better positioning
    const reactFlowInstance = reactFlowRef.current?.getBoundingClientRect();
    const centerX = reactFlowInstance ? reactFlowInstance.width / 2 : 400;
    const centerY = reactFlowInstance ? reactFlowInstance.height / 2 : 300;

    // Create a new general evidence item
    const newEvidence: EvidenceItem = {
      id: `evidence_${Date.now()}`,
      title: "New Evidence",
      type: "Analysis",
      date: new Date().toISOString().split("T")[0],
      owner: "Current User", // TODO: Get from auth
      summary: "Add your evidence summary here",
      hypothesis: "",
      impactOnConfidence: "",
      createdAt: new Date().toISOString(),
      createdBy: "current-user", // TODO: Get from auth
      context: {
        type: "general",
        targetName: "Canvas Evidence",
      },
      position: { x: centerX, y: centerY }, // Center position
      isVisible: true,
      isExpanded: false,
    };

    console.log("🔍 Created evidence item:", newEvidence);

    try {
      // Add to evidence store
      addEvidence(newEvidence);
      console.log("✅ Evidence added to store successfully");

      // Show success message
      toast.success("Evidence added to canvas");
      console.log("✅ Toast message shown");
    } catch (error) {
      console.error("❌ Error adding evidence:", error);
      toast.error("Failed to add evidence");
    }
  }, [addEvidence]);

  const handleApplyFilters = useCallback(
    (filters: FilterOptions) => {
      setCurrentFilters(filters);

      if (canvas?.nodes && canvas?.edges) {
        const {
          visibleNodeIds: newVisibleNodeIds,
          visibleEdgeIds: newVisibleEdgeIds,
        } = applyFilters(canvas.nodes, canvas.edges, filters);

        setVisibleNodeIds(newVisibleNodeIds);
        setVisibleEdgeIds(newVisibleEdgeIds);
      }
    },
    [canvas?.nodes, canvas?.edges]
  );

  // Update layout direction when canvas settings change
  useEffect(() => {
    if (canvas?.settings?.autoLayout?.algorithm) {
      setCurrentLayoutDirection(canvas.settings.autoLayout.algorithm);
    } else {
      // Default to TB if no saved layout
      setCurrentLayoutDirection("TB");
    }
  }, [canvas?.settings?.autoLayout?.algorithm]);

  // Layout application
  const handleApplyLayout = useCallback(
    (direction: "TB" | "BT" | "LR" | "RL") => {
      setCurrentLayoutDirection(direction);

      // Persist layout direction to canvas settings
      updateCanvasSettings({
        autoLayout: {
          algorithm: direction,
          enabled: true,
        },
      });

      if (canvas?.nodes && canvas?.edges) {
        const layoutedNodes = applyAutoLayout(
          canvas.nodes.map((node) => ({
            id: node.id,
            position: node.position,
            data: { card: node },
            type: "metricCard",
          })),
          canvas.edges.map((edge) => ({
            id: edge.id,
            source: edge.sourceId,
            target: edge.targetId,
            data: { relationship: edge },
          })),
          { direction }
        );

        // Update node positions
        layoutedNodes.forEach((node) => {
          updateNodePosition(node.id, node.position);
        });

        console.log(
          `✅ Applied ${direction} layout to canvas and saved to settings`
        );
      }
    },
    [canvas?.nodes, canvas?.edges, updateNodePosition, updateCanvasSettings]
  );

  // Beautiful auto-save status with enhanced UX
  const getAutoSaveStatus = useCallback(() => {
    if (isSaving) {
      return {
        text: "Saving...",
        icon: Save,
        className: "text-blue-600 animate-pulse",
        bgClassName: "bg-blue-50 border-blue-200",
        dotClassName: "bg-blue-500 animate-ping",
      };
    }

    if (pendingChanges.size > 0) {
      return {
        text: `${pendingChanges.size} unsaved change${pendingChanges.size > 1 ? "s" : ""}`,
        icon: Clock,
        className: "text-amber-600",
        bgClassName: "bg-amber-50 border-amber-200",
        dotClassName: "bg-amber-500",
      };
    }

    if (lastSaved) {
      const savedTime = new Date(lastSaved);
      const now = new Date();
      const diffMinutes = Math.floor(
        (now.getTime() - savedTime.getTime()) / (1000 * 60)
      );

      if (diffMinutes < 1) {
        return {
          text: "Saved just now",
          icon: Check,
          className: "text-emerald-600",
          bgClassName: "bg-emerald-50 border-emerald-200",
          dotClassName: "bg-emerald-500",
        };
      } else if (diffMinutes < 5) {
        return {
          text: `Saved ${diffMinutes}m ago`,
          icon: Check,
          className: "text-emerald-600",
          bgClassName: "bg-emerald-50 border-emerald-200",
          dotClassName: "bg-emerald-500",
        };
      } else if (diffMinutes < 60) {
        return {
          text: `Saved ${diffMinutes}m ago`,
          icon: Check,
          className: "text-green-600",
          bgClassName: "bg-green-50 border-green-200",
          dotClassName: "bg-green-500",
        };
      } else {
        const diffHours = Math.floor(diffMinutes / 60);
        return {
          text: `Saved ${diffHours}h ago`,
          icon: AlertCircle,
          className: "text-gray-600",
          bgClassName: "bg-gray-50 border-gray-200",
          dotClassName: "bg-gray-400",
        };
      }
    }

    return {
      text: "Auto-save enabled",
      icon: Save,
      className: "text-gray-500",
      bgClassName: "bg-gray-50 border-gray-200",
      dotClassName: "bg-gray-400",
    };
  }, [isSaving, pendingChanges, lastSaved]);

  // Update header information when canvas or auto-save status changes
  useEffect(() => {
    if (canvas) {
      const autoSaveStatus = getAutoSaveStatus();
      setHeaderInfo({
        title: canvas.name || "Untitled Canvas",
        description: canvas.description,
        autoSaveStatus,
      });
    }
  }, [
    canvas,
    isSaving,
    pendingChanges,
    lastSaved,
    setHeaderInfo,
    getAutoSaveStatus,
  ]);

  // Cleanup header on unmount
  useEffect(() => {
    return () => setHeaderInfo(null);
  }, [setHeaderInfo]);

  // Function to load canvas directly from database using Clerk authentication
  const loadCanvasFromDatabase = async (projectId: string) => {
    try {
      // Use Clerk-authenticated Supabase client to fetch project data
      const { data: project, error } = await supabaseClient
        .from("projects")
        .select(
          `
          *,
          metric_cards(*),
          relationships(*),
          groups(*)
        `
        )
        .eq("id", projectId)
        .single();

      if (error) {
        throw error;
      }

      if (project) {
        // Transform database data to CanvasProject format
        const canvasProject = {
          id: project.id,
          name: project.name || "",
          description: project.description || "",
          tags: project.tags || [],
          settings: (project.settings as CanvasSettings) || {},
          nodes: (project.metric_cards || []).map((card: any) => ({
            id: card.id,
            title: card.title,
            description: card.description || "",
            category: card.category as CardCategory,
            subCategory: card.sub_category as
              | CardSubCategory[CardCategory]
              | undefined,
            tags: [], // Will be populated from tags table if needed
            causalFactors: (card.causal_factors as CausalFactor[]) || [],
            dimensions: (card.dimensions as Dimension[]) || [],
            segments: [],
            position: { x: card.position_x, y: card.position_y },
            parentId: undefined, // Will be populated if needed
            data: Array.isArray(card.data)
              ? (card.data as unknown as MetricValue[])
              : [],
            sourceType: (card.source_type as SourceType) || "Manual",
            formula: card.formula || "",
            owner: card.owner_id || "",
            assignees: card.assignees || [],
            createdAt: card.created_at || new Date().toISOString(),
            updatedAt: card.updated_at || new Date().toISOString(),
          })),
          edges: (project.relationships || []).map((rel: any) => ({
            id: rel.id,
            sourceId: rel.source_id,
            targetId: rel.target_id,
            type: rel.type as RelationshipType,
            confidence: rel.confidence as ConfidenceLevel,
            weight: rel.weight || 1,
            description: rel.description || "",
            evidence: [], // Will be populated from evidence table if needed
            createdAt: rel.created_at || new Date().toISOString(),
            updatedAt: rel.updated_at || new Date().toISOString(),
          })),
          groups: (project.groups || []).map((group: any) => ({
            id: group.id,
            name: group.name,
            description: group.description || "",
            color: group.color || "#e5e7eb",
            position: { x: group.position_x, y: group.position_y },
            size: { width: group.width, height: group.height },
            nodeIds: group.node_ids || [],
            isCollapsed: false, // Default to expanded
            createdAt: group.created_at || new Date().toISOString(),
            updatedAt: group.updated_at || new Date().toISOString(),
          })),
          collaborators: [], // Will be populated if needed
          createdAt: project.created_at || new Date().toISOString(),
          updatedAt: project.updated_at || new Date().toISOString(),
          lastModifiedBy: project.last_modified_by || project.created_by || "",
        };

        console.log("📥 Loading canvas from database with Clerk auth:", {
          nodes: canvasProject.nodes.length,
          edges: canvasProject.edges.length,
          groups: canvasProject.groups.length,
        });

        loadCanvas(canvasProject);
      } else {
        // Project not found
      }
    } catch (error) {
      // Failed to load canvas
    }
  };

  // Keyboard shortcuts
  const shortcuts = useMemo(
    () => [
      // Navigation shortcuts
      createShortcut.cmd(
        "k",
        () => setShowShortcutsHelp(true),
        "Show keyboard shortcuts",
        "Navigation"
      ),
      createShortcut.key(
        "?",
        () => setShowShortcutsHelp(true),
        "Show keyboard shortcuts",
        "Navigation"
      ),
      // Spacebar Hand Tool (press and hold)
      // Handled via native key listeners below to get proper keyup behavior
      createShortcut.key(
        "Escape",
        () => {
          // setToolbarNodeId(undefined); // Removed as per edit hint
          setSettingsCardId(undefined);
          setRelationshipSheetId(undefined);
          clearSelection();
        },
        "Close dialogs and clear selection",
        "Navigation"
      ),
      createShortcut.cmd("h", () => navigate("/"), "Go to home", "Navigation"),
      createShortcut.cmd(
        "f",
        () => quickSearch.open(),
        "Open search",
        "Navigation"
      ),

      // Canvas operations
      createShortcut.cmd(
        "n",
        async () => {
          const newCard = {
            title: "New Metric Card",
            description: "",
            category: "Data/Metric" as const,
            tags: [],
            causalFactors: [],
            dimensions: [],
            position: { x: 100, y: 100 },
            sourceType: "Manual" as const,
            assignees: [],
          };
          await createNode(newCard);
        },
        "Create new metric card",
        "Canvas"
      ),

      createShortcut.cmd(
        "d",
        async () => {
          if (selectedNodeIds.length > 0) {
            try {
              for (const nodeId of selectedNodeIds) {
                deleteNode(nodeId);
                await persistNodeDelete(nodeId);
              }
              clearSelection();
            } catch (error) {
              console.error("❌ Failed to delete nodes:", error);
            }
          }
        },
        "Delete selected nodes",
        "Canvas"
      ),

      createShortcut.cmd(
        "a",
        () => {
          if (canvas?.nodes) {
            canvas.nodes.forEach((node) => selectNode(node.id));
          }
        },
        "Select all nodes",
        "Canvas"
      ),

      createShortcut.cmd(
        "Enter",
        () => {
          if (selectedNodeIds.length === 1) {
            setSettingsCardId(selectedNodeIds[0]);
          }
        },
        "Open settings for selected node",
        "Canvas"
      ),

      // View shortcuts
      createShortcut.key(
        "1",
        () => {
          // TODO: Zoom to fit
          console.log("Zoom to fit");
        },
        "Zoom to fit",
        "View"
      ),

      createShortcut.key(
        "2",
        () => {
          // TODO: Zoom to 100%
          console.log("Zoom to 100%");
        },
        "Zoom to 100%",
        "View"
      ),

      // Layout shortcuts
      createShortcut.cmd(
        "1",
        () => handleApplyLayout("TB"),
        "Apply Top-Bottom layout",
        "Layout"
      ),
      createShortcut.cmd(
        "2",
        () => handleApplyLayout("BT"),
        "Apply Bottom-Top layout",
        "Layout"
      ),
      createShortcut.cmd(
        "3",
        () => handleApplyLayout("LR"),
        "Apply Left-Right layout",
        "Layout"
      ),
      createShortcut.cmd(
        "4",
        () => handleApplyLayout("RL"),
        "Apply Right-Left layout",
        "Layout"
      ),

      // Quick actions
      createShortcut.cmd(
        "s",
        () => {
          // TODO: Save canvas
          console.log("Save canvas");
        },
        "Save canvas",
        "Actions"
      ),

      createShortcut.cmd(
        "z",
        () => {
          // TODO: Undo
          console.log("Undo");
        },
        "Undo",
        "Actions"
      ),

      createShortcut.cmd(
        "y",
        () => {
          // TODO: Redo
          console.log("Redo");
        },
        "Redo",
        "Actions"
      ),

      // Application shortcuts
      createShortcut.cmd(
        "e",
        () => navigate("/evidence"),
        "Open Evidence Repository",
        "Application"
      ),
      createShortcut.cmd(
        ",",
        () => {
          // TODO: Open preferences
          console.log("Open preferences");
        },
        "Open preferences",
        "Application"
      ),

      // Search and filter
      createShortcut.cmd(
        "f",
        () => {
          quickSearch.open();
        },
        "Quick search",
        "Search"
      ),

      createShortcut.shift(
        "f",
        () => {
          setShowAdvancedSearch(true);
        },
        "Advanced search",
        "Search"
      ),
    ],
    [
      navigate,
      selectedNodeIds,
      canvas?.nodes,
      addNode,
      deleteNode,
      clearSelection,
      selectNode,
    ]
  );

  // Enable keyboard shortcuts
  const { shortcuts: enabledShortcuts } = useKeyboardShortcuts(shortcuts, {
    enabled: true,
  });

  // Handle opening settings sheet
  const handleOpenSettings = useCallback((cardId: string, tab?: string) => {
    if (tab) {
      setSettingsInitialTab(tab);
    }
    setSettingsCardId(cardId);
    setIsSettingsSheetOpen(true);
  }, []);

  // Handle node click for toolbar
  const handleNodeClick = useCallback(() => {
    // setToolbarNodeId(cardId); // Removed as per edit hint
  }, []);

  // Handle opening relationship sheet
  const handleOpenRelationshipSheet = useCallback(
    (relationshipId: string) => {
      console.log("🎯 Opening relationship sheet for:", relationshipId);
      console.log("🎯 Current relationshipSheetId:", relationshipSheetId);
      console.log(
        "🎯 Current isRelationshipSheetOpen:",
        isRelationshipSheetOpen
      );
      setRelationshipSheetId(relationshipId);
      setIsRelationshipSheetOpen(true);
      console.log("🎯 relationshipSheetId set to:", relationshipId);
      console.log("🎯 isRelationshipSheetOpen set to: true");
    },
    [relationshipSheetId, isRelationshipSheetOpen]
  );

  // Handle group operations
  const handleEditGroup = useCallback((groupId: string) => {
    // TODO: Open group settings sheet
    console.log("Edit group:", groupId);
  }, []);

  const handleDeleteGroup = useCallback(
    async (groupId: string) => {
      try {
        await deleteGroup(groupId);
      } catch (error) {
        console.error("❌ Failed to delete group:", error);
      }
    },
    [deleteGroup]
  );

  // Handle closing settings sheet
  const handleCloseSettingsSheet = useCallback(() => {
    setIsSettingsSheetOpen(false);
    setSettingsCardId(undefined);
  }, []);

  // Handle closing relationship sheet
  const handleCloseRelationshipSheet = useCallback(() => {
    setIsRelationshipSheetOpen(false);
    setRelationshipSheetId(undefined);
  }, []);

  // Handle switching to a different card (for persistent sheet)
  const handleSwitchToCard = useCallback((cardId: string, tab?: string) => {
    if (tab) {
      setSettingsInitialTab(tab);
    }
    setSettingsCardId(cardId);
  }, []);

  // Handle switching to a different relationship (for persistent sheet)
  const handleSwitchToRelationship = useCallback(
    (relationshipId: string) => {
      console.log("🎯 Switching to relationship:", relationshipId);
      console.log("🎯 Current relationshipSheetId:", relationshipSheetId);
      setRelationshipSheetId(relationshipId);
      console.log("🎯 relationshipSheetId updated to:", relationshipId);
    },
    [relationshipSheetId]
  );

  // Convert canvas data to ReactFlow format
  const nodes = useMemo(() => {
    const metricNodes =
      canvas?.nodes
        .filter(
          (card) => visibleNodeIds.size === 0 || visibleNodeIds.has(card.id)
        )
        .map((card) =>
          convertToNode(
            card,
            handleOpenSettings,
            handleNodeClick,
            handleSwitchToCard,
            isSettingsSheetOpen,
            selectedNodeIds
          )
        ) || [];

    const groupNodes =
      canvas?.groups.map((group) =>
        convertToGroupNode(
          group,
          handleEditGroup,
          handleDeleteGroup,
          handleToggleCollapse,
          handleUpdateGroupSize
        )
      ) || [];

    // Get general evidence items and convert to nodes
    const evidenceNodes = getGeneralEvidence()
      .filter((evidence) => evidence.isVisible !== false)
      .map((evidence) =>
        convertToEvidenceNode(evidence, updateEvidence, deleteEvidence)
      );

    // Groups should be rendered last (on top of other nodes)
    return [...metricNodes, ...evidenceNodes, ...groupNodes, ...extraNodes];
  }, [
    canvas?.nodes,
    canvas?.groups,
    visibleNodeIds,
    handleOpenSettings,
    handleNodeClick,
    handleSwitchToCard,
    isSettingsSheetOpen,
    selectedNodeIds,
    handleEditGroup,
    handleDeleteGroup,
    handleToggleCollapse,
    handleUpdateGroupSize,
    getGeneralEvidence,
    updateEvidence,
    deleteEvidence,
    evidenceList,
    extraNodes,
  ]);
  const edges = useMemo(() => {
    const relEdges =
      canvas?.edges
        .filter(
          (edge) => visibleEdgeIds.size === 0 || visibleEdgeIds.has(edge.id)
        )
        .map((edge) =>
          convertToEdge(
            edge,
            handleOpenRelationshipSheet,
            handleSwitchToRelationship,
            isRelationshipSheetOpen
          )
        ) || [];
    return [...relEdges, ...extraEdges];
  }, [
    canvas?.edges,
    visibleEdgeIds,
    handleOpenRelationshipSheet,
    handleSwitchToRelationship,
    isRelationshipSheetOpen,
    extraEdges,
  ]);

  // Focus handling from query param
  useEffect(() => {
    const focus = searchParams.get("focus");
    if (!focus) return;
    const [kind, id] = focus.split(":");
    if (!id) return;
    // evidence: focus evidence node id
    if (kind === "evidence") {
      const target = nodes.find((n) => n.id === id);
      if (target && target.position) {
        setCenter(target.position.x, target.position.y, {
          zoom: 1.2,
          duration: 800,
        });
        selectNode(id);
      }
    }
    if (kind === "card") {
      const target = nodes.find((n) => n.id === id);
      if (target && target.position) {
        setCenter(target.position.x, target.position.y, {
          zoom: 1.2,
          duration: 800,
        });
        selectNode(id);
      }
    }
    if (kind === "rel") {
      const rel = canvas?.edges.find((e) => e.id === id);
      if (rel) {
        const a = nodes.find((n) => n.id === rel.sourceId);
        const b = nodes.find((n) => n.id === rel.targetId);
        if (a && b) {
          const cx = (a.position.x + b.position.x) / 2;
          const cy = (a.position.y + b.position.y) / 2;
          setCenter(cx, cy, { zoom: 1.0, duration: 800 });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, nodes, canvas?.edges]);

  // Proximity Connect - REMOVED for better drag/toolbar UX

  // Load canvas when component mounts or canvasId changes
  useEffect(() => {
    if (canvasId) {
      loadCanvasFromDatabase(canvasId);
    }
  }, [canvasId]);

  // After canvas loads, hydrate whiteboard scene from project settings
  useEffect(() => {
    if (canvas?.settings?.whiteboardScene) {
      setWhiteboardScene(canvas.settings.whiteboardScene);
    }
  }, [canvas?.settings?.whiteboardScene]);

  // Hydrate draw preferences (keepToolActive, lastTool, stroke)
  useEffect(() => {
    const prefs: any = canvas?.settings?.whiteboardPrefs;
    if (!prefs) return;
    if (typeof prefs.keepToolActive === "boolean")
      setKeepToolActive(prefs.keepToolActive);
    if (prefs.lastTool) setDrawActiveTool(prefs.lastTool);
    if (prefs.strokeColor) {
      setDrawStrokeColor(prefs.strokeColor);
      whiteboardRef.current?.setStrokeColor(prefs.strokeColor);
    }
    if (prefs.strokeWidth) {
      setDrawStrokeWidth(prefs.strokeWidth);
      whiteboardRef.current?.setStrokeWidth(prefs.strokeWidth);
    }
  }, [canvas?.settings?.whiteboardPrefs]);

  // Persist scene when it changes (debounced by overlay). Uses project settings JSON
  useEffect(() => {
    if (!canvas?.id) return;
    if (whiteboardScene == null) return;
    let cancelled = false;
    (async () => {
      try {
        const { mergeProjectSettings } = await import(
          "@/lib/supabase/services/projects"
        );
        if (!cancelled) {
          await mergeProjectSettings(canvas.id, {
            whiteboardScene: whiteboardScene,
          });
        }
      } catch (e) {
        console.warn("Failed to persist whiteboard scene", e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [canvas?.id, whiteboardScene]);

  // Persist draw preferences per canvas
  useEffect(() => {
    if (!canvas?.id) return;
    (async () => {
      try {
        const { mergeProjectSettings } = await import(
          "@/lib/supabase/services/projects"
        );
        await mergeProjectSettings(canvas.id, {
          whiteboardPrefs: {
            keepToolActive,
            lastTool: drawActiveTool,
            strokeColor: drawStrokeColor,
            strokeWidth: drawStrokeWidth,
          },
        });
      } catch (e) {
        console.warn("Failed to persist whiteboard prefs", e);
      }
    })();
  }, [
    canvas?.id,
    keepToolActive,
    drawActiveTool,
    drawStrokeColor,
    drawStrokeWidth,
  ]);

  // Persist React Flow viewport to settings
  useEffect(() => {
    if (!canvas?.id) return;
    if (!viewport) return;
    (async () => {
      try {
        const { mergeProjectSettings } = await import(
          "@/lib/supabase/services/projects"
        );
        await mergeProjectSettings(canvas.id, { reactFlowViewport: viewport });
      } catch (e) {
        // non-fatal
      }
    })();
  }, [canvas?.id, viewport?.x, viewport?.y, viewport?.zoom]);

  // Spacebar to temporarily switch to Hand tool
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !e.repeat) {
        prevNavigationToolRef.current = navigationTool;
        setNavigationTool("hand");
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setNavigationTool(prevNavigationToolRef.current);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [navigationTool]);

  // Draw-mode hotkeys (match Excalidraw)
  useEffect(() => {
    if (toolbarMode !== "draw") return;
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      if (
        tag === "input" ||
        tag === "textarea" ||
        (target as any)?.isContentEditable
      )
        return;
      let handled = true;
      switch (e.key.toLowerCase()) {
        case "q":
          setKeepToolActive((prev) => {
            const next = !prev;
            whiteboardRef.current?.setKeepToolActive(next);
            return next;
          });
          break;
        case "h":
          whiteboardRef.current?.setTool("hand");
          setDrawActiveTool("hand");
          break;
        case "v":
        case "1":
          whiteboardRef.current?.setTool("selection");
          setDrawActiveTool("selection");
          break;
        case "r":
        case "2":
          whiteboardRef.current?.setTool("rectangle");
          setDrawActiveTool("rectangle");
          break;
        case "d":
        case "3":
          whiteboardRef.current?.setTool("diamond");
          setDrawActiveTool("diamond");
          break;
        case "o":
        case "4":
          whiteboardRef.current?.setTool("ellipse");
          setDrawActiveTool("ellipse");
          break;
        case "a":
        case "5":
          whiteboardRef.current?.setTool("arrow");
          setDrawActiveTool("arrow");
          break;
        case "l":
        case "6":
          whiteboardRef.current?.setTool("line");
          setDrawActiveTool("line");
          break;
        case "p":
        case "7":
          whiteboardRef.current?.setTool("freedraw");
          setDrawActiveTool("freedraw");
          break;
        case "t":
        case "8":
          whiteboardRef.current?.setTool("text");
          setDrawActiveTool("text");
          break;
        case "9":
          whiteboardRef.current?.setTool("image");
          setDrawActiveTool("image");
          break;
        case "e":
        case "0":
          whiteboardRef.current?.setTool("eraser");
          setDrawActiveTool("eraser");
          break;
        default:
          handled = false;
      }
      if (handled) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener("keydown", handler, { capture: true });
    return () =>
      window.removeEventListener("keydown", handler, { capture: true } as any);
  }, [toolbarMode]);

  // Listen for keyboard shortcuts event from sidebar
  useEffect(() => {
    const handleOpenKeyboardShortcuts = () => {
      setShowShortcutsHelp(true);
    };

    window.addEventListener(
      "openKeyboardShortcuts",
      handleOpenKeyboardShortcuts
    );
    return () => {
      window.removeEventListener(
        "openKeyboardShortcuts",
        handleOpenKeyboardShortcuts
      );
    };
  }, []);

  // Drag & drop images onto canvas to create whiteboard image nodes
  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "copy";
    }
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      // Files first
      const files = Array.from(event.dataTransfer?.files || []).filter(
        (f: any) => (f as File).type?.startsWith("image/")
      ) as File[];
      if (files.length > 0) {
        const newNodes: Node[] = files
          .slice(0, 5)
          .map((file: File, index: number) => ({
            id: `wb-image-${Date.now()}-${index}`,
            type: "whiteboardNode",
            position: {
              x: position.x + index * 20,
              y: position.y + index * 20,
            },
            data: { shape: "image", imageSrc: URL.createObjectURL(file) },
            style: { width: 240, height: 180 },
          }));
        setExtraNodes((prev) => [...prev, ...newNodes]);
        return;
      }

      // URL drops (e.g., dragging an image from browser)
      const uriList = event.dataTransfer?.getData("text/uri-list");
      const plain = event.dataTransfer?.getData("text/plain");
      const candidate = uriList || plain || "";
      if (/^(https?:).*\.(png|jpe?g|gif|webp|svg)$/i.test(candidate)) {
        const node: Node = {
          id: `wb-image-${Date.now()}`,
          type: "whiteboardNode",
          position,
          data: { shape: "image", imageSrc: candidate },
          style: { width: 240, height: 180 },
        };
        setExtraNodes((prev) => [...prev, node]);
      }
    },
    [screenToFlowPosition]
  );

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      console.log("🎯 onNodesChange called with changes:", changes);

      changes.forEach((change) => {
        // Keep extra (non-persisted) nodes responsive
        if (change.type === "position") {
          setExtraNodes((prev) => {
            const idx = prev.findIndex((n) => n.id === change.id);
            if (idx === -1 || !change.position) return prev;
            const copy = [...prev];
            copy[idx] = { ...copy[idx], position: change.position };
            return copy;
          });
        }

        // Handle position changes - BULLETPROOF POSITION SAVING
        if (change.type === "position" && canvas) {
          const canvasNode = canvas.nodes.find((n) => n.id === change.id);
          if (canvasNode && change.position) {
            console.log(`🎯 Position change detected for ${change.id}:`, {
              from: canvasNode.position,
              to: change.position,
              dragging: change.dragging,
            });

            // Update position immediately for smooth UX
            updateNodePosition(change.id, change.position);

            // Add to pending changes for auto-save
            addPendingChange(change.id);

            // For manual dragging, add extra logging
            if (!change.dragging) {
              console.log(
                `✅ Manual drag completed for ${change.id}:`,
                change.position
              );
            }
          }
        }

        // Handle selection changes for multi-selection
        if (change.type === "select") {
          console.log(`🎯 Selection change for ${change.id}:`, {
            selected: change.selected,
            currentSelectedCount: selectedNodeIds.length,
            allSelectedIds: selectedNodeIds,
            canvasGroups: canvas?.groups?.map((g) => g.id) || [],
          });

          // Check if this is a group node by checking if it exists in canvas groups
          const isGroupNode =
            canvas?.groups.some((group) => group.id === change.id) || false;

          console.log(`🎯 Is group node: ${isGroupNode} for ${change.id}`, {
            changeId: change.id,
            canvasGroups:
              canvas?.groups?.map((g) => ({ id: g.id, name: g.name })) || [],
            matchingGroup: canvas?.groups?.find((g) => g.id === change.id),
          });

          // Ignore selection propagation for extra (temp) nodes
          const isExtraNode = extraNodes.some((n) => n.id === change.id);
          if (isExtraNode) {
            return;
          }

          if (change.selected) {
            if (isGroupNode) {
              // Add to group selection (prevent duplicates)
              setSelectedGroupIds((prev) =>
                prev.includes(change.id) ? prev : [...prev, change.id]
              );
              console.log(`✅ Added group ${change.id} to selection`);
            } else {
              // Add to node selection
              selectNode(change.id);
              console.log(`✅ Added node ${change.id} to selection`);
            }
          } else {
            if (isGroupNode) {
              // Remove from group selection
              setSelectedGroupIds((prev) =>
                prev.filter((id) => id !== change.id)
              );
              console.log(`✅ Removed group ${change.id} from selection`);
            } else {
              // Remove from node selection
              deselectNode(change.id);
              console.log(`✅ Removed node ${change.id} from selection`);
            }
          }
        }
      });
    },
    [
      canvas,
      updateNodePosition,
      addPendingChange,
      selectNode,
      deselectNode,
      selectedNodeIds,
    ]
  );

  // Log selection changes for debugging
  useEffect(() => {
    console.log("🎯 Selection changed:", { selectedNodeIds, selectedGroupIds });
  }, [selectedNodeIds, selectedGroupIds]);

  // Debug group creation
  useEffect(() => {
    console.log("🎯 Canvas groups updated:", canvas?.groups?.length || 0);
  }, [canvas?.groups]);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    const removed = changes
      .filter((c) => c.type === "remove")
      .map((c: any) => c.id as string);
    if (removed.length) {
      setExtraEdges((prev) => prev.filter((e) => !removed.includes(e.id)));
    }
  }, []);

  // Delete Middle Node - automatically reconnect edges when intermediate nodes are deleted
  const onNodesDelete = useCallback(
    async (deletedNodes: Node[]) => {
      console.log(
        `🗑️ onNodesDelete triggered for ${deletedNodes.length} nodes`
      );

      for (const node of deletedNodes) {
        // Get all incoming and outgoing edges for the deleted node
        const incomers = getIncomers(node, nodes, edges);
        const outgoers = getOutgoers(node, nodes, edges);
        const connectedEdges = getConnectedEdges([node], edges);

        console.log(`🗑️ Processing deletion for node ${node.id}:`, {
          incomers: incomers.map((n) => n.id),
          outgoers: outgoers.map((n) => n.id),
          connectedEdges: connectedEdges.length,
        });

        // Only auto-reconnect if this node has both incoming and outgoing connections
        if (incomers.length > 0 && outgoers.length > 0) {
          console.log(
            `🔗 Auto-reconnecting ${incomers.length} incomers to ${outgoers.length} outgoers`
          );

          // Create new connections between all incomers and outgoers
          for (const incomer of incomers) {
            for (const outgoer of outgoers) {
              // Check if connection already exists in current edges OR canvas.edges
              const connectionExistsInReactFlow = edges.some(
                (edge) =>
                  edge.source === incomer.id && edge.target === outgoer.id
              );

              const connectionExistsInCanvas = canvas?.edges.some(
                (edge) =>
                  edge.sourceId === incomer.id && edge.targetId === outgoer.id
              );

              if (
                !connectionExistsInReactFlow &&
                !connectionExistsInCanvas &&
                incomer.id !== outgoer.id
              ) {
                const newRelationshipData = {
                  sourceId: incomer.id,
                  targetId: outgoer.id,
                  type: "Probabilistic" as const,
                  confidence: "Low" as const,
                  evidence: [],
                };

                try {
                  await createEdge(newRelationshipData);
                  console.log(
                    `✅ Auto-reconnected: ${incomer.id} → ${outgoer.id}`
                  );
                } catch (error) {
                  console.error(
                    `❌ Failed to auto-reconnect ${incomer.id} → ${outgoer.id}:`,
                    error
                  );
                }
              } else {
                console.log(
                  `⏭️ Skipping connection ${incomer.id} → ${outgoer.id} (already exists or same node)`
                );
              }
            }
          }
        } else {
          console.log(
            `⏭️ No auto-reconnection needed for ${node.id} (incomers: ${incomers.length}, outgoers: ${outgoers.length})`
          );
        }

        // Delete the node from our canvas store AND database (this should happen after auto-reconnection)
        try {
          // Delete from local state first (immediate UI update)
          deleteNode(node.id);
          console.log(`✅ Node ${node.id} deleted from canvas store`);

          // Persist deletion to database
          await persistNodeDelete(node.id);
          console.log(`✅ Node ${node.id} deleted from database`);
        } catch (error) {
          console.error(`❌ Failed to delete node ${node.id}:`, error);
        }
      }
    },
    [nodes, edges, createEdge, deleteNode, persistNodeDelete, canvas?.edges]
  );

  // Enhanced connection validation with better feedback
  const isValidConnection = useCallback(
    (connection: Connection | Edge) => {
      const source = connection.source;
      const target = connection.target;

      if (!source || !target || !canvas) {
        console.log("🚫 Invalid connection: Missing source, target, or canvas");
        return false;
      }

      // Don't allow self-connections
      if (source === target) {
        console.log("🚫 Self-connections not allowed");
        return false;
      }

      // Check if connection already exists
      const existingEdge = canvas.edges.find(
        (edge) => edge.sourceId === source && edge.targetId === target
      );
      if (existingEdge) {
        console.log("🚫 Connection already exists between these nodes");
        return false;
      }

      // Get node details for better feedback
      const sourceNode = canvas.nodes.find((n) => n.id === source);
      const targetNode = canvas.nodes.find((n) => n.id === target);

      console.log("✅ Valid connection:", {
        from: `${sourceNode?.title || source} (${sourceNode?.category || "Unknown"})`,
        to: `${targetNode?.title || target} (${targetNode?.category || "Unknown"})`,
        source,
        target,
      });

      return true; // Allow all connections except self-connections and duplicates
    },
    [canvas]
  );

  const onConnect = useCallback(
    async (params: Connection) => {
      console.log("🔗 Connection params:", {
        source: params.source,
        target: params.target,
        sourceHandle: params.sourceHandle,
        targetHandle: params.targetHandle,
      });

      if (params.source && params.target && isValidConnection(params)) {
        const src = nodes.find((n) => n.id === params.source);
        const dst = nodes.find((n) => n.id === params.target);
        const srcType = src?.type;
        const dstType = dst?.type;

        const isOperative =
          ((srcType === "sourceNode" || srcType === "operatorNode") &&
            (dstType === "metricCard" || dstType === "operatorNode")) ||
          ((dstType === "sourceNode" || dstType === "operatorNode") &&
            (srcType === "metricCard" || srcType === "operatorNode"));

        if (isOperative) {
          const opEdge: Edge = {
            id: `op-${Date.now()}`,
            source: params.source,
            target: params.target,
            type: "operativeEdge",
            data: { label: "data" },
          };
          setExtraEdges((prev) => [...prev, opEdge]);
          return;
        }

        const newRelationshipData = {
          sourceId: params.source,
          targetId: params.target,
          type: "Probabilistic" as const,
          confidence: "Low" as const,
          evidence: [],
        };

        try {
          await createEdge(newRelationshipData);
        } catch (error) {
          console.error("❌ Failed to create relationship:", error);
        }
      }
    },
    [createEdge, isValidConnection, nodes]
  );

  // Handle category selection for dropped node
  const handleCategorySelect = useCallback(
    async (category: CardCategory) => {
      if (!pendingNodeDrop) return;

      const now = new Date().toISOString();
      const newCardId = generateUUID();

      const newCard: MetricCardType = {
        id: newCardId,
        title: "New Metric Card",
        description: "",
        category,
        subCategory: category === "Data/Metric" ? "Input Metric" : undefined,
        tags: [],
        causalFactors: [],
        dimensions: ["Quantitative"],
        segments: [],
        position: pendingNodeDrop.position,
        data: [
          {
            period: new Date().toISOString().split("T")[0],
            value: 0,
            change_percent: 0,
            trend: "neutral",
          },
        ],
        sourceType: "Manual",
        formula: "",
        owner: "",
        assignees: [],
        createdAt: now,
        updatedAt: now,
      };

      try {
        // Create the new node in the database and add to canvas
        await createNode(newCard);

        // Create the connection between the source node and the new node
        const newRelationshipData = {
          sourceId: pendingNodeDrop.sourceNodeId,
          targetId: newCardId,
          type: "Probabilistic" as const,
          confidence: "Low" as const,
          evidence: [],
        };

        await createEdge(newRelationshipData);

        console.log("✅ New node created and connected via edge drop");
        setPendingNodeDrop(null); // Clear pending state
      } catch (error) {
        console.error("❌ Failed to create node on edge drop:", error);
      }
    },
    [pendingNodeDrop, createNode, createEdge]
  );

  // Add Node on Edge Drop - show category selection when connection line is dropped on canvas
  const onConnectEnd = useCallback(
    async (
      event: MouseEvent | TouchEvent,
      connectionState: { isValid: boolean | null; fromNode?: Node | null }
    ) => {
      // Only create a node if the connection is not valid (dropped on empty canvas)
      if (!connectionState.isValid && connectionState.fromNode) {
        const { clientX, clientY } =
          "changedTouches" in event ? event.changedTouches[0] : event;

        // Convert screen coordinates to flow coordinates
        const position = screenToFlowPosition({
          x: clientX,
          y: clientY,
        });

        // Set pending node drop state to show category selection
        setPendingNodeDrop({
          position,
          sourceNodeId: connectionState.fromNode.id,
        });
      }
    },
    [screenToFlowPosition]
  );

  return (
    <div className="w-full h-full bg-background">
      {/* React Flow Canvas */}
      <div className="h-full">
        <PortalContainerProvider container={reactFlowRef.current as any}>
          <ReactFlow
            ref={reactFlowRef}
            onDragOver={onDragOver as any}
            onDrop={onDrop as any}
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodesDelete={onNodesDelete}
            onConnect={onConnect}
            onConnectEnd={onConnectEnd}
            onPaneClick={handlePaneClick}
            isValidConnection={isValidConnection}
            connectionMode={"strict" as ConnectionMode} // Better for touch devices - requires handle targeting
            connectOnClick={true} // Enable touch device support - click to connect handles
            snapToGrid={true}
            snapGrid={[15, 15]}
            multiSelectionKeyCode={["Shift"]}
            selectionKeyCode={["Shift"]}
            // Figma-style navigation behavior
            panOnDrag={navigationTool === "hand" ? [0, 1, 2] : [1, 2]}
            nodesDraggable={navigationTool === "move"}
            selectionOnDrag={false}
            // Make the canvas effectively infinite
            translateExtent={[
              [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
              [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY],
            ]}
            minZoom={0.05}
            maxZoom={3}
            panOnScroll={true}
            zoomOnScroll={toolbarMode !== "draw"}
            onMoveEnd={() => {
              try {
                const vp = getViewport?.();
                if (vp) setViewport(vp);
              } catch {}
            }}
            defaultEdgeOptions={{
              type: "dynamicEdge",
              animated: false,
            }}
            // Subflow configuration
            fitViewOptions={{ padding: 0.1 }}
            proOptions={{ hideAttribution: true }}
            // Enable subflow behavior
            nodesDraggable={true}
            nodesConnectable={true}
            elementsSelectable={true}
            // Ensure proper layering
            elevateNodesOnSelect={true}
            elevateEdgesOnSelect={true}
            connectionLineStyle={{
              strokeWidth: 3,
              stroke: "#3b82f6",
            }}
            connectionLineComponent={({
              fromX,
              fromY,
              toX,
              toY,
              connectionStatus,
            }: {
              fromX: number;
              fromY: number;
              toX: number;
              toY: number;
              connectionStatus: string | null;
            }) => {
              // Dynamic styling based on connection status
              const isValid = connectionStatus === "valid";
              const strokeColor = isValid ? "#10b981" : "#3b82f6"; // green if valid, blue otherwise

              return (
                <g>
                  <defs>
                    <linearGradient
                      id="easyConnectionGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop
                        offset="0%"
                        style={{ stopColor: strokeColor, stopOpacity: 0.8 }}
                      />
                      <stop
                        offset="100%"
                        style={{ stopColor: strokeColor, stopOpacity: 1 }}
                      />
                    </linearGradient>
                    <filter id="connectionGlow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Connection line with smooth bezier curve */}
                  <path
                    d={`M${fromX},${fromY} C${fromX + 50},${fromY} ${toX - 50},${toY} ${toX},${toY}`}
                    stroke="url(#easyConnectionGradient)"
                    strokeWidth={3}
                    fill="none"
                    filter="url(#connectionGlow)"
                    className={isValid ? "animate-pulse" : ""}
                  />

                  {/* Connection endpoint indicator */}
                  <circle
                    cx={toX}
                    cy={toY}
                    r={6}
                    fill={strokeColor}
                    stroke="white"
                    strokeWidth={2}
                    className={isValid ? "animate-bounce" : "animate-pulse"}
                  />

                  {/* Source point indicator */}
                  <circle
                    cx={fromX}
                    cy={fromY}
                    r={4}
                    fill={strokeColor}
                    stroke="white"
                    strokeWidth={1}
                  />
                </g>
              );
            }}
            fitView
            className="bg-background"
          >
            <Background />

            {/* Top toolbar */}
            <TopCanvasToolbar
              activeTool={activeWbTool}
              onSelectTool={(t) => {
                // In drawing mode (Excalidraw overlay), do not create ReactFlow whiteboard nodes
                if (isWhiteboardActive) return;
                setActiveWbTool(t);
              }}
              onUploadImage={(file) => {
                const id = `temp-whiteboardNode-${Date.now()}`;
                const position = { x: 200, y: 200 };
                const node: Node = {
                  id,
                  type: "whiteboardNode",
                  position,
                  data: { shape: "image", imageSrc: URL.createObjectURL(file) },
                  style: { width: 220, height: 160 },
                };
                setExtraNodes((prev) => [...prev, node]);
              }}
              onOpenSearch={() => quickSearch.open()}
              onOpenFilters={handleOpenFilters}
              onAddEvidence={handleAddEvidence}
              currentLayoutDirection={currentLayoutDirection}
              onChangeLayoutDirection={(dir) => handleApplyLayout(dir)}
              navigationTool={navigationTool}
              onChangeNavigationTool={setNavigationTool}
              onToggleWhiteboard={() => setIsWhiteboardActive((v) => !v)}
              isWhiteboardActive={isWhiteboardActive}
              mode={toolbarMode}
              onChangeMode={(m) => {
                setToolbarMode(m);
                setIsWhiteboardActive(m === "draw");
              }}
              drawActiveTool={drawActiveTool}
              keepToolActive={keepToolActive}
              onToggleKeepToolActive={(next) => {
                setKeepToolActive(next);
                whiteboardRef.current?.setKeepToolActive(next);
              }}
              onExportWhiteboardPNG={async () => {
                const blob = await whiteboardRef.current?.exportPNG();
                if (!blob) return;
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `whiteboard-${Date.now()}.png`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              onExportWhiteboardSVG={async () => {
                const svg = await whiteboardRef.current?.exportSVG();
                if (!svg) return;
                const serializer = new XMLSerializer();
                const data = serializer.serializeToString(svg);
                const blob = new Blob([data], { type: "image/svg+xml" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `whiteboard-${Date.now()}.svg`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              onClearWhiteboard={() => whiteboardRef.current?.clear()}
              onSetDrawTool={(tool) => {
                whiteboardRef.current?.setTool(tool);
                setDrawActiveTool(tool);
              }}
              onSetStrokeColor={(hex) => {
                setDrawStrokeColor(hex);
                whiteboardRef.current?.setStrokeColor(hex);
              }}
              onSetStrokeWidth={(px) => {
                setDrawStrokeWidth(px);
                whiteboardRef.current?.setStrokeWidth(px);
              }}
              onAddCustomNode={(
                type:
                  | "sourceNode"
                  | "chartNode"
                  | "operatorNode"
                  | "whiteboardNode",
                position?: { x: number; y: number }
              ) => {
                console.log("➕ Adding custom node from toolbar:", {
                  type,
                  position,
                });
                const id = `temp-${type}-${Date.now()}`;
                let pos = position ?? { x: 100, y: 100 };
                // If no position provided, try to place at canvas center
                if (!position && reactFlowRef.current) {
                  const bounds = reactFlowRef.current.getBoundingClientRect();
                  const centerScreen = {
                    x: bounds.left + bounds.width / 2,
                    y: bounds.top + bounds.height / 2,
                  };
                  try {
                    pos = screenToFlowPosition(centerScreen);
                  } catch {}
                }
                const base: any = { id, position: pos, data: {}, type };
                if (type === "sourceNode") {
                  base.data = {
                    title: "Source",
                    sourceType: "random",
                    sample: [],
                  };
                } else if (type === "chartNode") {
                  base.data = {
                    title: "Chart",
                    chartType: "bar",
                    xAxis: null,
                    yAxis: null,
                    data: [],
                  };
                } else if (type === "operatorNode") {
                  base.data = {
                    label: "Operator",
                    operationType: "formula",
                    isActive: true,
                  };
                } else if (type === "whiteboardNode") {
                  base.data = { shape: "rect" };
                }
                setExtraNodes((prev) => {
                  console.log("✅ Custom node queued:", base);
                  return [...prev, base];
                });
              }}
            />

            {/* Whiteboard overlay stacked above ReactFlow. */}
            <WhiteboardOverlay
              ref={whiteboardRef as any}
              isActive={isWhiteboardActive}
              viewport={getViewport?.() || { x: 0, y: 0, zoom: 1 }}
              initialData={
                whiteboardScene || {
                  appState: { viewBackgroundColor: "transparent" },
                }
              }
              onSceneChange={(scene) => setWhiteboardScene(scene)}
              topOffset={100}
            />

            {/* Tool interaction: click to create a whiteboard node with current tool
                Disable when Excalidraw overlay is active */}
            {activeWbTool && !isWhiteboardActive && (
              <div
                // transparent overlay to capture a single click
                style={{
                  position: "absolute",
                  inset: 0,
                  cursor: "crosshair",
                  zIndex: 5,
                }}
                onClick={(e) => {
                  const bounds = (
                    e.currentTarget as HTMLDivElement
                  ).getBoundingClientRect();
                  const position = screenToFlowPosition({
                    x: e.clientX,
                    y: e.clientY,
                  });
                  const id = `wb-${activeWbTool}-${Date.now()}`;
                  const node: Node = {
                    id,
                    type: "whiteboardNode",
                    position,
                    data: { shape: activeWbTool },
                    style: { width: 160, height: 120 },
                  };
                  setExtraNodes((prev) => [...prev, node]);
                  setActiveWbTool(null);
                  e.stopPropagation();
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setActiveWbTool(null);
                }}
              />
            )}

            {/* Proximity Connect - REMOVED for better drag/toolbar UX */}

            {/* Minimal React Flow Controls (zoom/fit only) */}
            <Controls className="bg-card border border-border">
              {/* keep default zoom/fit/interactive only */}
            </Controls>
            {/* Selection Panel - Inside React Flow */}
            <Panel position="bottom-center" className="z-10">
              <SelectionPanel
                selectedNodeIds={selectedNodeIds}
                selectedGroupIds={selectedGroupIds}
                onGroupNodes={handleGroupSelectedNodes}
                onUngroupNodes={handleUngroupSelectedGroups}
                onDeleteNodes={handleDeleteSelectedItems}
                onDuplicateNodes={handleDuplicateSelectedItems}
                onOpenSettings={handleOpenSelectedSettings}
              />
            </Panel>

            {/* Unified Debug Tool - Inside React Flow */}
            <DebugPanel title="Debug State" position="top-left">
              <div>Selected Nodes: {selectedNodeIds.length}</div>
              <div>Selected Groups: {selectedGroupIds.length}</div>
              <div>
                Selected Node IDs: {selectedNodeIds.join(", ") || "none"}
              </div>
              <div>
                Selected Group IDs: {selectedGroupIds.join(", ") || "none"}
              </div>
              <div>
                Selection Panel:{" "}
                {selectedNodeIds.length + selectedGroupIds.length > 0
                  ? "visible"
                  : "hidden"}
              </div>
              <div>Total Nodes: {canvas?.nodes?.length || 0}</div>
              <div>Total Groups: {canvas?.groups?.length || 0}</div>
              <div className="mt-2 text-yellow-300">
                Shift+Click should work for multi-selection
              </div>
            </DebugPanel>
          </ReactFlow>
        </PortalContainerProvider>

        {/* Bulk Operations Toolbar - Removed as we only use the top NodeToolbar */}
      </div>

      {/* Card Settings Sheet */}
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      <CardSettingsSheet
        isOpen={isSettingsSheetOpen}
        onClose={handleCloseSettingsSheet}
        cardId={settingsCardId}
        initialTab={settingsInitialTab}
        onSwitchToCard={handleSwitchToCard}
      />

      {/* Relationship Sheet */}
      <RelationshipSheet
        isOpen={isRelationshipSheetOpen}
        onClose={handleCloseRelationshipSheet}
        relationshipId={relationshipSheetId}
        onSwitchToRelationship={handleSwitchToRelationship}
      />

      {/* Keyboard Shortcuts Help */}
      <KeyboardShortcutsHelp
        shortcuts={enabledShortcuts}
        trigger={showShortcutsHelp ? <div style={{ display: "none" }} /> : null}
      />
      {showShortcutsHelp && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          onClick={() => setShowShortcutsHelp(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <KeyboardShortcutsHelp
              shortcuts={enabledShortcuts}
              trigger={null}
            />
          </div>
        </div>
      )}

      {/* Category Selection for Edge Drop */}
      {pendingNodeDrop && (
        <AlertDialog
          open={!!pendingNodeDrop}
          onOpenChange={() => setPendingNodeDrop(null)}
        >
          <AlertDialogContent className="max-w-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Select Node Type</AlertDialogTitle>
              <AlertDialogDescription>
                Choose the type of node you want to create. This will determine
                the card's appearance and functionality.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="grid grid-cols-2 gap-3 py-4">
              {[
                {
                  category: "Core/Value",
                  label: "Core/Value",
                  icon: "🎯",
                  description: "Foundational value elements",
                  color: "bg-blue-50 border-blue-200 text-blue-900",
                },
                {
                  category: "Data/Metric",
                  label: "Data/Metric",
                  icon: "📊",
                  description: "Quantifiable measures",
                  color: "bg-green-50 border-green-200 text-green-900",
                },
                {
                  category: "Work/Action",
                  label: "Work/Action",
                  icon: "⚡",
                  description: "Business activities",
                  color: "bg-orange-50 border-orange-200 text-orange-900",
                },
                {
                  category: "Ideas/Hypothesis",
                  label: "Ideas/Hypothesis",
                  icon: "💡",
                  description: "Assumptions & drivers",
                  color: "bg-purple-50 border-purple-200 text-purple-900",
                },
                {
                  category: "Metadata",
                  label: "Metadata",
                  icon: "🏷️",
                  description: "Contextual information",
                  color: "bg-gray-50 border-gray-200 text-gray-900",
                },
              ].map((template) => (
                <button
                  key={template.category}
                  onClick={() =>
                    handleCategorySelect(template.category as CardCategory)
                  }
                  className={`p-4 border rounded-lg hover:scale-105 transition-all duration-200 text-left ${template.color} hover:shadow-md`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{template.icon}</span>
                    <span className="font-semibold text-sm">
                      {template.label}
                    </span>
                  </div>
                  <p className="text-xs opacity-80">{template.description}</p>
                </button>
              ))}
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Quick Search */}
      <QuickSearchCommand
        isOpen={quickSearch.isOpen}
        onClose={quickSearch.close}
        onResultSelect={(result) => {
          // Handle search result selection
          switch (result.type) {
            case "metric":
              setSettingsCardId(result.id);
              break;
            case "relationship":
              setRelationshipSheetId(result.id);
              break;
            case "evidence":
              navigate("/evidence");
              break;
          }
        }}
      />

      {/* Advanced Search */}
      <AdvancedSearchModal
        isOpen={showAdvancedSearch}
        onClose={() => setShowAdvancedSearch(false)}
        onResultSelect={(result) => {
          // Handle advanced search result selection
          switch (result.type) {
            case "metric":
              setSettingsCardId(result.id);
              break;
            case "relationship":
              setRelationshipSheetId(result.id);
              break;
            case "evidence":
              navigate("/evidence");
              break;
          }
        }}
      />

      {/* Filter Modal */}
      <FilterModal
        isOpen={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        onApplyFilters={handleApplyFilters}
        currentFilters={currentFilters}
        availableOptions={
          canvas
            ? getAvailableFilterOptions(canvas.nodes, canvas.edges)
            : {
                categories: [],
                tags: [],
                owners: [],
                confidence: [],
                relationshipTypes: [],
              }
        }
      />
    </div>
  );
}

// Main export that wraps the inner component with ReactFlowProvider
export default function CanvasPage() {
  return (
    <ReactFlowProvider>
      <CanvasPageInner />
    </ReactFlowProvider>
  );
}
