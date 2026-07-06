import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2, ShieldOff } from 'lucide-react';
import { getEvidenceItemById } from '@/shared/lib/supabase/services/evidence';
import EvidenceContentRenderer from '@/features/evidence/components/EvidenceContentRenderer';
import type { EvidenceItem } from '@/shared/types';

// Read-only, public embed of a single evidence item (for Notion/Confluence/
// iframe). No auth — the anon Supabase client + RLS only return the item when
// it is is_public (see setEvidencePublic + the evidence_public_share migration).
export default function EmbedEvidencePage() {
  const { evidenceId } = useParams();
  const [status, setStatus] = useState<'loading' | 'ok' | 'missing'>('loading');
  const [evidence, setEvidence] = useState<EvidenceItem | null>(null);

  useEffect(() => {
    if (!evidenceId) return;
    let cancelled = false;
    // No client passed → anon client; RLS returns it only when is_public.
    getEvidenceItemById(evidenceId)
      .then((item) => {
        if (cancelled) return;
        if (!item) {
          setStatus('missing');
          return;
        }
        setEvidence(item);
        setStatus('ok');
      })
      .catch(() => !cancelled && setStatus('missing'));
    return () => {
      cancelled = true;
    };
  }, [evidenceId]);

  if (status === 'loading') {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (status === 'missing' || !evidence) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-3 bg-white px-6 text-center">
        <ShieldOff className="h-8 w-8 text-gray-300" />
        <p className="text-sm text-gray-500">
          This evidence isn't shared publicly.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen overflow-y-auto bg-white">
      <div className="mx-auto max-w-3xl px-6 py-8">
        <header className="mb-6 border-b pb-4">
          <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
            <span className="rounded bg-gray-100 px-1.5 py-0.5 font-medium">
              {evidence.type}
            </span>
            {evidence.date && <span>{evidence.date}</span>}
            {evidence.owner && <span>· {evidence.owner}</span>}
          </div>
          <h1 className="text-xl font-semibold text-gray-900">
            {evidence.title || 'Untitled evidence'}
          </h1>
          {evidence.hypothesis && (
            <p className="mt-1 text-sm text-gray-600">{evidence.hypothesis}</p>
          )}
        </header>

        <EvidenceContentRenderer evidence={evidence} />

        {evidence.link && (
          <a
            href={evidence.link}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-block text-sm text-primary hover:underline"
          >
            View source ↗
          </a>
        )}
      </div>
    </div>
  );
}
