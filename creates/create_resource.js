'use strict';

const BASE_URL = 'https://api.mainlayer.xyz';

/**
 * Creates a new billable resource in the Mainlayer catalog.
 */
const createResource = async (z, bundle) => {
  const response = await z.request({
    url: `${BASE_URL}/v1/resources`,
    method: 'POST',
    body: {
      name: bundle.inputData.name,
      description: bundle.inputData.description || '',
      price_usd: bundle.inputData.price_usd,
      fee_model: bundle.inputData.fee_model || 'per_call',
      endpoint: bundle.inputData.endpoint || '',
      tags: bundle.inputData.tags ? bundle.inputData.tags.split(',').map((t) => t.trim()) : [],
    },
  });

  return response.data;
};

module.exports = {
  key: 'create_resource',
  noun: 'Resource',

  display: {
    label: 'Create Resource',
    description:
      'Creates a new Mainlayer resource that others can pay to access.',
    important: true,
  },

  operation: {
    perform: createResource,

    inputFields: [
      {
        key: 'name',
        label: 'Resource Name',
        type: 'string',
        required: true,
        helpText: 'The human-readable name for your resource (e.g. "Weather Forecast API").',
      },
      {
        key: 'description',
        label: 'Description',
        type: 'text',
        required: false,
        helpText: 'A brief description shown to buyers.',
      },
      {
        key: 'price_usd',
        label: 'Price (USD)',
        type: 'number',
        required: true,
        helpText: 'Price in US dollars (e.g. 0.05 for 5 cents).',
      },
      {
        key: 'fee_model',
        label: 'Fee Model',
        type: 'string',
        required: false,
        default: 'per_call',
        choices: ['per_call', 'one_time', 'subscription'],
        helpText: 'How buyers are charged for access.',
      },
      {
        key: 'endpoint',
        label: 'Endpoint URL',
        type: 'string',
        required: false,
        helpText: 'Optional URL where the resource is hosted.',
      },
      {
        key: 'tags',
        label: 'Tags',
        type: 'string',
        required: false,
        helpText: 'Comma-separated tags for discoverability (e.g. "weather,data,ai").',
      },
    ],

    sample: {
      id: 'res_sample123',
      name: 'Weather Forecast API',
      description: 'Real-time weather data for any location.',
      price_usd: 0.05,
      fee_model: 'per_call',
      status: 'active',
      created_at: new Date().toISOString(),
    },

    outputFields: [
      { key: 'id', label: 'Resource ID' },
      { key: 'name', label: 'Resource Name' },
      { key: 'description', label: 'Description' },
      { key: 'price_usd', label: 'Price (USD)', type: 'number' },
      { key: 'fee_model', label: 'Fee Model' },
      { key: 'status', label: 'Status' },
      { key: 'created_at', label: 'Created At', type: 'datetime' },
    ],
  },
};
