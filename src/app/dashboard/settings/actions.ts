'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateSettingsAction(data: any) {
  const supabase = await createClient();
  const { error } = await supabase.from('site_settings').update(data).eq('id', 1);
  
  if (error) {
    return { error: error.message };
  }
  
  // Revalidate everything so the public site updates instantly
  revalidatePath('/', 'layout');
  
  return { success: true };
}
