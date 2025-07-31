import { useEffect, useCallback, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  getIncomers,
  getOutgoers,
  getConnectedEdges,
  NodeToolbar as ReactFlowNodeToolbar,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type Connection,
  Background,
  Controls,
  ControlButton,
} from "@xyflow/react";
import { Button } from "@/components/ui/button";
import {
  Users,
  Keyboard,
  Search,
  Save,
  Clock,
  Check,
  AlertCircle,
  Minimize2,
  Link,
  Eye,
  MoreHorizontal,
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
} from "@/lib/types";
import {
  MetricCard,
  AddNodeButton,
  CardSettingsSheet,
  NodeToolbar,
  DynamicEdge,
  RelationshipSheet,
  GroupNode,
  GroupControls,
} from "@/components/canvas";
import BulkOperationsToolbar from "@/components/canvas/BulkOperationsToolbar";
import {
  useKeyboardShortcuts,
  createShortcut,
} from "@/hooks/useKeyboardShortcuts";
import { useAccessibility } from "@/hooks/useAccessibility";
import KeyboardShortcutsHelp from "@/components/ui/KeyboardShortcutsHelp";
import QuickSearchCommand, {
  useQuickSearch,
} from "@/components/search/QuickSearchCommand";
import AdvancedSearchModal from "@/components/search/AdvancedSearchModal";
import AutoSaveIndicator from "@/components/canvas/AutoSaveIndicator";
import useAutoSave from "@/hooks/useAutoSave";

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
});

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
  const [toolbarNodeId, setToolbarNodeId] = useState<string | undefined>();
  const [relationshipSheetId, setRelationshipSheetId] = useState<
    string | undefined
  >();
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  // Initialize auto-save functionality
  useAutoSave();

  // Search functionality
  const quickSearch = useQuickSearch();

  // Canvas header context
  const { setHeaderInfo } = useCanvasHeader();

  // React Flow hooks
  const { screenToFlowPosition } = useReactFlow();

  // Accessibility hook
  const { announce } = useAccessibility();

  // Zustand stores
  const {
    canvas,
    loadCanvas,
    selectedNodeIds,
    updateNodePosition,
    addPendingChange,
    createEdge,
    updateGroup,
    deleteGroup,
    deleteNode,
    addNode,
    selectNode,
    clearSelection,
    updateCanvasSettings,
    pendingChanges,
    isSaving,
    lastSaved,
  } = useCanvasStore();

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
          setToolbarNodeId(undefined);
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
        () => {
          const newCard = {
            id: `card_${Date.now()}`,
            title: "New Metric Card",
            description: "",
            category: "Data/Metric" as const,
            tags: [],
            causalFactors: [],
            dimensions: [],
            position: { x: 100, y: 100 },
            sourceType: "Manual" as const,
            assignees: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          addNode(newCard);
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
  const handleOpenSettings = useCallback((cardId: string) => {
    setSettingsCardId(cardId);
  }, []);

  // Handle node click for toolbar
  const handleNodeClick = useCallback(
    (cardId: string, position: { x: number; y: number }) => {
      setToolbarNodeId(cardId);
    },
    []
  );

  // Handle opening relationship sheet
  const handleOpenRelationshipSheet = useCallback((relationshipId: string) => {
    setRelationshipSheetId(relationshipId);
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
    selectedNodeIds,
    handleEditGroup,
    handleDeleteGroup,
    handleToggleCollapse,
  ]);
  const edges = useMemo(
    () =>
      canvas?.edges.map((edge) =>
        convertToEdge(edge, handleOpenRelationshipSheet)
      ) || [],
    [canvas?.edges, handleOpenRelationshipSheet]
  );

  // Proximity Connect - Check if nodes are close enough to auto-connect
  const checkProximityAndConnect = useCallback(
    async (draggedNode: Node, newPosition: { x: number; y: number }) => {
      const PROXIMITY_THRESHOLD = 80; // pixels
      const NODE_SIZE = { width: 320, height: 200 }; // MetricCard dimensions

      // Calculate the center of the dragged node
      const draggedCenter = {
        x: newPosition.x + NODE_SIZE.width / 2,
        y: newPosition.y + NODE_SIZE.height / 2,
      };

      // Find nearby nodes
      const nearbyNodes = nodes.filter((node) => {
        if (node.id === draggedNode.id) return false; // Skip self

        const nodeCenter = {
          x: node.position.x + NODE_SIZE.width / 2,
          y: node.position.y + NODE_SIZE.height / 2,
        };

        const distance = Math.sqrt(
          Math.pow(draggedCenter.x - nodeCenter.x, 2) +
            Math.pow(draggedCenter.y - nodeCenter.y, 2)
        );

        return distance <= PROXIMITY_THRESHOLD;
      });

      // Auto-connect to nearby nodes
      for (const nearbyNode of nearbyNodes) {
        // Check if connection doesn't already exist
        const connectionExists = edges.some(
          (edge) =>
            (edge.source === draggedNode.id && edge.target === nearbyNode.id) ||
            (edge.source === nearbyNode.id && edge.target === draggedNode.id)
        );

        if (!connectionExists) {
          const newRelationshipData = {
            sourceId: draggedNode.id,
            targetId: nearbyNode.id,
            type: "Probabilistic" as const,
            confidence: "Low" as const, // Lower confidence for auto-proximity connections
            evidence: [],
          };

          try {
            await createEdge(newRelationshipData);
            console.log(
              `🔗 Proximity auto-connect: ${draggedNode.id} → ${nearbyNode.id}`
            );

            // Visual feedback could be added here
            announce(
              `Connected to nearby node: ${nearbyNode.data?.title || nearbyNode.id}`
            );
          } catch (error) {
            console.error(
              `❌ Failed proximity auto-connect ${draggedNode.id} → ${nearbyNode.id}:`,
              error
            );
          }
        }
      }
    },
    [nodes, edges, createEdge, announce]
  );

  // Load canvas when component mounts or canvasId changes
  useEffect(() => {
    if (canvasId) {
      loadCanvasFromDatabase(canvasId);
    }
  }, [canvasId]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
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

            // Proximity Connect - Check for nearby nodes during drag completion
            if (!change.dragging && change.position) {
              const currentNode = nodes.find((n) => n.id === change.id);
              if (currentNode) {
                checkProximityAndConnect(currentNode, change.position);
              }
            }

            // For manual dragging, add extra logging
            if (!change.dragging) {
              console.log(
                `✅ Manual drag completed for ${change.id}:`,
                change.position
              );
            }
          }
        }

        // Handle selection changes for toolbar
        if (change.type === "select" && change.selected) {
          setToolbarNodeId(change.id);
        } else if (change.type === "select" && !change.selected) {
          setToolbarNodeId(undefined);
        }
      });
    },
    [canvas, updateNodePosition, addPendingChange, nodes]
  );

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    // Handle edge changes
    // For now, we'll implement basic edge deletion
    console.log("Edge changes:", changes);
  }, []);

  // Delete Middle Node - automatically reconnect edges when intermediate nodes are deleted
  const onNodesDelete = useCallback(
    async (deletedNodes: Node[]) => {
      for (const node of deletedNodes) {
        // Get all incoming and outgoing edges for the deleted node
        const incomers = getIncomers(node, nodes, edges);
        const outgoers = getOutgoers(node, nodes, edges);
        const connectedEdges = getConnectedEdges([node], edges);

        console.log(`🗑️ Deleting node ${node.id}:`, {
          incomers: incomers.map((n) => n.id),
          outgoers: outgoers.map((n) => n.id),
          connectedEdges: connectedEdges.length,
        });

        // Create new connections between all incomers and outgoers
        // This maintains the flow structure when removing intermediate nodes
        for (const incomer of incomers) {
          for (const outgoer of outgoers) {
            // Don't create duplicate connections
            const connectionExists = edges.some(
              (edge) => edge.source === incomer.id && edge.target === outgoer.id
            );

            if (!connectionExists && incomer.id !== outgoer.id) {
              const newRelationshipData = {
                sourceId: incomer.id,
                targetId: outgoer.id,
                type: "Probabilistic" as const, // Default type for auto-reconnected edges
                confidence: "Low" as const, // Lower confidence for auto-connections
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
            }
          }
        }

        // Delete the node from our canvas store
        try {
          await deleteNode(node.id);
          console.log(`✅ Node ${node.id} deleted successfully`);
        } catch (error) {
          console.error(`❌ Failed to delete node ${node.id}:`, error);
        }
      }
    },
    [nodes, edges, createEdge, deleteNode]
  );

  // Enhanced connection validation with better feedback
  const isValidConnection = useCallback(
    (connection: any) => {
      const source = connection.source || connection.sourceNode?.id;
      const target = connection.target || connection.targetNode?.id;

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
      if (params.source && params.target && isValidConnection(params)) {
        const newRelationshipData = {
          sourceId: params.source,
          targetId: params.target,
          type: "Probabilistic" as const, // Default type
          confidence: "Low" as const, // Default confidence
          evidence: [],
        };

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

  // Add Node on Edge Drop - create node when connection line is dropped on canvas
  const onConnectEnd = useCallback(
    async (event: any, connectionState: any) => {
      // Only create a node if the connection is not valid (dropped on empty canvas)
      if (!connectionState.isValid && connectionState.fromNode) {
        const { clientX, clientY } =
          "changedTouches" in event ? event.changedTouches[0] : event;

        // Convert screen coordinates to flow coordinates
        const position = screenToFlowPosition({
          x: clientX,
          y: clientY,
        });

        // Create a new comprehensive MetricCard (matching our AddNodeButton pattern)
        const now = new Date().toISOString();
        const newCardId = `card_${Date.now()}`;

        const newCard: MetricCardType = {
          id: newCardId,
          title: "New Metric Card",
          description: "",
          category: "Data/Metric",
          subCategory: "Input Metric",
          tags: [],
          causalFactors: [],
          dimensions: ["Quantitative"],
          segments: [],
          position,
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
          // Add the new node to the canvas
          await addNode(newCard);

          // Create the connection between the source node and the new node
          const newRelationshipData = {
            sourceId: connectionState.fromNode.id,
            targetId: newCardId,
            type: "Probabilistic" as const,
            confidence: "Low" as const,
            evidence: [],
          };

          await createEdge(newRelationshipData);

          console.log("✅ New node created and connected via edge drop");
        } catch (error) {
          console.error("❌ Failed to create node on edge drop:", error);
        }
      }
    },
    [screenToFlowPosition, addNode, createEdge]
  );

  return (
    <div className="w-full h-full bg-background">
      {/* React Flow Canvas */}
      <div className="h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes as any}
          edgeTypes={edgeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodesDelete={onNodesDelete}
          onConnect={onConnect}
          onConnectEnd={onConnectEnd}
          isValidConnection={isValidConnection}
          connectionLineStyle={{
            strokeWidth: 2,
            stroke: "#3b82f6",
            strokeDasharray: "5,5",
          }}
          connectionLineComponent={({
            fromX,
            fromY,
            toX,
            toY,
            connectionLineStyle,
          }) => (
            <g>
              <defs>
                <linearGradient
                  id="connectionGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop
                    offset="0%"
                    style={{ stopColor: "#3b82f6", stopOpacity: 1 }}
                  />
                  <stop
                    offset="100%"
                    style={{ stopColor: "#8b5cf6", stopOpacity: 0.8 }}
                  />
                </linearGradient>
              </defs>
              <path
                d={`M${fromX},${fromY} Q${(fromX + toX) / 2},${fromY - 50} ${toX},${toY}`}
                stroke="url(#connectionGradient)"
                strokeWidth={2}
                fill="none"
                strokeDasharray="5,5"
                className="animate-pulse"
              />
              <circle
                cx={toX}
                cy={toY}
                r={4}
                fill="#8b5cf6"
                className="animate-ping"
              />
            </g>
          )}
          fitView
          className="bg-background"
        >
          <Background />

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

          {/* React Flow Node Toolbar - automatically positioned */}
          {toolbarNodeId && (
            <ReactFlowNodeToolbar
              nodeId={toolbarNodeId}
              isVisible={!!toolbarNodeId}
            >
              <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg p-2 shadow-lg">
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      console.log("Collapse/Expand node:", toolbarNodeId);
                    }}
                    className="h-8 w-8 p-0"
                    title="Collapse/Expand"
                  >
                    <Minimize2 className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      console.log("Create relationship from:", toolbarNodeId);
                    }}
                    className="h-8 w-8 p-0"
                    title="Create Relationship"
                  >
                    <Link className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      console.log("View details for:", toolbarNodeId);
                    }}
                    className="h-8 w-8 p-0"
                    title="View Details"
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      console.log("More options for:", toolbarNodeId);
                    }}
                    className="h-8 w-8 p-0"
                    title="More Options"
                  >
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </ReactFlowNodeToolbar>
          )}
        </ReactFlow>

        {/* Bulk Operations Toolbar */}
        <BulkOperationsToolbar />
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
