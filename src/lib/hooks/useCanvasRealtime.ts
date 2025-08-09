import { useEffect, useRef } from "react";
import { supabase, isDevelopmentEnvironment } from "@/lib/supabase/client";
import { useCanvasStore } from "@/lib/stores";

/**
 * Subscribes to realtime changes for a specific project (canvas):
 * - Postgres CDC on tables: metric_cards, relationships, groups
 * - Optional broadcast/presence on a shared channel for cursor/state (future)
 *
 * For public canvases, backend RLS should allow anonymous read on these tables.
 * For authenticated use, subscriptions use the authenticated client session.
 */
export function useCanvasRealtime(projectId?: string) {
  const initializedRef = useRef(false);
  const applyGroupLocalAdd = useCanvasStore((s) => s.applyGroupLocalAdd);
  const applyGroupLocalUpdate = useCanvasStore((s) => s.applyGroupLocalUpdate);
  const applyGroupLocalDelete = useCanvasStore((s) => s.applyGroupLocalDelete);
  const addNode = useCanvasStore((s) => s.addNode);
  const updateNode = useCanvasStore((s) => s.updateNode);
  const deleteNodeLocal = useCanvasStore((s) => s.deleteNode);
  const addEdge = useCanvasStore((s) => s.addEdge);
  const updateEdge = useCanvasStore((s) => s.updateEdge);
  const deleteEdgeLocal = useCanvasStore((s) => s.deleteEdge);

  useEffect(() => {
    if (!projectId) return;
    if (initializedRef.current) return;
    initializedRef.current = true;

    const client = supabase();

    // Helper to check row project match
    const isRowForProject = (row: any) => row?.project_id === projectId;

    // metric_cards
    const cardsChannel = client
      .channel(`realtime:metric_cards:${projectId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "metric_cards" },
        (payload: any) => {
          const { eventType, new: newRow, old: oldRow } = payload;
          if (eventType === "INSERT" && isRowForProject(newRow)) {
            addNode({
              id: newRow.id,
              title: newRow.title,
              description: newRow.description || "",
              category: newRow.category,
              subCategory: newRow.sub_category,
              tags: [],
              causalFactors: newRow.causal_factors || [],
              dimensions: newRow.dimensions || [],
              segments: [],
              position: { x: newRow.position_x, y: newRow.position_y },
              parentId: undefined,
              data: newRow.data,
              sourceType: newRow.source_type,
              formula: newRow.formula || undefined,
              owner: newRow.owner_id || "",
              assignees: newRow.assignees || [],
              createdAt: newRow.created_at,
              updatedAt: newRow.updated_at,
            } as any);
          }
          if (eventType === "UPDATE" && isRowForProject(newRow)) {
            updateNode(newRow.id, {
              title: newRow.title,
              description: newRow.description || "",
              category: newRow.category,
              subCategory: newRow.sub_category,
              position: { x: newRow.position_x, y: newRow.position_y },
              data: newRow.data,
              sourceType: newRow.source_type,
              formula: newRow.formula || undefined,
              assignees: newRow.assignees || [],
            } as any);
          }
          if (eventType === "DELETE" && isRowForProject(oldRow)) {
            deleteNodeLocal(oldRow.id);
          }
        }
      );

    // relationships
    const edgesChannel = client
      .channel(`realtime:relationships:${projectId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "relationships" },
        (payload: any) => {
          const { eventType, new: newRow, old: oldRow } = payload;
          if (eventType === "INSERT" && isRowForProject(newRow)) {
            addEdge({
              id: newRow.id,
              sourceId: newRow.source_id,
              targetId: newRow.target_id,
              source: newRow.source_id,
              target: newRow.target_id,
              type: newRow.type,
              confidence: newRow.confidence,
              weight: newRow.weight || 1,
              description: newRow.description || "",
              evidence: [],
              createdAt: newRow.created_at,
              updatedAt: newRow.updated_at,
            } as any);
          }
          if (eventType === "UPDATE" && isRowForProject(newRow)) {
            updateEdge(newRow.id, {
              type: newRow.type,
              confidence: newRow.confidence,
              weight: newRow.weight || 1,
              description: newRow.description || "",
            } as any);
          }
          if (eventType === "DELETE" && isRowForProject(oldRow)) {
            deleteEdgeLocal(oldRow.id);
          }
        }
      );

    // groups
    const groupsChannel = client
      .channel(`realtime:groups:${projectId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "groups" },
        (payload: any) => {
          const { eventType, new: newRow, old: oldRow } = payload;
          if (eventType === "INSERT" && isRowForProject(newRow)) {
            applyGroupLocalAdd({
              id: newRow.id,
              name: newRow.name,
              description: newRow.description || "",
              color: newRow.color || "#e5e7eb",
              nodeIds: newRow.node_ids || [],
              position: { x: newRow.position_x, y: newRow.position_y },
              size: { width: newRow.width, height: newRow.height },
              isCollapsed: false,
              createdAt: newRow.created_at,
              updatedAt: newRow.updated_at,
            } as any);
          }
          if (eventType === "UPDATE" && isRowForProject(newRow)) {
            applyGroupLocalUpdate(newRow.id, {
              name: newRow.name,
              nodeIds: newRow.node_ids || [],
              position: { x: newRow.position_x, y: newRow.position_y },
              size: { width: newRow.width, height: newRow.height },
            } as any);
          }
          if (eventType === "DELETE" && isRowForProject(oldRow)) {
            applyGroupLocalDelete(oldRow.id);
          }
        }
      );

    // Subscribe channels
    Promise.all([
      cardsChannel.subscribe(),
      edgesChannel.subscribe(),
      groupsChannel.subscribe(),
    ])
      .then(() => {
        console.log("✅ Realtime subscriptions active for project", projectId);
      })
      .catch((err) => console.error("❌ Realtime subscribe error", err));

    return () => {
      try {
        supabase().removeChannel(cardsChannel);
        supabase().removeChannel(edgesChannel);
        supabase().removeChannel(groupsChannel);
      } catch {}
      initializedRef.current = false;
    };
  }, [
    projectId,
    addNode,
    updateNode,
    deleteNodeLocal,
    addEdge,
    updateEdge,
    deleteEdgeLocal,
    applyGroupLocalAdd,
    applyGroupLocalUpdate,
    applyGroupLocalDelete,
  ]);
}

/**
 * Optional: Multiplayer presence & broadcast (future expansion)
 * Reference: supabase/realtime-js - Broadcast/Presence APIs
 * https://github.com/supabase/realtime-js
 */
export function useCanvasPresenceChannel(_projectId?: string) {
  // Placeholder for future presence/cursor sharing implementation
  // Example usage pattern (not active by default):
  // const client = supabase() as any
  // const channel = client.channel(`presence:canvas:${projectId}`, { config: { presence: { key: userId } } })
  // channel.on('presence', { event: 'sync' }, () => { ... })
  // channel.subscribe()
}
