import { useState, useMemo } from "react";
import {
  Plus,
  FolderPlus,
  Users,
  Layers,
  Grid,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCanvasStore } from "@/lib/stores";
import type { GroupNode, MetricCard } from "@/lib/types";

interface GroupControlsProps {
  selectedNodeIds: string[];
  onGroupCreated?: (groupId: string) => void;
}

export default function GroupControls({
  selectedNodeIds,
  onGroupCreated,
}: GroupControlsProps) {
  const [groupSheetOpen, setGroupSheetOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");

  const { canvas, addGroup, deleteGroup } = useCanvasStore();

  const groups = canvas?.groups || [];
  const nodes = canvas?.nodes || [];

  // Find nodes that can be grouped (selected and not already in a group)
  const availableNodes = useMemo(() => {
    return selectedNodeIds
      .map((id) => nodes.find((n) => n.id === id))
      .filter((node): node is MetricCard => {
        if (!node) return false;
        // Check if node is already in any group
        return !groups.some((group) => group.nodeIds.includes(node.id));
      });
  }, [selectedNodeIds, nodes, groups]);

  // Calculate position and size for new group based on selected nodes
  const calculateGroupBounds = (nodeIds: string[]) => {
    const groupNodes = nodeIds
      .map((id) => nodes.find((n) => n.id === id))
      .filter((node): node is MetricCard => !!node);

    if (groupNodes.length === 0) {
      return {
        position: { x: 100, y: 100 },
        size: { width: 300, height: 200 },
      };
    }

    const positions = groupNodes.map((node) => node.position);
    const minX = Math.min(...positions.map((p) => p.x)) - 20;
    const minY = Math.min(...positions.map((p) => p.y)) - 60; // Space for header
    const maxX = Math.max(...positions.map((p) => p.x + 300)) + 20; // Assume node width ~300
    const maxY = Math.max(...positions.map((p) => p.y + 200)) + 20; // Assume node height ~200

    return {
      position: { x: minX, y: minY },
      size: {
        width: Math.max(300, maxX - minX),
        height: Math.max(200, maxY - minY),
      },
    };
  };

  const handleCreateGroup = () => {
    if (!newGroupName.trim() || availableNodes.length === 0) return;

    const nodeIds = availableNodes.map((node) => node.id);
    const bounds = calculateGroupBounds(nodeIds);

    const newGroup: GroupNode = {
      id: `group-${Date.now()}`,
      name: newGroupName.trim(),
      nodeIds,
      position: bounds.position,
      size: bounds.size,
    };

    addGroup(newGroup);
    setNewGroupName("");
    setGroupSheetOpen(false);
    onGroupCreated?.(newGroup.id);
  };

  const handleQuickGroupSelected = () => {
    if (availableNodes.length === 0) return;

    const groupName = `Group ${groups.length + 1}`;
    const nodeIds = availableNodes.map((node) => node.id);
    const bounds = calculateGroupBounds(nodeIds);

    const newGroup: GroupNode = {
      id: `group-${Date.now()}`,
      name: groupName,
      nodeIds,
      position: bounds.position,
      size: bounds.size,
    };

    addGroup(newGroup);
    onGroupCreated?.(newGroup.id);
  };

  const handleDeleteGroup = (groupId: string) => {
    deleteGroup(groupId);
  };

  const getGroupNodeNames = (nodeIds: string[]) => {
    return nodeIds
      .map((id) => nodes.find((n) => n.id === id)?.title)
      .filter(Boolean)
      .join(", ");
  };

  return (
    <div className="flex items-center gap-2">
      {/* Quick Group Button */}
      {availableNodes.length > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleQuickGroupSelected}
          className="gap-2"
        >
          <Layers className="h-4 w-4" />
          Group Selected ({availableNodes.length})
        </Button>
      )}

      {/* Group Management Sheet */}
      <Sheet open={groupSheetOpen} onOpenChange={setGroupSheetOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <FolderPlus className="h-4 w-4" />
            Groups
            {groups.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {groups.length}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5" />
              Canvas Groups
            </SheetTitle>
            <SheetDescription>
              Create and manage groups to organize your metric cards
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6 mt-6">
            {/* Create New Group */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Create New Group</CardTitle>
                <CardDescription>
                  {availableNodes.length > 0
                    ? `Group ${availableNodes.length} selected node${availableNodes.length === 1 ? "" : "s"}`
                    : "Select nodes on the canvas to create a group"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="group-name">Group Name</Label>
                  <Input
                    id="group-name"
                    placeholder="Enter group name"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                  />
                </div>

                {availableNodes.length > 0 && (
                  <div className="space-y-2">
                    <Label>Selected Nodes</Label>
                    <div className="text-sm text-muted-foreground bg-muted p-2 rounded">
                      {availableNodes.map((node) => node.title).join(", ")}
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleCreateGroup}
                  disabled={!newGroupName.trim() || availableNodes.length === 0}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Group
                </Button>
              </CardContent>
            </Card>

            <Separator />

            {/* Existing Groups */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">
                Existing Groups ({groups.length})
              </h3>

              {groups.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Grid className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No groups created yet</p>
                  <p className="text-xs mt-1">
                    Select nodes and create your first group
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {groups.map((group) => (
                    <Card key={group.id} className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium truncate">
                            {group.name}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            {group.nodeIds.length} node
                            {group.nodeIds.length === 1 ? "" : "s"}
                            {group.nodeIds.length > 0 && (
                              <span className="block truncate mt-1">
                                {getGroupNodeNames(group.nodeIds)}
                              </span>
                            )}
                          </p>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Users className="h-4 w-4 mr-2" />
                              Manage Nodes
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteGroup(group.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Plus className="h-4 w-4 mr-2 rotate-45" />
                              Delete Group
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
