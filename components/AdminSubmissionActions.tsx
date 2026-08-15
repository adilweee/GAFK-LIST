'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminSubmissionActions({ submissionId }: { submissionId: number }) {
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  async function review(decision: 'approve' | 'reject') {
    setBusy(true); setMessage('');
    const response = await fetch(`/api/submissions/${submissionId}/review`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ decision }) });
    const body = await response.json();
    setBusy(false);
    if (!response.ok) return setMessage(body.error || 'Could not save review.');
    setMessage(decision === 'approve' ? 'Approved. It is in the placement queue when needed.' : 'Rejected.');
    router.refresh();
  }
  return <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginTop: 12 }}>
    <button className="btn" disabled={busy} onClick={() => review('approve')}>Approve</button>
    <button className="btn secondary" disabled={busy} onClick={() => review('reject')}>Reject</button>
    {message && <span className="muted">{message}</span>}
  </div>;
}
