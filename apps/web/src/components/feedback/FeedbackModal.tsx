'use client';

import React, { useState } from 'react';
import { X, MessageSquare, AlertCircle, Lightbulb, HelpCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [category, setCategory] = useState<'bug' | 'feature' | 'help' | 'other'>('bug');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/v1/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session ? { 'Authorization': `Bearer ${session.access_token}` } : {})
        },
        body: JSON.stringify({ category, message })
      });

      if (!response.ok) throw new Error('Failed to submit feedback');
      
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setMessage('');
        setCategory('bug');
      }, 2000);
    } catch (error) {
      console.error(error);
      alert('Could not submit feedback at this time. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-800 bg-gray-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-800 bg-gray-900/50 p-4">
          <h2 className="text-lg font-semibold text-white">Send Feedback</h2>
          <button onClick={onClose} className="rounded p-1 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        
        {success ? (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 text-green-500">
              <MessageSquare size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Thank you!</h3>
            <p className="text-gray-400">Your feedback helps us make Chessome better for everyone.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col p-6 gap-6">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setCategory('bug')}
                className={`flex items-center gap-2 rounded-xl border p-3 text-sm font-medium transition-all ${category === 'bug' ? 'border-red-500 bg-red-500/10 text-red-500' : 'border-gray-800 bg-gray-900/50 text-gray-400 hover:bg-gray-800'}`}
              >
                <AlertCircle size={16} /> Bug
              </button>
              <button
                type="button"
                onClick={() => setCategory('feature')}
                className={`flex items-center gap-2 rounded-xl border p-3 text-sm font-medium transition-all ${category === 'feature' ? 'border-blue-500 bg-blue-500/10 text-blue-500' : 'border-gray-800 bg-gray-900/50 text-gray-400 hover:bg-gray-800'}`}
              >
                <Lightbulb size={16} /> Feature
              </button>
              <button
                type="button"
                onClick={() => setCategory('help')}
                className={`flex items-center gap-2 rounded-xl border p-3 text-sm font-medium transition-all ${category === 'help' ? 'border-orange-500 bg-orange-500/10 text-orange-500' : 'border-gray-800 bg-gray-900/50 text-gray-400 hover:bg-gray-800'}`}
              >
                <HelpCircle size={16} /> Help
              </button>
              <button
                type="button"
                onClick={() => setCategory('other')}
                className={`flex items-center gap-2 rounded-xl border p-3 text-sm font-medium transition-all ${category === 'other' ? 'border-gray-400 bg-gray-400/10 text-gray-300' : 'border-gray-800 bg-gray-900/50 text-gray-400 hover:bg-gray-800'}`}
              >
                <MessageSquare size={16} /> Other
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="text-sm font-medium text-gray-400">Message</label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  category === 'bug' ? "What did you expect to happen, and what actually happened?" :
                  category === 'feature' ? "What feature would you like to see?" :
                  "Tell us what's on your mind..."
                }
                className="min-h-[120px] w-full resize-none rounded-lg border border-gray-800 bg-gray-900 p-3 text-sm text-gray-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !message.trim()}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending...' : 'Send Feedback'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
