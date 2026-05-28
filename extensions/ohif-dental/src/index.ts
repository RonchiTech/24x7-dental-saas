import { Types } from '@ohif/core';
import './theme/dental.css';

const id = '@ohif/extension-dental';

const ohifDentalExtension: Types.Extensions.Extension = {
  id,
  getCommandsModule: () => ({ definitions: {}, defaultContext: 'VIEWER' }),
  getPanelModule: () => [],
  getToolbarModule: () => [],
  getHangingProtocolModule: () => [],
};

export default ohifDentalExtension;
