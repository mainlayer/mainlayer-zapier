'use strict';

const zapier = require('zapier-platform-core');
const App = require('../src/index');

const appTester = zapier.createAppTester(App);
zapier.tools.env.inject();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Creates a minimal Zapier bundle with stubbed auth and input data. */
function makeBundle(overrides = {}) {
  return {
    authData: {
      api_key: 'ml_test_key_abc123',
    },
    inputData: {},
    meta: { cursor: '' },
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Authentication
// ---------------------------------------------------------------------------

describe('authentication', () => {
  test('app has custom auth type', () => {
    expect(App.authentication.type).toBe('custom');
  });

  test('authentication has api_key field', () => {
    const field = App.authentication.fields.find((f) => f.key === 'api_key');
    expect(field).toBeDefined();
    expect(field.required).toBe(true);
    expect(field.type).toBe('password');
  });

  test('beforeRequest injects Authorization header', () => {
    const bundle = makeBundle();
    const request = { headers: {} };

    const [middleware] = App.authentication.beforeRequest;
    const result = middleware(request, null, bundle);

    expect(result.headers['Authorization']).toBe('Bearer ml_test_key_abc123');
    expect(result.headers['Content-Type']).toBe('application/json');
  });
});

// ---------------------------------------------------------------------------
// Triggers registration
// ---------------------------------------------------------------------------

describe('app triggers', () => {
  test('new_payment trigger is registered', () => {
    expect(App.triggers.new_payment).toBeDefined();
    expect(App.triggers.new_payment.key).toBe('new_payment');
  });

  test('new_subscription trigger is registered', () => {
    expect(App.triggers.new_subscription).toBeDefined();
    expect(App.triggers.new_subscription.key).toBe('new_subscription');
  });
});

// ---------------------------------------------------------------------------
// Creates registration
// ---------------------------------------------------------------------------

describe('app creates', () => {
  test('create_resource action is registered', () => {
    expect(App.creates.create_resource).toBeDefined();
    expect(App.creates.create_resource.key).toBe('create_resource');
  });

  test('process_payment action is registered', () => {
    expect(App.creates.process_payment).toBeDefined();
    expect(App.creates.process_payment.key).toBe('process_payment');
  });
});

// ---------------------------------------------------------------------------
// Trigger samples
// ---------------------------------------------------------------------------

describe('new_payment trigger', () => {
  const trigger = App.triggers.new_payment;

  test('sample has required fields', () => {
    const sample = trigger.operation.sample;
    expect(sample.id).toBeDefined();
    expect(sample.resource_id).toBeDefined();
    expect(sample.amount_usd).toBeDefined();
    expect(sample.status).toBeDefined();
    expect(sample.created_at).toBeDefined();
  });

  test('display has a label', () => {
    expect(trigger.display.label).toBeTruthy();
  });

  test('operation type is polling', () => {
    expect(trigger.operation.type).toBe('polling');
  });

  test('outputFields includes payer_id', () => {
    const field = trigger.operation.outputFields.find((f) => f.key === 'payer_id');
    expect(field).toBeDefined();
  });
});

describe('new_subscription trigger', () => {
  const trigger = App.triggers.new_subscription;

  test('sample has required fields', () => {
    const sample = trigger.operation.sample;
    expect(sample.id).toBeDefined();
    expect(sample.subscriber_id).toBeDefined();
    expect(sample.status).toBeDefined();
  });

  test('sample status is active', () => {
    expect(trigger.operation.sample.status).toBe('active');
  });

  test('outputFields includes plan', () => {
    const field = trigger.operation.outputFields.find((f) => f.key === 'plan');
    expect(field).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// Create action input fields
// ---------------------------------------------------------------------------

describe('create_resource action', () => {
  const action = App.creates.create_resource;

  test('requires name field', () => {
    const field = action.operation.inputFields.find((f) => f.key === 'name');
    expect(field).toBeDefined();
    expect(field.required).toBe(true);
  });

  test('requires price_usd field', () => {
    const field = action.operation.inputFields.find((f) => f.key === 'price_usd');
    expect(field).toBeDefined();
    expect(field.required).toBe(true);
    expect(field.type).toBe('number');
  });

  test('fee_model defaults to per_call', () => {
    const field = action.operation.inputFields.find((f) => f.key === 'fee_model');
    expect(field.default).toBe('per_call');
  });

  test('fee_model has choices', () => {
    const field = action.operation.inputFields.find((f) => f.key === 'fee_model');
    expect(field.choices).toContain('per_call');
    expect(field.choices).toContain('subscription');
    expect(field.choices).toContain('one_time');
  });

  test('sample has id and name', () => {
    expect(action.operation.sample.id).toBeDefined();
    expect(action.operation.sample.name).toBeDefined();
  });
});

describe('process_payment action', () => {
  const action = App.creates.process_payment;

  test('requires resource_id', () => {
    const field = action.operation.inputFields.find((f) => f.key === 'resource_id');
    expect(field).toBeDefined();
    expect(field.required).toBe(true);
  });

  test('requires payer_id', () => {
    const field = action.operation.inputFields.find((f) => f.key === 'payer_id');
    expect(field).toBeDefined();
    expect(field.required).toBe(true);
  });

  test('requires amount_usd', () => {
    const field = action.operation.inputFields.find((f) => f.key === 'amount_usd');
    expect(field).toBeDefined();
    expect(field.required).toBe(true);
    expect(field.type).toBe('number');
  });

  test('idempotency_key is optional', () => {
    const field = action.operation.inputFields.find((f) => f.key === 'idempotency_key');
    expect(field).toBeDefined();
    expect(field.required).toBeFalsy();
  });

  test('sample has status confirmed', () => {
    expect(action.operation.sample.status).toBe('confirmed');
  });
});
