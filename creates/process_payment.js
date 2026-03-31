'use strict';

const BASE_URL = 'https://api.mainlayer.fr';

/**
 * Triggers a payment for a Mainlayer resource on behalf of a payer.
 */
const processPayment = async (z, bundle) => {
  const response = await z.request({
    url: `${BASE_URL}/v1/payments`,
    method: 'POST',
    body: {
      resource_id: bundle.inputData.resource_id,
      payer_id: bundle.inputData.payer_id,
      amount_usd: bundle.inputData.amount_usd,
      idempotency_key: bundle.inputData.idempotency_key || undefined,
    },
  });

  return response.data;
};

module.exports = {
  key: 'process_payment',
  noun: 'Payment',

  display: {
    label: 'Process Payment',
    description:
      'Processes a payment for a Mainlayer resource, granting the payer an entitlement.',
    important: true,
  },

  operation: {
    perform: processPayment,

    inputFields: [
      {
        key: 'resource_id',
        label: 'Resource ID',
        type: 'string',
        required: true,
        helpText: 'The ID of the Mainlayer resource to purchase access to.',
      },
      {
        key: 'payer_id',
        label: 'Payer ID',
        type: 'string',
        required: true,
        helpText:
          'A unique identifier for the entity making the payment (e.g. user email, user ID).',
      },
      {
        key: 'amount_usd',
        label: 'Amount (USD)',
        type: 'number',
        required: true,
        helpText: 'The amount to charge in US dollars.',
      },
      {
        key: 'idempotency_key',
        label: 'Idempotency Key',
        type: 'string',
        required: false,
        helpText:
          'Optional unique key to prevent duplicate payments when a Zap re-runs.',
      },
    ],

    sample: {
      id: 'pay_sample123',
      resource_id: 'res_abc456',
      payer_id: 'user_xyz789',
      amount_usd: 0.05,
      status: 'confirmed',
      entitlement_id: 'ent_sample456',
      created_at: new Date().toISOString(),
    },

    outputFields: [
      { key: 'id', label: 'Payment ID' },
      { key: 'resource_id', label: 'Resource ID' },
      { key: 'payer_id', label: 'Payer ID' },
      { key: 'amount_usd', label: 'Amount (USD)', type: 'number' },
      { key: 'status', label: 'Status' },
      { key: 'entitlement_id', label: 'Entitlement ID' },
      { key: 'created_at', label: 'Created At', type: 'datetime' },
    ],
  },
};
