# Mainlayer Zapier Integration

Connect [Mainlayer](https://mainlayer.fr) — payment infrastructure for AI apps — to 6,000+ apps via Zapier. Automate payment workflows, subscriptions, and access control across your entire stack.

## Features

### Triggers (Polling)

| Trigger | Fires When | Output |
|---------|-----------|--------|
| **New Payment** | A payer purchases resource access | Payment ID, amount, payer, resource info |
| **New Subscription** | A subscriber signs up for a plan | Subscription details, plan info, billing period |
| **Entitlement Expired** | User access expires or is revoked | Entitlement ID, resource, expiration date |

### Actions

| Action | Does | Returns |
|--------|------|---------|
| **Process Payment** | Charge a user for resource access | Payment confirmation, entitlement ID |
| **Create Resource** | Publish a billable resource | Resource ID, pricing info, status |
| **Create Plan** | Set up recurring subscription tiers | Plan ID, billing cycle, trial info |
| **Check Entitlement** | Verify user access to a resource | Boolean, expiration date, entitlement ID |

## Quick Start

### Option 1: Zapier UI (No Code)

1. Go to [zapier.com/apps](https://zapier.com/apps) and search **Mainlayer**
2. Click **Connect** → Paste your API key from [app.mainlayer.fr/settings/api-keys](https://app.mainlayer.fr/settings/api-keys)
3. Build a Zap. Example: Slack notification on new payment
   - Trigger: "New Payment"
   - Action: "Send Channel Message" (Slack)
   - Connect message: "Payment received: {{amount_usd}} USD from {{payer_id}}"

### Option 2: CLI (Developers)

```bash
npm install -g zapier-platform-cli
zapier login

git clone https://github.com/mainlayer/mainlayer-zapier
cd mainlayer-zapier
npm install
npm test
zapier validate
zapier push
```

## Common Patterns

### Pattern 1: Notify on Payment → Send Invoice

```
Trigger: New Payment
  ↓
Action: Send Email (Gmail)
  To: {{payer_id}}
  Subject: Payment Confirmed: {{amount_usd}} USD
  Body: Your access to {{resource_name}} is active
```

### Pattern 2: Track Subscriptions → Update CRM

```
Trigger: New Subscription
  ↓
Action: Create Contact (HubSpot)
  Email: {{subscriber_id}}
  Custom: plan = {{plan}}, renewal = {{current_period_end}}
```

### Pattern 3: Revoke Access → Cleanup

```
Trigger: Entitlement Expired
  ↓
Condition: Filter if entitlement_id matches paid tier
  ↓
Action: Revoke File Access (Google Drive)
  Remove user from shared folder
```

### Pattern 4: Form Submission → Process Payment

```
Trigger: New Form Submission (Typeform)
  ↓
Action: Process Payment
  Resource ID: {{selected_product_id}}
  Payer ID: {{respondent_email}}
  Amount: {{selected_price}}
  ↓
Action: Send Confirmation (Slack/Email)
  Message: Access granted to {{respondent_name}}
```

## Configuration

### Environment Variables (Development)

```bash
# .env (not committed)
MAINLAYER_API_KEY=ml_live_xxx...
MAINLAYER_BASE_URL=https://api.mainlayer.fr  # Override for staging
ZAPIER_CLIENT_ID=your_client_id
ZAPIER_CLIENT_SECRET=your_secret
```

### Project Structure

```
mainlayer-zapier/
├── authentication.js           # API key + Bearer token auth
├── package.json               # Dependencies: zapier-platform-core v15
├── src/
│   └── index.js               # App entry point, error handling
├── triggers/
│   ├── new_payment.js         # GET /v1/payments (polling)
│   ├── new_subscription.js    # GET /v1/subscriptions (polling)
│   └── entitlement_expired.js # GET /v1/entitlements?status=expired
├── creates/
│   ├── process_payment.js     # POST /v1/payments
│   ├── create_resource.js     # POST /v1/resources
│   ├── check_entitlement.js   # POST /v1/entitlements/check
│   └── create_plan.js         # POST /v1/plans
├── test/
│   └── triggers.test.js       # Jest unit tests
└── examples/
    └── zap_workflow.md        # Real-world Zap templates
```

## API Key Management

1. **Create an API Key** at [app.mainlayer.fr/settings/api-keys](https://app.mainlayer.fr/settings/api-keys)
2. **Paste into Zapier** connection dialog
3. **Never share** your live key — keep it in environment variables only
4. **Rotate regularly** (monthly recommended)

## Error Handling

The Zapier app includes built-in error handling:

| HTTP Status | Error Type | Handling |
|------------|-----------|----------|
| 401/403 | AuthenticationError | Prompts to re-authenticate |
| 422 | ValidationError | Shows field-level error messages |
| 429 | RateLimitError | Triggers exponential backoff retry |
| 5xx | APIError | Zapier retries (3x with backoff) |

## Development

### Run Tests

```bash
npm test
```

### Validate Syntax

```bash
zapier validate
```

### Lint Code

```bash
npm run lint
```

### Local Testing (before push)

```bash
zapier test triggers/new_payment.js \
  --api-key ml_test_abc123 \
  --limit 5
```

## Deployment

```bash
# Increment version in package.json
npm version minor

# Validate
npm test && zapier validate

# Deploy to Zapier platform
zapier push

# Tag in git
git tag -a v1.x.x -m "Release Zapier v1.x.x"
git push origin --tags
```

## Troubleshooting

**Q: "Invalid API key" error**
A: Verify your key at [app.mainlayer.fr](https://app.mainlayer.fr/settings/api-keys). Check it's a live key (ml_live_...), not a test key.

**Q: Trigger not firing**
A: Zapier polls every 5 minutes by default. Try:
1. Making a test payment to ensure events exist
2. Checking Zap history for errors under "Runs"
3. Validating with `zapier test triggers/new_payment.js`

**Q: "Insufficient balance" during payment processing**
A: Ensure the payer has enough balance or credit with Mainlayer.

## Security Best Practices

- Store `MAINLAYER_API_KEY` in Zapier's secure credential store (never hardcoded)
- Use separate dev/staging/prod API keys
- Rotate keys quarterly
- Monitor usage at [app.mainlayer.fr/dashboard](https://app.mainlayer.fr/dashboard)
- Set up Slack/email alerts for large payments

## Support

- **Docs**: [docs.mainlayer.fr](https://docs.mainlayer.fr)
- **Dashboard**: [app.mainlayer.fr](https://app.mainlayer.fr)
- **Zapier Platform**: [platform.zapier.com](https://platform.zapier.com/docs)
- **Issues**: Open a GitHub issue in this repo
