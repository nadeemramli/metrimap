import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import type { MetricCard as MetricCardType } from '@/shared/types';
import { useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  parentCard: MetricCardType;
  onSlice: (dimensions: string[]) => void;
}

export default function DimensionSliceModal({
  isOpen,
  onClose,
  parentCard,
  onSlice,
}: Props) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (dim: string) => {
    setSelected((prev) =>
      prev.includes(dim) ? prev.filter((d) => d !== dim) : [...prev, dim]
    );
  };

  const candidateDimensions = Array.from(
    new Set(
      (parentCard.dimensions ?? [])
        .map((d: any) => (typeof d === 'string' ? d : d?.name).trim())
        .filter(Boolean)
    )
  ) as string[];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Slice “{parentCard.title}” by dimensions</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 py-2">
          {candidateDimensions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No dimensions available on this card.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {candidateDimensions.map((dim) => (
                <button
                  key={dim}
                  type="button"
                  onClick={() => toggle(dim)}
                  className={`px-2 py-1 rounded border text-xs ${selected.includes(dim) ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                >
                  {dim}
                </button>
              ))}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onSlice(selected);
              onClose();
            }}
            disabled={selected.length === 0}
          >
            Slice
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

