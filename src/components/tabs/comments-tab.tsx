"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Reply, Save } from "lucide-react";
import { useCanvasStore } from "@/lib/stores";

interface CommentsTabProps {
  cardId?: string;
  onSave?: () => void;
  isModified?: boolean;
  onFieldChange?: (field: string, value: any) => void;
}

export function CommentsTab({
  cardId,
  onSave,
  isModified,
  onFieldChange,
}: CommentsTabProps) {
  const { getNodeById, persistNodeUpdate } = useCanvasStore();
  const card = cardId ? getNodeById(cardId) : null;

  // Adapter function to match the v0 interface
  const addComment = (comment: any) => {
    if (card && cardId) {
      const currentComments = (card as any).comments || [];
      const updatedComments = [...currentComments, comment];
      persistNodeUpdate(cardId, {
        comments: updatedComments,
        updatedAt: new Date().toISOString(),
      } as any);
      // Notify parent about changes
      if (onFieldChange) {
        onFieldChange("comments", updatedComments);
      }
    }
  };
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const handleAddComment = () => {
    if (newComment.trim()) {
      addComment({
        id: Date.now().toString(),
        author: "Current User",
        content: newComment,
        createdAt: new Date(),
        replies: [],
      });
      setNewComment("");
    }
  };

  const handleAddReply = (_parentId: string) => {
    if (replyText.trim()) {
      // In a real app, you'd update the specific comment's replies
      setReplyText("");
      setReplyingTo(null);
    }
  };

  if (!card) return <></>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-2">Discussion</h3>
          <p className="text-sm text-muted-foreground">
            Collaborate with your team on this metric
          </p>
        </div>
        {onSave && (
          <Button
            size="sm"
            onClick={onSave}
            disabled={!isModified}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="min-h-[80px]"
            />
            <Button onClick={handleAddComment} disabled={!newComment.trim()}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Add Comment
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {((card as any).comments || []).map((comment: any) => (
          <Card key={comment.id}>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {comment.author
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">
                        {comment.author}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {comment.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                </div>

                <div className="ml-11">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setReplyingTo(comment.id)}
                  >
                    <Reply className="h-3 w-3 mr-1" />
                    Reply
                  </Button>
                </div>

                {replyingTo === comment.id && (
                  <div className="ml-11 space-y-2">
                    <Textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write a reply..."
                      className="min-h-[60px]"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleAddReply(comment.id)}
                      >
                        Reply
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setReplyingTo(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {comment.replies.map((reply: any) => (
                  <div key={reply.id} className="ml-11 pt-3 border-t">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {reply.author
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-xs">
                            {reply.author}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {reply.createdAt.toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm">{reply.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {((card as any).comments || []).length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8 text-muted-foreground">
                No comments yet. Start the discussion!
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
