'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Player = { id: string; username: string; role: 'user' | 'moderator' | 'owner'; points: number };

export default function UserRoleManager({ players }: { players: Player[] }) {
  const router = useRouter(); const [message, setMessage] = useState(''); const [busy, setBusy] = useState<string | null>(null);
  async function changeRole(id: string, role: 'user' | 'moderator') {
    setBusy(id); setMessage('');
    const response = await fetch(`/api/admin/users/${id}/role`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ role }) });
    const body = await response.json(); setBusy(null);
    if (!response.ok) return setMessage(body.error || 'Role could not be updated.');
    setMessage('Role updated.'); router.refresh();
  }
  return <section className="admin-section"><h2>Users & Moderators</h2><p className="muted">Only you can promote or remove moderators. Moderators can set placements but cannot approve submissions.</p><div className="card"><table className="table"><thead><tr><th>User</th><th>Points</th><th>Role</th><th>Action</th></tr></thead><tbody>{players.map((player) => <tr key={player.id}><td>{player.username}</td><td>{player.points}</td><td>{player.role}</td><td>{player.role === 'owner' ? 'Owner' : <select className="select role-select" disabled={busy === player.id} value={player.role} onChange={(event) => changeRole(player.id, event.target.value as 'user' | 'moderator')}><option value="user">User</option><option value="moderator">Moderator</option></select>}</td></tr>)}</tbody></table>{message && <p className="muted">{message}</p>}</div></section>;
}
