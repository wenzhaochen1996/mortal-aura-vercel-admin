import { getSupabaseAdmin, getUserFromRequest, json } from './_lib.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return json(res, 405, { error: 'Method not allowed' });
  const user = await getUserFromRequest(req);
  if (!user) return json(res, 401, { error: 'Unauthorized' });

  const supabase = getSupabaseAdmin();
  const [{ data: profile }, { data: addresses }, { data: orders }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
    supabase.from('customer_addresses').select('*').eq('user_id', user.id).order('is_default', { ascending: false }).order('created_at', { ascending: false }),
    supabase.from('orders').select('*, order_items(*)').eq('user_id', user.id).order('created_at', { ascending: false }).limit(20),
  ]);

  return json(res, 200, { profile: profile || null, addresses: addresses || [], orders: orders || [] });
}
