import { useEffect, useCallback, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import "@xyflow/react/dist/style.css";
import { useCanvasStore, useProjectsStore, useAppStore } from "@/lib/stores";
import type {
  MetricCard as MetricCardType,
  Relationship,
  GroupNode as GroupNodeType,
} from "@/lib/types";
import {
  MetricCard,
  AddNodeButton,
  CardSettingsSheet,
  CanvasControls,
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
import KeyboardShortcutsHelp from "@/components/ui/KeyboardShortcutsHelp";
import QuickSearchCommand, {
  useQuickSearch,
} from "@/components/search/QuickSearchCommand";
import AdvancedSearchModal from "@/components/search/AdvancedSearchModal";

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
  markerEnd: {
    type: "arrowclosed",
    color: "#64748b",
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

export default function CanvasPage() {
  const { canvasId } = useParams();
  const navigate = useNavigate();
  const [settingsCardId, setSettingsCardId] = useState<string | undefined>();
  const [toolbarNodeId, setToolbarNodeId] = useState<string | undefined>();
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
  const [relationshipSheetId, setRelationshipSheetId] = useState<
    string | undefined
  >();
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  // Search functionality
  const quickSearch = useQuickSearch();

  // Zustand stores
  const {
    canvas,
    loadCanvas,
    updateNode,
    addEdge: addCanvasEdge,
    selectedNodeIds,
    updateGroup,
    deleteGroup,
    deleteNode,
    addNode,
    selectNode,
    clearSelection,
  } = useCanvasStore();
  const { getProjectById } = useProjectsStore();
  const { currentCanvasId } = useAppStore();

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
      setToolbarPosition({
        x: position.x + 160, // Center of MetricCard (width: 320px)
        y: position.y,
      });
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
          updateNode(node.id, { position: node.position });
        }
      });
    },
    [canvas?.nodes, updateNode]
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

  // Load canvas when component mounts or canvasId changes
  useEffect(() => {
    if (canvasId) {
      const project = getProjectById(canvasId);
      if (project) {
        loadCanvas(project);
      }
    }
  }, [canvasId, getProjectById, loadCanvas]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      changes.forEach((change) => {
        if (change.type === "position" && change.position && canvas) {
          const node = canvas.nodes.find((n) => n.id === change.id);
          if (node) {
            updateNode(change.id, { position: change.position });
          }
        }
        // Handle selection changes for toolbar
        if (change.type === "select" && change.selected) {
          const node = nodes.find((n) => n.id === change.id);
          if (node) {
            setToolbarNodeId(change.id);
            setToolbarPosition({
              x: node.position.x + 160, // Center of MetricCard (width: 320px)
              y: node.position.y,
            });
          }
        } else if (change.type === "select" && !change.selected) {
          setToolbarNodeId(undefined);
        }
      });
    },
    [canvas, updateNode, nodes]
  );

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    // Handle edge changes
    // For now, we'll implement basic edge deletion
    console.log("Edge changes:", changes);
  }, []);

  const onConnect = useCallback(
    (params: Connection) => {
      if (params.source && params.target) {
        const newRelationship: Relationship = {
          id: `${params.source}-${params.target}-${Date.now()}`,
          sourceId: params.source,
          targetId: params.target,
          type: "Probabilistic", // Default type
          confidence: "Low", // Default confidence
          evidence: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        addCanvasEdge(newRelationship);
      }
    },
    [addCanvasEdge]
  );

  return (
    <div className="w-full h-full bg-background">
      {/* Canvas Header */}
      <div className="h-14 border-b border-border bg-card px-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-card-foreground">
            {canvas?.name || `Canvas ${canvasId}`}
          </h2>
          <p className="text-sm text-muted-foreground">
            {canvas?.description || "Visual business architecture workspace"}
          </p>
        </div>

        {/* Canvas Controls */}
        <div className="flex items-center gap-4">
          <AddNodeButton />
          <GroupControls
            selectedNodeIds={selectedNodeIds}
            onGroupCreated={(groupId) => console.log("Group created:", groupId)}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={quickSearch.open}
            className="gap-2"
          >
            <Search className="h-4 w-4" />
            Search
          </Button>
          <KeyboardShortcutsHelp shortcuts={enabledShortcuts} />
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {canvas?.nodes.length || 0} nodes • {canvas?.edges.length || 0}{" "}
              edges • {canvas?.groups.length || 0} groups
            </span>
            <span className="text-sm text-muted-foreground">
              Auto-saved •{" "}
              {canvas?.updatedAt
                ? new Date(canvas.updatedAt).toLocaleTimeString()
                : new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>

      {/* React Flow Canvas */}
      <div className="h-[calc(100%-3.5rem)]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
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

          {/* Canvas Controls */}
          <CanvasControls
            nodes={nodes}
            edges={edges}
            onNodesChange={handleNodesChange}
          />

          {/* Node Toolbar */}
          {toolbarNodeId && (
            <NodeToolbar
              nodeId={toolbarNodeId}
              position={toolbarPosition}
              isVisible={!!toolbarNodeId}
              onOpenSettings={handleOpenSettings}
            />
          )}
        </ReactFlow>
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

      {/* Bulk Operations Toolbar */}
      <BulkOperationsToolbar />
    </div>
  );
}
