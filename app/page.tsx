import Link from 'next/link';
import { createClient } from '@/lib/supabase-server';
import LevelListRow from '@/components/LevelListRow';

export default async function Home() {
  const db = await createClient();
  const { data: levelsData } = await db.from('levels').select('*, records(proof_url, created_at)').eq('status', 'active').order('placement', { ascending: true }).limit(100);
  const levels = levelsData ?? [];
  const { count: players } = await db.from('profiles').select('*', { count: 'exact', head: true });
  const {data:settings}=await db.from('site_settings').select('featured_level_id').eq('id',true).maybeSingle(); const featured=levels.find((x:any)=>x.id===settings?.featured_level_id);
  return <main className="wrap"><section className="hero"><span className="pill">GARBIN AFAKI • GAFK</span><h1>GAFK LIST</h1><p>A community-driven Geometry Dash difficulty list. Submit your records, follow placements and climb the leaderboard.</p><Link className="btn" href="/submit">Submit a Level</Link></section>{featured&&<section className="card" style={{marginBottom:18}}><span className="pill">FEATURED LEVEL</span><h2>#{featured.placement} — <Link href={`/levels/${featured.id}`}>{featured.name}</Link></h2><p className="muted">{featured.creator||'Unknown'} · {featured.points} points</p></section>}<section><h2>Main List</h2><div className="card">{levels.length === 0 ? <p className="muted">No levels placed yet. The list is ready for its first entry.</p> : levels.map((level: any) => <LevelListRow level={level} showStatus key={level.id} />)}</div></section><section className="grid cards" style={{ marginTop: 18 }}><div className="card"><b>{players ?? 0}</b><div className="muted">Registered players</div></div><div className="card"><b>250 max</b><div className="muted">Maximum points per level</div></div><div className="card"><b>GAFK</b><div className="muted">Owner-controlled placements</div></div></section></main>;
}
