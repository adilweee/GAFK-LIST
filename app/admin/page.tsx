import { createAdminClient } from '@/lib/supabase-admin';
import { currentProfile } from '@/lib/auth';
import AdminSubmissionActions from '@/components/AdminSubmissionActions';
import PlacementForm from '@/components/PlacementForm';
import UserRoleManager from '@/components/UserRoleManager';
import PlacedLevelManager from '@/components/PlacedLevelManager';
import PointsRecalculator from '@/components/PointsRecalculator';
import MaintenanceToggle from '@/components/MaintenanceToggle';
import { isMaintenanceEnabled } from '@/lib/site-settings';
import AnnouncementForm from '@/components/AnnouncementForm';
import SiteResetButton from '@/components/SiteResetButton';
import SnapshotButton from '@/components/SnapshotButton';
import AdminSectionNav from '@/components/AdminSectionNav';
import ReportManager from '@/components/ReportManager';

export default async function Admin() {
  const profile = await currentProfile();
  if (!profile || !['owner', 'moderator'].includes(profile.role)) return <main className="wrap"><h1>403</h1><p>Admin access required.</p></main>;
  const db = createAdminClient(); let submissions: any[] = [];
  let players: any[] = [];
  if (profile.role === 'owner') { const { data } = await db.from('submissions').select('*, profiles!submissions_submitter_id_fkey(username)').order('created_at', { ascending: false }); submissions = data ?? []; const { data: profileData } = await db.from('profiles').select('id, username, role, points').order('username'); players = profileData ?? []; }
  const { data: queue } = await db.from('levels').select('*').eq('status', 'active').is('placement', null).order('created_at');
  const { data: placedLevelsData } = await db.from('levels').select('id, name, creator, placement, points, aredl_placement, list_percent_value').eq('status', 'active').not('placement', 'is', null).order('placement');
  const placedLevels = placedLevelsData ?? [];
  const maintenanceEnabled = await isMaintenanceEnabled();
  const { data: activityData } = await db.from('activity_log').select('action,target_type,target_id,detail,created_at,profiles(username)').order('created_at',{ascending:false}).limit(30);
  const { data: reportData } = await db.from('reports').select('id,reason,status,comment_id,created_at,profiles!reports_reporter_id_fkey(username)').order('created_at',{ascending:false}).limit(100);
  const pending = submissions.filter((submission) => submission.status === 'pending');
  return <main className="wrap">
    <div className="page-heading" id="overview"><span className="pill">{profile.role}</span><h1>Admin</h1><p className="muted">Review, placement and site management.</p></div><AdminSectionNav owner={profile.role==='owner'}/>
    <div className="grid cards"><div className="card"><b>{pending.length}</b><div className="muted">Pending reviews</div></div><div className="card"><b>{queue?.length ?? 0}</b><div className="muted">Waiting for placement</div></div></div>
    {profile.role === 'owner' && <section className="admin-section" id="submissions"><h2>Submission Review</h2>{pending.length === 0 ? <p className="muted">No pending submissions.</p> : pending.map((submission) => <article className="card" key={submission.id}><b>{submission.level_name}</b><p className="muted">Level ID {submission.gd_level_id} · Creator: {submission.creator || 'Unknown'} · Submitted by {submission.profiles?.username || 'Unknown'}</p><a className="btn secondary" href={submission.youtube_url} target="_blank" rel="noreferrer">Watch proof</a><AdminSubmissionActions submissionId={submission.id} /></article>)}</section>}
    {profile.role === 'owner' && <div id="users"><UserRoleManager players={players} /></div>}
    {profile.role === 'owner' && <PointsRecalculator />}
    {profile.role === 'owner' && <section id="site"><MaintenanceToggle enabled={maintenanceEnabled} /><SiteResetButton /><AnnouncementForm /></section>}
    {profile.role === 'owner' && <SnapshotButton />}
    <section className="admin-section" id="placement"><h2>Placement Queue</h2>{(queue ?? []).length === 0 ? <p className="muted">No approved levels are waiting for placement.</p> : queue?.map((level) => <article className="card" key={level.id}><b>{level.name}</b><p className="muted">Level ID {level.gd_level_id} · Creator: {level.creator || 'Unknown'}</p><PlacementForm levelId={level.id} currentPlacement={level.placement} /></article>)}</section>
    <PlacedLevelManager levels={placedLevels} canDelete={profile.role === 'owner'} />
    <ReportManager reports={reportData??[]}/>
    <section className="admin-section" id="activity"><h2>Moderator Activity</h2><div className="card">{(activityData??[]).length?(activityData??[]).map((x:any)=><p key={`${x.created_at}-${x.action}`}><b>{x.profiles?.username??'System'}</b> {x.action} — {x.detail||x.target_type}<br/><span className="muted">{new Date(x.created_at).toLocaleString()}</span></p>):<p className="muted">No activity recorded yet.</p>}</div></section>
  </main>;
}
