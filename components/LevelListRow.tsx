import Link from 'next/link';
import { youtubeThumbnail } from '@/lib/youtube';

export default function LevelListRow({ level, showStatus = false }: { level: any; showStatus?: boolean }) {
  const firstRecord = [...(level.records ?? [])].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())[0];
  const thumbnail = youtubeThumbnail(firstRecord?.proof_url);
  return <Link className="listrow level-card" href={`/levels/${level.id}`}>
    <div className="rank">#{level.placement}</div>
    <div className="level-thumb">{thumbnail ? <img src={thumbnail} alt={`${level.name} video thumbnail`} /> : <span>GAFK</span>}</div>
    <div className="level-summary"><b>{level.name}</b><div className="muted">published by {level.creator || 'Unknown creator'}</div></div>
    <div className="level-points">{level.points} pts</div>
    {showStatus && <div className="hide-sm muted">{level.status}</div>}
  </Link>;
}
