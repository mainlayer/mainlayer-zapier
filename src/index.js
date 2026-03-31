'use strict';

const authentication = require('../authentication');
const newPayment = require('./triggers/new_payment');
const newSubscription = require('./triggers/new_subscription');
const createResource = require('./creates/create_resource');
const processPayment = require('./creates/process_payment');

module.exports = {
  version: require('../package.json').version,
  platformVersion: require('zapier-platform-core').version,

  authentication,

  beforeRequest: [...(authentication.beforeRequest || [])],

  triggers: {
    [newPayment.key]: newPayment,
    [newSubscription.key]: newSubscription,
  },

  creates: {
    [createResource.key]: createResource,
    [processPayment.key]: processPayment,
  },

  searches: {},
};
