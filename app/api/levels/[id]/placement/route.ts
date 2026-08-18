import { NextResponse } from 'next/server';
import { currentProfile } from '@/lib/auth';
import { pointsForPlacement, rebuildPlayerPoints } from '@/lib/points';
import { createAdminClient } from '@/lib/supabase-admin';
import { logActivity, notify } from '@/lib/activity';
import { discordNotice } from '@/lib/discord';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const profile = await currentProfile();
  if (!profile || !['owner', 'moderator'].includes(profile.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { id } = await params;
  const { placement } = await req.json();
  if (!Number.isInteger(placement) || placement < 1) return NextResponse.json({ error: 'Placement must be a positive whole number.' }, { status: 400 });
  const db = createAdminClient();
  const { data: target } = await db.from('levels').select('*').eq('id', id).eq('status', 'active').single();
  if (!target) return NextResponse.json({ error: 'Active level not found.' }, { status: 404 });
  const { data: placed } = await db.from('levels').select('id, placement').eq('status', 'active').not('placement', 'is', null).order('placement');
  const withoutTarget = (placed ?? []).filter((level) => level.id !== target.id);
  if (placement > withoutTarget.length + 1) return NextResponse.json({ error: `Placement can be between #1 and #${withoutTarget.length + 1}.` }, { status: 400 });
  const ordered = [...withoutTarget]; ordered.splice(placement - 1, 0, { id: target.id, placement: null });
  for (const level of ordered) { const result = await db.from('levels').update({ placement: -Number(level.id) }).eq('id', level.id); if (result.error) return NextResponse.json({ error: result.error.message }, { status: 400 }); }
  for (const [index, level] of ordered.entries()) { const finalPlacement = index + 1; const result = await db.from('levels').update({ placement: finalPlacement, points: pointsForPlacement(finalPlacement), updated_at: new Date().toISOString() }).eq('id', level.id); if (result.error) return NextResponse.json({ error: result.error.message }, { status: 400 }); }
  const history = await db.from('placement_history').insert({ level_id: target.id, old_placement: target.placement, new_placement: placement, changed_by: profile.id });
  if (history.error) return NextResponse.json({ error: history.error.message }, { status: 400 });
  const { data: submitters } = await db.from('submissions').select('submitter_id').eq('level_id', target.id).neq('status', 'rejected');
  for (const row of submitters ?? []) await notify(row.submitter_id, 'Level placed', `${target.name} was placed at #${placement}.`, `/levels/${target.id}`);
  await logActivity(profile.id, 'changed placement', 'level', target.id, `${target.name}: #${target.placement ?? 'new'} → #${placement}`);
  await discordNotice(`${target.name} was placed at #${placement}.`);
  await rebuildPlayerPoints(); return NextResponse.json({ ok: true });
}
