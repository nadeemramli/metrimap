import { useEffect, useMemo, useRef } from "react";
import * as Automerge from "automerge";
import { useCanvasStore } from "@/lib/stores";
import { useCanvasBroadcast } from "@/lib/hooks/useCanvasPresence";

type CanvasDoc = Automerge.Doc<{ nodes: any[]; edges: any[]; groups: any[] }>;

export function useAutomergeCanvas(projectId?: string) {
  const broadcast = useCanvasBroadcast(projectId);
  const {
    canvas,
    addNode,
    updateNode,
    deleteNode,
    addEdge,
    updateEdge,
    deleteEdge,
  } = useCanvasStore();
  const docRef = useRef<CanvasDoc | null>(null);
  const changesRef = useRef<Uint8Array[]>([]);

  // Helper: sanitize values for Automerge (no undefined allowed)
  const sanitize = (value: any): any => {
    if (value === undefined) return null;
    if (value === null) return null;
    if (Array.isArray(value)) return value.map((v) => sanitize(v));
    if (typeof value === "object") {
      const out: Record<string, any> = {};
      for (const [k, v] of Object.entries(value)) {
        if (v === undefined) continue; // drop undefined keys
        out[k] = sanitize(v);
      }
      return out;
    }
    return value;
  };

  // Initialize a doc from current canvas
  useEffect(() => {
    if (!projectId) return;
    if (!canvas) return;
    try {
      const base: CanvasDoc = Automerge.from(
        sanitize({
          nodes: canvas.nodes,
          edges: canvas.edges,
          groups: canvas.groups,
        })
      );
      docRef.current = base;
    } catch (e) {
      console.error("Automerge init failed", e);
      docRef.current = Automerge.from({ nodes: [], edges: [], groups: [] });
    }
  }, [projectId, canvas?.id]);

  // Receive remote changes via broadcast and apply
  useEffect(() => {
    if (!projectId) return;
    const off = broadcast.on("am-change", (payload) => {
      try {
        const binArray: number[] | undefined =
          (payload as any)?.payload?.bin || (payload as any)?.bin;
        if (!binArray) return;
        const bin = new Uint8Array(binArray);
        if (!docRef.current) return;
        const [next] = Automerge.applyChanges(docRef.current, [bin]);
        docRef.current = next;
        // Consumers can read from docRef if needed and reconcile to store
        // For now we keep Supabase as source of truth; Automerge is additive layer for future
      } catch (e) {
        console.error("Failed to apply automerge change", e);
      }
    });
    return () => off();
  }, [projectId]);

  // Helper to emit local changes
  const emitChange = (oldDoc: CanvasDoc, newDoc: CanvasDoc) => {
    const changes = Automerge.getLastLocalChange(newDoc);
    if (changes) {
      broadcast.send("am-change", { bin: Array.from(changes) });
    }
  };

  // Example usage pattern (not yet wired to all edits): call this when local canvas changes
  const recordLocalMutation = () => {
    if (!docRef.current || !canvas) return;
    try {
      const oldDoc = docRef.current;
      const nextState = sanitize({
        nodes: canvas.nodes,
        edges: canvas.edges,
        groups: canvas.groups,
      });
      const newDoc = Automerge.change(oldDoc, (d) => {
        (d as any).nodes = nextState.nodes as any[];
        (d as any).edges = nextState.edges as any[];
        (d as any).groups = nextState.groups as any[];
      });
      docRef.current = newDoc;
      emitChange(oldDoc, newDoc);
    } catch (e) {
      console.error("Automerge change failed", e);
    }
  };

  return { recordLocalMutation };
}
