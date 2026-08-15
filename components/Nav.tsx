import Link from 'next/link';
export default function Nav(){return <nav className="nav"><div className="navin"><Link className="logo" href="/">GAFK LIST</Link><div className="spacer"/><div className="links"><Link href="/">List</Link><Link href="/leaderboard">Leaderboard</Link><Link href="/submit">Submit</Link><Link href="/legacy">Legacy</Link><Link href="/login">Login</Link></div></div></nav>}
