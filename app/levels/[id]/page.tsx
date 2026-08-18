import { createClient } from '@/lib/supabase-server';
import Link from 'next/link';
import { currentProfile } from '@/lib/auth';
import LevelComments from '@/components/LevelComments';

export default async function Level({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await createClient();
  const { data: l } = await db.from('levels').select('*').eq('id', id).single();
  if (!l) return <main className="wrap"><h1>Level not found</h1></main>;
  const { data: recordsData } = await db.from('records').select('proof_url,created_at,record_type,progress_percent,profiles(username)').eq('level_id', id);
  const { data: historyData } = await db.from('placement_history').select('*').eq('level_id', id).order('created_at', { ascending: false });
  const { data: commentsData } = await db.from('level_comments').select('id,body,created_at,profiles(username)').eq('level_id', id).eq('hidden', false).order('created_at', { ascending: false });
  const viewer = await currentProfile();
  const records = recordsData ?? [];
  const history = historyData ?? [];
  return <main className="wrap"><div className="hero"><span className="pill">{l.status}</span><h1>#{l.placement || 'Legacy'} — {l.name}</h1><p className="muted">Creator: {l.creator || 'Unknown'} · Verifier: {l.verifier || '—'} · {l.points} points · AREDL #{l.aredl_placement ?? '—'} · List% {l.list_percent_value}%</p></div><div className="grid cards"><section className="card"><h2>Records</h2>{records.length ? records.map((x: any) => <p key={x.proof_url}><b>{x.profiles?.username ?? 'Unknown player'}</b>{x.record_type==='list_percent'?` — ${x.progress_percent}% List%`: ' — Completion'} · <a href={x.proof_url} target="_blank" rel="noreferrer">Proof</a></p>) : <p className="muted">No records yet.</p>}</section><section className="card"><h2>Placement History</h2>{history.length ? history.map((x: any) => <p key={x.id}>#{x.old_placement || '—'} → #{x.new_placement || '—'}<br /><span className="muted">{new Date(x.created_at).toLocaleDateString()}</span></p>) : <p className="muted">No changes recorded.</p>}</section></div><LevelComments levelId={id} comments={commentsData??[]} loggedIn={!!viewer}/><br /><Link className="btn secondary" href="/">Back to List</Link></main>;
}
