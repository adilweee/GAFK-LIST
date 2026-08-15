'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PlacementForm({ levelId, currentPlacement }: { levelId: number; currentPlacement: number | null }) {
  const [placement, setPlacement] = useState(currentPlacement?.toString() ?? '');
  const [message, setMessage] = useState('');
  const router = useRouter();
  async function submit(event: React.FormEvent) {
    event.preventDefault(); setMessage('');
    const response = await fetch(`/api/levels/${levelId}/placement`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ placement: Number(placement) }) });
    const body = await response.json();
    if (!response.ok) return setMessage(body.error || 'Could not update placement.');
    setMessage('Placement saved and points updated.'); router.refresh();
  }
  return <form onSubmit={submit} style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginTop: 12 }}>
    <input className="input placement-input" type="number" min="1" required value={placement} onChange={(event) => setPlacement(event.target.value)} aria-label="Placement" />
    <button className="btn">Save placement</button>{message && <span className="muted">{message}</span>}
  </form>;
}
