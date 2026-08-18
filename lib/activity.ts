import { createAdminClient } from '@/lib/supabase-admin';

export async function logActivity(actorId:string|undefined, action:string, targetType:string, targetId?:string|number, detail?:string) {
  await createAdminClient().from('activity_log').insert({ actor_id: actorId || null, action, target_type: targetType, target_id: targetId == null ? null : String(targetId), detail: detail || null });
}
export async function notify(userId:string, title:string, body?:string, href?:string) {
  await createAdminClient().from('notifications').insert({ user_id:userId, title, body:body||null, href:href||null });
}
