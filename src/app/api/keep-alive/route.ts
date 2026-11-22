import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic'; // يمنع الكاش عشان يكلم الداتا بيز كل مرة

export async function GET() {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from('projects').select('id').limit(1);

    if (error) {
      return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }

    return NextResponse.json({ status: 'alive', timestamp: new Date().toISOString() });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ status: 'error', message }, { status: 500 });
  }
}
