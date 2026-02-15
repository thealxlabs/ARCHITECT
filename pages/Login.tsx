import React, { useState } from 'react';
import { Github, Mail } from 'lucide-react';
import { signInWithGithub, signInWithGoogle, signInWithEmail } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGithubLogin = async () => {
    try {
      setLoading(true);
      setError('');
      await signInWithGithub();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await signInWithEmail(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold font-mono text-white mb-2">//ARCHITECT</h1>
          <p className="text-zinc-400">Sign in to analyze your code</p>
        </div>

        {/* OAuth Buttons */}
        <div className="space-y-3 mb-6">
          <button
            onClick={handleGithubLogin}
            disabled={loading}
            className="w-full px-6 py-3 bg-white text-black hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-500 font-bold transition flex items-center justify-center gap-3"
          >
            <Github className="w-5 h-5" />
            Continue with GitHub
          </button>

          <button
            onClick={handleGoogleLogin}
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
        <form onSubmit={handleEmailLogin} className="space-y-4">
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
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 text-white focus:border-white outline-none transition"
              placeholder="••••••••"
            />
            <div className="text-right mt-2">
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-sm text-zinc-400 hover:text-white transition"
              >
                Forgot password?
              </button>
            </div>
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
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="mt-6 text-center text-sm text-zinc-500">
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/signup')}
            className="text-white hover:underline"
          >
            Sign Up
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
  );
};

export default Login;
