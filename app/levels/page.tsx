import { createClient } from '@/lib/supabase-server';
import Link from 'next/link';

export default async function Levels() {
  const db = await createClient();
  const { data } = await db.from('levels').select('*').eq('status', 'active').order('placement', { ascending: true }).limit(500);
  const levels = data ?? [];
  return <main className="wrap"><h1>GAFK Levels</h1><div className="card">{levels.length ? levels.map((l: any) => <Link className="listrow" href={`/levels/${l.id}`} key={l.id}><div>#{l.placement}</div><div><b>{l.name}</b><div className="muted">{l.creator || 'Unknown creator'}</div></div><div>{l.points} pts</div></Link>) : <p className="muted">No active levels yet.</p>}</div></main>;
}
