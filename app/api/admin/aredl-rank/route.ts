import { NextResponse } from 'next/server';
import { currentProfile } from '@/lib/auth';
import { pointsForPlacement, rebuildPlayerPoints } from '@/lib/points';
import { createAdminClient } from '@/lib/supabase-admin';

export async function POST() {
  const profile = await currentProfile();
  if (!profile || !['owner', 'moderator'].includes(profile.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const db = createAdminClient();
  const { data: levels } = await db.from('levels').select('id, placement, aredl_placement').eq('status', 'active').not('placement', 'is', null).order('placement');
  const ordered = [...(levels ?? [])].sort((a, b) => (a.aredl_placement ?? Number.MAX_SAFE_INTEGER) - (b.aredl_placement ?? Number.MAX_SAFE_INTEGER) || a.placement - b.placement);
  if (!ordered.some((level) => level.aredl_placement !== null)) return NextResponse.json({ error: 'Add at least one AREDL placement first.' }, { status: 400 });
  for (const level of ordered) { const result = await db.from('levels').update({ placement: -Number(level.id) }).eq('id', level.id); if (result.error) return NextResponse.json({ error: result.error.message }, { status: 400 }); }
  for (const [index, level] of ordered.entries()) { const placement = index + 1; const result = await db.from('levels').update({ placement, points: pointsForPlacement(placement) }).eq('id', level.id); if (result.error) return NextResponse.json({ error: result.error.message }, { status: 400 }); }
  await rebuildPlayerPoints(); return NextResponse.json({ ok: true, updated: ordered.length });
}
