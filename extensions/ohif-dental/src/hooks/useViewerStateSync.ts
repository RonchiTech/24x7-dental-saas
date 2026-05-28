import { useCallback, useRef } from 'react';

interface ViewportState { seriesUID: string; windowCenter: number; windowWidth: number; zoom: number; pan: { x: number; y: number }; }
interface ViewerStateJson { viewports: ViewportState[]; activeTool: string; }
interface MeasurementInput { tooth: string; type: string; label: string; value: number; unit: string; }

const DEBOUNCE_MS = 1000;
const JWT_KEY = 'dental_jwt';

export function useViewerStateSync(studyUID: string, apiBase: string) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const syncState = useCallback((stateJson: ViewerStateJson, measurements: MeasurementInput[]) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      const token = localStorage.getItem(JWT_KEY);
      if (!token) return;
      await fetch(`${apiBase}/viewer-state/${studyUID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ stateJson, measurements }),
      });
    }, DEBOUNCE_MS);
  }, [studyUID, apiBase]);

  return { syncState };
}
