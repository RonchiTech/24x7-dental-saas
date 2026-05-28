import { Types } from '@ohif/core';

const id = '@ohif/extension-dental';

const ohifDentalExtension: Types.Extensions.Extension = {
  id,
  getCommandsModule: () => ({ definitions: {}, defaultContext: 'VIEWER' }),
  getPanelModule: () => [],
  getToolbarModule: () => [],
  getHangingProtocolModule: () => [],
};

export default ohifDentalExtension;
