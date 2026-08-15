import { NextResponse } from 'next/server';
import { currentProfile } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase-admin';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const owner = await currentProfile();
  if (!owner || owner.role !== 'owner') return NextResponse.json({ error: 'Owner only.' }, { status: 403 });
  const { role } = await req.json();
  if (!['user', 'moderator'].includes(role)) return NextResponse.json({ error: 'Only user and moderator roles can be assigned.' }, { status: 400 });
  const { id } = await params;
  if (id === owner.id) return NextResponse.json({ error: 'The owner role cannot be changed here.' }, { status: 400 });
  const db = createAdminClient();
  const { error } = await db.from('profiles').update({ role }).eq('id', id);
  return error ? NextResponse.json({ error: error.message }, { status: 400 }) : NextResponse.json({ ok: true });
}
