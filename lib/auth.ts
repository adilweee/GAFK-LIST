import { createClient } from './supabase-server';
import { createAdminClient } from './supabase-admin';
export const internalEmail=(username:string)=>`${username.toLowerCase()}@${process.env.GAFK_INTERNAL_EMAIL_DOMAIN || 'users.gafk.local'}`;
export async function currentProfile(){
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) return null;
  const admin=createAdminClient();
  const {data}=await admin.from('profiles').select('*').eq('id',user.id).single();
  return data;
}
export async function requireRole(roles:string[]){
  const p=await currentProfile();
  if(!p || !roles.includes(p.role)) throw new Error('FORBIDDEN');
  return p;
}
