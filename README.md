# Mortal Aura — storefront + backend pack

This package has been upgraded from a static storefront into a Vercel-compatible full-stack structure:

- Frontend storefront: Vite + React
- Customer accounts: Supabase Auth
- Address book / order history: Supabase Postgres + Vercel API
- Checkout: Stripe Checkout
- Admin dashboard: `/admin.html`
- Existing content editor: `?admin=1`

## Included backend pieces

- Customer sign up / log in
- Saved shipping addresses
- Stripe checkout session creation
- Order creation and Stripe webhook payment confirmation
- Order history for logged-in customers
- Separate admin order dashboard

## Files added

- `src/lib/supabaseClient.js`
- `api/*.js`
- `supabase/schema.sql`
- `supabase/seed-products.sql`
- `public/admin.html`

## Required environment variables

Copy `.env.example` and set:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `PUBLIC_APP_URL`

On Vercel, add them in Project Settings → Environment Variables, then redeploy. Vercel environment variables are configured outside source code and take effect on new deployments after redeploy. citeturn756993search0turn756993search5

## Supabase setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL editor.
3. Run `supabase/seed-products.sql` to seed the product catalog used for checkout.
4. Create your first admin user in Supabase Auth.
5. Insert that user's UUID into `admin_users`.

Supabase Auth supports password-based auth and other sign-in methods; this package uses email/password out of the box. citeturn756993search4turn756993search16

## Stripe setup

1. Create a Stripe account and get your secret key.
2. Add a webhook endpoint pointing to `/api/stripe-webhook`.
3. Subscribe at minimum to `checkout.session.completed`.
4. Paste the webhook signing secret into `STRIPE_WEBHOOK_SECRET`.

Stripe Checkout Sessions are intended to be created server-side for each payment attempt. citeturn756993search3turn756993search6

## Deploy

1. Upload the package to GitHub.
2. Import the repo into Vercel.
3. Build command: `npm run build`
4. Output directory: `dist`
5. Set environment variables in Vercel.
6. Redeploy.

Vercel supports runtime and build-time environment variables across local, preview, and production environments. citeturn756993search8turn756993search17

## Notes

- The existing visual CMS editor is still configuration-based. It edits site content, not database records.
- Checkout now expects the `products` table to be the payment source of truth.
- The Stripe API recently changed some `ui_mode` enum values; this package uses the current hosted-page naming. citeturn756993search12
