import { useCallback, useEffect, useRef, useState } from 'react';

interface UseWorkerOptions {
  onMessage?: (data: any) => void;
  onError?: (error: ErrorEvent) => void;
}

export function useWorker(
  workerScript?: string,
  options: UseWorkerOptions = {}
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const workerRef = useRef<Worker | null>(null);

  const postMessage = useCallback((data: any) => {
    if (workerRef.current) {
      setIsLoading(true);
      workerRef.current.postMessage(data);
    }
  }, []);

  const terminate = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!workerScript) return;

    try {
      workerRef.current = new Worker(workerScript);

      workerRef.current.onmessage = (event) => {
        setIsLoading(false);
        setError(null);
        options.onMessage?.(event.data);
      };

      workerRef.current.onerror = (error) => {
        setIsLoading(false);
        setError(error.message);
        options.onError?.(error);
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create worker');
    }

    return () => {
      terminate();
    };
  }, [workerScript, options.onMessage, options.onError, terminate]);

  return {
    postMessage,
    terminate,
    isLoading,
    error,
  };
}




