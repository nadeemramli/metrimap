import { useCanvasStore } from '@/lib/stores';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Download, FileText, Upload } from 'lucide-react';

export function ImportExportCard() {
  const { canvas, importCanvasData } = useCanvasStore();

  const handleExport = () => {
    try {
      const blob = new Blob([JSON.stringify(canvas || {}, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `canvas-export-${canvas?.id || 'current'}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to export canvas:', e);
      alert('Failed to export canvas.');
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (typeof importCanvasData === 'function') {
        await importCanvasData(data);
        alert('Canvas imported successfully');
      } else {
        console.warn(
          'importCanvasData not available in useCanvasStore; skipping apply'
        );
      }
    } catch (err) {
      console.error('Failed to import canvas:', err);
      alert('Invalid canvas file.');
    } finally {
      e.target.value = '';
    }
  };

  const handleGenerateReport = () => {
    try {
      const report = {
        id: canvas?.id,
        name: (canvas as any)?.name || 'Untitled Canvas',
        nodes: canvas?.nodes?.length || 0,
        edges: canvas?.edges?.length || 0,
        generatedAt: new Date().toISOString(),
      };
      const blob = new Blob([JSON.stringify(report, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `canvas-report-${canvas?.id || 'current'}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to generate report:', e);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import & Export</CardTitle>
        <CardDescription>Manage your canvas data</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <input
            id="import-input"
            type="file"
            accept="application/json"
            className="hidden"
            onChange={handleImport}
          />
          <Button
            variant="outline"
            className="w-full"
            onClick={() => document.getElementById('import-input')?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            Import Canvas Data
          </Button>
        </div>
        <Button variant="outline" className="w-full" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export Canvas Data
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={handleGenerateReport}
        >
          <FileText className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
      </CardContent>
    </Card>
  );
}
