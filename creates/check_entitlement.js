'use strict';

const BASE_URL = 'https://api.mainlayer.fr';

/**
 * Checks if a specific user has an active entitlement to a resource.
 * Useful for access control, conditional workflows, and permission checks.
 */
const checkEntitlement = async (z, bundle) => {
  const response = await z.request({
    url: `${BASE_URL}/v1/entitlements/check`,
    method: 'POST',
    body: {
      resource_id: bundle.inputData.resource_id,
      user_id: bundle.inputData.user_id,
      payer_id: bundle.inputData.payer_id || bundle.inputData.user_id,
    },
  });

  return response.data;
};

module.exports = {
  key: 'check_entitlement',
  noun: 'Entitlement',

  display: {
    label: 'Check Entitlement',
    description:
      'Checks if a user has active access to a Mainlayer resource.',
    important: false,
  },

  operation: {
    perform: checkEntitlement,

    inputFields: [
      {
        key: 'resource_id',
        label: 'Resource ID',
        type: 'string',
        required: true,
        helpText: 'The ID of the Mainlayer resource to check access for.',
      },
      {
        key: 'user_id',
        label: 'User ID',
        type: 'string',
        required: true,
        helpText: 'A unique identifier for the user (e.g., email, username, or internal ID).',
      },
      {
        key: 'payer_id',
        label: 'Payer ID (Optional)',
        type: 'string',
        required: false,
        helpText: 'If different from user_id, the entity that paid for the entitlement.',
      },
    ],

    sample: {
      has_entitlement: true,
      resource_id: 'res_abc456',
      user_id: 'user_xyz789',
      entitlement_id: 'ent_sample123',
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    },

    outputFields: [
      { key: 'has_entitlement', label: 'Has Access', type: 'boolean' },
      { key: 'resource_id', label: 'Resource ID' },
      { key: 'user_id', label: 'User ID' },
      { key: 'entitlement_id', label: 'Entitlement ID' },
      { key: 'expires_at', label: 'Expiration Date', type: 'datetime' },
    ],
  },
};
