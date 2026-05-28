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

const API_BASE =
  (typeof process !== 'undefined' && process.env?.REACT_APP_API_BASE) ?? 'http://localhost:4000';

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

// Inner component — lives inside DentalProvider so it can call useDental()
function DentalLayoutContent({ viewports = [], ViewportGridComp }: any) {
  const { servicesManager, commandsManager, extensionManager } = useSystem();
  const { selectedTooth } = useDental();
  const [measurements, setMeasurements] = React.useState<MeasurementRow[]>([]);
  const activePresetRef = React.useRef<MeasurementPreset | null>(null);
  const selectedToothRef = React.useRef<string>('');

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
  const patientMeta = displaySetService?.activeDisplaySets?.[0]?.instances?.[0] ?? {};
  const rawName = patientMeta.PatientName;
  const patient = {
    name: typeof rawName === 'object' ? (rawName?.Alphabetic ?? 'Unknown Patient') : (rawName ?? 'Unknown Patient'),
    dob: patientMeta.PatientBirthDate ?? '—',
    mrn: patientMeta.PatientID ?? '—',
  };

  const studyUID = displaySetService?.activeDisplaySets?.[0]?.StudyInstanceUID ?? 'unknown';
  const { syncState } = useViewerStateSync(studyUID, API_BASE);
  void syncState;

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
        <div style={{ flex: 1 }}>
          <ViewportGridComp
            servicesManager={servicesManager}
            commandsManager={commandsManager}
            viewportComponents={viewportComponents}
          />
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
