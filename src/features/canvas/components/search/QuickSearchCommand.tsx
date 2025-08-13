import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { useState } from 'react';

interface QuickSearchResult {
  type: 'metric' | 'relationship' | 'evidence';
  id: string;
  title: string;
}

interface QuickSearchCommandProps {
  isOpen: boolean;
  onClose: () => void;
  onResultSelect: (result: QuickSearchResult) => void;
}

export function useQuickSearch() {
  const [isOpen, setIsOpen] = useState(false);

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  };
}

export default function QuickSearchCommand({
  isOpen,
  onClose,
  onResultSelect,
}: QuickSearchCommandProps) {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Quick Search</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <Input
            placeholder="Search metrics, relationships, evidence..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />
          <p className="text-gray-600 mb-4">
            Quick search is being rebuilt after the reorganization.
          </p>
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}




