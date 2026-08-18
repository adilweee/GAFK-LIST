import { createClient } from '@/lib/supabase-server';
import { currentProfile } from '@/lib/auth';
import ProfileEditor from '@/components/ProfileEditor';

export default async function User({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const db = await createClient();
  const { data: p } = await db.from('profiles').select('*').eq('username', username).single();
  if (!p) return <main className="wrap"><h1>User not found</h1></main>;
  const viewer = await currentProfile();
  const { data: recordsData } = await db.from('records').select('proof_url,levels(name,placement,points)').eq('player_id', p.id);
  const records = recordsData ?? [];
  const completed:any[] = records.filter((x:any)=>x.levels?.placement); const hardest:any = [...completed].sort((a:any,b:any)=>(a.levels?.placement??99999)-(b.levels?.placement??99999))[0]; const bestPoints:any = [...completed].sort((a:any,b:any)=>(b.levels?.points??0)-(a.levels?.points??0))[0];
  const isOwnProfile = viewer?.id === p.id;
  const { data: submissionsData } = isOwnProfile ? await db.from('submissions').select('id,level_name,gd_level_id,status,record_type,progress_percent,created_at,level_id').eq('submitter_id', p.id).order('created_at', { ascending: false }) : { data: [] };
  const submissions = submissionsData ?? [];
  const { data: notificationData } = isOwnProfile ? await db.from('notifications').select('id,title,body,href,created_at').order('created_at',{ascending:false}).limit(20) : { data: [] };
  const notifications = notificationData ?? [];
  const statusLabel:Record<string,string>={pending:'Pending review',approved:'Accepted — waiting for placement',placed:'Accepted and placed',rejected:'Rejected'};
  const statusIcon:Record<string,string>={pending:'/submission-status/pending.png',approved:'/submission-status/accepted.png',placed:'/submission-status/accepted.png',rejected:'/submission-status/rejected.png'};
  return <main className="wrap">{p.banner_url&&<img className="profile-banner" src={p.banner_url} alt=""/>}<div className="hero">{p.avatar_url&&<img className="profile-avatar" src={p.avatar_url} alt=""/>}<span className="pill">{p.role}</span><h1>{p.username}</h1>{p.bio&&<p>{p.bio}</p>}<p className="muted">{p.points} GAFK Points · {records.length} records</p></div><section className="grid cards" style={{marginBottom:18}}><div className="card"><b>{completed.length}</b><div className="muted">Completions</div></div><div className="card"><b>{hardest?.levels?.name??'—'}</b><div className="muted">Hardest: #{hardest?.levels?.placement??'—'}</div></div><div className="card"><b>{bestPoints?.levels?.name??'—'}</b><div className="muted">Most points: {bestPoints?.levels?.points??0}</div></div></section>{isOwnProfile&&<><ProfileEditor profile={p}/><section className="card" style={{marginBottom:18}}><h2>Notifications</h2>{notifications.length?notifications.map(n=><p key={n.id}><b>{n.title}</b> — {n.body} {n.href&&<a href={n.href}>Open</a>}</p>):<p className="muted">No notifications yet.</p>}</section><section className="card" style={{marginBottom:18}}><h2>My Submissions</h2>{submissions.length?submissions.map((s:any)=><div className="listrow submission-row" key={s.id}><img className="submission-status-icon" src={statusIcon[s.status]??statusIcon.pending} alt={statusLabel[s.status]??s.status}/><div><b>{s.level_name}</b><br/><span className="muted">ID {s.gd_level_id}</span><br/><span className="pill">{statusLabel[s.status]??s.status}</span></div><div>{s.record_type==='list_percent'?`List%: ${s.progress_percent}%`:'Completion'}</div><div>{s.level_id&&s.status==='placed'?<a href={`/levels/${s.level_id}`}>View level</a>:new Date(s.created_at).toLocaleDateString()}</div></div>):<p className="muted">You have not submitted a level yet.</p>}</section></>}<div className="card"><h2>GAFK Records</h2>{records.length ? records.map((x: any) => <div className="listrow" key={x.proof_url}><div>#{x.levels?.placement || '—'}</div><div><b>{x.levels?.name}</b></div><div>{x.levels?.points ?? 0} pts</div><div><a href={x.proof_url} target="_blank" rel="noreferrer">Proof</a></div></div>) : <p className="muted">No records yet.</p>}</div></main>;
}
