import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Code, FileText, Search, BarChart3, Settings, Clock } from 'lucide-react';
import { supabase, signOut, getCurrentUser } from '../lib/supabase';
import GitHubRepoSelector from '../components/GitHubRepoSelector';
import ReportProblem from '../components/ReportProblem';

interface Analysis {
  id: string;
  project_name: string;
  language: string;
  overall_score: number;
  created_at: string;
}

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [displayName, setDisplayName] = useState('');
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadUser();
    loadAnalyses();
  }, []);

  const loadUser = async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
    
    // Get display name from metadata or email
    const name = currentUser?.user_metadata?.full_name || 
                 currentUser?.user_metadata?.name ||
                 currentUser?.email?.split('@')[0] || 
                 'User';
    setDisplayName(name);
  };

  const loadAnalyses = async () => {
    try {
      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setAnalyses(data || []);
    } catch (error) {
      console.error('Error loading analyses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  const tools = [
    {
      icon: Code,
      title: 'Code Analysis',
      description: 'Analyze any codebase and get instant insights',
      color: 'emerald',
      path: '/analyze'
    },
    {
      icon: FileText,
      title: 'Documentation',
      description: 'Generate comprehensive docs for your code',
      color: 'blue',
      path: '/analyze'
    },
    {
      icon: Search,
      title: 'Code Search',
      description: 'Search through your analyzed projects',
      color: 'purple',
      path: '/search',
      badge: 'Soon'
    },
    {
      icon: BarChart3,
      title: 'Project Stats',
      description: 'View trends and improve over time',
      color: 'yellow',
      path: '/stats',
      badge: 'Soon'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-black sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="font-bold font-mono text-2xl text-white">//A</div>
          
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 px-4 py-2 border border-zinc-700 hover:border-white transition"
            >
              <div className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center font-bold text-sm">
                {displayName?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="hidden md:inline font-medium">{displayName || 'User'}</span>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-zinc-900 border border-zinc-800 shadow-2xl">
                <div className="p-4 border-b border-zinc-800">
                  <p className="font-medium text-white truncate">{displayName}</p>
                  <p className="text-sm text-zinc-400 truncate">{user?.email}</p>
                </div>
                <button
                  onClick={() => { navigate('/settings'); setShowProfileMenu(false); }}
                  className="w-full px-4 py-3 text-left text-sm hover:bg-zinc-800 transition flex items-center gap-3"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 text-left text-sm hover:bg-zinc-800 transition flex items-center gap-3 border-t border-zinc-800"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12 flex-1">
        {/* Welcome */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {displayName.split(' ')[0]}!</h1>
          <p className="text-zinc-400">What would you like to do today?</p>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {tools.map((tool, index) => (
            <button
              key={index}
              onClick={() => tool.path && navigate(tool.path)}
              disabled={tool.badge === 'Soon'}
              className="relative bg-zinc-900/50 border border-zinc-800 hover:border-zinc-600 transition p-6 text-left disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {tool.badge && (
                <span className="absolute top-3 right-3 text-xs px-2 py-1 bg-zinc-800 text-zinc-400 rounded">
                  {tool.badge}
                </span>
              )}
              <div className={`w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-white/20 transition`}>
                <tool.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold mb-2">{tool.title}</h3>
              <p className="text-sm text-zinc-400">{tool.description}</p>
            </button>
          ))}
        </div>

        {/* GitHub Repo Selector */}
        <div className="mb-12">
          <GitHubRepoSelector />
        </div>

        {/* Recent Analyses */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Clock className="w-6 h-6" />
              Recent Analyses
            </h2>
            {analyses.length > 0 && (
              <button
                onClick={() => navigate('/history')}
                className="text-sm text-zinc-400 hover:text-white transition"
              >
                View all →
              </button>
            )}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : analyses.length === 0 ? (
            <div className="text-center py-12 border border-zinc-800 rounded bg-zinc-900/30">
              <Code className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">No Analyses Yet</h3>
              <p className="text-zinc-400 mb-6">Start by analyzing your first codebase</p>
              <button
                onClick={() => navigate('/analyze')}
                className="px-6 py-3 bg-white text-black hover:bg-zinc-200 font-bold transition"
              >
                Analyze Code
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {analyses.map((analysis) => (
                <button
                  key={analysis.id}
                  onClick={() => navigate(`/results/${analysis.id}`)}
                  className="bg-zinc-900/50 border border-zinc-800 hover:border-zinc-600 transition p-6 text-left group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2 group-hover:text-white transition">
                        {analysis.project_name}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-zinc-400">
                        <span>{analysis.language || 'Unknown'}</span>
                        <span>•</span>
                        <span>Score: {analysis.overall_score}/10</span>
                        <span>•</span>
                        <span>{formatDate(analysis.created_at)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${
                        analysis.overall_score >= 8 ? 'text-emerald-500' :
                        analysis.overall_score >= 6 ? 'text-blue-500' :
                        analysis.overall_score >= 4 ? 'text-yellow-500' : 'text-red-500'
                      }`}>
                        {analysis.overall_score}/10
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
      <ReportProblem />
    </div>
  );
};

export default Dashboard;
