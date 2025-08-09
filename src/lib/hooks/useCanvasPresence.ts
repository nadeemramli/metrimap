import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/lib/supabase/client";

interface PresencePayload {
  userId: string;
  cursor?: { x: number; y: number };
  status?: "viewing" | "editing";
}

export function useCanvasPresence(
  projectId?: string,
  payload?: PresencePayload
) {
  const channelRef = useRef<ReturnType<
    ReturnType<typeof supabase>["channel"]
  > | null>(null);
  const [presence, setPresence] = useState<Record<string, PresencePayload[]>>(
    {}
  );

  useEffect(() => {
    if (!projectId) return;

    const client = supabase();
    const channel = client.channel(`presence:canvas:${projectId}`, {
      config: { presence: { key: payload?.userId || "anonymous" } },
    });
    channelRef.current = channel;

    channel.on("presence", { event: "sync" }, () => {
      try {
        const state = channel.presenceState() as Record<
          string,
          PresencePayload[]
        >;
        setPresence(state || {});
      } catch {}
    });

    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await channel.track(
          payload || { userId: "anonymous", status: "viewing" }
        );
      }
    });

    return () => {
      try {
        if (channelRef.current) supabase().removeChannel(channelRef.current);
      } catch {}
      channelRef.current = null;
    };
  }, [
    projectId,
    payload?.userId,
    payload?.cursor?.x,
    payload?.cursor?.y,
    payload?.status,
  ]);

  // Update presence payload on changes without re-subscribing
  useEffect(() => {
    if (!channelRef.current) return;
    (async () => {
      try {
        await channelRef.current!.track(
          payload || { userId: "anonymous", status: "viewing" }
        );
      } catch {}
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payload?.cursor?.x, payload?.cursor?.y, payload?.status]);

  return { presence };
}

export function useCanvasBroadcast(projectId?: string) {
  const channelRef = useRef<ReturnType<
    ReturnType<typeof supabase>["channel"]
  > | null>(null);

  useEffect(() => {
    if (!projectId) return;
    const client = supabase();
    const channel = client.channel(`broadcast:canvas:${projectId}`, {
      broadcast: { ack: false, self: false },
    });
    channelRef.current = channel;
    channel.subscribe();
    return () => {
      try {
        if (channelRef.current) supabase().removeChannel(channelRef.current);
      } catch {}
      channelRef.current = null;
    };
  }, [projectId]);

  const send = async (event: string, data: unknown) => {
    if (!channelRef.current) return;
    await channelRef.current.send({
      type: "broadcast",
      event,
      payload: data as any,
    });
  };

  const on = (event: string, cb: (data: any) => void) => {
    if (!channelRef.current) return () => {};
    const ch = channelRef.current.on("broadcast", { event }, (payload) =>
      cb(payload)
    );
    return () => {
      try {
        supabase().removeChannel(ch);
      } catch {}
    };
  };

  return { send, on };
}
