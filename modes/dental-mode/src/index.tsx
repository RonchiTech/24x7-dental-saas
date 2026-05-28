const dentalMode = {
  id: 'dental',
  routeName: 'dental',
  displayName: 'Dental',
  isValidMode: () => ({ valid: true, description: 'Dental imaging mode' }),
  onModeEnter: () => {},
  onModeExit: () => {},
  routes: [
    {
      path: 'dental',
      layoutTemplate: () => ({
        id: '@ohif/extension-dental.layoutTemplateModule.dentalLayout',
        props: {
          viewports: [
            {
              namespace: '@ohif/extension-cornerstone.viewportModule.cornerstone',
              displaySetsToDisplay: ['@ohif/extension-default.sopClassHandlerModule.stack'],
            },
          ],
        },
      }),
    },
  ],
  extensions: {
    '@ohif/extension-dental': '^0.1.0',
    '@ohif/extension-default': '^3.0.0',
    '@ohif/extension-cornerstone': '^3.0.0',
  },
  hangingProtocol: 'dentalProtocol',
  sopClassHandlers: ['@ohif/extension-default.sopClassHandlerModule.stack'],
  hotkeys: [],
};

export default dentalMode;
