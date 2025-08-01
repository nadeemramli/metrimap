import {
  Copy,
  Settings,
  Trash2,
  Edit,
  MessageSquare,
  BarChart3,
  Database,
  Layers,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ContextMenuProps {
  id: string;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  onClick: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onSettings: () => void;
  onDelete: () => void;
  onComments: () => void;
  onData: () => void;
  onTags: () => void;
  onAssignees: () => void;
  onDimensions: () => void;
  cardTitle: string;
}

export default function ContextMenu({
  top,
  left,
  right,
  bottom,
  onClick,
  onEdit,
  onDuplicate,
  onSettings,
  onDelete,
  onComments,
  onData,
  onTags,
  onAssignees,
  onDimensions,
  cardTitle,
}: ContextMenuProps) {
  return (
    <>
      <div
        className="fixed z-50 bg-popover border border-border rounded-md shadow-lg p-1 min-w-[160px]"
        style={{
          top: top || "auto",
          left: left || "auto",
          right: right || "auto",
          bottom: bottom || "auto",
        }}
      >
        <div className="flex flex-col gap-1">
          {/* Edit */}
          <Button
            variant="ghost"
            size="sm"
            className="justify-start h-8 px-2 text-sm"
            onClick={() => {
              onEdit();
              onClick();
            }}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>

          {/* Duplicate */}
          <Button
            variant="ghost"
            size="sm"
            className="justify-start h-8 px-2 text-sm"
            onClick={() => {
              onDuplicate();
              onClick();
            }}
          >
            <Copy className="h-4 w-4 mr-2" />
            Duplicate
          </Button>

          {/* Settings */}
          <Button
            variant="ghost"
            size="sm"
            className="justify-start h-8 px-2 text-sm"
            onClick={() => {
              onSettings();
              onClick();
            }}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>

          <div className="h-px bg-border my-1" />

          {/* Data */}
          <Button
            variant="ghost"
            size="sm"
            className="justify-start h-8 px-2 text-sm"
            onClick={() => {
              onData();
              onClick();
            }}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Data
          </Button>

          {/* Tags */}
          <Button
            variant="ghost"
            size="sm"
            className="justify-start h-8 px-2 text-sm"
            onClick={() => {
              onTags();
              onClick();
            }}
          >
            <Layers className="h-4 w-4 mr-2" />
            Tags
          </Button>

          {/* Assignees */}
          <Button
            variant="ghost"
            size="sm"
            className="justify-start h-8 px-2 text-sm"
            onClick={() => {
              onAssignees();
              onClick();
            }}
          >
            <Users className="h-4 w-4 mr-2" />
            Assignees
          </Button>

          {/* Dimensions */}
          <Button
            variant="ghost"
            size="sm"
            className="justify-start h-8 px-2 text-sm"
            onClick={() => {
              onDimensions();
              onClick();
            }}
          >
            <Database className="h-4 w-4 mr-2" />
            Dimensions
          </Button>

          {/* Comments */}
          <Button
            variant="ghost"
            size="sm"
            className="justify-start h-8 px-2 text-sm"
            onClick={() => {
              onComments();
              onClick();
            }}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Comments
          </Button>

          <div className="h-px bg-border my-1" />

          {/* Delete with confirmation */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="justify-start h-8 px-2 text-sm text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={(e) => e.stopPropagation()}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Metric Card</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{cardTitle}"? This action
                  cannot be undone and will also remove all connected
                  relationships.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    onDelete();
                    onClick();
                  }}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </>
  );
}
