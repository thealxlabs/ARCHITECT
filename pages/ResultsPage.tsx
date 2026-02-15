import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Copy } from 'lucide-react';
import { supabase, getCurrentUser } from '../lib/supabase';
import ReportProblem from '../components/ReportProblem';

const ResultsPage: React.FC = () => {
  const { id, token } = useParams();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadAnalysis();
  }, [id, token]);

  const loadAnalysis = async () => {
    try {
      let query = supabase.from('analyses').select('*');

      // Load by ID or share token
      if (id) {
        query = query.eq('id', id);
      } else if (token) {
        query = query.eq('share_token', token).eq('is_public', true);
      }

      const { data, error: fetchError } = await query.single();

      if (fetchError) throw fetchError;
      if (!data) throw new Error('Analysis not found');

      setAnalysis(data);

      // Check if current user is owner
      const user = await getCurrentUser();
      setIsOwner(user?.id === data.user_id);

    } catch (err: any) {
      console.error('Error loading analysis:', err);
      setError(err.message || 'Failed to load analysis');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!analysis.share_token) {
      // Generate share token
      const newToken = Math.random().toString(36).substring(2, 15);
      try {
        const { error: updateError } = await supabase
          .from('analyses')
          .update({ share_token: newToken, is_public: true })
          .eq('id', analysis.id);

        if (updateError) throw updateError;

        const shareUrl = `${window.location.origin}/share/${newToken}`;
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);

        // Reload analysis
        loadAnalysis();
      } catch (err: any) {
        alert('Failed to create share link');
      }
    } else {
      const shareUrl = `${window.location.origin}/share/${analysis.share_token}`;
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-zinc-400">Loading analysis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <h3 className="text-white text-xl font-bold mb-4">Not Found</h3>
          <p className="text-zinc-400 mb-6">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-white text-black hover:bg-zinc-200 font-bold transition"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const analysisData = analysis.analysis_data || {};
  const metadata = analysisData.metadata || {};
  const docs = analysisData.documentation_files || {};
  
  // FIXED: Try multiple locations for analysis details
  let analysisDetails = analysisData.analysis || {};
  if (!analysisDetails.whats_great && analysisData.whats_great) {
    // If analysis.analysis doesn't have the data, try root level
    analysisDetails = analysisData;
  }
  
  const scores = analysis.scores || {};

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-black sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-zinc-400 hover:text-white transition text-sm flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          {isOwner && (
            <button
              onClick={handleShare}
              className="px-4 py-2 border border-zinc-700 hover:border-white text-sm transition flex items-center gap-2"
            >
              {copied ? (
                <>
                  <Copy className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  Share
                </>
              )}
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-4 md:p-8 flex-1">
        {/* Title */}
        <div className="mb-8 pb-6 border-b border-zinc-700">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {analysis.project_name}
          </h1>
          <p className="text-zinc-400">
            {analysis.language || "Unknown"} • 
            Overall Score: <span className="text-white font-bold">{analysis.overall_score || "N/A"}/10</span>
          </p>
        </div>

        {/* Scores Section */}
        {Object.keys(scores).length > 0 && (
          <div className="mb-12 bg-zinc-900 border border-zinc-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              📊 Quality Scores
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(scores).map(([key, value]: [string, any]) => {
                const score = typeof value === 'number' ? value : 5;
                const percentage = (score / 10) * 100;
                const color = score >= 8 ? 'emerald' : score >= 6 ? 'blue' : score >= 4 ? 'yellow' : 'red';
                
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-zinc-300 capitalize">
                        {key.replace(/_/g, ' ')}
                      </span>
                      <span className={`text-lg font-bold text-${color}-500`}>{score}/10</span>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-2">
                      <div 
                        className={`bg-${color}-500 h-2 rounded-full transition-all`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Documentation */}
        {Object.keys(docs).length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-bold mb-6">📚 Documentation</h2>
            {Object.entries(docs).map(([name, content]: [string, any]) => (
              <details key={name} className="mb-4 bg-zinc-900 border border-zinc-700 rounded" open={name === 'README.md'}>
                <summary className="px-6 py-4 cursor-pointer hover:bg-zinc-800 font-mono text-sm">
                  {name}
                </summary>
                <div className="p-6 border-t border-zinc-700">
                  <pre className="text-sm text-zinc-300 whitespace-pre-wrap overflow-x-auto">
                    {content}
                  </pre>
                </div>
              </details>
            ))}
          </div>
        )}

        {/* Analysis */}
        {analysisDetails && (
          <div>
            <h2 className="text-xl font-bold mb-6">🔍 Analysis</h2>
            
            {/* What's Great */}
            {analysisDetails.whats_great && analysisDetails.whats_great.length > 0 && (
              <div className="mb-6 bg-emerald-950/20 border border-emerald-900/30 rounded p-6">
                <h3 className="font-bold mb-3 text-emerald-400 text-lg">✓ What's Working Well</h3>
                <ul className="space-y-2">
                  {analysisDetails.whats_great.map((item: any, i: number) => (
                    <li key={i} className="text-zinc-300 flex items-start gap-3">
                      <span className="text-emerald-500 mt-1">•</span>
                      <div>
                        <span>{typeof item === 'string' ? item : item.description || item.point || JSON.stringify(item)}</span>
                        {typeof item === 'object' && item.reason && (
                          <p className="text-sm text-zinc-500 mt-1">{item.reason}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Needs Improvement */}
            {analysisDetails.needs_improvement && analysisDetails.needs_improvement.length > 0 && (
              <div className="mb-6 bg-amber-950/20 border border-amber-900/30 rounded p-6">
                <h3 className="font-bold mb-3 text-amber-400 text-lg">⚠️ Needs Improvement</h3>
                {analysisDetails.needs_improvement.map((item: any, i: number) => (
                  <div key={i} className="mb-3 border-l-2 border-amber-600 pl-4">
                    <p className="font-semibold text-zinc-200">
                      {typeof item === 'string' ? item : item.issue || item.description || item.problem}
                    </p>
                    {typeof item === 'object' && (item.how_to_fix || item.reason) && (
                      <p className="text-sm text-zinc-400 mt-1">{item.how_to_fix || item.reason}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Security Concerns */}
            {analysisDetails.security_concerns && analysisDetails.security_concerns.length > 0 && (
              <div className="bg-red-950/20 border border-red-900/30 rounded p-6">
                <h3 className="font-bold mb-3 text-red-400 text-lg">🔒 Security Concerns</h3>
                {analysisDetails.security_concerns.map((item: any, i: number) => (
                  <div key={i} className="mb-3 border-l-2 border-red-600 pl-4">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-zinc-200">
                        {typeof item === 'string' ? item : item.problem || item.description || item.vulnerability}
                      </p>
                      {typeof item === 'object' && (item.risk_level || item.severity) && (
                        <span className={`text-xs px-2 py-1 rounded ${
                          (item.risk_level || item.severity) === 'critical' || (item.risk_level || item.severity) === 'High' ? 'bg-red-900/50 text-red-300' :
                          (item.risk_level || item.severity) === 'important' || (item.risk_level || item.severity) === 'Medium' ? 'bg-orange-900/50 text-orange-300' :
                          'bg-yellow-900/50 text-yellow-300'
                        }`}>
                          {item.risk_level || item.severity}
                        </span>
                      )}
                    </div>
                    {typeof item === 'object' && (item.fix || item.suggestion || item.reason) && (
                      <p className="text-sm text-zinc-400">{item.fix || item.suggestion || item.reason}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <ReportProblem />
    </div>
  );
};

export default ResultsPage;
