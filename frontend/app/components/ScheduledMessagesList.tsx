'use client';

import { useState, useEffect } from 'react';
import { ScheduledMessage } from '@/types';
import { messagesApi } from '@/lib/api';
import { format } from 'date-fns';

export default function ScheduledMessagesList() {
  const [messages, setMessages] = useState<ScheduledMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
    
    // Refresh every 30 seconds
    const interval = setInterval(loadMessages, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadMessages = async () => {
    try {
      const data = await messagesApi.getAll();
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this scheduled message?')) {
      return;
    }

    try {
      await messagesApi.delete(id);
      setMessages(messages.filter(m => m.id !== id));
    } catch (error) {
      console.error('Failed to delete message:', error);
      alert('Failed to delete message');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'sent':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Scheduled Messages</h2>
      
      {messages.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No scheduled messages</p>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-gray-900">{msg.contactName}</p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(msg.scheduledAt), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(msg.status)}`}>
                    {msg.status}
                  </span>
                  {msg.status === 'pending' && (
                    <button
                      onClick={() => handleDelete(msg.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{msg.message}</p>
              {msg.errorMessage && (
                <p className="text-red-600 text-sm mt-2">Error: {msg.errorMessage}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
