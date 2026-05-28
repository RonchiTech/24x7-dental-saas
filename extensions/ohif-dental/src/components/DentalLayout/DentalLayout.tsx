import React from 'react';
import { useSystem } from '@ohif/core';
import { DentalProvider } from '../../context/DentalContext';
import PracticeHeader from '../PracticeHeader/PracticeHeader';
import DentalMeasurementsPalette from '../DentalMeasurementsPalette/DentalMeasurementsPalette';
import MeasurementsPanel, { MeasurementRow } from '../MeasurementsPanel/MeasurementsPanel';
import LoginPage from '../LoginPage/LoginPage';
import { MeasurementPreset } from '../DentalMeasurementsPalette/presets';
import { useViewerStateSync } from '../../hooks/useViewerStateSync';

const API_BASE =
  (typeof process !== 'undefined' && process.env?.REACT_APP_API_BASE) ?? 'http://localhost:4000';

export default function DentalLayout({ viewports = [], ViewportGridComp }: any) {
  const { servicesManager, commandsManager, extensionManager } = useSystem();
  const [authed, setAuthed] = React.useState(!!localStorage.getItem('dental_jwt'));
  const [measurements, setMeasurements] = React.useState<MeasurementRow[]>([]);

  const displaySetService = servicesManager?.services?.displaySetService;
  const patientMeta = displaySetService?.activeDisplaySets?.[0]?.instances?.[0] ?? {};
  const patient = {
    name: patientMeta.PatientName ?? 'Unknown Patient',
    dob: patientMeta.PatientBirthDate ?? '—',
    mrn: patientMeta.PatientID ?? '—',
  };

  const studyUID =
    displaySetService?.activeDisplaySets?.[0]?.StudyInstanceUID ?? 'unknown';
  const { syncState } = useViewerStateSync(studyUID, API_BASE);
  void syncState;

  const viewportComponents = viewports.map((viewport: any) => {
    const entry = extensionManager?.getModuleEntry(viewport.namespace);
    return {
      component: entry?.component,
      displaySetsToDisplay: viewport.displaySetsToDisplay,
    };
  });

  if (!authed) {
    return <LoginPage apiBase={API_BASE} onSuccess={() => setAuthed(true)} />;
  }

  function handleActivatePreset(preset: MeasurementPreset) {
    commandsManager?.runCommand('activateDentalMeasurement', { preset });
  }

  function handleExport() {
    commandsManager?.runCommand('exportMeasurementsJSON', { measurements });
  }

  return (
    <DentalProvider>
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
    </DentalProvider>
  );
}
