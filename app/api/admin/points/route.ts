import { NextResponse } from 'next/server';
import { currentProfile } from '@/lib/auth';
import { pointsForPlacement, rebuildPlayerPoints } from '@/lib/points';
import { createAdminClient } from '@/lib/supabase-admin';

export async function POST() {
  const owner = await currentProfile();
  if (!owner || owner.role !== 'owner') return NextResponse.json({ error: 'Owner only.' }, { status: 403 });
  const db = createAdminClient();
  const { data: levels } = await db.from('levels').select('id, placement').eq('status', 'active').not('placement', 'is', null);
  for (const level of levels ?? []) {
    const result = await db.from('levels').update({ points: pointsForPlacement(level.placement) }).eq('id', level.id);
    if (result.error) return NextResponse.json({ error: result.error.message }, { status: 400 });
  }
  await rebuildPlayerPoints();
  return NextResponse.json({ ok: true, updated: levels?.length ?? 0 });
}
