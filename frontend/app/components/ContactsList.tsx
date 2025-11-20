'use client';

import { useState, useEffect } from 'react';
import { Contact } from '@/types';
import { whatsappApi } from '@/lib/api';
import MessageScheduler from './MessageScheduler';

export default function ContactsList() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const data = await whatsappApi.getContacts();
      setContacts(data);
    } catch (error) {
      console.error('Failed to load contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.number.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (selectedContact) {
    return (
      <div>
        <button
          onClick={() => setSelectedContact(null)}
          className="mb-4 flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to contacts
        </button>
        <MessageScheduler contact={selectedContact} onSuccess={() => setSelectedContact(null)} />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Select a Contact</h2>
      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search contacts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {filteredContacts.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No contacts found</p>
      ) : (
        <div className="grid gap-2 max-h-96 overflow-y-auto">
          {filteredContacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-left"
            >
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                {contact.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{contact.name}</p>
                <p className="text-sm text-gray-500">{contact.number}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
