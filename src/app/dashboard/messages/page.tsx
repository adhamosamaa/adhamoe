import { createClient } from '@/utils/supabase/server';
import { MessageList } from './MessageList';
import { Mail } from 'lucide-react';

export default async function MessagesPage() {
  const supabase = await createClient();
  const { data: messages, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-8 animate-dash-fade-up">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-dash-brand">Inbox</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl flex items-center gap-3">
            <Mail className="size-8 text-dash-fg" />
            Messages
          </h1>
          <p className="mt-2 max-w-xl text-sm text-dash-muted">
            Manage inquiries and contacts from your portfolio website.
          </p>
        </div>
      </header>

      {error ? (
        <div className="rounded-lg border border-dash-danger/20 bg-dash-danger/10 p-4 text-sm text-dash-danger">
          Failed to load messages: {error.message}
        </div>
      ) : (
        <MessageList initialMessages={messages || []} />
      )}
    </div>
  );
}
