import { NextResponse } from 'next/server';
import { currentProfile } from '@/lib/auth';
import { pointsForPlacement, rebuildPlayerPoints } from '@/lib/points';
import { createAdminClient } from '@/lib/supabase-admin';

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const owner = await currentProfile();
  if (!owner || owner.role !== 'owner') return NextResponse.json({ error: 'Owner only.' }, { status: 403 });
  const { id } = await params;
  const db = createAdminClient();
  const deleted = await db.from('levels').delete().eq('id', id);
  if (deleted.error) return NextResponse.json({ error: deleted.error.message }, { status: 400 });
  const { data: remaining } = await db.from('levels').select('id').eq('status', 'active').not('placement', 'is', null).order('placement');
  for (const level of remaining ?? []) { const result = await db.from('levels').update({ placement: -Number(level.id) }).eq('id', level.id); if (result.error) return NextResponse.json({ error: result.error.message }, { status: 400 }); }
  for (const [index, level] of (remaining ?? []).entries()) { const placement = index + 1; const result = await db.from('levels').update({ placement, points: pointsForPlacement(placement) }).eq('id', level.id); if (result.error) return NextResponse.json({ error: result.error.message }, { status: 400 }); }
  await rebuildPlayerPoints();
  return NextResponse.json({ ok: true });
}
