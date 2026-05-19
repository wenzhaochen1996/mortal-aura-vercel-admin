import { getSupabaseAdmin, getStripe, getUserFromRequest, json, readBody } from './_lib.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });
  const body = await readBody(req);
  const user = await getUserFromRequest(req);
  const supabase = getSupabaseAdmin();
  const stripe = getStripe();

  const items = Array.isArray(body.items) ? body.items : [];
  if (!items.length) return json(res, 400, { error: 'Cart is empty' });

  const skus = items.map((item) => String(item.sku || '')).filter(Boolean);
  const { data: catalog, error: catalogError } = await supabase.from('products').select('*').in('sku', skus);
  if (catalogError) return json(res, 400, { error: catalogError.message });

  const bySku = new Map((catalog || []).map((row) => [row.sku, row]));
  const line_items = [];
  let subtotal = 0;
  const orderItems = [];

  for (const rawItem of items) {
    const sku = String(rawItem.sku || '');
    const quantity = Math.max(1, Number(rawItem.quantity || 1));
    const product = bySku.get(sku);
    if (!product) return json(res, 400, { error: `Product not found: ${sku}` });
    const amount = Number(product.price_jpy || 0);
    subtotal += amount * quantity;
    line_items.push({
      quantity,
      price_data: {
        currency: 'jpy',
        product_data: {
          name: product.title || sku,
          description: sku,
          images: product.image_url ? [product.image_url] : [],
        },
        unit_amount: amount,
      },
    });
    orderItems.push({ sku, title: product.title || sku, quantity, unit_price_jpy: amount, line_total_jpy: amount * quantity });
  }

  const shippingAddress = body.shipping_address || {};
  const orderPayload = {
    user_id: user?.id || null,
    email: String(body.email || user?.email || ''),
    status: 'pending',
    payment_status: 'unpaid',
    currency: 'JPY',
    subtotal_jpy: subtotal,
    total_jpy: subtotal,
    shipping_name: String(shippingAddress.name || ''),
    shipping_phone: String(shippingAddress.phone || ''),
    shipping_country: String(shippingAddress.country || ''),
    shipping_state_region: String(shippingAddress.state_region || ''),
    shipping_city: String(shippingAddress.city || ''),
    shipping_postal_code: String(shippingAddress.postal_code || ''),
    shipping_address_line1: String(shippingAddress.address_line1 || ''),
    shipping_address_line2: String(shippingAddress.address_line2 || ''),
    order_note: String(body.note || ''),
  };

  const { data: order, error: orderError } = await supabase.from('orders').insert(orderPayload).select('*').single();
  if (orderError) return json(res, 400, { error: orderError.message });

  const { error: itemError } = await supabase.from('order_items').insert(orderItems.map((item) => ({ ...item, order_id: order.id })));
  if (itemError) return json(res, 400, { error: itemError.message });

  const appUrl = process.env.PUBLIC_APP_URL || `https://${req.headers.host}`;
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    ui_mode: 'hosted_page',
    line_items,
    customer_email: order.email || undefined,
    success_url: `${appUrl}?checkout=success&order=${order.id}`,
    cancel_url: `${appUrl}?checkout=cancelled&order=${order.id}`,
    metadata: { order_id: order.id },
    billing_address_collection: 'required',
  });

  await supabase.from('orders').update({ stripe_checkout_session_id: session.id }).eq('id', order.id);
  return json(res, 200, { url: session.url, order_id: order.id });
}
