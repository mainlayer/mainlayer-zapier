'use strict';

const BASE_URL = 'https://api.mainlayer.fr';

/**
 * Polls for new subscriptions created on the authenticated vendor's account.
 */
const getSubscriptions = async (z, bundle) => {
  const response = await z.request({
    url: `${BASE_URL}/v1/subscriptions`,
    method: 'GET',
    params: {
      since: bundle.meta.cursor || '',
      limit: 25,
    },
  });

  return response.data.subscriptions || response.data || [];
};

module.exports = {
  key: 'new_subscription',
  noun: 'Subscription',

  display: {
    label: 'New Subscription',
    description:
      'Triggers when a subscriber signs up for one of your Mainlayer subscription resources.',
    important: true,
  },

  operation: {
    type: 'polling',
    perform: getSubscriptions,

    canPaginate: true,

    sample: {
      id: 'sub_sample123',
      resource_id: 'res_abc456',
      resource_name: 'Premium Data Feed',
      subscriber_id: 'user_xyz789',
      plan: 'monthly',
      amount_usd: 9.99,
      status: 'active',
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
    },

    outputFields: [
      { key: 'id', label: 'Subscription ID' },
      { key: 'resource_id', label: 'Resource ID' },
      { key: 'resource_name', label: 'Resource Name' },
      { key: 'subscriber_id', label: 'Subscriber ID' },
      { key: 'plan', label: 'Plan' },
      { key: 'amount_usd', label: 'Amount (USD)', type: 'number' },
      { key: 'status', label: 'Status' },
      { key: 'current_period_start', label: 'Period Start', type: 'datetime' },
      { key: 'current_period_end', label: 'Period End', type: 'datetime' },
      { key: 'created_at', label: 'Created At', type: 'datetime' },
    ],
  },
};
