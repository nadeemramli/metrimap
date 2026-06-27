// Live-preview driver: debounced, one-directional. On any meaningful change
// (digest) it runs the PURE computePipeline (no writes) and pushes results into
// useOperatorPreviewStore, which operator nodes + the tooling panel read by id.
// The effect only depends on a primitive `digest` (not array identities) so it
// can't form a render→compute→set→render loop. See operator-revamp-feature.md (E).

import { useEffect, useRef } from 'react';
import {
  computePipeline,
  type DataFlowEdge,
} from '@/features/canvas/utils/computePipeline';
import { useOperatorPreviewStore } from '@/features/canvas/stores/useOperatorPreviewStore';

export function useLivePreview(edges: DataFlowEdge[], digest: string): void {
  const setPreview = useOperatorPreviewStore((s) => s.setPreview);
  const edgesRef = useRef(edges);
  edgesRef.current = edges;

  useEffect(() => {
    let cancelled = false;
    const t = setTimeout(async () => {
      try {
        const { operatorValues, cardValues } = await computePipeline(
          edgesRef.current
        );
        if (cancelled) return;
        setPreview(
          Object.fromEntries(operatorValues),
          Object.fromEntries(cardValues)
        );
      } catch {
        // preview is best-effort; ignore transient compute errors
      }
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [digest, setPreview]);
}
