import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import {
  ArrowRight,
  BarChart3,
  Layers,
  Lightbulb,
  MousePointer,
  Network,
} from 'lucide-react';

interface GroupHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function GroupHelpModal({ isOpen, onClose }: GroupHelpModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Creating Groups for Auto-Dashboards
          </DialogTitle>
          <DialogDescription>
            Learn how to organize your metrics into groups that automatically
            generate focused dashboards.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Benefits */}
          <Alert>
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              Each named group on your canvas automatically becomes a dedicated
              dashboard, making it easy to focus on specific areas of your
              business model.
            </AlertDescription>
          </Alert>

          {/* Step-by-step guide */}
          <div className="space-y-4">
            <h3 className="font-semibold">How to Create Groups:</h3>

            <div className="space-y-4">
              <div className="flex gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-medium mb-1">Open Canvas Controls</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Navigate to your canvas and look for the "Groups" button in
                    the top toolbar.
                  </p>
                  <Badge variant="outline" className="gap-1">
                    <Layers className="h-3 w-3" />
                    Groups
                  </Badge>
                </div>
              </div>

              <div className="flex gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-medium mb-1">Select Metrics to Group</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Select the metric cards you want to group together by
                    clicking on them while holding Shift or Ctrl.
                  </p>
                  <Badge variant="outline" className="gap-1">
                    <MousePointer className="h-3 w-3" />
                    Multi-select
                  </Badge>
                </div>
              </div>

              <div className="flex gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-medium mb-1">Name Your Group</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Give your group a meaningful name like "Marketing Funnel" or
                    "Core Financials". This name becomes your dashboard title.
                  </p>
                  <div className="flex gap-2">
                    <Badge variant="secondary">Marketing Funnel</Badge>
                    <Badge variant="secondary">Core Financials</Badge>
                    <Badge variant="secondary">User Journey</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Example groups */}
          <div className="space-y-3">
            <h3 className="font-semibold">Example Group Ideas:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">Sales Pipeline</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Leads, Conversions, Revenue metrics
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Network className="h-4 w-4 text-green-500" />
                  <span className="font-medium">Product Health</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Usage, Retention, Performance metrics
                </p>
              </div>
            </div>
          </div>

          {/* Next steps */}
          <div className="bg-primary/5 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <ArrowRight className="h-4 w-4 text-primary" />
              <span className="font-medium">What happens next?</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Once you create groups, return to this dashboard page to see them
              automatically appear in the dropdown selector. Each group becomes
              a focused dashboard view.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Got it!
          </Button>
          <Button
            onClick={() => {
              onClose();
              window.history.back();
            }}
          >
            Go to Canvas
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default GroupHelpModal;
export { GroupHelpModal };
