import './globals.css';
import './themes.css';
import './nav.css';
import Nav from '@/components/Nav';
import SiteResetWatcher from '@/components/SiteResetWatcher';
import { currentProfile } from '@/lib/auth';
import { isMaintenanceEnabled } from '@/lib/site-settings';
export const dynamic = 'force-dynamic';
export default async function RootLayout({children}:{children:React.ReactNode}){const [maintenance,profile]=await Promise.all([isMaintenanceEnabled(),currentProfile()]);const allowed=profile&&['owner','moderator'].includes(profile.role);return <html lang="en"><head><link rel="icon" href="/gafk-logo.jpeg" type="image/jpeg"/></head><body><SiteResetWatcher/>{maintenance&&!allowed?<main className="wrap"><section className="hero"><span className="pill">GAFK LIST</span><h1>Maintenance break</h1><p>The list is temporarily under maintenance. Please come back soon.</p></section></main>:<><Nav profile={profile}/>{children}</>}</body></html>}
