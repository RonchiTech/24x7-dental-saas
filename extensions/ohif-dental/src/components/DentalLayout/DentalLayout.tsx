import React from 'react';
import { useSystem } from '@ohif/core';
import { eventTarget } from '@cornerstonejs/core';
import { Enums as csToolsEnums } from '@cornerstonejs/tools';
import { DentalProvider, useDental } from '../../context/DentalContext';
import PracticeHeader from '../PracticeHeader/PracticeHeader';
import DentalMeasurementsPalette from '../DentalMeasurementsPalette/DentalMeasurementsPalette';
import MeasurementsPanel, { MeasurementRow } from '../MeasurementsPanel/MeasurementsPanel';
import LoginPage from '../LoginPage/LoginPage';
import { MeasurementPreset } from '../DentalMeasurementsPalette/presets';
import { useViewerStateSync } from '../../hooks/useViewerStateSync';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000';

// Extracts numeric value from a Cornerstone annotation's cachedStats
function extractValueFromAnnotation(annotation: any, preset: MeasurementPreset): number {
  const stats = annotation?.data?.cachedStats ?? {};
  const firstKey = Object.keys(stats)[0];
  if (!firstKey) return 0;
  const entry = stats[firstKey];
  if (preset.cornerstoneTool === 'Angle') {
    return Math.round((entry?.angle ?? 0) * 10) / 10;
  }
  return Math.round((entry?.length ?? 0) * 10) / 10;
}

const bitewingStyle: React.CSSProperties = {
  position: 'absolute', bottom: 0, width: '50%', height: '50%',
  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
  gap: 6, pointerEvents: 'none',
  background: 'rgba(10, 13, 20, 0.88)',
  border: '1px dashed #2d3748',
  color: '#4a5568',
};

