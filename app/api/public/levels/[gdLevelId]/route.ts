import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET(_:Request,{params}:{params:Promise<{gdLevelId:string}>}) {
  const { gdLevelId } = await params;
  const { data: level, error } = await createAdminClient().from('levels')
    .select('id,gd_level_id,name,creator,verifier,placement,points,status,aredl_placement,list_percent_value')
    .eq('gd_level_id', gdLevelId).maybeSingle();
  if (error) return NextResponse.json({ error:'Lookup unavailable.' }, { status:500, headers:{'Access-Control-Allow-Origin':'*'} });
  if (!level) return NextResponse.json({ listed:false, gdLevelId }, { headers:{'Access-Control-Allow-Origin':'*','Cache-Control':'public, max-age=60'} });
  return NextResponse.json({ listed:true, level }, { headers:{'Access-Control-Allow-Origin':'*','Cache-Control':'public, max-age=60'} });
}
