import { getSupabaseAdmin, getUserFromRequest, json, readBody } from './_lib.js';

export default async function handler(req, res) {
  const user = await getUserFromRequest(req);
  if (!user) return json(res, 401, { error: 'Unauthorized' });
  const supabase = getSupabaseAdmin();

  if (req.method === 'POST') {
    const body = await readBody(req);
    if (body.is_default) {
      await supabase.from('customer_addresses').update({ is_default: false }).eq('user_id', user.id);
    }
    const payload = {
      id: body.id || undefined,
      user_id: user.id,
      label: String(body.label || 'Default'),
      recipient_name: String(body.recipient_name || ''),
      phone: String(body.phone || ''),
      country: String(body.country || ''),
      state_region: String(body.state_region || ''),
      city: String(body.city || ''),
      postal_code: String(body.postal_code || ''),
      address_line1: String(body.address_line1 || ''),
      address_line2: String(body.address_line2 || ''),
      is_default: Boolean(body.is_default),
      updated_at: new Date().toISOString(),
    };
    const { data, error } = await supabase.from('customer_addresses').upsert(payload).select('*').single();
    if (error) return json(res, 400, { error: error.message });
    return json(res, 200, { address: data });
  }

  if (req.method === 'DELETE') {
    const body = await readBody(req);
    if (!body.id) return json(res, 400, { error: 'Address id required' });
    const { error } = await supabase.from('customer_addresses').delete().eq('id', body.id).eq('user_id', user.id);
    if (error) return json(res, 400, { error: error.message });
    return json(res, 200, { ok: true });
  }

  return json(res, 405, { error: 'Method not allowed' });
}
