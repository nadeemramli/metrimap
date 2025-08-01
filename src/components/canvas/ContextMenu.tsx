import { Copy, Trash2, MessageSquare, BarChart3, Database } from "lucide-react";
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
  onDuplicate,
  onSettings,
  onDelete,
  onComments,
  onData,

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
          {/* Settings - Main entry point to CardSettingsSheet */}
          <Button
            variant="ghost"
            size="sm"
            className="justify-start h-8 px-2 text-sm"
            onClick={() => {
              onSettings();
              onClick();
            }}
          >
            <Database className="h-4 w-4 mr-2" />
            Settings
          </Button>

          {/* Quick Actions that open specific tabs in CardSettingsSheet */}
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
            Data & Events
          </Button>

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

          {/* Utility Actions */}
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

          <div className="h-px bg-border my-1" />

          {/* Delete with confirmation */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="justify-start h-8 px-2 text-sm text-destructive hover:text-destructive"
                onClick={(e) => e.preventDefault()}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Card</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{cardTitle}"? This action
                  cannot be undone.
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
