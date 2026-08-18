import { NextResponse } from 'next/server';
import { currentProfile } from '@/lib/auth';
import { rebuildPlayerPoints } from '@/lib/points';
import { createAdminClient } from '@/lib/supabase-admin';
import { logActivity, notify } from '@/lib/activity';
import { discordNotice } from '@/lib/discord';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const reviewer = await currentProfile();
  if (!reviewer || reviewer.role !== 'owner') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { id } = await params;
  const { decision } = await req.json();
  if (!['approve', 'reject'].includes(decision)) return NextResponse.json({ error: 'Invalid review action.' }, { status: 400 });

  const db = createAdminClient();
  const { data: submission } = await db.from('submissions').select('*').eq('id', id).single();
  if (!submission || submission.status !== 'pending') return NextResponse.json({ error: 'Submission is no longer pending.' }, { status: 404 });

  if (decision === 'reject') {
    const { error } = await db.from('submissions').update({ status: 'rejected', reviewer_id: reviewer.id, reviewed_at: new Date().toISOString() }).eq('id', id);
    if (!error) { await notify(submission.submitter_id, 'Submission rejected', `${submission.level_name} was rejected.`, `/users/${encodeURIComponent((await db.from('profiles').select('username').eq('id', submission.submitter_id).single()).data?.username ?? '')}`); await logActivity(reviewer.id, 'rejected submission', 'submission', id, submission.level_name); await discordNotice(`Submission rejected: ${submission.level_name}`); }
    return error ? NextResponse.json({ error: error.message }, { status: 400 }) : NextResponse.json({ ok: true });
  }

  let { data: level } = await db.from('levels').select('*').eq('gd_level_id', submission.gd_level_id).maybeSingle();
  if (!level) {
    const created = await db.from('levels').insert({
      gd_level_id: submission.gd_level_id,
      name: submission.level_name,
      creator: submission.creator || null,
      verifier: submission.verifier || null,
      placement: null,
      points: 0,
      status: submission.record_type === 'list_percent' ? 'list_percent' : 'active',
    }).select().single();
    if (created.error) return NextResponse.json({ error: created.error.message }, { status: 400 });
    level = created.data;
  }

  const record = await db.from('records').upsert({ level_id: level.id, player_id: submission.submitter_id, submission_id: submission.id, proof_url: submission.youtube_url, record_type: submission.record_type, progress_percent: submission.progress_percent }, { onConflict: 'level_id,player_id' });
  if (record.error) return NextResponse.json({ error: record.error.message }, { status: 400 });
  const updated = await db.from('submissions').update({ status: level.placement ? 'placed' : 'approved', level_id: level.id, reviewer_id: reviewer.id, reviewed_at: new Date().toISOString() }).eq('id', id);
  if (updated.error) return NextResponse.json({ error: updated.error.message }, { status: 400 });
  await notify(submission.submitter_id, 'Submission accepted', level.placement ? `${submission.level_name} is now placed.` : `${submission.level_name} is waiting for placement.`, `/levels/${level.id}`);
  await logActivity(reviewer.id, 'approved submission', 'submission', id, submission.level_name);
  await discordNotice(`Submission accepted: ${submission.level_name}`);
  await rebuildPlayerPoints();
  return NextResponse.json({ ok: true, placementPending: !level.placement });
}
