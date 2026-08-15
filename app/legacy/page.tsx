import { createClient } from '@/lib/supabase-server';
import Link from 'next/link';

export default async function Legacy() {
  const db = await createClient();
  const { data } = await db.from('levels').select('*').eq('status', 'legacy').order('placement', { ascending: true, nullsFirst: false });
  const levels = data ?? [];
  return <main className="wrap"><h1>Legacy List</h1><div className="card">{levels.length ? levels.map((l: any) => <Link className="listrow" href={`/levels/${l.id}`} key={l.id}><div>#{l.placement || '—'}</div><div><b>{l.name}</b><div className="muted">Formerly placed level</div></div><div>{l.points} pts</div></Link>) : <p className="muted">No legacy levels yet.</p>}</div></main>;
}
