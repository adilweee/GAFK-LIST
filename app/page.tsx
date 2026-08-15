import Link from 'next/link';
import { createClient } from '@/lib/supabase-server';

export default async function Home() {
  const db = await createClient();
  const { data: levelsData } = await db
    .from('levels')
    .select('*')
    .eq('status', 'active')
    .order('placement', { ascending: true })
    .limit(100);
  const levels = levelsData ?? [];
  const { count: players } = await db.from('profiles').select('*', { count: 'exact', head: true });

  return <main className="wrap">
    <section className="hero">
      <span className="pill">GARBIN AFAKI • GAFK</span>
      <h1>GAFK LIST</h1>
      <p>A community-driven Geometry Dash difficulty list. Submit your records, follow placements and climb the leaderboard.</p>
      <Link className="btn" href="/submit">Submit a Level</Link>
    </section>
    <section>
      <h2>Main List</h2>
      <div className="card">
        {levels.length === 0 ? <p className="muted">No levels placed yet. The list is ready for its first entry.</p> : levels.map((l: any) => <Link className="listrow" href={`/levels/${l.id}`} key={l.id}>
          <div className="rank">#{l.placement}</div>
          <div><b>{l.name}</b><div className="muted">{l.creator || 'Unknown creator'}</div></div>
          <div>{l.points} pts</div>
          <div className="hide-sm">{l.status}</div>
        </Link>)}
      </div>
    </section>
    <section className="grid cards" style={{ marginTop: 18 }}>
      <div className="card"><b>{players ?? 0}</b><div className="muted">Registered players</div></div>
      <div className="card"><b>250 max</b><div className="muted">Maximum points per level</div></div>
      <div className="card"><b>GAFK</b><div className="muted">Owner-controlled placements</div></div>
    </section>
  </main>;
}
