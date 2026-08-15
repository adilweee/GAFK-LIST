import { createClient } from '@/lib/supabase-server';
import Link from 'next/link';

export default async function Leaderboard() {
  const db = await createClient();
  const { data } = await db.from('profiles').select('username,points').order('points', { ascending: false }).limit(100);
  const players = data ?? [];
  return <main className="wrap"><h1>Leaderboard</h1><div className="card"><table className="table"><thead><tr><th>#</th><th>Player</th><th>GAFK Points</th></tr></thead><tbody>{players.map((p: any, i: number) => <tr key={p.username}><td>{i + 1}</td><td><Link href={`/users/${p.username}`}>{p.username}</Link></td><td>{p.points}</td></tr>)}</tbody></table></div></main>;
}
