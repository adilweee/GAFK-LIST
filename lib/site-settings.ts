import { createAdminClient } from '@/lib/supabase-admin';

export async function isMaintenanceEnabled() {
  const { data } = await createAdminClient().from('site_settings').select('maintenance_enabled').eq('id', true).maybeSingle();
  return data?.maintenance_enabled ?? false;
}
