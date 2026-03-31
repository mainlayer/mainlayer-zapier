# Zapier Workflow Examples

This document describes example Zap workflows using the Mainlayer integration.

## Prerequisites

1. A Mainlayer account — sign up at [mainlayer.fr](https://mainlayer.fr)
2. A Mainlayer API key from your [dashboard](https://app.mainlayer.fr/settings/api-keys)
3. A Zapier account at [zapier.com](https://zapier.com)

---

## Example 1: Notify Slack on New Payment

**Trigger**: Mainlayer — New Payment
**Action**: Slack — Send Channel Message

**Use case**: Get a Slack notification every time someone pays for one of your resources.

**Setup**:
1. Add the **Mainlayer** app to Zapier and connect with your API key.
2. Choose trigger: **New Payment**.
3. Test the trigger — Zapier will fetch a recent payment from your account.
4. Add a Slack action. Map the fields:
   - Message: `New payment received! Resource: {{resource_name}}, Amount: ${{amount_usd}}, Payer: {{payer_id}}`
5. Turn on the Zap.

---

## Example 2: Add New Subscriber to Mailchimp

**Trigger**: Mainlayer — New Subscription
**Action**: Mailchimp — Add/Update Subscriber

**Use case**: Automatically add paying subscribers to your marketing list.

**Setup**:
1. Choose trigger: **New Subscription**.
2. Add Mailchimp action. Map:
   - Email: `{{subscriber_id}}` (if subscriber_id is an email address)
   - Tags: `mainlayer-subscriber, {{plan}}`
3. Turn on the Zap.

---

## Example 3: Create a Resource from a Google Sheet Row

**Trigger**: Google Sheets — New Row
**Action**: Mainlayer — Create Resource

**Use case**: Maintain a spreadsheet of APIs you want to monetize and auto-publish them.

**Google Sheet columns**: `name`, `description`, `price_usd`, `fee_model`

**Setup**:
1. Configure the Google Sheets trigger for your spreadsheet.
2. Choose action: **Create Resource**.
3. Map columns:
   - Resource Name: `{{name}}`
   - Description: `{{description}}`
   - Price (USD): `{{price_usd}}`
   - Fee Model: `{{fee_model}}`
4. Turn on the Zap.

---

## Example 4: Process Payment on Typeform Submission

**Trigger**: Typeform — New Entry
**Action**: Mainlayer — Process Payment

**Use case**: Collect user details via Typeform and immediately grant them access.

**Setup**:
1. Configure the Typeform trigger for your form.
2. Choose action: **Process Payment**.
3. Map fields:
   - Resource ID: `res_your_resource_id` (hardcoded or from a hidden field)
   - Payer ID: `{{email}}` (from the form)
   - Amount (USD): `0.99`
4. Turn on the Zap.

---

## Tips

- Use **Zapier Filters** between steps to only proceed when `status = confirmed`.
- Add a **Delay** step if you want to wait before sending follow-up emails.
- Chain multiple actions in a single Zap: e.g. Process Payment → Send Email → Update CRM.
