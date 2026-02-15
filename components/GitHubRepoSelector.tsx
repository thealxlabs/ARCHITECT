import React, { useState, useEffect } from 'react';
import { Github, ChevronDown, ExternalLink, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  private: boolean;
}

const GitHubRepoSelector: React.FC = () => {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(false);
  const [githubConnected, setGithubConnected] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkGitHubConnection();
  }, []);

  const checkGitHubConnection = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Check if user has GitHub provider
      const hasGitHub = user?.app_metadata?.providers?.includes('github');
      setGithubConnected(!!hasGitHub);
      
      if (hasGitHub) {
        loadRepos();
      }
    } catch (error) {
      console.error('Error checking GitHub:', error);
    }
  };

  const loadRepos = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const githubToken = session?.provider_token;
      
      if (!githubToken) {
        console.log('No GitHub token found');
        setLoading(false);
        return;
      }

      // Fetch user's repos from GitHub
      const response = await fetch('https://api.github.com/user/repos?sort=updated&per_page=50', {
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRepos(data);
      } else {
        console.error('Failed to fetch repos:', response.status);
      }
    } catch (error) {
      console.error('Error loading repos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectGitHub = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        scopes: 'repo read:user',
        redirectTo: window.location.origin + '/dashboard'
      }
    });
  };

  const handleSelectRepo = (repoUrl: string) => {
    navigate(`/analyze?repo=${encodeURIComponent(repoUrl)}`);
    setShowDropdown(false);
  };

  if (!githubConnected) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
            <Github className="w-7 h-7 text-black" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-2">
              Connect Your GitHub
            </h3>
            <p className="text-sm text-zinc-400 mb-4">
              Link your GitHub account to quickly select and analyze your repositories
            </p>
            
            <button
              onClick={handleConnectGitHub}
              className="px-6 py-3 bg-white text-black hover:bg-zinc-200 font-bold transition text-sm flex items-center gap-2"
            >
              <Github className="w-4 h-4" />
              Connect GitHub
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
            <Github className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Your Repositories</h3>
            <p className="text-xs text-zinc-500">
              {loading ? 'Loading...' : `${repos.length} repos available`}
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader className="w-6 h-6 text-zinc-400 animate-spin" />
        </div>
      ) : repos.length === 0 ? (
        <p className="text-sm text-zinc-400 py-4">No repositories found</p>
      ) : (
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 hover:border-zinc-600 transition text-left flex items-center justify-between"
          >
            <span className="text-white">Select a repository to analyze</span>
            <ChevronDown className={`w-5 h-5 text-zinc-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-800 border border-zinc-700 rounded max-h-96 overflow-y-auto z-50 shadow-2xl">
              {repos.map((repo) => (
                <button
                  key={repo.id}
                  onClick={() => handleSelectRepo(repo.html_url)}
                  className="w-full px-4 py-3 hover:bg-zinc-700 transition text-left border-b border-zinc-700 last:border-b-0"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-white truncate">{repo.full_name}</p>
                        {repo.private && (
                          <span className="text-xs px-2 py-0.5 bg-zinc-600 text-zinc-300 rounded flex-shrink-0">
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
                    <ExternalLink className="w-4 h-4 text-zinc-500 ml-3 flex-shrink-0" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GitHubRepoSelector;
