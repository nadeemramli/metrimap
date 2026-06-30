// Inbound half of canvas multiplayer sync. Applies a change received from
// another session to local Zustand state using each store's LOCAL-ONLY apply
// path — never the persisting/broadcasting variant. So a remote change updates
// the UI without writing to Supabase again (the originator already persisted)
// and without re-broadcasting (which would loop).

import { useCanvasStore } from '@/features/canvas/stores/useCanvasStore';
import { useCanvasNodesStore } from '@/features/canvas/stores/useCanvasNodesStore';
import type { CanvasNode, MetricCard } from '@/shared/types';
import { getExtraEdgesApply, type CanvasChange } from './canvasSyncChannel';

export function applyRemoteCanvasChange(change: CanvasChange) {
  const cards = useCanvasStore.getState();
  const canvasNodes = useCanvasNodesStore.getState();

  switch (change.t) {
    case 'node:create':
      if (change.family === 'card') cards.addNode(change.node as MetricCard);
      else canvasNodes.addNodeLocal(change.node as CanvasNode);
      break;

    case 'node:move':
      if (change.family === 'card')
        cards.updateNode(change.id, { position: change.position });
      else canvasNodes.updateNodeLocal(change.id, { position: change.position });
      break;

    case 'node:update':
      if (change.family === 'card')
        cards.updateNode(change.id, change.updates as Partial<MetricCard>);
      else
        canvasNodes.updateNodeLocal(
          change.id,
          change.updates as Partial<CanvasNode>
        );
      break;

    case 'node:delete':
      if (change.family === 'card') cards.deleteNode(change.id);
      else canvasNodes.removeNodeLocal(change.id);
      break;

    case 'edge:create':
      cards.addEdge(change.edge);
      break;

    case 'edge:update':
      cards.updateEdge(change.id, change.updates as Record<string, never>);
      break;

    case 'edge:delete':
      cards.deleteEdge(change.id);
      break;

    case 'extraEdge:create': {
      const api = getExtraEdgesApply();
      if (api && !api.get().some((e) => e.id === change.edge.id)) {
        api.set([...api.get(), change.edge]);
      }
      break;
    }

    case 'extraEdge:delete': {
      const api = getExtraEdgesApply();
      if (api) api.set(api.get().filter((e) => e.id !== change.id));
      break;
    }
  }
}
