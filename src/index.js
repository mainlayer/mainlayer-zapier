'use strict';

const authentication = require('../authentication');
const newPayment = require('../triggers/new_payment');
const newSubscription = require('../triggers/new_subscription');
const entitlementExpired = require('../triggers/entitlement_expired');
const createResource = require('../creates/create_resource');
const processPayment = require('../creates/process_payment');
const checkEntitlement = require('../creates/check_entitlement');
const createPlan = require('../creates/create_plan');

// ── Global error handler middleware ──────────────────────────────────────────
const errorHandling = (response, z, bundle) => {
  const { status, data } = response;

  if (status >= 400) {
    const errorMsg = data?.error || data?.message || `HTTP ${status}`;
    const errorCode = data?.code || 'APIError';

    if (status === 401 || status === 403) {
      throw new z.errors.Error(
        'Authentication failed. Please verify your Mainlayer API key.',
        'AuthenticationError',
        status
      );
    }

    if (status === 429) {
      throw new z.errors.Error(
        'Rate limited. Please wait before retrying.',
        'RateLimitError',
        status
      );
    }

    if (status === 422) {
      throw new z.errors.Error(
        `Validation error: ${errorMsg}`,
        'ValidationError',
        status
      );
    }

    throw new z.errors.Error(errorMsg, errorCode, status);
  }

  return response;
};

module.exports = {
  version: require('../package.json').version,
  platformVersion: require('zapier-platform-core').version,

  authentication,

  beforeRequest: [...(authentication.beforeRequest || [])],
  afterResponse: [errorHandling],

  triggers: {
    [newPayment.key]: newPayment,
    [newSubscription.key]: newSubscription,
    [entitlementExpired.key]: entitlementExpired,
  },

  creates: {
    [createResource.key]: createResource,
    [processPayment.key]: processPayment,
    [checkEntitlement.key]: checkEntitlement,
    [createPlan.key]: createPlan,
  },

  searches: {},
};
