import { MeasurementPreset } from '../components/DentalMeasurementsPalette/presets';
import { MeasurementRow } from '../components/MeasurementsPanel/MeasurementsPanel';

export function getCommandsModule({ servicesManager }: { servicesManager: any }) {
  return {
    definitions: {
      activateDentalMeasurement: {
        commandFn: ({ preset }: { preset: MeasurementPreset }) => {
          const { toolbarService } = servicesManager.services;
          toolbarService?.setActive(preset.cornerstoneTool);
        },
      },
      exportMeasurementsJSON: {
        commandFn: ({ measurements }: { measurements: MeasurementRow[] }) => {
          const blob = new Blob([JSON.stringify(measurements, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `measurements-${Date.now()}.json`;
          a.click();
          URL.revokeObjectURL(url);
        },
      },
    },
    defaultContext: 'VIEWER',
  };
}
