const dentalProtocol = {
  id: 'dentalProtocol',
  name: 'Dental 2x2',
  description: 'Current + prior + two bitewing placeholders',
  numImageLoadersPerViewport: 1,
  toolGroupIds: ['default'],
  displaySetSelectors: {
    current: {
      seriesMatchingRules: [
        { attribute: 'SeriesDate', constraint: { validator: 'range', validatorOptions: { minValue: 0 } } },
      ],
      seriesRequiredMatch: true,
    },
    prior: {
      seriesMatchingRules: [
        { attribute: 'SeriesDate', constraint: { validator: 'range', validatorOptions: { minValue: 0 } } },
      ],
      seriesRequiredMatch: false,
    },
  },
  stages: [
    {
      id: 'dentalStage',
      viewportStructure: {
        layoutType: 'grid',
        properties: { rows: 2, columns: 2 },
      },
      viewports: [
        { viewportOptions: { viewportId: 'top-left',     viewportType: 'stack' }, displaySets: [{ id: 'current' }] },
        { viewportOptions: { viewportId: 'top-right',    viewportType: 'stack' }, displaySets: [{ id: 'prior' }]   },
        { viewportOptions: { viewportId: 'bottom-left',  viewportType: 'stack' }, displaySets: []                   },
        { viewportOptions: { viewportId: 'bottom-right', viewportType: 'stack' }, displaySets: []                   },
      ],
    },
  ],
};

export default dentalProtocol;
