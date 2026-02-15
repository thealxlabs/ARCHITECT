import React, { useState } from 'react';
import { CodemapResponse, DocumentationFiles, Diagrams } from '../types';
import { 
  FileText, 
  Activity, 
  Download, 
  Layout, 
  CheckCircle,
  Copy,
  ChevronRight,
  Terminal,
  ShieldAlert,
  AlertTriangle,
  Zap,
  ShieldCheck
} from 'lucide-react';

interface DocViewerProps {
  data: CodemapResponse;
  onReset: () => void;
}

type TabType = keyof DocumentationFiles | 'DIAGRAMS' | 'ANALYSIS';

const DocViewer: React.FC<DocViewerProps> = ({ data, onReset }) => {
  const [activeTab, setActiveTab] = useState<TabType>('README.md' as any);
  const [copied, setCopied] = useState(false);

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.metadata.repository_name.toLowerCase().replace(/\s+/g, '-')}-docs.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
     if (activeTab === 'DIAGRAMS' || activeTab === 'ANALYSIS') return;
     const content = data.documentation_files[activeTab as keyof DocumentationFiles];
     navigator.clipboard.writeText(content);
     setCopied(true);
     setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex h-screen bg-black overflow-hidden font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-black border-r border-zinc-800 flex flex-col z-20">
        <div className="p-6 border-b border-zinc-800">
          <h1 className="font-bold text-sm truncate tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-600">
            {data.metadata.repository_name}
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            <span className="text-[10px] font-mono text-zinc-500 uppercase">System Online</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 space-y-0.5">
          <div className="px-6 text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-4">Filesystem</div>
          {Object.keys(data.documentation_files).map((file) => (
            <button
              key={file}
              onClick={() => setActiveTab(file as TabType)}
              className={`w-full flex items-center justify-between px-6 py-2.5 text-xs font-medium transition-all border-l-2 ${
                activeTab === file 
                  ? 'border-white bg-zinc-900/50 text-white' 
                  : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileText className={`w-3.5 h-3.5 ${activeTab === file ? 'text-white' : 'text-zinc-700'}`} />
                {file}
              </div>
              {activeTab === file && <ChevronRight className="w-3 h-3 text-white" />}
            </button>
          ))}

          <div className="px-6 text-[10px] font-mono text-zinc-600 uppercase tracking-wider mt-8 mb-4">Diagnostics</div>
          <button
            onClick={() => setActiveTab('DIAGRAMS')}
            className={`w-full flex items-center gap-3 px-6 py-2.5 text-xs font-medium transition-all border-l-2 ${
              activeTab === 'DIAGRAMS' ? 'border-white bg-zinc-900/50 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/20'
            }`}
          >
            <Layout className={`w-3.5 h-3.5 ${activeTab === 'DIAGRAMS' ? 'text-white' : 'text-zinc-700'}`} />
            Architecture
          </button>
          <button
            onClick={() => setActiveTab('ANALYSIS')}
            className={`w-full flex items-center gap-3 px-6 py-2.5 text-xs font-medium transition-all border-l-2 ${
              activeTab === 'ANALYSIS' ? 'border-white bg-zinc-900/50 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/20'
            }`}
          >
            <Activity className={`w-3.5 h-3.5 ${activeTab === 'ANALYSIS' ? 'text-white' : 'text-zinc-700'}`} />
            Report Card
          </button>
        </nav>

        <div className="p-6 border-t border-zinc-800 bg-zinc-950">
          <button onClick={onReset} className="w-full py-2 text-[10px] uppercase tracking-widest text-zinc-500 hover:text-white border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900 transition-all">
            New Session
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-black relative">
        {/* Content Toolbar */}
        <header className="h-14 border-b border-zinc-800 flex items-center justify-between px-8 bg-black/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-3 text-zinc-500">
             <Terminal className="w-4 h-4" />
             <span className="font-mono text-xs text-zinc-300">~/docs/{activeTab.toLowerCase()}</span>
          </div>
          <div className="flex items-center gap-4">
            {activeTab !== 'DIAGRAMS' && activeTab !== 'ANALYSIS' && (
                <button onClick={copyToClipboard} className="text-xs font-mono text-zinc-500 hover:text-white flex items-center gap-2 transition-colors">
                  <Copy className="w-3 h-3" />
                  {copied ? 'COPIED' : 'COPY RAW'}
                </button>
            )}
            <button onClick={handleDownload} className="text-xs font-mono text-zinc-500 hover:text-white flex items-center gap-2 transition-colors">
              <Download className="w-3 h-3" />
              DOWNLOAD
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-8 md:p-12 scroll-smooth bg-technical">
           <div className="max-w-4xl mx-auto min-h-full">
              {activeTab === 'DIAGRAMS' ? (
                <DiagramsView diagrams={data.diagrams} />
              ) : activeTab === 'ANALYSIS' ? (
                <AnalysisView analysis={data.analysis} />
              ) : (
                <MarkdownPreview content={data.documentation_files[activeTab as keyof DocumentationFiles]} />
              )}
           </div>
        </main>
      </div>
    </div>
  );
};

const MarkdownPreview: React.FC<{ content: string }> = ({ content }) => {
  return (
    <div className="prose prose-invert prose-zinc max-w-none">
      <div className="font-mono text-sm text-zinc-300 leading-relaxed p-8 border border-zinc-800 bg-black shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-800 via-zinc-500 to-zinc-800 opacity-20"></div>
        <pre className="whitespace-pre-wrap">{content}</pre>
      </div>
    </div>
  );
};

const DiagramsView: React.FC<{ diagrams: Diagrams }> = ({ diagrams }) => {
  return (
    <div className="space-y-16">
      {Object.entries(diagrams).map(([key, mermaidCode]) => (
        <div key={key} className="border border-zinc-800 bg-black shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <div className="px-4 py-3 border-b border-zinc-800 bg-zinc-900/30 flex justify-between items-center backdrop-blur-sm">
            <div className="flex items-center gap-2">
                <Layout className="w-3 h-3 text-zinc-500" />
                <h3 className="font-bold text-xs text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500 uppercase tracking-wider">{key.replace('_', ' ')}</h3>
            </div>
            <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-zinc-800"></div>
                <div className="w-2 h-2 rounded-full bg-zinc-800"></div>
            </div>
          </div>
          <div className="p-8 overflow-x-auto bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
            <pre className="text-zinc-400 font-mono text-xs leading-relaxed opacity-80 hover:opacity-100 transition-opacity">{mermaidCode}</pre>
          </div>
        </div>
      ))}
    </div>
  );
};

const AnalysisView: React.FC<{ analysis: CodemapResponse['analysis'] }> = ({ analysis }) => {
  return (
    <div className="space-y-12 max-w-4xl">
      {/* Header */}
      <div className="flex items-end justify-between border-b border-zinc-800 pb-4">
        <div>
            <h2 className="text-2xl font-bold text-white mb-1">SYSTEM AUDIT</h2>
            <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Diagnostic Report v2.4.1</p>
        </div>
        <div className="text-right">
            <div className="text-3xl font-bold text-white">A+</div>
            <div className="text-[10px] font-mono text-zinc-500 uppercase">Overall Grade</div>
        </div>
      </div>

      {/* Strengths */}
      <section>
        <div className="flex items-center gap-2 mb-6">
            <Zap className="w-4 h-4 text-white" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Structural Integrity</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysis.strengths.map((s, i) => (
            <div key={i} className="p-4 bg-zinc-900/20 border border-zinc-800/50 hover:border-zinc-700 transition-colors flex items-start gap-3 group">
              <div className="mt-0.5 p-1 bg-emerald-500/10 rounded-full group-hover:bg-emerald-500/20 transition-colors">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <span className="text-sm text-zinc-300 font-light">{s}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Code Smells */}
      <section>
        <div className="flex items-center gap-2 mb-6">
            <AlertTriangle className="w-4 h-4 text-white" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Technical Debt</h3>
        </div>
        <div className="space-y-3">
          {analysis.code_smells.map((smell, i) => (
            <div key={i} className="flex flex-col md:flex-row gap-4 p-5 border-l-2 border-amber-500/50 bg-gradient-to-r from-zinc-900/40 to-transparent hover:from-zinc-900/60 transition-all">
              <div className="shrink-0 pt-1">
                 <span className="text-[10px] font-bold font-mono px-2 py-1 bg-amber-500/10 text-amber-500 rounded uppercase tracking-wider border border-amber-500/20">
                    {smell.severity}
                 </span>
              </div>
              <div>
                 <h4 className="text-zinc-200 text-sm font-medium mb-1 flex items-center gap-2">
                    {smell.issue}
                 </h4>
                 <p className="text-zinc-500 text-xs font-mono leading-relaxed">{smell.recommendation}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Security */}
      <section>
        <div className="flex items-center gap-2 mb-6">
            <ShieldCheck className="w-4 h-4 text-white" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Vulnerability Vectors</h3>
        </div>
        
        {analysis.security_concerns.length === 0 ? (
          <div className="p-8 border border-dashed border-zinc-800 bg-zinc-950/50 text-center">
            <ShieldCheck className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-500 text-sm font-mono">// NO_CRITICAL_THREATS_DETECTED</p>
          </div>
        ) : (
           <div className="grid gap-4">
            {analysis.security_concerns.map((issue, i) => (
              <div key={i} className="relative p-5 border border-red-900/30 bg-red-950/5 hover:bg-red-950/10 transition-colors overflow-hidden group">
                {/* Background Pattern */}
                <div className="absolute -right-4 -top-4 text-red-900/10 group-hover:text-red-900/20 transition-colors">
                    <ShieldAlert className="w-24 h-24" />
                </div>
                
                <div className="relative z-10 flex gap-4">
                    <div className="pt-1">
                       <ShieldAlert className="w-4 h-4 text-red-500" />
                    </div>
                    <div>
                       <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-white text-sm font-bold tracking-wide">{issue.vulnerability}</h4>
                          <span className="text-[10px] border border-red-500 text-red-500 px-1.5 py-0.5 font-bold uppercase tracking-widest">
                            {issue.severity}
                          </span>
                       </div>
                       <p className="text-zinc-400 text-xs font-mono">
                         <span className="text-red-400">REMEDIATION ::</span> {issue.remediation}
                       </p>
                    </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default DocViewer;