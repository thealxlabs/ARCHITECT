import React, { useState, useEffect } from 'react';
import { Github, ChevronDown, Loader } from 'lucide-react';
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

interface Props {
  onSelectRepo: (url: string) => void;
}

const GitHubRepoDropdown: React.FC<Props> = ({ onSelectRepo }) => {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<string>('');

  useEffect(() => {
    loadRepos();
  }, []);

  const loadRepos = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const githubToken = session?.provider_token;
      
      if (!githubToken) {
        setLoading(false);
        return;
      }

      const response = await fetch('https://api.github.com/user/repos?sort=updated&per_page=50', {
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRepos(data);
      }
    } catch (error) {
      console.error('Error loading repos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (repo: GitHubRepo) => {
    setSelectedRepo(repo.full_name);
    onSelectRepo(repo.html_url);
    setShowDropdown(false);
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-zinc-400 text-sm">
        <Loader className="w-4 h-4 animate-spin" />
        Loading your repos...
      </div>
    );
  }

  if (repos.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      <p className="text-sm text-zinc-400 mb-2">Or select from your repos:</p>
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 hover:border-zinc-600 transition text-left flex items-center justify-between"
        >
          <span className="text-white truncate">
            {selectedRepo || 'Select a repository...'}
          </span>
          <ChevronDown className={`w-5 h-5 text-zinc-400 transition-transform flex-shrink-0 ml-2 ${showDropdown ? 'rotate-180' : ''}`} />
        </button>

        {showDropdown && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-800 border border-zinc-700 rounded max-h-80 overflow-y-auto z-50 shadow-2xl">
            {repos.map((repo) => (
              <button
                key={repo.id}
                onClick={() => handleSelect(repo)}
                className="w-full px-4 py-3 hover:bg-zinc-700 transition text-left border-b border-zinc-700 last:border-b-0"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Github className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                  <p className="font-semibold text-white truncate">{repo.full_name}</p>
                  {repo.private && (
                    <span className="text-xs px-2 py-0.5 bg-zinc-600 text-zinc-300 rounded flex-shrink-0">
                      Private
                    </span>
                  )}
                </div>
                {repo.description && (
                  <p className="text-sm text-zinc-400 truncate ml-6">{repo.description}</p>
                )}
                {repo.language && (
                  <p className="text-xs text-zinc-500 mt-1 ml-6">{repo.language}</p>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GitHubRepoDropdown;
