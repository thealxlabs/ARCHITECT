import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Github } from 'lucide-react';

const InstallSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [installationId, setInstallationId] = useState('');
  const [setupAction, setSetupAction] = useState('');

  useEffect(() => {
    const id = searchParams.get('installation_id');
    const action = searchParams.get('setup_action');
    if (id) setInstallationId(id);
    if (action) setSetupAction(action);
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-zinc-800">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="font-bold font-mono text-2xl">//ARCHITECT</div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-20 text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-emerald-500" />
          </div>
          
          <h1 className="text-4xl font-bold mb-4">
            {setupAction === 'install' ? 'App Installed!' : 'Setup Complete!'}
          </h1>
          
          <p className="text-zinc-400 text-lg mb-8">
            ARCHITECT can now analyze your GitHub repositories.
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 mb-8">
          <h2 className="text-xl font-bold mb-6">🚀 How to Use ARCHITECT</h2>
          
          <div className="text-left space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <p className="font-semibold text-white mb-1">Go to Dashboard</p>
                <p className="text-sm text-zinc-400">Click "New Analysis" to get started</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <p className="font-semibold text-white mb-1">Paste Your Repo URL</p>
                <p className="text-sm text-zinc-400">Example: https://github.com/yourusername/yourrepo</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <p className="font-semibold text-white mb-1">Get AI Insights</p>
                <p className="text-sm text-zinc-400">Documentation, scores, and security analysis in seconds</p>
              </div>
            </div>
          </div>
        </div>

        {installationId && (
          <div className="mb-8 p-4 bg-zinc-900 border border-zinc-800 rounded">
            <p className="text-xs text-zinc-500 mb-1">Installation ID</p>
            <p className="text-sm text-white font-mono">{installationId}</p>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto px-8 py-4 bg-white text-black hover:bg-zinc-200 font-bold transition"
          >
            Go to Dashboard
          </button>
          
          <p className="text-sm text-zinc-500">
            You can manage permissions anytime in{' '}
            <a
              href="https://github.com/settings/installations"
              className="text-white hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub settings
            </a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default InstallSuccess;
