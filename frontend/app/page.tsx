'use client';

import { useState } from 'react';
import QRCodeDisplay from './components/QRCodeDisplay';
import ContactsList from './components/ContactsList';
import ScheduledMessagesList from './components/ScheduledMessagesList';

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [activeTab, setActiveTab] = useState<'schedule' | 'list'>('schedule');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            WhatsApp Message Scheduler
          </h1>
          <p className="text-gray-600">
            Schedule messages to your WhatsApp contacts
          </p>
        </header>

        {!isConnected ? (
          <div className="max-w-md mx-auto">
            <QRCodeDisplay onReady={() => setIsConnected(true)} />
          </div>
        ) : (
          <div>
            <div className="flex justify-center mb-6">
              <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
                <button
                  onClick={() => setActiveTab('schedule')}
                  className={`px-6 py-2 rounded-md font-medium transition-colors ${
                    activeTab === 'schedule'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Schedule Message
                </button>
                <button
                  onClick={() => setActiveTab('list')}
                  className={`px-6 py-2 rounded-md font-medium transition-colors ${
                    activeTab === 'list'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  My Scheduled Messages
                </button>
              </div>
            </div>

            <div className="max-w-4xl mx-auto">
              {activeTab === 'schedule' ? (
                <ContactsList />
              ) : (
                <ScheduledMessagesList />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
