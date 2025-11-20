'use client';

import { useState } from 'react';
import { Contact } from '@/types';
import { messagesApi } from '@/lib/api';
import { format } from 'date-fns';

interface MessageSchedulerProps {
  contact: Contact;
  onSuccess: () => void;
}

export default function MessageScheduler({ contact, onSuccess }: MessageSchedulerProps) {
  const [message, setMessage] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!message.trim()) {
        throw new Error('Message cannot be empty');
      }

      if (!scheduledDate || !scheduledTime) {
        throw new Error('Please select date and time');
      }

      const scheduledAt = new Date(`${scheduledDate}T${scheduledTime}`);
      
      if (scheduledAt < new Date()) {
        throw new Error('Scheduled time must be in the future');
      }

      await messagesApi.create({
        contactId: contact.id,
        contactName: contact.name,
        message: message.trim(),
        scheduledAt: scheduledAt.toISOString(),
      });

      alert('Message scheduled successfully!');
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to schedule message');
    } finally {
      setLoading(false);
    }
  };

  // Get minimum date (today)
  const today = format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Schedule Message</h2>
        <div className="flex items-center text-gray-600">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
            {contact.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold">{contact.name}</p>
            <p className="text-sm">{contact.number}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Type your message here..."
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              min={today}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
              Time
            </label>
            <input
              type="time"
              id="time"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Scheduling...' : 'Schedule Message'}
        </button>
      </form>
    </div>
  );
}
