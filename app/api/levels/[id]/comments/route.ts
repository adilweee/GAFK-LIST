import { NextResponse } from 'next/server';
import { currentProfile } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase-admin';

export async function POST(req:Request,{params}:{params:Promise<{id:string}>}){const p=await currentProfile();if(!p)return NextResponse.json({error:'Login required.'},{status:401});if(p.banned_at)return NextResponse.json({error:'Banned users cannot comment.'},{status:403});const {body}=await req.json();if(typeof body!=='string'||body.trim().length<1||body.trim().length>1000)return NextResponse.json({error:'Comment must be 1-1000 characters.'},{status:400});const {id}=await params;const {error}=await createAdminClient().from('level_comments').insert({level_id:id,author_id:p.id,body:body.trim()});return error?NextResponse.json({error:error.message},{status:400}):NextResponse.json({ok:true});}
