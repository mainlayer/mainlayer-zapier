'use strict';

const BASE_URL = 'https://api.mainlayer.fr';

/**
 * Creates a subscription plan for a resource.
 * Plans define billing cycles and pricing tiers for recurring revenue.
 */
const createPlan = async (z, bundle) => {
  const response = await z.request({
    url: `${BASE_URL}/v1/plans`,
    method: 'POST',
    body: {
      resource_id: bundle.inputData.resource_id,
      name: bundle.inputData.name,
      description: bundle.inputData.description || '',
      amount_usd: bundle.inputData.amount_usd,
      interval: bundle.inputData.interval || 'monthly',
      interval_count: parseInt(bundle.inputData.interval_count, 10) || 1,
      trial_days: parseInt(bundle.inputData.trial_days, 10) || 0,
      features: bundle.inputData.features ? bundle.inputData.features.split('\n').filter(f => f.trim()) : [],
    },
  });

  return response.data;
};

module.exports = {
  key: 'create_plan',
  noun: 'Plan',

  display: {
    label: 'Create Plan',
    description:
      'Creates a new subscription plan for a Mainlayer resource.',
    important: true,
  },

  operation: {
    perform: createPlan,

    inputFields: [
      {
        key: 'resource_id',
        label: 'Resource ID',
        type: 'string',
        required: true,
        helpText: 'The ID of the Mainlayer resource this plan applies to.',
      },
      {
        key: 'name',
        label: 'Plan Name',
        type: 'string',
        required: true,
        helpText: 'Human-readable name (e.g., "Starter", "Pro", "Enterprise").',
      },
      {
        key: 'description',
        label: 'Description',
        type: 'text',
        required: false,
        helpText: 'Brief description shown to subscribers.',
      },
      {
        key: 'amount_usd',
        label: 'Price (USD)',
        type: 'number',
        required: true,
        helpText: 'Monthly or interval price in US dollars.',
      },
      {
        key: 'interval',
        label: 'Billing Interval',
        type: 'string',
        required: false,
        default: 'monthly',
        choices: ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'],
        helpText: 'Billing cycle frequency.',
      },
      {
        key: 'interval_count',
        label: 'Interval Multiplier',
        type: 'integer',
        required: false,
        default: 1,
        helpText: 'Multiples of interval (e.g., 3 with "monthly" = quarterly).',
      },
      {
        key: 'trial_days',
        label: 'Trial Period (Days)',
        type: 'integer',
        required: false,
        default: 0,
        helpText: 'Free trial duration before first charge.',
      },
      {
        key: 'features',
        label: 'Features (One per Line)',
        type: 'text',
        required: false,
        helpText: 'List of included features, separated by newlines.',
      },
    ],

    sample: {
      id: 'plan_sample123',
      resource_id: 'res_abc456',
      name: 'Pro Plan',
      description: 'Best for growing teams.',
      amount_usd: 99.99,
      interval: 'monthly',
      interval_count: 1,
      trial_days: 14,
      status: 'active',
      created_at: new Date().toISOString(),
    },

    outputFields: [
      { key: 'id', label: 'Plan ID' },
      { key: 'resource_id', label: 'Resource ID' },
      { key: 'name', label: 'Plan Name' },
      { key: 'description', label: 'Description' },
      { key: 'amount_usd', label: 'Price (USD)', type: 'number' },
      { key: 'interval', label: 'Billing Interval' },
      { key: 'interval_count', label: 'Interval Multiplier', type: 'integer' },
      { key: 'trial_days', label: 'Trial Days', type: 'integer' },
      { key: 'status', label: 'Status' },
      { key: 'created_at', label: 'Created At', type: 'datetime' },
    ],
  },
};
