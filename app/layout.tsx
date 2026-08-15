import './globals.css';
import Nav from '@/components/Nav';
import { currentProfile } from '@/lib/auth';
import { isMaintenanceEnabled } from '@/lib/site-settings';
export const dynamic = 'force-dynamic';
export default async function RootLayout({children}:{children:React.ReactNode}){const maintenance=await isMaintenanceEnabled();const profile=maintenance?await currentProfile():null;const allowed=profile&&['owner','moderator'].includes(profile.role);return <html lang="en"><head><link rel="icon" href="/gafk-logo.jpeg" type="image/jpeg"/></head><body>{maintenance&&!allowed?<main className="wrap"><section className="hero"><span className="pill">GAFK LIST</span><h1>Maintenance break</h1><p>The list is temporarily under maintenance. Please come back soon.</p></section></main>:<><Nav/>{children}</>}</body></html>}
