import { createClient } from '@/lib/supabase-server';

export default async function User({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const db = await createClient();
  const { data: p } = await db.from('profiles').select('*').eq('username', username).single();
  if (!p) return <main className="wrap"><h1>User not found</h1></main>;
  const { data: recordsData } = await db.from('records').select('proof_url,levels(name,placement,points)').eq('player_id', p.id);
  const records = recordsData ?? [];
  return <main className="wrap"><div className="hero"><span className="pill">{p.role}</span><h1>{p.username}</h1><p className="muted">{p.points} GAFK Points · {records.length} records</p></div><div className="card"><h2>GAFK Records</h2>{records.length ? records.map((x: any) => <div className="listrow" key={x.proof_url}><div>#{x.levels?.placement || '—'}</div><div><b>{x.levels?.name}</b></div><div>{x.levels?.points ?? 0} pts</div><div><a href={x.proof_url} target="_blank" rel="noreferrer">Proof</a></div></div>) : <p className="muted">No records yet.</p>}</div></main>;
}
