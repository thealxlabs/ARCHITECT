/** Scores returned by the AI for each analysis category */
export interface AnalysisScores {
  code_quality: number;
  security: number;
  performance: number;
  documentation: number;
}

/** A single "what's great" item from the analysis */
export interface StrengthItem {
  description: string;
  reason: string;
}

/** A single improvement suggestion from the analysis */
export interface ImprovementItem {
  issue: string;
  how_to_fix: string;
}

/** A single security concern from the analysis */
export interface SecurityConcernItem {
  problem: string;
  risk_level: 'critical' | 'important' | 'minor';
  fix: string;
}

/** The normalized analysis structure stored in the database */
export interface NormalizedAnalysis {
  metadata: {
    repository_name: string;
    primary_language: string;
    complexity_score: number;
    overall_score: number;
  };
  scores: AnalysisScores;
  documentation_files: Record<string, string>;
  diagrams: Record<string, string>;
  analysis: {
    whats_great: StrengthItem[];
    needs_improvement: ImprovementItem[];
    security_concerns: SecurityConcernItem[];
  };
}

/** Raw response shape from the AI (may vary — the normalizer handles mismatches) */
export interface RawAIResponse {
  overall_score?: number;
  language?: string;
  scores?: Partial<AnalysisScores>;
  whats_great?: StrengthItem[];
  what_works_well?: StrengthItem[];
  needs_improvement?: ImprovementItem[];
  what_needs_improvement?: ImprovementItem[];
  security_concerns?: SecurityConcernItem[];
  security_issues?: SecurityConcernItem[];
  [key: string]: unknown;
}

/** A saved analysis row from the database */
export interface SavedAnalysis {
  id: string;
  user_id: string;
  project_name: string;
  language: string;
  file_count: number;
  overall_score: number;
  scores: AnalysisScores;
  analysis_data: NormalizedAnalysis;
  share_token?: string;
  is_public: boolean;
  created_at: string;
}

/** UI loading step for the analysis progress animation */
export interface AnalysisStep {
  id: number;
  label: string;
  status: 'pending' | 'active' | 'completed';
}

// ---------------------------------------------------------------------------
// Legacy types — used by DocViewer.tsx. Keep for backward compatibility.
// ---------------------------------------------------------------------------

export interface DocumentationFiles {
  "README.md": string;
  "ARCHITECTURE.md": string;
  "API.md": string;
  "SETUP.md": string;
  "CONTRIBUTING.md": string;
  "TROUBLESHOOTING.md": string;
}

export interface Diagrams {
  system_architecture: string;
  data_flow: string;
  component_relationships: string;
  database_schema: string;
}

export interface Metadata {
  repository_name: string;
  analysis_timestamp: string;
  primary_language: string;
  framework: string;
  complexity_score: number;
  documentation_quality_score: number;
}

export interface Analysis {
  strengths: string[];
  code_smells: Array<{ issue: string; severity: string; recommendation: string }>;
  security_concerns: Array<{ vulnerability: string; severity: string; remediation: string }>;
  missing_documentation: string[];
}

export interface CodemapResponse {
  metadata: Metadata;
  documentation_files: DocumentationFiles;
  diagrams: Diagrams;
  analysis: Analysis;
}
