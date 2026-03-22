'use client';
import { useState, useEffect } from 'react';
import { Trash2, Mail, CheckCircle, Circle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch messages on load
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/contact');
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Handle Delete
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('Message deleted');
        // Remove from UI immediately
        setMessages(messages.filter((msg) => msg._id !== id));
      } else {
        toast.error('Failed to delete');
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    }
  };

  // Handle Toggle Read/Unread
  const toggleReadStatus = async (id, currentStatus) => {
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: !currentStatus }),
      });

      if (res.ok) {
        // Update UI locally
        setMessages(
          messages.map((msg) =>
            msg._id === id ? { ...msg, read: !currentStatus } : msg
          )
        );
        toast.success(`Marked as ${!currentStatus ? 'read' : 'unread'}`);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update status');
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
        <div className="text-center py-12 text-gray-500 bg-gray-800 rounded-xl">
          No messages yet.
        </div>
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
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className={`font-bold text-lg ${msg.read ? 'text-gray-300' : 'text-white'}`}>
                      {msg.name}
                    </h3>
                    <span className="text-xs text-gray-500 bg-gray-900 px-2 py-1 rounded">
                      {msg.email}
                    </span>
                    {!msg.read && (
                      <span className="text-xs font-bold text-blue-400 bg-blue-400/10 px-2 py-1 rounded flex items-center gap-1">
                        <Circle size={10} fill="currentColor" /> New
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-2 whitespace-pre-wrap">
                    {msg.message}
                  </p>
                  
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock size={12} /> {new Date(msg.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <button
                    onClick={() => toggleReadStatus(msg._id, msg.read)}
                    className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 text-gray-300 hover:text-white transition"
                    title={msg.read ? "Mark as Unread" : "Mark as Read"}
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