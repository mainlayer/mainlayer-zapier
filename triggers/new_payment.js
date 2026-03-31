'use strict';

const BASE_URL = 'https://api.mainlayer.fr';

/**
 * Polls for new payments on the authenticated vendor's account.
 * Returns payments created since the last poll.
 */
const getPayments = async (z, bundle) => {
  const response = await z.request({
    url: `${BASE_URL}/v1/payments`,
    method: 'GET',
    params: {
      since: bundle.meta.cursor || '',
      limit: 25,
    },
  });

  return response.data.payments || response.data || [];
};

module.exports = {
  key: 'new_payment',
  noun: 'Payment',

  display: {
    label: 'New Payment',
    description:
      'Triggers when a new payment is received for one of your Mainlayer resources.',
    important: true,
  },

  operation: {
    type: 'polling',
    perform: getPayments,

    canPaginate: true,

    sample: {
      id: 'pay_sample123',
      resource_id: 'res_abc456',
      resource_name: 'Image Analysis API',
      payer_id: 'user_xyz789',
      amount_usd: 0.05,
      fee_model: 'per_call',
      status: 'confirmed',
      created_at: new Date().toISOString(),
    },

    outputFields: [
      { key: 'id', label: 'Payment ID' },
      { key: 'resource_id', label: 'Resource ID' },
      { key: 'resource_name', label: 'Resource Name' },
      { key: 'payer_id', label: 'Payer ID' },
      { key: 'amount_usd', label: 'Amount (USD)', type: 'number' },
      { key: 'fee_model', label: 'Fee Model' },
      { key: 'status', label: 'Status' },
      { key: 'created_at', label: 'Created At', type: 'datetime' },
    ],
  },
};
