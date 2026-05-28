import { useCallback, useRef } from 'react';

interface ViewerStateJson { selectedTooth?: string; activeTool?: string; }
interface MeasurementInput { tooth: string; type: string; label: string; value: number; unit: string; }

export interface SavedState {
  stateJson: ViewerStateJson;
  measurements: (MeasurementInput & { id: string })[];
}

const DEBOUNCE_MS = 1000;
const JWT_KEY = 'dental_jwt';

export function useViewerStateSync(studyUID: string, apiBase: string) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const syncState = useCallback((stateJson: ViewerStateJson, measurements: MeasurementInput[]) => {
    if (studyUID === 'unknown') return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      const token = localStorage.getItem(JWT_KEY);
      if (!token) return;
      await fetch(`${apiBase}/viewer-state/${encodeURIComponent(studyUID)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ stateJson, measurements }),
      }).catch(() => {});
    }, DEBOUNCE_MS);
  }, [studyUID, apiBase]);

  const loadState = useCallback(async (): Promise<SavedState | null> => {
    const token = localStorage.getItem(JWT_KEY);
    if (!token || studyUID === 'unknown') return null;
    try {
      const res = await fetch(`${apiBase}/viewer-state/${encodeURIComponent(studyUID)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }, [studyUID, apiBase]);

  return { syncState, loadState };
}
