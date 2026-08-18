'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Player = { id: string; username: string; role: 'user' | 'moderator' | 'owner'; points: number; banned_at?: string | null };

export default function UserRoleManager({ players }: { players: Player[] }) {
  const router = useRouter(); const [message, setMessage] = useState(''); const [busy, setBusy] = useState<string | null>(null);
  async function changeRole(id: string, role: 'user' | 'moderator') {
    setBusy(id); setMessage('');
    const response = await fetch(`/api/admin/users/${id}/role`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ role }) });
    const body = await response.json(); setBusy(null);
    if (!response.ok) return setMessage(body.error || 'Role could not be updated.');
    setMessage('Role updated.'); router.refresh();
  }
  async function resetPassword(id: string, username: string) {
    const password = window.prompt(`${username} için yeni şifre (en az 8 karakter):`); if (!password) return;
    setBusy(id); const response = await fetch(`/api/admin/users/${id}/password`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ password }) }); const body = await response.json(); setBusy(null); setMessage(response.ok ? 'Password updated.' : body.error || 'Password could not be updated.');
  }
  async function deleteUser(id: string, username: string) {
    if (!window.confirm(`${username} hesabı ve kayıtları kalıcı olarak silinsin mi?`)) return;
    setBusy(id); const response = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' }); const body = await response.json(); setBusy(null); if (!response.ok) return setMessage(body.error || 'User could not be deleted.'); setMessage('User deleted.'); router.refresh();
  }
  async function banUser(id:string, username:string, banned:boolean){const reason=banned?window.prompt(`${username} için ban sebebi:`):'';if(banned&&reason===null)return;setBusy(id);const response=await fetch(`/api/admin/users/${id}/ban`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({banned,reason})});const body=await response.json();setBusy(null);setMessage(response.ok?(banned?'User banned.':'User unbanned.'):body.error||'Ban could not be updated.');if(response.ok)router.refresh();}
  return <section className="admin-section"><h2>Users & Moderators</h2><p className="muted">Only you can promote moderators, reset passwords, ban or delete accounts.</p><div className="card"><table className="table"><thead><tr><th>User</th><th>Points</th><th>Role</th><th>Manage</th></tr></thead><tbody>{players.map((player) => <tr key={player.id}><td>{player.username}{player.banned_at&&<><br/><span className="muted">Banned</span></>}</td><td>{player.points}</td><td>{player.role}</td><td>{player.role === 'owner' ? 'Owner' : <div className="user-actions"><select className="select role-select" disabled={busy === player.id} value={player.role} onChange={(event) => changeRole(player.id, event.target.value as 'user' | 'moderator')}><option value="user">User</option><option value="moderator">Moderator</option></select><button className="btn secondary" disabled={busy === player.id} onClick={() => resetPassword(player.id, player.username)}>Reset password</button><button className="btn secondary" disabled={busy === player.id} onClick={() => banUser(player.id,player.username,!player.banned_at)}>{player.banned_at?'Unban':'Ban'}</button><button className="btn danger" disabled={busy === player.id} onClick={() => deleteUser(player.id, player.username)}>Delete</button></div>}</td></tr>)}</tbody></table>{message && <p className="muted">{message}</p>}</div></section>;
}
