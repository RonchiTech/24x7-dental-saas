export interface JwtPayload {
  userId: string;
  email: string;
}

export interface ViewportState {
  seriesUID: string;
  windowCenter: number;
  windowWidth: number;
  zoom: number;
  pan: { x: number; y: number };
}

export interface ViewerStateJson {
  viewports: ViewportState[];
  activeTool: string;
}

export interface MeasurementInput {
  tooth: string;
  type: string;
  label: string;
  value: number;
  unit: string;
}
