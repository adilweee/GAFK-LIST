import { NextResponse } from 'next/server';
import { currentProfile } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase-admin';

export async function POST(req: Request) {
  const owner = await currentProfile();
  if (!owner || owner.role !== 'owner') return NextResponse.json({ error: 'Owner only.' }, { status: 403 });
  const { enabled } = await req.json();
  if (typeof enabled !== 'boolean') return NextResponse.json({ error: 'Invalid maintenance setting.' }, { status: 400 });
  const { error } = await createAdminClient().from('site_settings').upsert({ id: true, maintenance_enabled: enabled });
  return error ? NextResponse.json({ error: error.message }, { status: 400 }) : NextResponse.json({ ok: true, enabled });
}
