"use client";

import * as React from "react";
import { type NodeProps } from "@xyflow/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, MapPin } from "lucide-react";
import { useAppStore } from "@/lib/stores";
import {
  createCommentThread,
  createComment,
  listComments,
  type CommentRow,
} from "@/lib/supabase/services/collaboration";
import {
  getClientForEnvironment,
  isDevelopmentMode,
} from "@/lib/utils/authenticatedClient";
import { toast } from "sonner";

export type CommentNodeData = {
  title?: string;
  threadId?: string | null;
  projectId?: string; // canvas id
  pinnedBy?: string | null;
};

export default function CommentNode({ id, data }: NodeProps) {
  const nodeData = (data || {}) as CommentNodeData;
  const user = useAppStore((s) => s.user);
  const [threadId, setThreadId] = React.useState<string | null>(
    nodeData.threadId ?? null
  );
  const [comments, setComments] = React.useState<CommentRow[]>([]);
  const [content, setContent] = React.useState("");
  const [isSending, setIsSending] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!threadId) return;
      try {
        const c = await listComments(threadId, getClientForEnvironment());
        if (mounted) setComments(c || []);
      } catch (e: any) {
        console.error("Failed to load comments", e);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [threadId]);

  const handleSend = async () => {
    if (!content.trim()) return;
    if (!nodeData.projectId) {
      toast.error("Missing project id for comment thread");
      return;
    }
    setIsSending(true);
    try {
      const client = getClientForEnvironment();
      let currentThreadId = threadId;
      if (!currentThreadId) {
        const thread = await createCommentThread(
          {
            projectId: nodeData.projectId,
            source: "canvas",
            context: { nodeId: id, title: nodeData.title ?? "Comment" },
            createdBy: user?.id ?? null,
          },
          client
        );
        currentThreadId = thread.id;
        setThreadId(thread.id);
      }
      const created = await createComment(
        {
          threadId: currentThreadId!,
          authorId: user?.id ?? null,
          content: content.trim(),
        },
        client
      );
      setComments((prev) => [...prev, created]);
      setContent("");
      toast.success("Comment posted");
      // Also broadcast to open collaboration dialog selection if needed
      window.dispatchEvent(
        new CustomEvent("collab:navigate", {
          detail: {
            threadId: currentThreadId,
            context: { nodeId: id },
            source: "canvas",
          },
        })
      );
    } catch (e: any) {
      console.error("Failed to send comment", e);
      const msg = e?.message || "Unable to post comment";
      if (!isDevelopmentMode()) {
        toast.error(msg);
      } else {
        toast.error(`Dev: ${msg}`);
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="relative select-none">
      {/* Pin marker */}
      <div className="absolute -left-6 -top-6 rounded-full bg-rose-500 text-white w-8 h-8 flex items-center justify-center shadow">
        <MapPin className="w-4 h-4" />
      </div>

      <Card className="w-[280px] p-3 shadow-md border rounded-xl bg-white/95">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Comments</span>
          </div>
          {threadId ? (
            <Badge variant="secondary" className="text-[10px]">
              Thread
            </Badge>
          ) : (
            <Badge variant="outline" className="text-[10px]">
              New
            </Badge>
          )}
        </div>

        <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
          {comments.map((c) => (
            <div key={c.id} className="flex items-start gap-2">
              <Avatar className="w-6 h-6">
                <AvatarFallback>
                  {(c.author_id?.[0] || "?").toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="text-[11px] text-muted-foreground">
                  {c.author_id || "anon"} •{" "}
                  {new Date(c.created_at).toLocaleTimeString()}
                </div>
                <div className="text-sm leading-snug">{c.content}</div>
              </div>
            </div>
          ))}
          {comments.length === 0 && (
            <div className="text-xs text-muted-foreground">
              Be the first to comment…
            </div>
          )}
        </div>

        <div className="mt-2">
          <Textarea
            placeholder="Add a comment…"
            className="min-h-[60px]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="flex justify-end mt-2">
            <Button
              size="sm"
              onClick={handleSend}
              disabled={isSending || !content.trim()}
            >
              Send
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
