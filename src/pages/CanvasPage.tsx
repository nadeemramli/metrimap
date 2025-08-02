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
} from "@xyflow/react";
import {
  Users,
  Keyboard,
  Search,
  Save,
  Clock,
  Check,
  AlertCircle,
} from "lucide-react";

import "@xyflow/react/dist/style.css";
import { useCanvasStore } from "@/lib/stores";
import { getProjectById as getProjectFromDatabase } from "@/lib/supabase/services/projects";
import { useCanvasHeader } from "@/contexts/CanvasHeaderContext";
import AutoLayoutControls from "@/components/canvas/AutoLayoutControls";
import FilterControls from "@/components/canvas/FilterControls";
import type {
  MetricCard as MetricCardType,
  Relationship,
  GroupNode as GroupNodeType,
  CardCategory,
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
import ContextMenu from "@/components/canvas/ContextMenu";
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
  data: {
    card: card, // Store full card data for our custom component
    onOpenSettings, // Pass the settings callback
    onNodeClick, // Pass the click callback
    onSwitchToCard, // Pass the switch callback for persistent sheets
    isSettingsSheetOpen, // Pass the sheet open state
  },
  type: "metricCard", // Use our custom node type
  selected: selectedNodeIds.includes(card.id),
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

  return {
    id: relationship.id,
    source: relationship.sourceId,
    target: relationship.targetId,
    type: "dynamicEdge",
    animated: shouldAnimate, // Animate dotted lines (Probabilistic and Compositional)
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
  onToggleCollapse: (groupId: string) => void
): Node => ({
  id: group.id,
  position: group.position,
  data: {
    group,
    onEditGroup,
    onDeleteGroup,
    onToggleCollapse,
  },
  type: "groupNode",
  style: {
    width: group.size.width,
    height: group.size.height,
  },
  draggable: true,
  selectable: true,
  zIndex: -1, // Groups should be behind other nodes
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
  const [contextMenu, setContextMenu] = useState<{
    id: string;
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
  } | null>(null);
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
    updateGroup,
    deleteGroup,
    deleteNode,
    persistNodeDelete,
    addNode,
    selectNode,
    deselectNodes,
    clearSelection,
    pendingChanges,
    isSaving,
    lastSaved,
  } = useCanvasStore();

  // Context Menu handlers
  const handleNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: Node) => {
      // Prevent native context menu from showing
      event.preventDefault();

      // Calculate position of the context menu
      const pane = reactFlowRef.current?.getBoundingClientRect();
      if (!pane) return;

      setContextMenu({
        id: node.id,
        top: event.clientY < pane.height - 200 ? event.clientY : undefined,
        left: event.clientX < pane.width - 200 ? event.clientX : undefined,
        right:
          event.clientX >= pane.width - 200
            ? pane.width - event.clientX
            : undefined,
        bottom:
          event.clientY >= pane.height - 200
            ? pane.height - event.clientY
            : undefined,
      });
    },
    []
  );

  const handlePaneClick = useCallback(() => {
    setContextMenu(null);
    clearSelection(); // Clear node selection when clicking on empty space
  }, [clearSelection]);

  const handleContextMenuAction = useCallback(
    (action: string, nodeId: string) => {
      const node = canvas?.nodes.find((n) => n.id === nodeId);
      if (!node) return;

      switch (action) {
        case "duplicate":
          // Handle duplicate
          console.log("Duplicate node:", nodeId);
          break;
        case "settings":
          setSettingsCardId(nodeId);
          break;
        case "delete":
          deleteNode(nodeId);
          break;
        case "comments":
          // Open settings sheet with comments tab
          setSettingsInitialTab("comments");
          setSettingsCardId(nodeId);
          break;
        case "data":
          // Open settings sheet with data tab
          setSettingsInitialTab("data");
          setSettingsCardId(nodeId);
          break;
        case "tags":
          // Open settings sheet with settings tab (tags are managed there)
          setSettingsInitialTab("settings");
          setSettingsCardId(nodeId);
          break;
        case "assignees":
          // Open settings sheet with settings tab (assignees are managed there)
          setSettingsInitialTab("settings");
          setSettingsCardId(nodeId);
          break;
        case "dimensions":
          // Open settings sheet with settings tab (dimensions are managed there)
          setSettingsInitialTab("settings");
          setSettingsCardId(nodeId);
          break;
      }
    },
    [canvas?.nodes, deleteNode, setSettingsCardId]
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

  // Function to load canvas directly from database (not from projects store)
  const loadCanvasFromDatabase = async (projectId: string) => {
    try {
      const project = await getProjectFromDatabase(projectId);
      if (project) {
        console.log("📥 Loading canvas from database:", {
          nodes: project.nodes.length,
          edges: project.edges.length,
          groups: project.groups?.length || 0,
        });
        loadCanvas(project);
      } else {
        console.error("❌ Project not found:", projectId);
      }
    } catch (error) {
      console.error("❌ Failed to load canvas:", error);
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
        () => {
          if (selectedNodeIds.length > 0) {
            selectedNodeIds.forEach((nodeId) => deleteNode(nodeId));
            clearSelection();
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
  const handleOpenRelationshipSheet = useCallback((relationshipId: string) => {
    console.log("🎯 Opening relationship sheet for:", relationshipId);
    setRelationshipSheetId(relationshipId);
    setIsRelationshipSheetOpen(true);
    console.log("🎯 relationshipSheetId set to:", relationshipId);
  }, []);

  // Handle group operations
  const handleEditGroup = useCallback((groupId: string) => {
    // TODO: Open group settings sheet
    console.log("Edit group:", groupId);
  }, []);

  const handleDeleteGroup = useCallback(
    (groupId: string) => {
      deleteGroup(groupId);
    },
    [deleteGroup]
  );

  const handleToggleCollapse = useCallback(
    (groupId: string) => {
      const group = canvas?.groups.find((g) => g.id === groupId);
      if (group) {
        // Toggle collapsed state - you could add this to GroupNode interface
        updateGroup(groupId, {
          // Add collapsed property to GroupNode type if needed
          size:
            group.size.height < 100
              ? { ...group.size, height: 200 }
              : { ...group.size, height: 60 },
        });
      }
    },
    [canvas?.groups, updateGroup]
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
  const handleSwitchToRelationship = useCallback((relationshipId: string) => {
    setRelationshipSheetId(relationshipId);
  }, []);

  // Handle auto-layout from controls
  const handleNodesChange = useCallback(
    (newNodes: Node[]) => {
      newNodes.forEach((node) => {
        const card = canvas?.nodes.find((n) => n.id === node.id);
        if (card && node.position) {
          updateNodePosition(node.id, node.position);
          addPendingChange(node.id);
        }
      });
    },
    [canvas?.nodes, updateNodePosition, addPendingChange]
  );

  // Convert canvas data to ReactFlow format
  const nodes = useMemo(() => {
    const metricNodes =
      canvas?.nodes.map((card) =>
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
          handleToggleCollapse
        )
      ) || [];

    // Groups should be rendered first (behind other nodes)
    return [...groupNodes, ...metricNodes];
  }, [
    canvas?.nodes,
    canvas?.groups,
    handleOpenSettings,
    handleNodeClick,
    handleSwitchToCard,
    isSettingsSheetOpen,
    selectedNodeIds,
    handleEditGroup,
    handleDeleteGroup,
    handleToggleCollapse,
  ]);
  const edges = useMemo(
    () =>
      canvas?.edges.map((edge) =>
        convertToEdge(
          edge,
          handleOpenRelationshipSheet,
          handleSwitchToRelationship,
          isRelationshipSheetOpen
        )
      ) || [],
    [
      canvas?.edges,
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

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      // Apply changes to React Flow's internal state
      // setNodes((nds) => applyNodeChanges(changes, nds)); // This line is removed

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

            // Proximity Connect - REMOVED for better drag/toolbar UX

            // For manual dragging, add extra logging
            if (!change.dragging) {
              console.log(
                `✅ Manual drag completed for ${change.id}:`,
                change.position
              );
            }
          }
        }

        // Handle selection changes for NodeToolbar
        if (change.type === "select") {
          if (change.selected) {
            selectNode(change.id);
          } else {
            // For individual deselection, clear all and reselect others
            const currentSelected = selectedNodeIds.filter(
              (id) => id !== change.id
            );
            if (currentSelected.length > 0) {
              // Clear all and reselect the remaining nodes
              clearSelection();
              currentSelected.forEach((id) => selectNode(id));
            } else {
              clearSelection();
            }
          }
        }
      });
    },
    [
      canvas,
      updateNodePosition,
      addPendingChange,
      nodes,
      selectNode,
      deselectNodes,
      selectedNodeIds,
      clearSelection,
    ]
  );

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
          onNodeContextMenu={handleNodeContextMenu}
          onPaneClick={handlePaneClick}
          isValidConnection={isValidConnection}
          connectionMode={"strict" as ConnectionMode} // Better for touch devices - requires handle targeting
          connectOnClick={true} // Enable touch device support - click to connect handles
          snapToGrid={true}
          snapGrid={[15, 15]}
          defaultEdgeOptions={{
            type: "dynamicEdge",
            animated: false,
          }}
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

          {/* Left Bottom Panel - Core Functions */}
          <Controls className="bg-card border border-border">
            {/* Comprehensive Add Node Button */}
            <AddNodeButton
              position={{ x: 100, y: 100 }}
              asControlButton={true}
            />

            {/* Group Controls Button */}
            <ControlButton
              onClick={() => {
                // Handle group functionality
                console.log("Group controls");
              }}
              title="Group Controls"
            >
              <Users className="h-4 w-4" />
            </ControlButton>

            {/* Search Button */}
            <ControlButton
              onClick={() => quickSearch.open()}
              title="Search (Cmd+F)"
            >
              <Search className="h-4 w-4" />
            </ControlButton>

            {/* Keyboard Shortcuts Button */}
            <ControlButton
              onClick={() => setShowShortcutsHelp(true)}
              title="Keyboard Shortcuts"
            >
              <Keyboard className="h-4 w-4" />
            </ControlButton>
          </Controls>

          {/* Right Bottom Panel - View Settings */}
          <Controls
            className="bg-card border border-border"
            position="bottom-right"
          >
            {/* Comprehensive Auto Layout */}
            <AutoLayoutControls
              nodes={nodes}
              edges={edges}
              onNodesChange={handleNodesChange}
            />

            {/* Comprehensive Filter & Date */}
            <FilterControls />
          </Controls>
        </ReactFlow>

        {/* Context Menu */}
        {contextMenu && (
          <ContextMenu
            {...contextMenu}
            onClick={handlePaneClick}
            onEdit={() => {}} // No longer used
            onDuplicate={() =>
              handleContextMenuAction("duplicate", contextMenu.id)
            }
            onSettings={() =>
              handleContextMenuAction("settings", contextMenu.id)
            }
            onDelete={() => handleContextMenuAction("delete", contextMenu.id)}
            onComments={() =>
              handleContextMenuAction("comments", contextMenu.id)
            }
            onData={() => handleContextMenuAction("data", contextMenu.id)}
            onTags={() => handleContextMenuAction("tags", contextMenu.id)}
            onAssignees={() =>
              handleContextMenuAction("assignees", contextMenu.id)
            }
            onDimensions={() =>
              handleContextMenuAction("dimensions", contextMenu.id)
            }
            cardTitle={
              canvas?.nodes.find((n) => n.id === contextMenu.id)?.title || ""
            }
          />
        )}

        {/* Bulk Operations Toolbar - Removed as we only use the top NodeToolbar */}
      </div>

      {/* Card Settings Sheet */}
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
