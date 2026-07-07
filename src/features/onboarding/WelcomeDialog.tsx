import { useAppStore } from '@/lib/stores';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { useClerkSupabase } from '@/shared/hooks/useClerkSupabase';
import {
  duplicateProjectDeep,
  getShowcaseProjects,
} from '@/shared/lib/supabase/services/projects';
import { Compass, Loader2, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useOnboardingStore } from './useOnboardingStore';

// First-run welcome (CVS-114 slice 1). Two paths, both recorded so it never
// shows twice: copy the demo canvas (by example-tag lookup, never a hard-coded
// id) and run the guided tour on the user's own populated copy — or start
// from scratch and fall back to the getting-started checklist.

export function WelcomeDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const navigate = useNavigate();
  const client = useClerkSupabase();
  const user = useAppStore((s) => s.user);
  const [copying, setCopying] = useState(false);

  const closeAsSeen = () => {
    useOnboardingStore.getState().markFirstRunSeen();
    onOpenChange(false);
  };

  const handleTour = async () => {
    if (!client || !user?.id) return;
    setCopying(true);
    try {
      // Tag lookup keeps onboarding decoupled from the marketing embed id.
      const examples = await getShowcaseProjects(client);
      const demo =
        examples.find((p: { name: string }) =>
          p.name.toLowerCase().includes('canvasm demo')
        ) ?? examples[0];
      if (!demo) {
        toast.error('No example canvas available yet');
        closeAsSeen();
        return;
      }
      const copyId = await duplicateProjectDeep(demo.id, user.id, client);
      const onboarding = useOnboardingStore.getState();
      onboarding.setDemoCopyProjectId(copyId);
      onboarding.setTourPending(true);
      onboarding.markFirstRunSeen();
      onOpenChange(false);
      navigate(`/canvas/${copyId}`);
    } catch (e) {
      console.error('Onboarding demo copy failed', e);
      toast.error('Could not set up the tour canvas');
      setCopying(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) closeAsSeen();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to Canvasm</DialogTitle>
          <DialogDescription>
            Map what your team believes, connect the work to metrics, and see
            the impact. Want a two-minute guided look at a working metric tree?
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 pt-2">
          <Button
            onClick={() => void handleTour()}
            disabled={copying || !client}
            className="justify-start gap-2"
          >
            {copying ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Compass className="h-4 w-4" />
            )}
            {copying ? 'Setting up your demo canvas…' : 'Take the 2-minute tour'}
          </Button>
          <Button
            variant="outline"
            onClick={closeAsSeen}
            disabled={copying}
            className="justify-start gap-2"
          >
            <Sparkles className="h-4 w-4" />
            Start from scratch
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          The tour builds a private copy of an example canvas in your workspace
          — play with it freely, it's yours.
        </p>
      </DialogContent>
    </Dialog>
  );
}
