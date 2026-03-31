# Mainlayer Zapier Integration

Connect [Mainlayer](https://mainlayer.fr) — payment infrastructure for apps and AI agents — to 6,000+ apps with Zapier.

## What You Can Do

| Type | Name | Description |
|------|------|-------------|
| Trigger | **New Payment** | Fires when a payment is received for one of your resources |
| Trigger | **New Subscription** | Fires when someone subscribes to a subscription resource |
| Action | **Create Resource** | Publishes a new billable resource to the Mainlayer catalog |
| Action | **Process Payment** | Charges a payer for access to a resource |

## Installation

### Via Zapier (no-code)

1. Go to [zapier.com/apps](https://zapier.com/apps) and search for **Mainlayer**.
2. Click **Connect** and enter your Mainlayer API key.
3. Build your Zap using the triggers and actions listed above.

### Via CLI (developers)

```bash
npm install -g zapier-platform-cli
zapier login

git clone https://github.com/mainlayer/mainlayer-zapier.git
cd mainlayer-zapier
npm install
zapier push
```

## Authentication

All requests use API key authentication. Obtain your key from the
[Mainlayer dashboard](https://app.mainlayer.fr/settings/api-keys) under
**Settings → API Keys**.

## Example Workflows

See [examples/zap_workflow.md](examples/zap_workflow.md) for step-by-step
instructions for common automation patterns:

- Notify Slack when a payment arrives
- Add new subscribers to Mailchimp
- Publish resources from a Google Sheet
- Process payments on form submission

## Development

### Prerequisites

- Node.js >= 18
- A Mainlayer account

### Setup

```bash
npm install
```

### Run Tests

```bash
npm test
```

### Validate App Definition

```bash
npm install -g zapier-platform-cli
zapier validate
```

### Project Structure

```
├── authentication.js       # API key auth flow
├── src/
│   └── index.js            # App entry point
├── triggers/
│   ├── new_payment.js      # New Payment trigger
│   └── new_subscription.js # New Subscription trigger
├── creates/
│   ├── create_resource.js  # Create Resource action
│   └── process_payment.js  # Process Payment action
├── test/
│   └── triggers.test.js    # Jest tests
└── examples/
    └── zap_workflow.md     # Example Zap workflows
```

## Links

- [Mainlayer Documentation](https://docs.mainlayer.fr)
- [Mainlayer Dashboard](https://app.mainlayer.fr)
- [Zapier Platform Docs](https://platform.zapier.com/docs)
