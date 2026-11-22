'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function deleteMessageAction(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('contact_messages').delete().eq('id', id);
  
  if (error) {
    return { error: error.message };
  }
  
  revalidatePath('/dashboard/messages');
  return { success: true };
}

export async function toggleMessageStatusAction(id: string, currentStatus: string) {
  const supabase = await createClient();
  const newStatus = currentStatus === 'unread' ? 'read' : 'unread';
  
  const { error } = await supabase.from('contact_messages').update({ status: newStatus }).eq('id', id);
  
  if (error) {
    return { error: error.message };
  }
  
  revalidatePath('/dashboard/messages');
  return { success: true };
}
