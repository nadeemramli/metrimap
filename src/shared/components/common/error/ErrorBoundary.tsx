import { Component } from "react";
import type { ChangeEvent, ErrorInfo, ReactNode } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/components/ui/collapsible";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
// Raw sonner Toaster (not the shared wrapper): the app-level Toaster lives INSIDE
// the providers this boundary wraps, so it is unmounted when the boundary trips.
// The shared wrapper also depends on next-themes, which is unavailable up here.
import { Toaster, toast } from "sonner";
import { submitErrorReport } from "@/shared/lib/supabase/services/errorReports";
import { computeErrorFingerprint } from "@/shared/utils/errorFingerprint";
import { useAppStore } from "@/shared/stores/useAppStore";
import {
  AlertTriangle,
  RefreshCw,
  Home,
  Copy,
  Send,
  ChevronDown,
} from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  note: string;
  detailsOpen: boolean;
  sending: boolean;
  sent: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    note: "",
    detailsOpen: false,
    sending: false,
    sent: false,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = "/";
  };

  private handleNoteChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ note: e.target.value });
  };

  /** Human-readable dump for the details panel + clipboard. */
  private buildDetailsString(): string {
    const { error, errorInfo } = this.state;
    return [
      `Message: ${error?.message ?? error?.toString() ?? "Unknown error"}`,
      "",
      `Error stack:\n${error?.stack ?? "(none)"}`,
      "",
      `Component stack:\n${errorInfo?.componentStack ?? "(none)"}`,
      "",
      `URL: ${window.location.href}`,
      `User agent: ${navigator.userAgent}`,
      `Time: ${new Date().toISOString()}`,
    ].join("\n");
  }

  /** Best-effort Clerk identity without hooks (this boundary sits above providers). */
  private getReporterIdentity(): { id: string | null; email: string | null } {
    try {
      const u = useAppStore.getState().user;
      if (u?.id) return { id: u.id, email: u.email ?? null };
    } catch {
      /* store not ready */
    }
    try {
      const clerk = (window as unknown as { Clerk?: { user?: unknown } }).Clerk;
      const cu = clerk?.user as
        | { id?: string; primaryEmailAddress?: { emailAddress?: string } }
        | undefined;
      if (cu?.id) {
        return { id: cu.id, email: cu.primaryEmailAddress?.emailAddress ?? null };
      }
    } catch {
      /* ignore */
    }
    return { id: null, email: null };
  }

  private handleCopyDetails = async () => {
    try {
      await navigator.clipboard.writeText(this.buildDetailsString());
      toast.success("Error details copied to clipboard");
    } catch {
      toast.error("Could not copy to clipboard");
    }
  };

  private handleReport = async () => {
    if (this.state.sending || this.state.sent) return;
    this.setState({ sending: true });
    const { error, errorInfo } = this.state;
    const identity = this.getReporterIdentity();
    const message = error?.message ?? error?.toString() ?? null;
    const errorStack = error?.stack ?? null;
    const componentStack = errorInfo?.componentStack ?? null;
    const fingerprint = await computeErrorFingerprint({
      message,
      errorStack,
      componentStack,
      pathname: window.location.pathname,
    });
    try {
      await submitErrorReport({
        message,
        errorStack,
        componentStack,
        note: this.state.note.trim() || null,
        url: window.location.href,
        userAgent: navigator.userAgent,
        reporterUserId: identity.id,
        reporterEmail: identity.email,
        clientTime: new Date().toISOString(),
        fingerprint,
      });
      this.setState({ sending: false, sent: true });
      toast.success("Report sent. Thank you!");
    } catch (e) {
      this.setState({ sending: false });
      toast.error("Could not send the report. Please try again.");
      console.error("submitErrorReport failed:", e);
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { sending, sent } = this.state;

      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <Card className="w-full max-w-lg">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <AlertTriangle className="h-12 w-12 text-destructive" />
              </div>
              <CardTitle>Something went wrong</CardTitle>
              <CardDescription>
                We're sorry, but something unexpected happened. You can report
                this to us, or try reloading the page.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Report to developer */}
              <div className="space-y-2">
                <label htmlFor="err-note" className="text-sm font-medium">
                  What were you doing? (optional)
                </label>
                <Textarea
                  id="err-note"
                  value={this.state.note}
                  onChange={this.handleNoteChange}
                  placeholder="e.g. I clicked Save on the canvas settings page…"
                  disabled={sent}
                  rows={3}
                />
                <Button
                  onClick={this.handleReport}
                  disabled={sending || sent}
                  className="w-full"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {sent
                    ? "Report sent — thank you!"
                    : sending
                      ? "Sending…"
                      : "Report this error"}
                </Button>
              </div>

              {/* Technical details — visible in all environments */}
              {this.state.error && (
                <Collapsible
                  open={this.state.detailsOpen}
                  onOpenChange={(o) => this.setState({ detailsOpen: o })}
                >
                  <div className="flex items-center justify-between">
                    <CollapsibleTrigger className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                      <ChevronDown className="h-4 w-4" />
                      Technical details
                    </CollapsibleTrigger>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={this.handleCopyDetails}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy details
                    </Button>
                  </div>
                  <CollapsibleContent>
                    <ScrollArea className="mt-2 max-h-64 rounded-md bg-muted p-3">
                      <pre className="text-xs whitespace-pre-wrap font-mono">
                        {this.buildDetailsString()}
                      </pre>
                    </ScrollArea>
                  </CollapsibleContent>
                </Collapsible>
              )}

              <div className="flex gap-2">
                <Button onClick={this.handleReload} className="flex-1">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reload Page
                </Button>
                <Button
                  variant="outline"
                  onClick={this.handleGoHome}
                  className="flex-1"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Local Toaster: the app-level one was unmounted with the crashed tree. */}
          <Toaster richColors closeButton position="bottom-right" />
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook version for functional components
export function useErrorHandler() {
  return (error: Error, errorInfo?: ErrorInfo) => {
    console.error("Unhandled error:", error, errorInfo);
  };
}
