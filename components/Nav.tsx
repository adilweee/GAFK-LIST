'use client';
import Link from 'next/link';
import { useState } from 'react';
import ThemeToggle from '@/components/ThemeToggle';

const menu = [['Leaderboard','/leaderboard'],['Submit','/submit'],['List%','/list-percent'],['News','/announcements'],['Changelog','/changelog'],['Report','/report'],['Legacy','/legacy'],['Panel','/admin']];
type NavProfile={username:string;role:string}|null;
export default function Nav({profile}: {profile:NavProfile}){const [open,setOpen]=useState(false);return <nav className="nav"><div className="navin"><Link className="logo" href="/">GAFK LIST</Link><div className="spacer"/><div className="account-links"><Link className="always-list" href="/">List</Link>{profile?<Link href={`/users/${encodeURIComponent(profile.username)}`}>Profil</Link>:<><Link href="/login">Login</Link><Link href="/register">Kayıt Ol</Link></>}<ThemeToggle/><button className="menu-toggle" aria-label="Open menu" aria-expanded={open} onClick={()=>setOpen(!open)}><span/><span/><span/></button></div><div className={`menu-popover ${open?'open':''}`}>{menu.map(([label,href])=><Link href={href} key={href} onClick={()=>setOpen(false)}>{label}</Link>)}</div></div></nav>}
