import { useCanvasStore } from '@/lib/stores';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import type { MetricCard } from '@/shared/types';
import {
  getNodesBounds,
  getViewportForBounds,
  useReactFlow,
} from '@xyflow/react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { Download, FileImage, FileText, Sheet } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

function slug(name?: string) {
  return (name || 'canvas').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'canvas';
}
function csvCell(v: unknown) {
  const s = String(v ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function CanvasExportMenu() {
  const { getNodes } = useReactFlow();
  const canvas = useCanvasStore((s) => s.canvas);
  const [busy, setBusy] = useState(false);

  const name = slug(canvas?.name);

  const exportCSV = () => {
    const rows: string[] = ['metric,period,value,change_percent,trend'];
    let count = 0;
    for (const node of canvas?.nodes || []) {
      const card = node as MetricCard;
      const data = Array.isArray(card.data) ? card.data : [];
      for (const p of data) {
        rows.push(
          [
            csvCell(card.title),
            csvCell(p.period),
            p.value ?? '',
            p.change_percent ?? '',
            csvCell(p.trend ?? ''),
          ].join(',')
        );
        count++;
      }
    }
    if (count === 0) {
      toast.error('No metric data to export.');
      return;
    }
    downloadBlob(
      new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8' }),
      `${name}.csv`
    );
    toast.success('Exported CSV');
  };

  const exportImage = async (asPdf: boolean) => {
    const nodes = getNodes();
    if (!nodes.length) {
      toast.error('Nothing on the canvas to export.');
      return;
    }
    setBusy(true);
    try {
      const bounds = getNodesBounds(nodes);
      const pad = 80;
      const width = Math.min(4000, Math.max(800, Math.round(bounds.width) + pad * 2));
      const height = Math.min(4000, Math.max(600, Math.round(bounds.height) + pad * 2));
      const vp = getViewportForBounds(bounds, width, height, 0.2, 2, 0.1);
      const el = document.querySelector(
        '.react-flow__viewport'
      ) as HTMLElement | null;
      if (!el) throw new Error('viewport not found');
      const dataUrl = await toPng(el, {
        backgroundColor: '#ffffff',
        width,
        height,
        pixelRatio: 2,
        style: {
          width: `${width}px`,
          height: `${height}px`,
          transform: `translate(${vp.x}px, ${vp.y}px) scale(${vp.zoom})`,
        },
      });
      if (asPdf) {
        const pdf = new jsPDF({
          orientation: width >= height ? 'landscape' : 'portrait',
          unit: 'px',
          format: [width, height],
        });
        pdf.addImage(dataUrl, 'PNG', 0, 0, width, height);
        pdf.save(`${name}.pdf`);
        toast.success('Exported PDF');
      } else {
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `${name}.png`;
        a.click();
        toast.success('Exported PNG');
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Export failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5" disabled={busy}>
          <Download className="h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => exportImage(false)}>
          <FileImage className="mr-2 h-4 w-4" />
          PNG image
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportImage(true)}>
          <FileText className="mr-2 h-4 w-4" />
          PDF document
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportCSV}>
          <Sheet className="mr-2 h-4 w-4" />
          CSV (metric data)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
