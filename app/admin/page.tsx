import { createAdminClient } from '@/lib/supabase-admin';
import { currentProfile } from '@/lib/auth';
import Link from 'next/link';

export default async function Admin() {
  const p = await currentProfile();
  if (!p || !['owner', 'moderator'].includes(p.role)) {
    return <main className="wrap"><h1>403</h1><p>Admin access required.</p></main>;
  }

  const db = createAdminClient();
  let subs: any[] = [];

  if (p.role === 'owner') {
    const { data } = await db
      .from('submissions')
      .select('*, profiles(username)')
      .order('created_at', { ascending: false });
    subs = data ?? [];
  }

  const { data: pendingData } = await db
    .from('levels')
    .select('*')
    .is('placement', null)
    .eq('status', 'active')
    .order('created_at', { ascending: true });
  const pending = pendingData ?? [];

  return (
    <main className="wrap">
      <h1>{p.role === 'owner' ? 'Owner' : 'Moderator'} Panel</h1>
      <div className="grid cards">
        <div className="card"><h2>Submissions</h2><b>{subs.length}</b></div>
        <div className="card"><h2>Placement Queue</h2><b>{pending.length}</b></div>
      </div>

      {p.role === 'owner' && (
        <section style={{ marginTop: 20 }}>
          <h2>Pending Submissions</h2>
          {subs.filter((s) => s.status === 'pending').map((s) => (
            <div className="card" key={s.id} style={{ marginBottom: 10 }}>
              <b>{s.level_name}</b>
              <p className="muted">ID {s.gd_level_id} · submitted by {s.profiles?.username ?? 'Unknown user'}</p>
              <a className="btn secondary" href={s.youtube_url} target="_blank" rel="noreferrer">Watch Proof</a>
            </div>
          ))}
          {subs.filter((s) => s.status === 'pending').length === 0 && <p className="muted">No pending submissions.</p>}
        </section>
      )}

      <section style={{ marginTop: 20 }}>
        <h2>Placement Queue</h2>
        {pending.length === 0 && <p className="muted">No levels are waiting for placement.</p>}
        {pending.map((l: any) => (
          <div className="card" key={l.id} style={{ marginBottom: 10 }}>
            <b>{l.name}</b>
            <p className="muted">{l.creator || 'Unknown creator'} · {l.points} pts</p>
            <Link className="btn" href={`/admin/placement/${l.id}`}>Set Placement</Link>
          </div>
        ))}
      </section>
    </main>
  );
}
