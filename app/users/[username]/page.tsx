import { createClient } from '@/lib/supabase-server';
import { currentProfile } from '@/lib/auth';

export default async function User({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const db = await createClient();
  const { data: p } = await db.from('profiles').select('*').eq('username', username).single();
  if (!p) return <main className="wrap"><h1>User not found</h1></main>;
  const viewer = await currentProfile();
  const { data: recordsData } = await db.from('records').select('proof_url,levels(name,placement,points)').eq('player_id', p.id);
  const records = recordsData ?? [];
  const isOwnProfile = viewer?.id === p.id;
  const { data: submissionsData } = isOwnProfile ? await db.from('submissions').select('id,level_name,gd_level_id,status,record_type,progress_percent,created_at,level_id').eq('submitter_id', p.id).order('created_at', { ascending: false }) : { data: [] };
  const submissions = submissionsData ?? [];
  const statusLabel:Record<string,string>={pending:'Pending review',approved:'Accepted — waiting for placement',placed:'Accepted and placed',rejected:'Rejected'};
  const statusIcon:Record<string,string>={pending:'/submission-status/pending.png',approved:'/submission-status/accepted.png',placed:'/submission-status/accepted.png',rejected:'/submission-status/rejected.png'};
  return <main className="wrap"><div className="hero"><span className="pill">{p.role}</span><h1>{p.username}</h1><p className="muted">{p.points} GAFK Points · {records.length} records</p></div>{isOwnProfile&&<section className="card" style={{marginBottom:18}}><h2>My Submissions</h2>{submissions.length?submissions.map((s:any)=><div className="listrow submission-row" key={s.id}><img className="submission-status-icon" src={statusIcon[s.status]??statusIcon.pending} alt={statusLabel[s.status]??s.status}/><div><b>{s.level_name}</b><br/><span className="muted">ID {s.gd_level_id}</span><br/><span className="pill">{statusLabel[s.status]??s.status}</span></div><div>{s.record_type==='list_percent'?`List%: ${s.progress_percent}%`:'Completion'}</div><div>{s.level_id&&s.status==='placed'?<a href={`/levels/${s.level_id}`}>View level</a>:new Date(s.created_at).toLocaleDateString()}</div></div>):<p className="muted">You have not submitted a level yet.</p>}</section>}<div className="card"><h2>GAFK Records</h2>{records.length ? records.map((x: any) => <div className="listrow" key={x.proof_url}><div>#{x.levels?.placement || '—'}</div><div><b>{x.levels?.name}</b></div><div>{x.levels?.points ?? 0} pts</div><div><a href={x.proof_url} target="_blank" rel="noreferrer">Proof</a></div></div>) : <p className="muted">No records yet.</p>}</div></main>;
}
