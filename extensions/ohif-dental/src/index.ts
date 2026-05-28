import { Types } from '@ohif/core';
import './theme/dental.css';
import { getCommandsModule } from './commands';
import dentalProtocol from './hangingProtocols/dentalProtocol';
import DentalLayout from './components/DentalLayout/DentalLayout';

const id = '@ohif/extension-dental';

const ohifDentalExtension: Types.Extensions.Extension = {
  id,
  getCommandsModule,
  getPanelModule: () => [],
  getToolbarModule: () => [],
  getHangingProtocolModule: () => [{ name: dentalProtocol.id, protocol: dentalProtocol }],
  getLayoutTemplateModule: () => [{ name: 'dentalLayout', component: DentalLayout }],
};

export default ohifDentalExtension;
