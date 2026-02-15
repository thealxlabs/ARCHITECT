import React, { useState } from 'react';
import { MessageSquare, Send, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../lib/supabase';

type FeedbackType = 'bug' | 'feature' | 'other';

const TYPE_LABELS: Record<FeedbackType, string> = {
  bug: 'Bug Report',
  feature: 'Feature Request',
  other: 'Other',
};

/**
 * A sticky footer component that lets users report problems or request features.
 * Submissions are saved to the `feedback` table in Supabase.
 *
 * Drop this at the bottom of any page:
 *   <ReportProblem />
 */
const ReportProblem: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<FeedbackType>('bug');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    const trimmed = message.trim();
    if (trimmed.length < 5) {
      setError('Please describe the issue in a bit more detail.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const { error: dbError } = await supabase.from('feedback').insert({
        type,
        message: trimmed,
        email: email.trim() || null,
        page_url: window.location.pathname,
        user_agent: navigator.userAgent,
      });

      if (dbError) throw dbError;

      setSubmitted(true);
      setMessage('');
      setEmail('');

      // Reset after a few seconds
      setTimeout(() => {
        setSubmitted(false);
        setIsOpen(false);
      }, 3000);
    } catch (err: any) {
      console.error('Feedback submit error:', err);
      setError('Failed to submit. Please try again or open an issue on GitHub.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="border-t border-zinc-800 bg-zinc-950">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Toggle bar */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full py-4 flex items-center justify-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition"
        >
          <MessageSquare className="w-4 h-4" />
          Report a problem or suggest a feature
          {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>

        {/* Collapsible form */}
        {isOpen && (
          <div className="pb-6">
            {submitted ? (
              <div className="flex items-center justify-center gap-3 py-6 text-emerald-400">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Thanks for your feedback!</span>
              </div>
            ) : (
              <div className="max-w-lg mx-auto space-y-4">
                {/* Type selector */}
                <div className="flex gap-2">
                  {(Object.keys(TYPE_LABELS) as FeedbackType[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setType(t)}
                      className={`px-4 py-2 text-sm rounded transition ${
                        type === t
                          ? 'bg-white text-black font-medium'
                          : 'bg-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {TYPE_LABELS[t]}
                    </button>
                  ))}
                </div>

                {/* Message */}
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    type === 'bug'
                      ? 'What happened? What did you expect instead?'
                      : type === 'feature'
                      ? 'What would you like to see?'
                      : 'Tell us anything...'
                  }
                  className="w-full h-24 px-4 py-3 bg-zinc-900 border border-zinc-700 text-white text-sm rounded focus:border-zinc-500 outline-none transition resize-y"
                />

                {/* Email (optional) */}
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email (optional — if you want a response)"
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 text-white text-sm rounded focus:border-zinc-500 outline-none transition"
                />

                {/* Error */}
                {error && <p className="text-red-400 text-sm">{error}</p>}

                {/* Submit */}
                <div className="flex items-center justify-between">
                  <a
                    href="https://github.com/thealxlabs/ARCHITECT/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-zinc-600 hover:text-zinc-400 transition"
                  >
                    Or open a GitHub Issue →
                  </a>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting || message.trim().length < 5}
                    className="px-5 py-2 bg-white text-black hover:bg-zinc-200 disabled:bg-zinc-700 disabled:text-zinc-500 text-sm font-medium rounded transition flex items-center gap-2"
                  >
                    {submitting ? (
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    Submit
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </footer>
  );
};

export default ReportProblem;
