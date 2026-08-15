import { NextResponse } from 'next/server';
import { currentProfile } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase-admin';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const profile = await currentProfile();
  if (!profile || !['owner', 'moderator'].includes(profile.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { id } = await params; const { aredlPlacement } = await req.json();
  if (aredlPlacement !== null && (!Number.isInteger(aredlPlacement) || aredlPlacement < 1)) return NextResponse.json({ error: 'AREDL placement must be a positive whole number.' }, { status: 400 });
  const { error } = await createAdminClient().from('levels').update({ aredl_placement: aredlPlacement }).eq('id', id);
  return error ? NextResponse.json({ error: error.message }, { status: 400 }) : NextResponse.json({ ok: true });
}
