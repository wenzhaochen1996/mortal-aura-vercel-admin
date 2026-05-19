import { getSupabaseAdmin, json, readBody, requireAdmin } from './_lib.js';

export default async function handler(req, res) {
  const { isAdmin } = await requireAdmin(req);
  if (!isAdmin) return json(res, 403, { error: 'Forbidden' });
  const supabase = getSupabaseAdmin();

  if (req.method === 'GET') {
    const { data, error } = await supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false }).limit(100);
    if (error) return json(res, 400, { error: error.message });
    return json(res, 200, { orders: data || [] });
  }

  if (req.method === 'PATCH') {
    const body = await readBody(req);
    const { data, error } = await supabase.from('orders').update({
      status: body.status,
      fulfillment_status: body.fulfillment_status,
      tracking_number: body.tracking_number || null,
      updated_at: new Date().toISOString(),
    }).eq('id', body.id).select('*').single();
    if (error) return json(res, 400, { error: error.message });
    return json(res, 200, { order: data });
  }

  return json(res, 405, { error: 'Method not allowed' });
}
