import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Check Your Email</h2>
            <p className="text-zinc-400">
              We've sent a password reset link to <strong className="text-white">{email}</strong>
            </p>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="text-zinc-400 hover:text-white transition text-sm flex items-center justify-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold font-mono text-white mb-2">//ARCHITECT</h1>
          <p className="text-zinc-400">Reset your password</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 text-white focus:border-white outline-none transition"
              placeholder="you@example.com"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-950/20 border border-red-900/30 rounded text-red-300 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-white text-black hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-500 font-bold transition"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <p className="mt-6 text-center">
          <button
            onClick={() => navigate('/login')}
            className="text-sm text-zinc-500 hover:text-white transition flex items-center justify-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
