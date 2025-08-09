"use client";

import {
  MessageSquare,
  FileText,
  Network,
  CheckCircle,
  Clock,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CommentSummaryProps {
  threads: any[];
  onSourceFilter: (source: string) => void;
  activeSourceFilter: string;
}

export function CommentSummaryDashboard({
  threads,
  onSourceFilter,
  activeSourceFilter,
}: CommentSummaryProps) {
  const canvasComments = threads.filter((t) => t.source === "canvas");
  const evidenceComments = threads.filter((t) => t.source === "evidence");
  const nodeComments = threads.filter((t) => t.source === "node");

  const totalComments = threads.reduce(
    (acc, thread) => acc + thread.comments.length,
    0
  );
  const resolvedThreads = threads.filter((t) =>
    t.comments.every((c) => c.resolved)
  ).length;
  const activeThreads = threads.length - resolvedThreads;

  const summaryCards = [
    {
      title: "Canvas Comments",
      count: canvasComments.length,
      totalComments: canvasComments.reduce(
        (acc, t) => acc + t.comments.length,
        0
      ),
      icon: MessageSquare,
      source: "canvas",
      color: "bg-blue-50 border-blue-200 text-blue-700",
    },
    {
      title: "Evidence Editor",
      count: evidenceComments.length,
      totalComments: evidenceComments.reduce(
        (acc, t) => acc + t.comments.length,
        0
      ),
      icon: FileText,
      source: "evidence",
      color: "bg-green-50 border-green-200 text-green-700",
    },
    {
      title: "Node Sheets",
      count: nodeComments.length,
      totalComments: nodeComments.reduce(
        (acc, t) => acc + t.comments.length,
        0
      ),
      icon: Network,
      source: "node",
      color: "bg-purple-50 border-purple-200 text-purple-700",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Overall Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card
          className="cursor-pointer hover:bg-muted/50"
          onClick={() => onSourceFilter("all")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{threads.length}</p>
                <p className="text-sm text-muted-foreground">Total Threads</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{activeThreads}</p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{resolvedThreads}</p>
                <p className="text-sm text-muted-foreground">Resolved</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Source Breakdown */}
      <div className="grid grid-cols-3 gap-4">
        {summaryCards.map((card) => (
          <Card
            key={card.source}
            className={`cursor-pointer hover:bg-muted/50 transition-colors ${
              activeSourceFilter === card.source ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => onSourceFilter(card.source)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <card.icon className="h-5 w-5 text-muted-foreground" />
                <Badge variant="outline" className={card.color}>
                  {card.count} threads
                </Badge>
              </div>
              <h3 className="font-medium text-sm mb-1">{card.title}</h3>
              <p className="text-xs text-muted-foreground">
                {card.totalComments} total comments
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
