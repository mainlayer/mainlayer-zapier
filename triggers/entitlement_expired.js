'use strict';

const BASE_URL = 'https://api.mainlayer.fr';

/**
 * Polls for entitlements that have expired on the authenticated vendor's account.
 * Useful for revoking access, cleanup, or notifications when users lose access.
 */
const getExpiredEntitlements = async (z, bundle) => {
  const response = await z.request({
    url: `${BASE_URL}/v1/entitlements`,
    method: 'GET',
    params: {
      status: 'expired',
      since: bundle.meta.cursor || '',
      limit: 25,
    },
  });

  return response.data.entitlements || response.data || [];
};

module.exports = {
  key: 'entitlement_expired',
  noun: 'Entitlement',

  display: {
    label: 'Entitlement Expired',
    description:
      'Triggers when a user\'s access entitlement expires or is revoked.',
    important: true,
  },

  operation: {
    type: 'polling',
    perform: getExpiredEntitlements,

    canPaginate: true,

    sample: {
      id: 'ent_sample123',
      resource_id: 'res_abc456',
      resource_name: 'Premium Data Feed',
      user_id: 'user_xyz789',
      payer_id: 'user_xyz789',
      status: 'expired',
      expires_at: new Date().toISOString(),
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },

    outputFields: [
      { key: 'id', label: 'Entitlement ID' },
      { key: 'resource_id', label: 'Resource ID' },
      { key: 'resource_name', label: 'Resource Name' },
      { key: 'user_id', label: 'User ID' },
      { key: 'payer_id', label: 'Payer ID' },
      { key: 'status', label: 'Status' },
      { key: 'expires_at', label: 'Expiration Date', type: 'datetime' },
      { key: 'created_at', label: 'Created At', type: 'datetime' },
    ],
  },
};
