import { createClient } from '@/lib/supabase-server';
import LevelListRow from '@/components/LevelListRow';

export default async function Levels() {
  const db = await createClient();
  const { data } = await db.from('levels').select('*, records(proof_url, created_at)').eq('status', 'active').order('placement', { ascending: true }).limit(500);
  const levels = data ?? [];
  return <main className="wrap"><h1>GAFK Levels</h1><div className="card">{levels.length ? levels.map((level: any) => <LevelListRow level={level} key={level.id} />) : <p className="muted">No active levels yet.</p>}</div></main>;
}
