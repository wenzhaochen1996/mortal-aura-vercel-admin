import { getStripe, getSupabaseAdmin } from './_lib.js';

export const config = { api: { bodyParser: false } };

async function rawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    return res.end('Method not allowed');
  }

  const stripe = getStripe();
  const supabase = getSupabaseAdmin();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = req.headers['stripe-signature'];
  let event;

  try {
    const body = await rawBody(req);
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch (err) {
    res.statusCode = 400;
    return res.end(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.metadata?.order_id;
    if (orderId) {
      await supabase
        .from('orders')
        .update({
          status: 'paid',
          payment_status: 'paid',
          stripe_payment_intent_id: session.payment_intent || null,
          paid_at: new Date().toISOString(),
        })
        .eq('id', orderId);
    }
  }

  res.statusCode = 200;
  res.end('ok');
}
