'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  CheckCircle,
  Circle,
  Clock,
  Mail,
  Reply,
  Send,
  Trash2,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);

      const res = await fetch('/api/contact', {
        cache: 'no-store',
      });

      if (!res.ok) {
        throw new Error('Failed to load messages');
      }

      const data = await res.json();

      // Supports both [...] and { messages: [...] }
      const messageList = Array.isArray(data)
        ? data
        : Array.isArray(data.messages)
          ? data.messages
          : [];

      setMessages(messageList);
    } catch (error) {
      console.error('Failed to load messages:', error);
      toast.error('Failed to load messages');
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return;
    }

    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete message');
      }

      toast.success('Message deleted');

      setMessages((previousMessages) =>
        previousMessages.filter((message) => message._id !== id)
      );

      if (replyingTo === id) {
        setReplyingTo(null);
        setReplyText('');
      }
    } catch (error) {
      console.error('Failed to delete message:', error);
      toast.error('Something went wrong');
    }
  };

  const toggleReadStatus = async (id, currentStatus) => {
    const newStatus = !currentStatus;

    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          read: newStatus,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to update message status');
      }

      setMessages((previousMessages) =>
        previousMessages.map((message) =>
          message._id === id
            ? { ...message, read: newStatus }
            : message
        )
      );

      toast.success(`Marked as ${newStatus ? 'read' : 'unread'}`);
    } catch (error) {
      console.error('Failed to update message status:', error);
      toast.error('Failed to update status');
    }
  };

  const openReply = (id) => {
    setReplyingTo((currentId) => (currentId === id ? null : id));
    setReplyText('');
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setReplyText('');
  };

  const sendReply = async (id) => {
    if (!replyText.trim() || sending) {
      return;
    }

    setSending(true);

    try {
      const res = await fetch(`/api/contact/${id}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reply: replyText.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send reply');
      }

      toast.success(
        data.emailSent
          ? 'Reply sent!'
          : 'Marked as replied, but the email could not be sent — check nodemailer config'
      );

      setMessages((previousMessages) =>
        previousMessages.map((message) =>
          message._id === id
            ? { ...message, replied: true }
            : message
        )
      );

      cancelReply();
    } catch (error) {
      console.error('Failed to send reply:', error);
      toast.error(error.message || 'Something went wrong');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-400">
        Loading messages...
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Mail size={24} aria-hidden="true" />
        Inbox
      </h1>

      {messages.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-gray-800 rounded-xl">
          No messages yet.
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => {
            const replyLabel = 'Reply by email';
            const readLabel = message.read
              ? 'Mark as unread'
              : 'Mark as read';
            const deleteLabel = 'Delete message';

            return (
              <div
                key={message._id}
                className={`bg-gray-800 p-6 rounded-xl border-l-4 transition-all hover:translate-x-1 ${
                  message.read
                    ? 'border-gray-600 opacity-75'
                    : 'border-blue-500 bg-gray-800/80'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3
                        className={`font-bold text-lg ${
                          message.read ? 'text-gray-300' : 'text-white'
                        }`}
                      >
                        {message.name}
                      </h3>

                      <span className="text-xs text-gray-500 bg-gray-900 px-2 py-1 rounded">
                        {message.email}
                      </span>

                      {!message.read && (
                        <span className="text-xs font-bold text-blue-400 bg-blue-400/10 px-2 py-1 rounded flex items-center gap-1">
                          <Circle
                            size={10}
                            fill="currentColor"
                            aria-hidden="true"
                          />
                          New
                        </span>
                      )}

                      {message.replied && (
                        <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded">
                          Replied
                        </span>
                      )}
                    </div>

                    <p className="text-gray-300 text-sm mb-2 whitespace-pre-wrap">
                      {message.message}
                    </p>

                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock size={12} aria-hidden="true" />
                      {message.createdAt
                        ? new Date(message.createdAt).toLocaleString()
                        : 'Unknown date'}
                    </p>

                    {replyingTo === message._id && (
                      <div className="mt-4 bg-gray-900/60 rounded-lg p-4">
                        <label
                          htmlFor={`reply-${message._id}`}
                          className="sr-only"
                        >
                          Reply to {message.name}
                        </label>

                        <textarea
                          id={`reply-${message._id}`}
                          rows={3}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-blue-500"
                          placeholder={`Reply to ${message.name}...`}
                          value={replyText}
                          onChange={(event) =>
                            setReplyText(event.target.value)
                          }
                        />

                        <div className="flex justify-end gap-2 mt-2">
                          <button
                            type="button"
                            title="Cancel reply"
                            aria-label="Cancel reply"
                            onClick={cancelReply}
                            className="px-3 py-1.5 text-sm bg-gray-700 rounded flex items-center gap-1 hover:bg-gray-600"
                          >
                            <X size={14} aria-hidden="true" />
                            Cancel
                          </button>

                          <button
                            type="button"
                            title="Send reply"
                            aria-label="Send reply"
                            onClick={() => sendReply(message._id)}
                            disabled={sending || !replyText.trim()}
                            className="px-3 py-1.5 text-sm bg-blue-600 rounded flex items-center gap-1 hover:bg-blue-700 disabled:opacity-50"
                          >
                            <Send size={14} aria-hidden="true" />
                            {sending ? 'Sending...' : 'Send Reply'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      type="button"
                      title={replyLabel}
                      aria-label={replyLabel}
                      onClick={() => openReply(message._id)}
                      className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 text-gray-300 hover:text-white transition"
                    >
                      <Reply size={18} aria-hidden="true" />
                    </button>

                    <button
                      type="button"
                      title={readLabel}
                      aria-label={readLabel}
                      onClick={() =>
                        toggleReadStatus(message._id, message.read)
                      }
                      className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 text-gray-300 hover:text-white transition"
                    >
                      {message.read ? (
                        <Circle size={18} aria-hidden="true" />
                      ) : (
                        <CheckCircle
                          size={18}
                          className="text-green-400"
                          aria-hidden="true"
                        />
                      )}
                    </button>

                    <button
                      type="button"
                      title={deleteLabel}
                      aria-label={deleteLabel}
                      onClick={() => handleDelete(message._id)}
                      className="p-2 bg-red-900/30 rounded-lg hover:bg-red-900/50 text-red-400 transition"
                    >
                      <Trash2 size={18} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
