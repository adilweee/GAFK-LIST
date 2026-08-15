import { NextResponse } from 'next/server';
import { currentProfile } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase-admin';

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const owner = await currentProfile();
  if (!owner || owner.role !== 'owner') return NextResponse.json({ error: 'Owner only.' }, { status: 403 });
  const { id } = await params;
  if (id === owner.id) return NextResponse.json({ error: 'Owner account cannot be deleted here.' }, { status: 400 });
  const db = createAdminClient();
  const { error } = await db.auth.admin.deleteUser(id);
  return error ? NextResponse.json({ error: error.message }, { status: 400 }) : NextResponse.json({ ok: true });
}
