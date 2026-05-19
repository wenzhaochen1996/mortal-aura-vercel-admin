import { getSupabaseAdmin, getUserFromRequest, json, readBody } from './_lib.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });
  const user = await getUserFromRequest(req);
  if (!user) return json(res, 401, { error: 'Unauthorized' });
  const body = await readBody(req);
  const supabase = getSupabaseAdmin();
  const payload = {
    id: user.id,
    email: user.email,
    full_name: String(body.full_name || ''),
    phone: String(body.phone || ''),
    updated_at: new Date().toISOString(),
  };
  const { data, error } = await supabase.from('profiles').upsert(payload).select('*').single();
  if (error) return json(res, 400, { error: error.message });
  return json(res, 200, { profile: data });
}
