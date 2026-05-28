export type MeasurementType = 'paLength' | 'canalAngle' | 'crownWidth' | 'rootLength';

export interface MeasurementPreset {
  type: MeasurementType;
  label: string;
  cornerstoneTool: string;
  unit: string;
}

export const MEASUREMENT_PRESETS: MeasurementPreset[] = [
  { type: 'paLength',   label: 'PA length',   cornerstoneTool: 'Length', unit: 'mm' },
  { type: 'canalAngle', label: 'Canal angle', cornerstoneTool: 'Angle',  unit: '°'  },
  { type: 'crownWidth', label: 'Crown width', cornerstoneTool: 'Length', unit: 'mm' },
  { type: 'rootLength', label: 'Root length', cornerstoneTool: 'Length', unit: 'mm' },
];
