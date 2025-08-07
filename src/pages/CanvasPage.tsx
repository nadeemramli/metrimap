import { useEffect, useCallback, useMemo, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { Search, Save, Clock, Check, AlertCircle, Filter } from "lucide-react";

import "@xyflow/react/dist/style.css";
import { useCanvasStore } from "@/lib/stores";
import { useClerkSupabase } from "@/hooks/useClerkSupabase";
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
} from "@/lib/types";
import {
  MetricCard,
  AddNodeButton,
  CardSettingsSheet,
  DynamicEdge,
  RelationshipSheet,
  GroupNode,
} from "@/components/canvas";
import {
  useKeyboardShortcuts,
  createShortcut,
} from "@/hooks/useKeyboardShortcuts";
// import { useAccessibility } from "@/hooks/useAccessibility";
import KeyboardShortcutsHelp from "@/components/ui/KeyboardShortcutsHelp";
import QuickSearchCommand, {
  useQuickSearch,
} from "@/components/search/QuickSearchCommand";
import AdvancedSearchModal from "@/components/search/AdvancedSearchModal";
import useAutoSave from "@/hooks/useAutoSave";
import { generateUUID } from "@/lib/utils/validation";
import { applyAutoLayout } from "@/lib/utils/autoLayout";
import { toast } from "sonner";
import {
  getAvailableFilterOptions,
  applyFilters,
  type FilterOptions,
} from "@/lib/utils/filterUtils";

import SelectionPanel from "@/components/canvas/SelectionPanel";
import FilterModal from "@/components/canvas/FilterModal";
import LayoutControls from "@/components/canvas/LayoutControls";
import DebugPanel from "@/components/canvas/DebugPanel";
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
};

const edgeTypes = {
  dynamicEdge: DynamicEdge,
};

function CanvasPageInner() {
  const { canvasId } = useParams();
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

  // Initialize auto-save functionality
  useAutoSave();

  // Search functionality
  const quickSearch = useQuickSearch();

  // Canvas header context
  const { setHeaderInfo } = useCanvasHeader();

  // React Flow hooks
  const { screenToFlowPosition } = useReactFlow();

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

    // Groups should be rendered last (on top of other nodes)
    return [...metricNodes, ...groupNodes];
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
  ]);
  const edges = useMemo(
    () =>
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
        ) || [],
    [
      canvas?.edges,
      visibleEdgeIds,
      handleOpenRelationshipSheet,
      handleSwitchToRelationship,
      isRelationshipSheetOpen,
    ]
  );

  // Proximity Connect - REMOVED for better drag/toolbar UX

  // Load canvas when component mounts or canvasId changes
  useEffect(() => {
    if (canvasId) {
      loadCanvasFromDatabase(canvasId);
    }
  }, [canvasId]);

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

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      console.log("🎯 onNodesChange called with changes:", changes);

      changes.forEach((change) => {
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
    // Handle edge changes
    // For now, we'll implement basic edge deletion
    console.log("Edge changes:", changes);
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
        const newRelationshipData = {
          sourceId: params.source,
          targetId: params.target,
          type: "Probabilistic" as const, // Default type
          confidence: "Low" as const, // Default confidence
          evidence: [],
        };

        console.log("🔗 Creating relationship:", newRelationshipData);

        try {
          await createEdge(newRelationshipData);
          console.log("✅ Relationship created and saved to database");
        } catch (error) {
          console.error("❌ Failed to create relationship:", error);
        }
      }
    },
    [createEdge, isValidConnection]
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
        <ReactFlow
          ref={reactFlowRef}
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
          multiSelectionKeyCode={["Shift"]} // Enable multi-selection with Shift key
          selectionKeyCode={["Shift"]} // Enable selection with Shift key
          panOnDrag={[0, 1, 2]} // Allow panning with left, middle, and right mouse buttons
          selectionOnDrag={false} // Disable selection by dragging to prevent conflicts with panning
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

          {/* Proximity Connect - REMOVED for better drag/toolbar UX */}

          {/* Comprehensive Control Panel - Bottom Left */}
          <Controls className="bg-card border border-border">
            {/* Node Creation */}
            <AddNodeButton
              position={{ x: 100, y: 100 }}
              asControlButton={true}
            />

            {/* Search & Navigation */}
            <ControlButton
              onClick={() => quickSearch.open()}
              title="Search (Cmd+F)"
            >
              <Search className="h-4 w-4" />
            </ControlButton>

            {/* Layout Controls */}
            <LayoutControls
              onApplyLayout={handleApplyLayout}
              currentDirection={currentLayoutDirection}
            />

            {/* Filter Controls */}
            <ControlButton onClick={handleOpenFilters} title="Filters">
              <Filter className="h-4 w-4" />
            </ControlButton>
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
            <div>Selected Node IDs: {selectedNodeIds.join(", ") || "none"}</div>
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
