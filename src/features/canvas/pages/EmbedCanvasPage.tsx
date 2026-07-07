import { getProjectById } from '@/shared/lib/supabase/services/projects';
import type { MetricValue } from '@/shared/types';
import {
  Background,
  Controls,
  Handle,
  MarkerType,
  Position,
  ReactFlow,
  type Edge,
  type Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Loader2 } from 'lucide-react';
import { memo, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// Read-only, public embed of a canvas (for Notion/Confluence/iframe). No auth —
// the anon Supabase client + RLS only return the project if it's is_public.
function latest(data?: MetricValue[]): number | null {
  if (!Array.isArray(data) || data.length === 0) return null;
  return data[data.length - 1]?.value ?? null;
}

const EmbedNode = memo(({ data }: { data: any }) => (
  <div className="min-w-[150px] rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm">
    {/* Invisible anchors — without Handles React Flow silently drops every
        edge, so public embeds rendered bare nodes with no relationships. */}
    <Handle type="target" position={Position.Top} className="!h-1 !w-1 !border-0 !bg-transparent" />
    <Handle type="source" position={Position.Bottom} className="!h-1 !w-1 !border-0 !bg-transparent" />
    {data.category && (
      <div className="text-[10px] uppercase tracking-wide text-gray-400">
        {data.category}
      </div>
    )}
    <div className="text-sm font-medium text-gray-900">{data.title}</div>
    {data.value != null && (
      <div className="mt-0.5 text-lg font-bold text-gray-900">{data.value}</div>
    )}
  </div>
));
EmbedNode.displayName = 'EmbedNode';

const nodeTypes = { embed: EmbedNode };

export default function EmbedCanvasPage() {
  const { canvasId } = useParams();
  const [status, setStatus] = useState<'loading' | 'ok' | 'missing'>('loading');
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [name, setName] = useState('');

  useEffect(() => {
    if (!canvasId) return;
    let cancelled = false;
    // No client passed → anon client; RLS returns it only when is_public.
    getProjectById(canvasId)
      .then((proj) => {
        if (cancelled) return;
        if (!proj) {
          setStatus('missing');
          return;
        }
        setName(proj.name);
        setNodes(
          (proj.nodes || []).map((n: any) => ({
            id: n.id,
            position: n.position || { x: 0, y: 0 },
            type: 'embed',
            draggable: false,
            data: {
              title: n.title,
              category: n.category,
              value: latest(n.data),
            },
          }))
        );
        setEdges(
          // Relationships come from the data layer as sourceId/targetId (the
          // domain shape) — mapping only e.source/e.target dropped every edge
          // from public embeds. Accept both shapes.
          (proj.edges || []).map((e: any) => ({
            id: e.id,
            source: e.sourceId ?? e.source,
            target: e.targetId ?? e.target,
            markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16 },
          }))
        );
        setStatus('ok');
      })
      .catch(() => !cancelled && setStatus('missing'));
    return () => {
      cancelled = true;
    };
  }, [canvasId]);

  if (status === 'loading') {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (status === 'missing') {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-2 bg-white text-center">
        <p className="text-sm font-medium text-gray-700">
          This canvas isn’t shared publicly.
        </p>
        <p className="text-xs text-gray-400">
          The owner can enable a public link from the canvas’s share panel.
        </p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-white">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background />
        <Controls showInteractive={false} />
      </ReactFlow>
      <div className="pointer-events-none absolute bottom-2 right-3 text-[11px] text-gray-400">
        {name} · Metrimap
      </div>
    </div>
  );
}
