'use client';
import { useState, useEffect } from 'react';
import { Trash2, Mail, CheckCircle, Circle, Clock, Reply, Send, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/contact');
      const data = res.ok ? await res.json() : [];
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMessages(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      const res = await fetch(`/api/contact/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Message deleted');
        setMessages(messages.filter((msg) => msg._id !== id));
      } else {
        toast.error('Failed to delete');
      }
    } catch {
      toast.error('Something went wrong');
    }
  };

  const toggleReadStatus = async (id, currentStatus) => {
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: !currentStatus }),
      });
      if (res.ok) {
        setMessages(messages.map((msg) => (msg._id === id ? { ...msg, read: !currentStatus } : msg)));
        toast.success(`Marked as ${!currentStatus ? 'read' : 'unread'}`);
      } else {
        toast.error('Failed to update status');
      }
    } catch {
      toast.error('Failed to update status');
    }
  };

  const sendReply = async (id) => {
    if (!replyText.trim()) return;
    setSending(true);
    try {
      const res = await fetch(`/api/contact/${id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply: replyText }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        toast.success(data.emailSent ? 'Reply sent!' : 'Marked as replied, but the email could not be sent — check nodemailer config');
        setMessages(messages.map((m) => (m._id === id ? { ...m, replied: true } : m)));
        setReplyingTo(null);
        setReplyText('');
      } else {
        toast.error(data.error || 'Failed to send reply');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-400">Loading messages...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Mail size={24} /> Inbox
      </h1>

      {messages.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-gray-800 rounded-xl">No messages yet.</div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`bg-gray-800 p-6 rounded-xl border-l-4 transition-all hover:translate-x-1 ${
                msg.read ? 'border-gray-600 opacity-75' : 'border-blue-500 bg-gray-800/80'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className={`font-bold text-lg ${msg.read ? 'text-gray-300' : 'text-white'}`}>{msg.name}</h3>
                    <span className="text-xs text-gray-500 bg-gray-900 px-2 py-1 rounded">{msg.email}</span>
                    {!msg.read && (
                      <span className="text-xs font-bold text-blue-400 bg-blue-400/10 px-2 py-1 rounded flex items-center gap-1">
                        <Circle size={10} fill="currentColor" /> New
                      </span>
                    )}
                    {msg.replied && (
                      <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded">Replied</span>
                    )}
                  </div>

                  <p className="text-gray-300 text-sm mb-2 whitespace-pre-wrap">{msg.message}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock size={12} /> {new Date(msg.createdAt).toLocaleString()}
                  </p>

                  {replyingTo === msg._id && (
                    <div className="mt-4 bg-gray-900/60 rounded-lg p-4">
                      <textarea
                        rows={3}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-blue-500"
                        placeholder={`Reply to ${msg.name}...`}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <button
                          onClick={() => { setReplyingTo(null); setReplyText(''); }}
                          className="px-3 py-1.5 text-sm bg-gray-700 rounded flex items-center gap-1 hover:bg-gray-600"
                        >
                          <X size={14} /> Cancel
                        </button>
                        <button
                          onClick={() => sendReply(msg._id)}
                          disabled={sending || !replyText.trim()}
                          className="px-3 py-1.5 text-sm bg-blue-600 rounded flex items-center gap-1 hover:bg-blue-700 disabled:opacity-50"
                        >
                          <Send size={14} /> {sending ? 'Sending...' : 'Send Reply'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <button
                    onClick={() => { setReplyingTo(replyingTo === msg._id ? null : msg._id); setReplyText(''); }}
                    className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 text-gray-300 hover:text-white transition"
                    title="Reply by email"
                  >
                    <Reply size={18} />
                  </button>
                  <button
                    onClick={() => toggleReadStatus(msg._id, msg.read)}
                    className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 text-gray-300 hover:text-white transition"
                    title={msg.read ? 'Mark as Unread' : 'Mark as Read'}
                  >
                    {msg.read ? <Circle size={18} /> : <CheckCircle size={18} className="text-green-400" />}
                  </button>
                  <button
                    onClick={() => handleDelete(msg._id)}
                    className="p-2 bg-red-900/30 rounded-lg hover:bg-red-900/50 text-red-400 transition"
                    title="Delete Message"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}