import { Button } from '@/shared/components/ui/button';
import { Download, Plus, Tag } from 'lucide-react';

interface AssetsHeaderProps {
  onOpenTagManagement: () => void;
  onExport: () => void;
  onAddAsset: () => void;
}

export default function AssetsHeader({
  onOpenTagManagement,
  onExport,
  onAddAsset,
}: AssetsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Assets</h1>
        <p className="text-muted-foreground mt-1">
          Comprehensive repository of metrics, relationships, and templates
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={onOpenTagManagement}>
          <Tag className="h-4 w-4 mr-2" />
          Manage Tags
        </Button>
        <Button variant="outline" size="sm" onClick={onExport}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
        <Button onClick={onAddAsset}>
          <Plus className="h-4 w-4 mr-2" />
          Add Asset
        </Button>
      </div>
    </div>
  );
}
