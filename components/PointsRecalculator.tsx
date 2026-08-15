'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PointsRecalculator() {
  const [message, setMessage] = useState(''); const [busy, setBusy] = useState(false); const router = useRouter();
  async function recalculate() {
    setBusy(true); const response = await fetch('/api/admin/points', { method: 'POST' }); const body = await response.json(); setBusy(false);
    setMessage(response.ok ? `${body.updated} level and all player points updated.` : body.error || 'Could not update points.'); if (response.ok) router.refresh();
  }
  return <section className="admin-section"><h2>Points</h2><p className="muted">#1 = 250, #2 = 225, #3 = 200; each placement loses 25 points.</p><button className="btn" disabled={busy} onClick={recalculate}>Recalculate all points</button>{message && <p className="muted">{message}</p>}</section>;
}
