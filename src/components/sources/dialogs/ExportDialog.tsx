import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Database, Download, FileText } from 'lucide-react';
import { useState } from 'react';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (options: ExportOptions) => Promise<void>;
}

export interface ExportOptions {
  type: 'sources' | 'apis' | 'policies' | 'all';
  format: 'json' | 'csv' | 'xlsx';
  includeMetadata: boolean;
  includeStatistics: boolean;
  dateRange?: {
    from: string;
    to: string;
  };
}

export default function ExportDialog({
  isOpen,
  onClose,
  onExport,
}: ExportDialogProps) {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    type: 'all',
    format: 'json',
    includeMetadata: true,
    includeStatistics: false,
  });
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExport(exportOptions);
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const downloadFile = (
    content: string,
    filename: string,
    contentType: string
  ) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Data
          </DialogTitle>
          <DialogDescription>
            Export your source data in various formats for backup or analysis.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Data Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="type">Data to Export</Label>
            <Select
              value={exportOptions.type}
              onValueChange={(value) =>
                setExportOptions((prev) => ({
                  ...prev,
                  type: value as ExportOptions['type'],
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Data</SelectItem>
                <SelectItem value="sources">Data Sources Only</SelectItem>
                <SelectItem value="apis">API Connections Only</SelectItem>
                <SelectItem value="policies">
                  Governance Policies Only
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Format Selection */}
          <div className="space-y-2">
            <Label htmlFor="format">Export Format</Label>
            <Select
              value={exportOptions.format}
              onValueChange={(value) =>
                setExportOptions((prev) => ({
                  ...prev,
                  format: value as ExportOptions['format'],
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="json">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    JSON (Structured Data)
                  </div>
                </SelectItem>
                <SelectItem value="csv">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    CSV (Spreadsheet)
                  </div>
                </SelectItem>
                <SelectItem value="xlsx">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Excel (.xlsx)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Export Options */}
          <div className="space-y-3">
            <Label>Export Options</Label>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeMetadata"
                checked={exportOptions.includeMetadata}
                onCheckedChange={(checked) =>
                  setExportOptions((prev) => ({
                    ...prev,
                    includeMetadata: !!checked,
                  }))
                }
              />
              <Label htmlFor="includeMetadata" className="text-sm">
                Include metadata (creation dates, owners, etc.)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeStatistics"
                checked={exportOptions.includeStatistics}
                onCheckedChange={(checked) =>
                  setExportOptions((prev) => ({
                    ...prev,
                    includeStatistics: !!checked,
                  }))
                }
              />
              <Label htmlFor="includeStatistics" className="text-sm">
                Include performance statistics and metrics
              </Label>
            </div>
          </div>

          {/* Export Preview */}
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground">
              <strong>Export Preview:</strong>
            </div>
            <div className="text-sm mt-1">
              Format: {exportOptions.format.toUpperCase()}
              <br />
              Data:{' '}
              {exportOptions.type === 'all'
                ? 'All sources, APIs, and policies'
                : exportOptions.type}
              <br />
              Options: {exportOptions.includeMetadata ? 'Metadata, ' : ''}
              {exportOptions.includeStatistics ? 'Statistics' : ''}
              {!exportOptions.includeMetadata &&
              !exportOptions.includeStatistics
                ? 'Basic data only'
                : ''}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              'Exporting...'
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
