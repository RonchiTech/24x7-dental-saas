import { state as csToolsState, Enums as csToolsEnums } from '@cornerstonejs/tools';
import { MeasurementPreset } from '../components/DentalMeasurementsPalette/presets';
import { MeasurementRow } from '../components/MeasurementsPanel/MeasurementsPanel';

export function getCommandsModule({
  servicesManager,
  commandsManager,
}: {
  servicesManager: any;
  commandsManager: any;
}) {
  return {
    definitions: {
      activateDentalMeasurement: {
        commandFn: ({ preset }: { preset: MeasurementPreset }) => {
          // Ensure the tool is registered in every Cornerstone tool group,
          // then activate it with the primary mouse button binding.
          const toolGroups: any[] = csToolsState.toolGroups ?? [];
          toolGroups.forEach(tg => {
            if (!tg.toolOptions?.[preset.cornerstoneTool]) {
              tg.addTool(preset.cornerstoneTool);
            }
            tg.setToolActive(preset.cornerstoneTool, {
              bindings: [{ mouseButton: csToolsEnums.MouseBindings?.Primary ?? 1 }],
            });
          });
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
