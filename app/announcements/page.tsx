import { createClient } from '@/lib/supabase-server';
import { currentProfile } from '@/lib/auth';
import AnnouncementDeleteButton from '@/components/AnnouncementDeleteButton';

export default async function Announcements() {
  const [{ data }, profile] = await Promise.all([
    (await createClient()).from('announcements').select('id,title,body,created_at').order('created_at', { ascending: false }),
    currentProfile(),
  ]);
  const announcements = data ?? [];
  const canDelete = profile?.role === 'owner';

  return <main className="wrap"><h1>Announcements</h1>
    {announcements.length === 0 ? <p className="muted">No announcements.</p> : announcements.map((a: any) => <article className="card" key={a.id}>
      <h2>{a.title}</h2><p>{a.body}</p><span className="muted">{new Date(a.created_at).toLocaleDateString()}</span>
      {canDelete && <AnnouncementDeleteButton id={a.id} />}
    </article>)}
  </main>;
}
