import { NextResponse } from 'next/server'; import { createAdminClient } from '@/lib/supabase-admin';
export async function GET(){const {data}=await createAdminClient().from('changelog').select('id').order('id',{ascending:false}).limit(1).maybeSingle();return NextResponse.json({version:data?.id??0});}
