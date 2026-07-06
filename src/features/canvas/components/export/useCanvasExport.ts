import { useCanvasStore } from '@/lib/stores';
import type { MetricCard } from '@/shared/types';
import {
  getNodesBounds,
  getViewportForBounds,
  useReactFlow,
} from '@xyflow/react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

export type CanvasExportFormat = 'png' | 'pdf' | 'csv';

function slug(name?: string) {
  return (
    (name || 'canvas')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'canvas'
  );
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

/**
 * Canvas export (PNG / PDF / CSV). Must be used inside the ReactFlowProvider
 * (needs the live nodes + viewport). The Collaboration panel — which lives
 * outside the provider — triggers it via the `canvas:export` window event that
 * CanvasPage forwards into `exportAs`.
 */
export function useCanvasExport() {
  const { getNodes } = useReactFlow();
  const canvas = useCanvasStore((s) => s.canvas);
  const [busy, setBusy] = useState(false);

  const exportCSV = useCallback(() => {
    const name = slug(canvas?.name);
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
  }, [canvas]);

  const exportImage = useCallback(
    async (asPdf: boolean) => {
      const name = slug(canvas?.name);
      const nodes = getNodes();
      if (!nodes.length) {
        toast.error('Nothing on the canvas to export.');
        return;
      }
      setBusy(true);
      try {
        const bounds = getNodesBounds(nodes);
        const pad = 80;
        const width = Math.min(
          4000,
          Math.max(800, Math.round(bounds.width) + pad * 2)
        );
        const height = Math.min(
          4000,
          Math.max(600, Math.round(bounds.height) + pad * 2)
        );
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
    },
    [getNodes, canvas]
  );

  const exportAs = useCallback(
    (format: CanvasExportFormat) => {
      if (format === 'csv') exportCSV();
      else exportImage(format === 'pdf');
    },
    [exportCSV, exportImage]
  );

  return { exportAs, busy };
}
