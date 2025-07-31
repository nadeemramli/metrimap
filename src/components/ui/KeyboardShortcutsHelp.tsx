import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Keyboard, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { KeyboardShortcut, formatShortcut } from "@/hooks/useKeyboardShortcuts";

interface KeyboardShortcutsHelpProps {
  shortcuts: KeyboardShortcut[];
  trigger?: React.ReactNode;
}

export default function KeyboardShortcutsHelp({
  shortcuts,
  trigger,
}: KeyboardShortcutsHelpProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Group shortcuts by category
  const groupedShortcuts = shortcuts.reduce(
    (acc, shortcut) => {
      const category = shortcut.category || "General";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(shortcut);
      return acc;
    },
    {} as Record<string, KeyboardShortcut[]>
  );

  // Filter shortcuts based on search term
  const filteredGroups = Object.entries(groupedShortcuts).reduce(
    (acc, [category, shortcuts]) => {
      const filteredShortcuts = shortcuts.filter(
        (shortcut) =>
          shortcut.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          shortcut.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
          category.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (filteredShortcuts.length > 0) {
        acc[category] = filteredShortcuts;
      }

      return acc;
    },
    {} as Record<string, KeyboardShortcut[]>
  );

  const defaultTrigger = (
    <Button variant="ghost" size="sm" className="gap-2">
      <Keyboard className="h-4 w-4" />
      Shortcuts
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Use these keyboard shortcuts to navigate and control the application
            efficiently
          </DialogDescription>
        </DialogHeader>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search shortcuts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Shortcuts List */}
        <div className="space-y-6">
          {Object.entries(filteredGroups).map(
            ([category, categoryShortcuts]) => (
              <div key={category}>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  {category}
                  <Badge variant="secondary" className="text-xs">
                    {categoryShortcuts.length}
                  </Badge>
                </h3>

                <div className="space-y-2">
                  {categoryShortcuts.map((shortcut, index) => (
                    <div
                      key={`${category}-${index}`}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-sm">
                          {shortcut.description}
                        </div>
                      </div>
                      <div className="ml-4">
                        <kbd className="px-2 py-1 text-xs font-mono bg-background border rounded shadow-sm">
                          {formatShortcut(shortcut)}
                        </kbd>
                      </div>
                    </div>
                  ))}
                </div>

                {Object.keys(filteredGroups).indexOf(category) <
                  Object.keys(filteredGroups).length - 1 && (
                  <Separator className="mt-4" />
                )}
              </div>
            )
          )}
        </div>

        {Object.keys(filteredGroups).length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Keyboard className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No shortcuts found matching "{searchTerm}"</p>
          </div>
        )}

        {/* Footer */}
        <div className="pt-4 border-t text-xs text-muted-foreground">
          <p>
            <strong>Tip:</strong> Press{" "}
            <kbd className="px-1 py-0.5 bg-muted border rounded text-xs">?</kbd>{" "}
            to quickly open this help dialog
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Quick shortcut component for inline display
export function ShortcutBadge({ shortcut }: { shortcut: KeyboardShortcut }) {
  return (
    <kbd className="px-1.5 py-0.5 text-xs font-mono bg-muted border rounded shadow-sm">
      {formatShortcut(shortcut)}
    </kbd>
  );
}

// Hook to show shortcuts help
export function useShortcutsHelp() {
  const [isOpen, setIsOpen] = useState(false);

  const showHelp = () => setIsOpen(true);
  const hideHelp = () => setIsOpen(false);

  return {
    isOpen,
    showHelp,
    hideHelp,
    setIsOpen,
  };
}
