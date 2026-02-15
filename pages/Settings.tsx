import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Lock, Mail } from 'lucide-react';
import { supabase, getCurrentUser } from '../lib/supabase';
import ReportProblem from '../components/ReportProblem';

const Settings: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [displayName, setDisplayName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [customApiKey, setCustomApiKey] = useState('');
  const [useCustomKey, setUseCustomKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
    setDisplayName(currentUser?.user_metadata?.display_name || '');
    
    // Load custom API key from localStorage
    const savedKey = localStorage.getItem('custom_openrouter_key');
    if (savedKey) {
      setCustomApiKey(savedKey);
      setUseCustomKey(true);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { error } = await supabase.auth.updateUser({
        data: { display_name: displayName }
      });

      if (error) throw error;
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      setMessage('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveApiKey = () => {
    if (useCustomKey && customApiKey.trim()) {
      localStorage.setItem('custom_openrouter_key', customApiKey.trim());
      setMessage('Custom API key saved! It will be used for all analyses.');
    } else {
      localStorage.removeItem('custom_openrouter_key');
      setMessage('Using default OpenRouter API key.');
    }
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <header className="border-b border-zinc-800">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="font-bold font-mono text-2xl">//A</div>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-zinc-400 hover:text-white transition text-sm flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 flex-1">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        {message && (
          <div className="mb-6 p-4 bg-emerald-950/20 border border-emerald-900/30 rounded text-emerald-300">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-950/20 border border-red-900/30 rounded text-red-300">
            {error}
          </div>
        )}

        {/* Profile Section */}
        <div className="mb-12 bg-zinc-900 border border-zinc-800 rounded-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-5 h-5" />
            <h2 className="text-xl font-bold">Profile</h2>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Alexander Wondwossen"
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 text-white focus:border-white outline-none transition"
              />
              <p className="text-xs text-zinc-500 mt-2">This will be shown instead of your email</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Email</label>
              <div className="flex items-center gap-2 px-4 py-3 bg-zinc-800 border border-zinc-700 text-zinc-500">
                <Mail className="w-4 h-4" />
                {user?.email}
              </div>
              <p className="text-xs text-zinc-500 mt-2">Email cannot be changed</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-white text-black hover:bg-zinc-200 disabled:bg-zinc-700 disabled:text-zinc-500 font-bold transition"
            >
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </div>

        {/* Password Section */}
        <div className="mb-12 bg-zinc-900 border border-zinc-800 rounded-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-5 h-5" />
            <h2 className="text-xl font-bold">Change Password</h2>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={6}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 text-white focus:border-white outline-none transition"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={6}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 text-white focus:border-white outline-none transition"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !newPassword}
              className="px-6 py-3 bg-white text-black hover:bg-zinc-200 disabled:bg-zinc-700 disabled:text-zinc-500 font-bold transition"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* API Key Section */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            <h2 className="text-xl font-bold">OpenRouter API Key</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <input
                type="checkbox"
                id="useCustomKey"
                checked={useCustomKey}
                onChange={(e) => setUseCustomKey(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="useCustomKey" className="text-sm text-zinc-300">
                Use my own OpenRouter API key
              </label>
            </div>

            {useCustomKey && (
              <>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    OpenRouter API Key
                  </label>
                  <input
                    type="password"
                    value={customApiKey}
                    onChange={(e) => setCustomApiKey(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 text-white focus:border-white outline-none transition font-mono text-sm"
                    placeholder="sk-or-v1-..."
                  />
                  <p className="text-xs text-zinc-500 mt-2">
                    Get your API key from{' '}
                    <a
                      href="https://openrouter.ai/keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:underline"
                    >
                      OpenRouter.ai
                    </a>
                  </p>
                </div>

                <div className="p-4 bg-blue-950/20 border border-blue-900/30 rounded">
                  <p className="text-sm text-blue-300">
                    <strong>Why use your own key?</strong>
                    <br />
                    • No rate limits
                    <br />
                    • Pay only for what you use
                    <br />• Choose premium models (GPT-4, Claude, etc.)
                  </p>
                </div>
              </>
            )}

            {!useCustomKey && (
              <div className="p-4 bg-zinc-800 border border-zinc-700 rounded">
                <p className="text-sm text-zinc-400">
                  You're using the shared OpenRouter API key. This works great for most users!
                </p>
              </div>
            )}

            <button
              onClick={handleSaveApiKey}
              className="px-6 py-3 bg-white text-black hover:bg-zinc-200 font-bold transition"
            >
              Save API Settings
            </button>
          </div>
        </div>
      </main>
      <ReportProblem />
    </div>
  );
};

export default Settings;
