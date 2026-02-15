import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import InputSection from '../components/InputSection';
import AnalysisLoader from '../components/AnalysisLoader';
import ReportProblem from '../components/ReportProblem';
import { supabase, getCurrentUser } from '../lib/supabase';
import { aiService } from '../services/universalAIService';

enum PageState {
  INPUT = 'INPUT',
  ANALYZING = 'ANALYZING',
  ERROR = 'ERROR'
}

const AnalyzePage: React.FC = () => {
  const [pageState, setPageState] = useState<PageState>(PageState.INPUT);
  const [error, setError] = useState<string | null>(null);
  const [initialRepo, setInitialRepo] = useState<string>('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const repoParam = searchParams.get('repo');
    if (repoParam) {
      setInitialRepo(repoParam);
    }
  }, [searchParams]);

  const startAnalysis = async (input: string) => {
    setPageState(PageState.ANALYZING);
    setError(null);

    try {
      console.log("Starting analysis...");
      const result = await aiService.analyzeCodebase(input);
      console.log("Analysis complete:", result);

      const user = await getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      let projectName = 'Code Analysis';
      if (input.includes('github.com')) {
        const match = input.match(/github\.com\/[^\/]+\/([^\/\s]+)/);
        if (match) projectName = match[1];
      } else if (input.includes('# ')) {
        const match = input.match(/# (.+)/);
        if (match) projectName = match[1];
      }

      // Map from whatever the AI returns - check all possible field names
      const whatsGreat = result.whats_great || result.what_works_well || result.whatsGreat || result.working_well || result.strengths || [];
      const needsImprovement = result.needs_improvement || result.what_needs_improvement || result.needsImprovement || result.improvements || [];
      const securityConcerns = result.security_concerns || result.security_issues || result.securityConcerns || result.securityIssues || [];

      console.log("Mapped: whats_great=%d, needs_improvement=%d, security=%d", whatsGreat.length, needsImprovement.length, securityConcerns.length);

      const normalizedResult = {
        metadata: {
          repository_name: result.repository_name || result.projectName || projectName,
          primary_language: result.language || result.primaryLanguage || "Unknown",
          complexity_score: result.overall_score || result.overallScore || result.scores?.complexity || 5,
          overall_score: result.overall_score || result.overallScore || 5
        },
        scores: result.scores || {},
        documentation_files: result.documentation || result.documentation_files || {},
        diagrams: result.diagrams || {},
        analysis: {
          whats_great: whatsGreat,
          needs_improvement: needsImprovement,
          security_concerns: securityConcerns
        }
      };

      console.log("Normalized result:", JSON.stringify(normalizedResult, null, 2));

      const { data: savedAnalysis, error: dbError } = await supabase
        .from('analyses')
        .insert({
          user_id: user.id,
          project_name: normalizedResult.metadata.repository_name,
          language: normalizedResult.metadata.primary_language,
          file_count: 0,
          overall_score: normalizedResult.metadata.overall_score,
          scores: normalizedResult.scores,
          analysis_data: normalizedResult
        })
        .select()
        .maybeSingle();

      if (dbError) throw dbError;
      if (!savedAnalysis) throw new Error('Failed to save analysis');

      console.log("Saved to database:", savedAnalysis);

      navigate(`/results/${savedAnalysis.id}`);

    } catch (err: any) {
      console.error("Analysis error:", err);
      setError(err?.message || "Analysis Failed");
      setPageState(PageState.ERROR);
    }
  };

  if (pageState === PageState.ANALYZING) {
    return <AnalysisLoader onCancel={() => setPageState(PageState.INPUT)} />;
  }

  if (pageState === PageState.ERROR) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md w-full border border-red-500/50 bg-red-950/20 p-8 rounded-lg text-center">
          <h3 className="text-white text-xl font-bold mb-4">ERROR</h3>
          <p className="text-red-300 mb-6">{error}</p>
          <button
            onClick={() => setPageState(PageState.INPUT)}
            className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <header className="border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="font-bold font-mono text-2xl text-white">//A</div>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-zinc-400 hover:text-white transition text-sm flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>
      </header>

      <div className="flex-1">
        <InputSection 
          onAnalyze={startAnalysis}
          onBack={() => navigate('/dashboard')}
          initialInput={initialRepo}
        />
      </div>
      <ReportProblem />
    </div>
  );
};

export default AnalyzePage;
