'use strict';

const BASE_URL = 'https://api.mainlayer.fr';

/**
 * Tests the provided API key by calling the /v1/whoami endpoint.
 * Zapier calls this automatically during the connection setup flow.
 */
const testAuthentication = async (z, bundle) => {
  const response = await z.request({
    url: `${BASE_URL}/v1/whoami`,
    method: 'GET',
  });

  // z.request throws on non-2xx when throwForStatus is not disabled, but we
  // want a friendly message on 401/403.
  if (response.status === 401 || response.status === 403) {
    throw new z.errors.Error(
      'Invalid API key. Please check your Mainlayer API key and try again.',
      'AuthenticationError',
      response.status
    );
  }

  return response.data;
};

module.exports = {
  type: 'custom',

  // The field shown to users when they connect their Mainlayer account.
  fields: [
    {
      key: 'api_key',
      label: 'API Key',
      required: true,
      type: 'password',
      helpText:
        'Your Mainlayer API key. Find it in your [Mainlayer dashboard](https://app.mainlayer.fr/settings/api-keys) under Settings → API Keys.',
    },
  ],

  // Attach the API key as a Bearer token on every outbound request.
  connectionLabel: '{{bundle.authData.api_key}}',

  test: testAuthentication,

  // Zapier applies this to every z.request automatically when auth is wired up.
  beforeRequest: [
    (request, z, bundle) => {
      request.headers['Authorization'] = `Bearer ${bundle.authData.api_key}`;
      request.headers['Content-Type'] = 'application/json';
      return request;
    },
  ],
};
