import React from 'react';
import { DentalProvider } from '../../../extensions/ohif-dental/src/context/DentalContext';
import PracticeHeader from '../../../extensions/ohif-dental/src/components/PracticeHeader/PracticeHeader';
import DentalMeasurementsPalette from '../../../extensions/ohif-dental/src/components/DentalMeasurementsPalette/DentalMeasurementsPalette';
import MeasurementsPanel, { MeasurementRow } from '../../../extensions/ohif-dental/src/components/MeasurementsPanel/MeasurementsPanel';
import LoginPage from '../../../extensions/ohif-dental/src/components/LoginPage/LoginPage';
import { MeasurementPreset } from '../../../extensions/ohif-dental/src/components/DentalMeasurementsPalette/presets';
import { useViewerStateSync } from '../../../extensions/ohif-dental/src/hooks/useViewerStateSync';

const API_BASE = (typeof process !== 'undefined' && process.env?.REACT_APP_API_BASE) ?? 'http://localhost:4000';

function DentalLayout({ servicesManager, commandsManager, children }: any) {
  const [authed, setAuthed] = React.useState(!!localStorage.getItem('dental_jwt'));
  const [measurements, setMeasurements] = React.useState<MeasurementRow[]>([]);

  const displaySetService = servicesManager?.services?.displaySetService;
  const patientMeta = displaySetService?.activeDisplaySets?.[0]?.instances?.[0] ?? {};
  const patient = {
    name: patientMeta.PatientName ?? 'Unknown Patient',
    dob: patientMeta.PatientBirthDate ?? '—',
    mrn: patientMeta.PatientID ?? '—',
  };

  const studyUID = displaySetService?.activeDisplaySets?.[0]?.StudyInstanceUID ?? 'unknown';
  const { syncState } = useViewerStateSync(studyUID, API_BASE);

  if (!authed) {
    return <LoginPage apiBase={API_BASE} onSuccess={() => setAuthed(true)} />;
  }

  function handleActivatePreset(preset: MeasurementPreset) {
    commandsManager.runCommand('activateDentalMeasurement', { preset });
  }

  function handleExport() {
    commandsManager.runCommand('exportMeasurementsJSON', { measurements });
  }

  return (
    <DentalProvider>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <PracticeHeader practiceName="Westside Dental" patient={patient} />
        <div className="ohif-toolbar" style={{ padding: '4px 14px', display: 'flex', gap: '6px' }}>
          <DentalMeasurementsPalette onActivatePreset={handleActivatePreset} />
        </div>
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          <div style={{ flex: 1 }}>{children}</div>
          <div className="panel-right" style={{ width: '220px' }}>
            <MeasurementsPanel measurements={measurements} onExport={handleExport} />
          </div>
        </div>
      </div>
    </DentalProvider>
  );
}

const dentalMode = {
  id: 'dental',
  routeName: 'dental',
  displayName: 'Dental',
  onModeEnter: ({ servicesManager }: any) => {
    servicesManager.services.hangingProtocolService?.setProtocol('dentalProtocol');
  },
  onModeExit: () => {},
  routes: [
    {
      path: 'dental',
      layoutTemplate: () => ({
        id: '@ohif/extension-default.layoutTemplateModule.viewerLayout',
        props: {
          leftPanels: [],
          rightPanels: [],
          viewports: [{ namespace: '@ohif/extension-cornerstone.viewportModule.cornerstone', displaySetsToDisplay: ['@ohif/extension-default.sopClassHandlerModule.stack'] }],
        },
      }),
    },
  ],
  extensions: ['@ohif/extension-dental', '@ohif/extension-default', '@ohif/extension-cornerstone'],
  hangingProtocol: 'dentalProtocol',
  sopClassHandlers: ['@ohif/extension-default.sopClassHandlerModule.stack'],
  hotkeys: [],
};

export default dentalMode;
