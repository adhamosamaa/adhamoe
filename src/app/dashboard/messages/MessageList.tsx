'use client';

import { useState } from 'react';
import { Trash2, Mail, MailOpen, Reply, ChevronDown, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { deleteMessageAction, toggleMessageStatusAction } from './actions';
import { cn } from '@/utils/cn';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  status: string;
  created_at: string;
}

export function MessageList({ initialMessages }: { initialMessages: ContactMessage[] }) {
  const [messages, setMessages] = useState(initialMessages);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleDelete = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!confirm('Are you sure you want to delete this message?')) return;
    
    setProcessingId(id);
    const res = await deleteMessageAction(id);
    
    if (res.error) {
      toast.error(`Failed to delete: ${res.error}`);
    } else {
      toast.success('Message deleted');
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (expandedId === id) setExpandedId(null);
    }
    setProcessingId(null);
  };

  const handleToggleStatus = async (msg: ContactMessage, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    setProcessingId(msg.id);
    const res = await toggleMessageStatusAction(msg.id, msg.status);
    
    if (res.error) {
      toast.error(`Failed to update status: ${res.error}`);
    } else {
      setMessages((prev) => 
        prev.map((m) => m.id === msg.id ? { ...m, status: m.status === 'unread' ? 'read' : 'unread' } : m)
      );
    }
    setProcessingId(null);
  };

  const handleRowClick = async (msg: ContactMessage) => {
    const isExpanding = expandedId !== msg.id;
    setExpandedId(isExpanding ? msg.id : null);

    // Auto mark as read if it was unread and we are expanding it
    if (isExpanding && msg.status === 'unread') {
      const res = await toggleMessageStatusAction(msg.id, 'unread'); // flips to read
      if (!res.error) {
        setMessages((prev) => 
          prev.map((m) => m.id === msg.id ? { ...m, status: 'read' } : m)
        );
      }
    }
  };

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dash-line bg-dash-surface py-20 text-center shadow-dash-card">
        <Mail className="size-10 text-dash-subtle" strokeWidth={1} />
        <h3 className="mt-4 text-base font-medium text-dash-fg">No messages yet</h3>
        <p className="mt-1 text-sm text-dash-muted">When someone contacts you, their message will appear here.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-2xl border border-dash-line bg-dash-surface shadow-dash-card overflow-hidden">
      {messages.map((msg, index) => {
        const isUnread = msg.status === 'unread';
        const isExpanded = expandedId === msg.id;
        const isProcessing = processingId === msg.id;
        const isLast = index === messages.length - 1;

        return (
          <div
            key={msg.id}
            className={cn(
              "group relative flex flex-col transition-colors duration-200",
              !isLast && "border-b border-dash-line",
              isExpanded ? "bg-dash-elevated" : "hover:bg-dash-canvas",
              isUnread && !isExpanded && "bg-dash-brand/5 hover:bg-dash-brand/10"
            )}
          >
            {/* Clickable Header Row */}
            <button
              onClick={() => handleRowClick(msg)}
              className="flex w-full items-center gap-4 px-5 py-4 text-left transition-all"
            >
              {/* Unread Dot */}
              <div className="flex h-full w-3 items-center justify-center shrink-0">
                {isUnread && (
                  <span className="size-2.5 rounded-full bg-dash-brand shadow-[0_0_8px_rgba(4,217,217,0.5)]" />
                )}
              </div>

              {/* Sender Info & Preview */}
              <div className="flex flex-1 items-center gap-4 min-w-0">
                <div className="w-48 shrink-0 truncate">
                  <span className={cn("text-sm", isUnread ? "font-bold text-dash-fg" : "font-medium text-dash-fg/90")}>
                    {msg.name}
                  </span>
                </div>
                <div className="w-56 shrink-0 hidden md:block truncate">
                  <span className={cn("text-sm transition-colors", isUnread ? "text-dash-fg/80 font-medium" : "text-dash-muted")}>
                    {msg.email}
                  </span>
                </div>
                <div className="flex-1 truncate hidden sm:block">
                  <span className={cn("text-sm transition-colors", isUnread ? "text-dash-fg/90" : "text-dash-subtle")}>
                    {msg.message}
                  </span>
                </div>
              </div>

              {/* Date & Expand Icon */}
              <div className="flex items-center gap-4 shrink-0 pl-4">
                <span className="text-xs text-dash-muted whitespace-nowrap" suppressHydrationWarning>
                  {new Date(msg.created_at).toLocaleDateString(undefined, { 
                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                  })}
                </span>
                <ChevronDown 
                  className={cn("size-4 text-dash-subtle transition-transform duration-300", isExpanded && "-rotate-180")} 
                />
              </div>
            </button>

            {/* Expanded Content Panel */}
            <div
              className={cn(
                "grid transition-all duration-300 ease-in-out",
                isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="overflow-hidden">
                <div className="p-5 pt-2 pl-12 border-t border-dash-line/50">
                  <div className="flex items-center gap-2 mb-4 md:hidden">
                    <span className="text-xs text-dash-muted font-medium tracking-wide uppercase">From:</span>
                    <a href={`mailto:${msg.email}`} className="text-sm text-dash-brand hover:underline">
                      {msg.email}
                    </a>
                  </div>
                  
                  <div className="rounded-xl bg-dash-canvas p-5 border border-dash-line shadow-inner">
                    <p className="text-sm text-dash-fg whitespace-pre-wrap leading-relaxed">
                      {msg.message}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-end gap-3">
                    <a
                      href={`mailto:${msg.email}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex h-9 items-center gap-2 rounded-lg bg-dash-elevated px-4 text-xs font-medium text-dash-fg transition-colors hover:bg-dash-line hover:text-white"
                    >
                      <Reply className="size-3.5" />
                      Reply
                    </a>
                    <button
                      onClick={(e) => handleToggleStatus(msg, e)}
                      disabled={isProcessing}
                      className="inline-flex h-9 items-center gap-2 rounded-lg bg-dash-elevated px-4 text-xs font-medium text-dash-muted transition-colors hover:bg-dash-line hover:text-dash-fg disabled:opacity-50"
                    >
                      {isProcessing ? <Loader2 className="size-3.5 animate-spin" /> : (msg.status === 'unread' ? <MailOpen className="size-3.5" /> : <Mail className="size-3.5" />)}
                      {msg.status === 'unread' ? 'Mark Read' : 'Mark Unread'}
                    </button>
                    <button
                      onClick={(e) => handleDelete(msg.id, e)}
                      disabled={isProcessing}
                      className="inline-flex h-9 items-center gap-2 rounded-lg bg-dash-danger/10 px-4 text-xs font-medium text-dash-danger transition-colors hover:bg-dash-danger/20 disabled:opacity-50"
                    >
                      {isProcessing ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
