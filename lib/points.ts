import { createAdminClient } from './supabase-admin';

export const pointsForPlacement = (placement: number) => Math.max(0, 250 - (placement - 1) * 25);

/** Rebuild totals after a record or placement changes. Kept server-only. */
export async function rebuildPlayerPoints() {
  const db = createAdminClient();
  const { data } = await db.from('records').select('player_id, levels(points)');
  const totals = new Map<string, number>();
  for (const record of data ?? []) {
    const level = Array.isArray(record.levels) ? record.levels[0] : record.levels;
    totals.set(record.player_id, (totals.get(record.player_id) ?? 0) + (level?.points ?? 0));
  }
  const { data: profiles } = await db.from('profiles').select('id');
  await Promise.all((profiles ?? []).map((profile) =>
    db.from('profiles').update({ points: totals.get(profile.id) ?? 0 }).eq('id', profile.id)
  ));
}
