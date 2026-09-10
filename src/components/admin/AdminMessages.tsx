import React from 'react';
import { 
  MessageSquare, 
  Trash2, 
  Mail, 
  CheckCircle2, 
  Clock, 
  ExternalLink 
} from 'lucide-react';
import { ContactMessage } from '../../types.js';
import { toggleMessageRead, deleteMessage } from '../../services/api.js';

interface AdminMessagesProps {
  messages: ContactMessage[];
  onRefresh: () => void;
}

export const AdminMessages: React.FC<AdminMessagesProps> = ({ messages, onRefresh }) => {
  const handleToggleRead = async (id?: string) => {
    if (!id) {
      alert('Cannot update: Message ID is missing.');
      return;
    }
    try {
      await toggleMessageRead(id);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to toggle status');
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) {
      alert('Cannot delete: Message ID is missing.');
      return;
    }
    if (!window.confirm('Delete this message?')) return;
    try {
      await deleteMessage(id);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to delete message');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-purple-500" />
            <span>Contact Form Inquiries ({messages.length})</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Incoming messages received from prospective clients, recruiters, and collaborators
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {messages.map((msg) => {
          const itemDocId = msg._id || msg.id;
          return (
          <div
            key={itemDocId}
            className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border transition-all ${
              msg.read 
                ? 'border-slate-200 dark:border-slate-800 opacity-80' 
                : 'border-purple-300 dark:border-purple-800 shadow-sm ring-1 ring-purple-500/20'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className={`w-2.5 h-2.5 rounded-full ${msg.read ? 'bg-slate-400' : 'bg-purple-600 animate-pulse'}`} />
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {msg.name}
                </h4>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  &lt;{msg.email}&gt;
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                <span>{new Date(msg.createdAt).toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-3 space-y-1">
              <div className="font-semibold text-xs text-indigo-600 dark:text-indigo-400">
                Subject: {msg.subject}
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                {msg.message}
              </p>
            </div>

            <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => handleToggleRead(itemDocId)}
                className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{msg.read ? 'Mark as Unread' : 'Mark as Read'}</span>
              </button>

              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                  className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 text-purple-700 dark:text-purple-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Reply via Email</span>
                </a>
                <button
                  onClick={() => handleDelete(itemDocId)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                  title="Delete Message"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          );
        })}

        {messages.length === 0 && (
          <div className="p-12 text-center text-slate-400 text-xs rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            Your inbox is empty. Inquiries submitted through the Contact Me form will be displayed here.
          </div>
        )}
      </div>
    </div>
  );
};
