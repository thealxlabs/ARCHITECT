import React, { useState } from 'react';
import { Github } from 'lucide-react';
import { signInWithGithub, signInWithGoogle, signUpWithEmail } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import ReportProblem from '../components/ReportProblem';

const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleGithubSignup = async () => {
    try {
      setLoading(true);
      setError('');
      await signInWithGithub();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setLoading(true);
      setError('');
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await signUpWithEmail(email, password);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Check Your Email</h2>
            <p className="text-zinc-400">
              We've sent you a confirmation link to <strong className="text-white">{email}</strong>
            </p>
            <p className="text-zinc-500 text-sm mt-4">
              Click the link in the email to verify your account and start analyzing code.
            </p>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="text-zinc-400 hover:text-white transition text-sm"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold font-mono text-white mb-2">//ARCHITECT</h1>
          <p className="text-zinc-400">Create your account</p>
        </div>

        {/* OAuth Buttons */}
        <div className="space-y-3 mb-6">
          <button
            onClick={handleGithubSignup}
            disabled={loading}
            className="w-full px-6 py-3 bg-white text-black hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-500 font-bold transition flex items-center justify-center gap-3"
          >
            <Github className="w-5 h-5" />
            Continue with GitHub
          </button>

          <button
            onClick={handleGoogleSignup}
            disabled={loading}
            className="w-full px-6 py-3 border border-zinc-700 text-white hover:border-white disabled:border-zinc-800 disabled:text-zinc-500 font-bold transition flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-800"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-black text-zinc-500">OR</span>
          </div>
        </div>

        {/* Email Form */}
        <form onSubmit={handleEmailSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 text-white focus:border-white outline-none transition"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 text-white focus:border-white outline-none transition"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 text-white focus:border-white outline-none transition"
              placeholder="••••••••"
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
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        {/* Login Link */}
        <p className="mt-6 text-center text-sm text-zinc-500">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-white hover:underline"
          >
            Sign In
          </button>
        </p>

        {/* Back Home */}
        <p className="mt-4 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-zinc-500 hover:text-white transition"
          >
            ← Back to Homepage
          </button>
        </p>
      </div>
      </div>
      <ReportProblem />
    </div>
  );
};

export default Signup;