// Inner component — lives inside DentalProvider so it can call useDental()
function DentalLayoutContent({ viewports = [], ViewportGridComp }: any) {
  const { servicesManager, commandsManager, extensionManager } = useSystem();
  const { selectedTooth, setSelectedTooth } = useDental();
  const [measurements, setMeasurements] = React.useState<MeasurementRow[]>([]);
  const activePresetRef = React.useRef<MeasurementPreset | null>(null);
  const selectedToothRef = React.useRef<string>('');
  const isRestoredRef = React.useRef(false);

  // Keep tooth ref in sync so the subscription closure always sees the current value
  React.useEffect(() => {
    selectedToothRef.current = selectedTooth;
  }, [selectedTooth]);

  // Subscribe to Cornerstone ANNOTATION_COMPLETED events directly
  React.useEffect(() => {
    const handler = (evt: any) => {
      const annotation = evt.detail?.annotation;
      const preset = activePresetRef.current;
      if (!preset || !annotation) return;
      if (annotation.metadata?.toolName !== preset.cornerstoneTool) return;

      setMeasurements(prev => [
        ...prev,
        {
          id: annotation.annotationUID ?? String(Date.now()),
          tooth: selectedToothRef.current || '—',
          type: preset.type,
          label: preset.label,
          value: extractValueFromAnnotation(annotation, preset),
          unit: preset.unit,
        },
      ]);
    };

    eventTarget.addEventListener(csToolsEnums.Events.ANNOTATION_COMPLETED, handler);
    return () => eventTarget.removeEventListener(csToolsEnums.Events.ANNOTATION_COMPLETED, handler);
  }, []);

  const displaySetService = servicesManager?.services?.displaySetService;

  // Track studyUID as React state so the load effect fires when display sets arrive
  const [studyUID, setStudyUID] = React.useState<string>('unknown');
  const [patientMeta, setPatientMeta] = React.useState<any>({});

  React.useEffect(() => {
    if (!displaySetService) return;

    const syncMeta = () => {
      const ds = displaySetService.activeDisplaySets?.[0];
      const uid = ds?.StudyInstanceUID;
      if (uid) setStudyUID(uid);
      setPatientMeta(ds?.instances?.[0] ?? {});
    };

    // Run immediately (display sets may already be loaded on HMR / re-mount)
    syncMeta();

    // Subscribe so we also catch the async load case
    const { unsubscribe } = displaySetService.subscribe(
      displaySetService.EVENTS.DISPLAY_SETS_ADDED,
      syncMeta
    );
    return unsubscribe;
  }, [displaySetService]);

  const rawName = patientMeta.PatientName;
  const patient = {
    name: typeof rawName === 'object' ? (rawName?.Alphabetic ?? 'Unknown Patient') : (rawName ?? 'Unknown Patient'),
    dob: patientMeta.PatientBirthDate ?? '—',
    mrn: patientMeta.PatientID ?? '—',
  };

  const { syncState, loadState } = useViewerStateSync(studyUID, API_BASE);

  // Load saved state once when studyUID becomes known
  React.useEffect(() => {
    if (studyUID === 'unknown' || isRestoredRef.current) return;
    isRestoredRef.current = true;
    loadState().then(saved => {
      if (!saved) return;
      if (saved.measurements?.length) {
        setMeasurements(saved.measurements.map((m: any) => ({
          id: m.id, tooth: m.tooth, type: m.type,
          label: m.label, value: m.value, unit: m.unit,
        })));
      }
      if (saved.stateJson?.selectedTooth) {
        setSelectedTooth(saved.stateJson.selectedTooth);
      }
    });
  }, [studyUID, loadState, setSelectedTooth]);

  // Persist state whenever measurements or selected tooth changes
  React.useEffect(() => {
    if (!isRestoredRef.current) return;
    syncState({ selectedTooth }, measurements);
  }, [measurements, selectedTooth, syncState]);

  const viewportComponents = React.useMemo(
    () =>
      viewports.map((viewport: any) => {
        const entry = extensionManager?.getModuleEntry(viewport.namespace);
        return {
          component: entry?.component,
          displaySetsToDisplay: viewport.displaySetsToDisplay,
        };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [viewports, extensionManager]
  );

  function handleActivatePreset(preset: MeasurementPreset) {
    activePresetRef.current = preset;
    commandsManager?.runCommand('activateDentalMeasurement', { preset });
  }

  function handleExport() {
    commandsManager?.runCommand('exportMeasurementsJSON', { measurements });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#000' }}>
      <PracticeHeader practiceName="Westside Dental" patient={patient} />
      <div style={{ padding: '4px 14px', display: 'flex', gap: '6px', background: '#1a1f2e', borderBottom: '1px solid #2d3748' }}>
        <DentalMeasurementsPalette onActivatePreset={handleActivatePreset} />
      </div>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <ViewportGridComp
            servicesManager={servicesManager}
            commandsManager={commandsManager}
            viewportComponents={viewportComponents}
          />
          {/* Bitewing placeholder overlays for the empty bottom two cells */}
          <div style={{ ...bitewingStyle, left: 0 }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" opacity={0.5}>
              <rect x="3" y="6" width="18" height="13" rx="2" />
              <line x1="3" y1="11" x2="21" y2="11" />
              <line x1="9" y1="6" x2="9" y2="19" />
              <line x1="15" y1="6" x2="15" y2="19" />
            </svg>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em' }}>BITEWING — LEFT</span>
            <span style={{ fontSize: 10, opacity: 0.55 }}>No image loaded</span>
          </div>
          <div style={{ ...bitewingStyle, right: 0 }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" opacity={0.5}>
              <rect x="3" y="6" width="18" height="13" rx="2" />
              <line x1="3" y1="11" x2="21" y2="11" />
              <line x1="9" y1="6" x2="9" y2="19" />
              <line x1="15" y1="6" x2="15" y2="19" />
            </svg>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em' }}>BITEWING — RIGHT</span>
            <span style={{ fontSize: 10, opacity: 0.55 }}>No image loaded</span>
          </div>
        </div>
        <div style={{ width: '240px', borderLeft: '1px solid #2d3748', overflowY: 'auto', background: '#0d1117' }}>
          <MeasurementsPanel measurements={measurements} onExport={handleExport} />
        </div>
      </div>
    </div>
  );
}

export default function DentalLayout({ viewports = [], ViewportGridComp }: any) {
  const [authed, setAuthed] = React.useState(!!localStorage.getItem('dental_jwt'));

  if (!authed) {
    return <LoginPage apiBase={API_BASE} onSuccess={() => setAuthed(true)} />;
  }

  return (
    <DentalProvider>
      <DentalLayoutContent viewports={viewports} ViewportGridComp={ViewportGridComp} />
    </DentalProvider>
  );
}
