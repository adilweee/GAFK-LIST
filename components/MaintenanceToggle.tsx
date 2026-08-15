'use client';
import { useState } from 'react';

export default function MaintenanceToggle({ enabled }: { enabled: boolean }) {
  const [active, setActive] = useState(enabled); const [message, setMessage] = useState('');
  async function toggle() { const response = await fetch('/api/admin/maintenance', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ enabled: !active }) }); const body = await response.json(); if (!response.ok) return setMessage(body.error || 'Could not update maintenance mode.'); setActive(!active); setMessage(!active ? 'Maintenance mode enabled.' : 'Maintenance mode ended.'); }
  return <section className="admin-section"><h2>Maintenance Mode</h2><p className="muted">When enabled, only Owner and Moderators can view the site.</p><button className="btn" onClick={toggle}>{active ? 'End maintenance mode' : 'Start maintenance mode'}</button>{message && <p className="muted">{message}</p>}</section>;
}
