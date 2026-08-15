'use client';

import { useMemo, useState } from 'react';
import PlacementForm from '@/components/PlacementForm';

type Level = { id: number; name: string; creator: string | null; placement: number; points: number };

export default function PlacedLevelManager({ levels }: { levels: Level[] }) {
  const [search, setSearch] = useState('');
  const shown = useMemo(() => levels.filter((level) => `${level.name} ${level.creator ?? ''} ${level.placement}`.toLowerCase().includes(search.toLowerCase())).slice(0, 100), [levels, search]);
  return <section className="admin-section"><h2>Change Existing Placement</h2><p className="muted">Moving a level automatically shifts every affected level and recalculates points.</p><input className="input admin-search" placeholder="Search level name, creator or placement…" value={search} onChange={(event) => setSearch(event.target.value)} />
    <div className="admin-results">{shown.map((level) => <article className="card" key={level.id}><b>#{level.placement} — {level.name}</b><p className="muted">{level.creator || 'Unknown creator'} · {level.points} pts</p><PlacementForm levelId={level.id} currentPlacement={level.placement} /></article>)}{shown.length === 0 && <p className="muted">No matching placed levels.</p>}</div>
  </section>;
}
