# North AI — $49 2027 Creative Strategy landing page

Next.js 16 (App Router) + TypeScript + Tailwind v4. Long-form sales page with a 3-step modal funnel:

1. **Details** → lead saved to your CRM, Meta `Lead` (Pixel + CAPI)
2. **Order** → Stripe Payment Element, $49 USD; Meta `InitiateCheckout` (Pixel + CAPI)
3. **Book call** (only after Stripe confirms) → Calendly inline embed, prefilled; Meta `Purchase` (Pixel in browser + CAPI from the Stripe webhook, same `event_id`) and `Schedule` on booking

## Run locally

```bash
cp .env.example .env.local   # fill in keys
npm install
npm run dev
```

Forward Stripe webhooks while developing:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Test card: `4242 4242 4242 4242`, any future date, any CVC.

## Environment variables

See `.env.example`. `NEXT_PUBLIC_*` values are baked in at build time, so redeploy after changing them.

| Variable | Purpose |
|---|---|
| `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe API keys |
| `STRIPE_WEBHOOK_SECRET` | Signing secret of the webhook endpoint |
| `NEXT_PUBLIC_META_PIXEL_ID`, `META_CAPI_TOKEN` | Meta Pixel + Conversions API |
| `META_TEST_EVENT_CODE` | Optional: route CAPI events to Events Manager "Test events" |
| `NEXT_PUBLIC_REQUIRE_CONSENT` | `true` (default): cookie banner; Pixel and CAPI only fire after consent |
| `CRM_WEBHOOK_URL`, `CRM_WEBHOOK_SECRET` | Where leads are POSTed (see below) |
| `NEXT_PUBLIC_CALENDLY_URL` | Calendly event link |
| `NEXT_PUBLIC_SPOTS_LEFT`, `NEXT_PUBLIC_SPOTS_CAPACITY` | Scarcity counter (default 6 of 10) |
| `NEXT_PUBLIC_TERMS_URL`, `NEXT_PUBLIC_PRIVACY_URL`, `NEXT_PUBLIC_COOKIE_URL` | Footer legal links |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for metadata and sitemap |

## Stripe

- The charge is a PaymentIntent for 4900 USD created server-side in `app/api/checkout` (the amount can't be changed from the browser). The Payment Element runs in deferred-intent mode, so the intent is only created when the buyer clicks **Complete order**.
- Lead details, UTMs, and the browser context Meta needs (`fbp`, `fbc`, IP, user agent, consent) are stored in the PaymentIntent metadata. The webhook reads them back.
- Create a webhook endpoint at `https://<your-domain>/api/stripe/webhook` that listens for **`payment_intent.succeeded`**, and put its signing secret in `STRIPE_WEBHOOK_SECRET`.
- Redirect-based methods (bank redirects, some wallets) return to `/?checkout=return…`. The page checks the PaymentIntent and resumes at step 3, or at step 2 with an error.

## Meta Pixel + Conversions API

| Event | Browser | Server (CAPI) | event_id |
|---|---|---|---|
| PageView | on load (after consent) | — | — |
| ViewContent | hero video first plays | `/api/track` | random, shared |
| Lead | step 1 submit | `/api/lead` | `lead_<uuid>` |
| InitiateCheckout | step 2 shown | `/api/track` | `initiatecheckout_<uuid>` |
| Purchase | payment success | Stripe webhook | `purchase_<payment_intent_id>` |
| Schedule | `calendly.event_scheduled` | `/api/track` | `schedule_<payment_intent_id>` |

CAPI sends SHA-256-hashed email, phone, first and last name, `external_id`, plus `fbp`/`fbc`, client IP, and user agent. If someone lands with `?fbclid=` and consents later, `_fbc` is still set from the stored click ID. To verify, use Events Manager → Test events (set `META_TEST_EVENT_CODE`) and check that browser and server events show as deduplicated.

## CRM

Every lead event is a JSON `POST` to `CRM_WEBHOOK_URL`, with an `X-Webhook-Secret` header if `CRM_WEBHOOK_SECRET` is set. This works with a GoHighLevel inbound webhook, a HubSpot workflow webhook, a Zapier or Make catch hook, Airtable automations, and similar tools.

```json
{
  "event": "lead.created",          // then "order.paid", then "call.booked"
  "occurred_at": "2026-11-09T18:02:06.119Z",
  "source": "strategy-landing",
  "full_name": "Jane Smith", "first_name": "Jane", "last_name": "Smith",
  "email": "jane@company.com",
  "phone": "+447911123456",          // E.164
  "tags": ["2027-strategy", "lead.created"],
  "page_url": "...", "utm_source": "...", "utm_medium": "...", "utm_campaign": "...", "utm_content": "...", "utm_term": "...", "fbclid": "..."
}
```

`order.paid` adds `amount`, `currency`, `product`, and `stripe_payment_intent`. `call.booked` adds the Calendly event and invitee URIs. Upsert contacts on `email`. The lead is sent at step 1, before payment, so abandoned checkouts can be retargeted.

## Deploy to Vercel

1. Import the repo at vercel.com/new (framework preset: Next.js; no other settings needed).
2. Add the environment variables above for Production (use test keys on Preview).
3. Deploy, then add the custom domain (for example `strategy.north-ai.com`) under Project → Domains.
4. Point the Stripe webhook at `https://<domain>/api/stripe/webhook`, and add the domain to Meta Events Manager and to the Stripe Payment Method Domains (needed for Apple Pay / Google Pay).

Or deploy from the CLI: `npx vercel link`, then `npx vercel env add …`, then `npx vercel --prod`.

## Before launch

- Replace `/public/brands/*.png` (low-res crops) with vector originals.
- Set real legal URLs, and check the scarcity count and the comparison/outcome claims with North AI.
- Run Stripe end to end in test mode, then switch to live keys and a live webhook.
