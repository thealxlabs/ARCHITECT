import React, { useState, useEffect } from 'react';
import { Github, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  private: boolean;
}

const GitHubAppInstall: React.FC = () => {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    checkInstallation();
  }, []);

  const checkInstallation = async () => {
    try {
      // Check if user has architect-tool installed
      const response = await fetch('https://api.github.com/user/installations', {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
        },
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        const architectInstall = data.installations?.find((i: any) => 
          i.app_slug === 'architect-tool'
        );

        if (architectInstall) {
          await loadRepos(architectInstall.id);
        }
      }
    } catch (err) {
      console.log('No GitHub app installed yet');
    } finally {
      setLoading(false);
    }
  };

  const loadRepos = async (installationId: number) => {
    try {
      const response = await fetch(
        `https://api.github.com/user/installations/${installationId}/repositories`,
        {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
          },
          credentials: 'include'
        }
      );

      if (response.ok) {
        const data = await response.json();
        setRepos(data.repositories || []);
      }
    } catch (err: any) {
      setError('Failed to load repositories');
    }
  };

  const handleInstall = () => {
    window.open('https://github.com/apps/architect-tool/installations/new', '_blank');
  };

  const handleAnalyzeRepo = (repoUrl: string) => {
    navigate(`/analyze?repo=${encodeURIComponent(repoUrl)}`);
  };

  if (loading) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <p className="text-zinc-400 text-sm">Checking GitHub connection...</p>
      </div>
    );
  }

  // No repos = app not installed
  if (repos.length === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
            <Github className="w-7 h-7 text-black" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-2">
              Connect GitHub Repositories
            </h3>
            <p className="text-sm text-zinc-400 mb-4">
              Install the ARCHITECT app to analyze your GitHub repos instantly
            </p>
            
            <button
              onClick={handleInstall}
              className="px-6 py-3 bg-white text-black hover:bg-zinc-200 font-bold transition text-sm"
            >
              Install GitHub App
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Has repos = show them!
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
            <Github className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Connected Repositories</h3>
            <p className="text-xs text-zinc-500">{repos.length} repo{repos.length !== 1 ? 's' : ''} available</p>
          </div>
        </div>

        <button
          onClick={handleInstall}
          className="text-sm text-zinc-400 hover:text-white transition"
        >
          Manage →
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-950/20 border border-red-900/30 rounded text-red-300 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {repos.map((repo) => (
          <div
            key={repo.id}
            className="flex items-center justify-between p-4 bg-zinc-800/50 border border-zinc-700 hover:border-zinc-600 transition rounded"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-white truncate">{repo.name}</h4>
                {repo.private && (
                  <span className="text-xs px-2 py-0.5 bg-zinc-700 text-zinc-300 rounded">
                    Private
                  </span>
                )}
              </div>
              {repo.description && (
                <p className="text-sm text-zinc-400 truncate">{repo.description}</p>
              )}
              {repo.language && (
                <p className="text-xs text-zinc-500 mt-1">{repo.language}</p>
              )}
            </div>

            <button
              onClick={() => handleAnalyzeRepo(repo.html_url)}
              className="ml-4 px-4 py-2 bg-white text-black hover:bg-zinc-200 font-bold text-sm transition flex items-center gap-2 flex-shrink-0"
            >
              Analyze
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GitHubAppInstall;
