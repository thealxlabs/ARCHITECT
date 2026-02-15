import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Terminal, Code, Github, FolderOpen, FileArchive, Sparkles, AlertTriangle } from 'lucide-react';
import GitHubRepoDropdown from './GitHubRepoDropdown';
import { scanForSecrets } from '../services/universalAIService';

interface InputSectionProps {
  onAnalyze: (input: string) => void;
  onBack: () => void;
  initialInput?: string;
}

const EXAMPLE_CODEBASE = `# Project: TaskFlow - Team Task Management Platform

## Tech Stack
- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: NextAuth.js with GitHub OAuth
- **Real-time**: Pusher for live updates

## Core Features
1. Task Management: Create, edit, delete, and assign tasks
2. Team Collaboration: Multi-team support with role-based access
3. Real-time Updates: Live task status changes via Pusher
4. Priority System: High/Medium/Low priority with color coding
5. Due Dates: Calendar integration with reminders`;

/** Validates that a string looks like a real GitHub repo URL. */
function isValidGitHubUrl(url: string): boolean {
  return /^https?:\/\/(www\.)?github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+/.test(url.trim());
}

const InputSection: React.FC<InputSectionProps> = ({ onAnalyze, onBack, initialInput = '' }) => {
  const [input, setInput] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [inputError, setInputError] = useState<string | null>(null);
  const [secretWarning, setSecretWarning] = useState<string[] | null>(null);
  const [pendingInput, setPendingInput] = useState<string | null>(null);
  const [uploadMode, setUploadMode] = useState<'text' | 'github' | 'folder' | 'zip'>('text');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  // Handle initialInput from URL parameter
  useEffect(() => {
    if (initialInput) {
      setGithubUrl(initialInput);
      setUploadMode('github');
    }
  }, [initialInput]);

  /** Checks for secrets, then either warns or submits. */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInputError(null);
    setSecretWarning(null);

    const trimmed = input.trim();
    if (trimmed.length < 20) {
      setInputError('Input is too short for a meaningful analysis. Paste more code or a project description.');
      return;
    }

    // Scan for hardcoded secrets
    const secrets = scanForSecrets(trimmed);
    if (secrets.length > 0) {
      setSecretWarning(secrets);
      setPendingInput(trimmed);
      return; // Wait for user confirmation
    }

    onAnalyze(trimmed);
  };

  /** User confirmed they want to proceed despite secrets warning. */
  const confirmAnalyze = () => {
    if (pendingInput) {
      onAnalyze(pendingInput);
      setSecretWarning(null);
      setPendingInput(null);
    }
  };

  const dismissSecretWarning = () => {
    setSecretWarning(null);
    setPendingInput(null);
  };

  const loadExample = () => {
    setInput(EXAMPLE_CODEBASE);
    setUploadMode('text');
  };

  const fetchGithubRepo = async () => {
    setInputError(null);

    if (!githubUrl.trim()) {
      setInputError('Please enter a GitHub URL.');
      return;
    }

    if (!isValidGitHubUrl(githubUrl)) {
      setInputError('Invalid GitHub URL. Use the format: https://github.com/owner/repo');
      return;
    }
    
    setLoading(true);
    try {
      // Extract owner/repo from various GitHub URL formats
      const match = githubUrl.match(/github\.com\/([^\/]+)\/([^\/\s]+)/);
      if (!match) {
        setInputError('Could not parse owner/repo from that URL.');
        setLoading(false);
        return;
      }
      
      const [, owner, repo] = match;
      const cleanRepo = repo.replace(/\.git$/, '');
      
      let repoInfo = `# ${cleanRepo} by ${owner}\n\nGitHub: https://github.com/${owner}/${cleanRepo}\n\n`;
      
      // Fetch README
      try {
        const readmeRes = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}/readme`, {
          headers: { 'Accept': 'application/vnd.github.v3+json' }
        });
        if (readmeRes.ok) {
          const readmeData = await readmeRes.json();
          const readme = atob(readmeData.content);
          repoInfo += `## README\n\n${readme}\n\n`;
        }
      } catch (e) {
        console.log('No README found');
      }
      
      // Fetch package.json or requirements.txt for tech stack info
      try {
        const pkgRes = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}/contents/package.json`);
        if (pkgRes.ok) {
          const pkgData = await pkgRes.json();
          const pkg = JSON.parse(atob(pkgData.content));
          repoInfo += `## Tech Stack (from package.json)\n\nDependencies:\n${Object.keys(pkg.dependencies || {}).slice(0, 20).join(', ')}\n\n`;
          if (pkg.scripts) {
            repoInfo += `Scripts: ${Object.keys(pkg.scripts).join(', ')}\n\n`;
          }
        } else {
          // Not a Node project - try Python
          const reqRes = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}/contents/requirements.txt`);
          if (reqRes.ok) {
            const reqData = await reqRes.json();
            const requirements = atob(reqData.content);
            repoInfo += `## Dependencies (Python - requirements.txt)\n\n${requirements}\n\n`;
          } else {
            // Try pyproject.toml
            const pyRes = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}/contents/pyproject.toml`);
            if (pyRes.ok) {
              const pyData = await pyRes.json();
              const pyproject = atob(pyData.content);
              repoInfo += `## Dependencies (Python - pyproject.toml)\n\n${pyproject}\n\n`;
            }
          }
        }
      } catch (e) {
        console.log('Could not detect project dependencies');
      }
      
      // Fetch file tree
      try {
        const treeRes = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}/git/trees/main?recursive=1`);
        if (!treeRes.ok) {
          // Try 'master' branch
          const masterRes = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}/git/trees/master?recursive=1`);
          if (masterRes.ok) {
            const masterData = await masterRes.json();
            const files = masterData.tree.filter((item: any) => item.type === 'blob').slice(0, 50);
            repoInfo += `## File Structure (${files.length} files shown)\n\n`;
            files.forEach((file: any) => {
              repoInfo += `- ${file.path}\n`;
            });
          }
        } else {
          const treeData = await treeRes.json();
          const files = treeData.tree.filter((item: any) => item.type === 'blob').slice(0, 50);
          repoInfo += `## File Structure (${files.length} files shown)\n\n`;
          files.forEach((file: any) => {
            repoInfo += `- ${file.path}\n`;
          });
        }
      } catch (e) {
        console.log('Could not fetch file tree');
      }
      
      setInput(repoInfo);
      setUploadMode('text');
      setLoading(false);
      
      // Auto-trigger analysis
      if (repoInfo.length > 100) {
        onAnalyze(repoInfo);
      }
      
    } catch (error) {
      console.error(error);
      setInputError('Failed to fetch GitHub repo. Make sure it\'s public and the URL is correct.');
      setLoading(false);
    }
  };

  const handleZipUpload = async (file: File) => {
    setLoading(true);
    try {
      setInputError('ZIP extraction requires additional libraries. Please extract the ZIP manually and use the "Upload Folder" option, or paste the code directly.');
      setLoading(false);
    } catch (error) {
      setInputError('Error reading ZIP file.');
      setLoading(false);
    }
  };

  const handleFolderUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setLoading(true);
    
    const filesToProcess = Array.from(files).slice(0, 30);
    
    let codebaseContent = `# Uploaded Project\n\n## Total Files: ${files.length} (analyzing first 30)\n\n`;
    
    const filesByType: { [key: string]: File[] } = {};
    const allowedExtensions = ['.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.go', '.rs', '.swift', '.md', '.json', '.yml', '.yaml'];
    
    for (const file of filesToProcess) {
      const ext = file.name.substring(file.name.lastIndexOf('.'));
      if (allowedExtensions.includes(ext.toLowerCase())) {
        if (!filesByType[ext]) filesByType[ext] = [];
        filesByType[ext].push(file);
      }
    }

    codebaseContent += `## File Types:\n`;
    for (const [ext, fileList] of Object.entries(filesByType)) {
      codebaseContent += `- ${ext}: ${fileList.length} files\n`;
    }
    codebaseContent += '\n';

    const importantFiles = filesToProcess.filter(f => 
      ['readme.md', 'package.json', 'requirements.txt', 'go.mod', 'cargo.toml'].includes(f.name.toLowerCase())
    );

    for (const file of importantFiles.slice(0, 2)) {
      try {
        const content = await file.text();
        codebaseContent += `\n## ${file.name}\n\`\`\`\n${content.substring(0, 200)}\n\`\`\`\n\n`;
      } catch (error) {
        console.error(`Error reading ${file.name}`);
      }
    }

    for (const [ext, fileList] of Object.entries(filesByType)) {
      if (fileList.length > 0) {
        codebaseContent += `\n## Sample ${ext} file:\n`;
        try {
          const file = fileList[0];
          const content = await file.text();
          codebaseContent += `\`\`\`\n${content.substring(0, 200)}\n\`\`\`\n\n`;
        } catch (error) {
          console.error(`Error reading sample ${ext} file`);
        }
      }
    }

    setInput(codebaseContent);
    setUploadMode('text');
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="mb-8 text-zinc-400 hover:text-white transition flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">New Analysis</h1>
        <p className="text-zinc-400">Choose how you want to provide your codebase</p>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto">
        <button
          onClick={() => setUploadMode('text')}
          className={`px-6 py-3 font-bold transition flex items-center gap-2 whitespace-nowrap ${
            uploadMode === 'text'
              ? 'bg-white text-black'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <Code className="w-5 h-5" />
          Paste Code
        </button>

        <button
          onClick={() => setUploadMode('github')}
          className={`px-6 py-3 font-bold transition flex items-center gap-2 whitespace-nowrap ${
            uploadMode === 'github'
              ? 'bg-white text-black'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <Github className="w-5 h-5" />
          GitHub URL
        </button>

        <button
          onClick={() => setUploadMode('folder')}
          className={`px-6 py-3 font-bold transition flex items-center gap-2 whitespace-nowrap ${
            uploadMode === 'folder'
              ? 'bg-white text-black'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <FolderOpen className="w-5 h-5" />
          Upload Folder
        </button>

        <button
          onClick={() => setUploadMode('zip')}
          className={`px-6 py-3 font-bold transition flex items-center gap-2 whitespace-nowrap ${
            uploadMode === 'zip'
              ? 'bg-white text-black'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <FileArchive className="w-5 h-5" />
          Upload ZIP
        </button>
      </div>

      {/* Inline error banner */}
      {inputError && (
        <div className="mb-4 bg-red-950/30 border border-red-800/50 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-red-300 text-sm">{inputError}</p>
          </div>
          <button
            onClick={() => setInputError(null)}
            className="text-red-500 hover:text-red-300 text-sm"
          >
            ✕
          </button>
        </div>
      )}

      {/* Sensitive data warning */}
      {secretWarning && (
        <div className="mb-4 bg-amber-950/30 border border-amber-700/50 rounded-lg p-4">
          <div className="flex items-start gap-3 mb-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-amber-300 font-medium text-sm">Possible secrets detected in your code</p>
              <p className="text-amber-400/70 text-sm mt-1">
                Found what looks like: {secretWarning.join(', ')}. 
                Your code will be sent to a third-party AI service for analysis. 
                Remove secrets before submitting, or proceed at your own risk.
              </p>
            </div>
          </div>
          <div className="flex gap-3 ml-8">
            <button
              onClick={confirmAnalyze}
              className="px-4 py-2 bg-amber-800/50 hover:bg-amber-700/50 text-amber-200 text-sm rounded transition"
            >
              Analyze anyway
            </button>
            <button
              onClick={dismissSecretWarning}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm rounded transition"
            >
              Go back and edit
            </button>
          </div>
        </div>
      )}

      <div className="bg-zinc-900 border border-zinc-800 p-8 mb-6">
        {uploadMode === 'text' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-zinc-300">
                Paste your codebase, file structure, or project description
              </label>
              <button
                type="button"
                onClick={loadExample}
                className="text-sm text-zinc-400 hover:text-white transition flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Load Demo
              </button>
            </div>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-96 px-4 py-3 bg-zinc-800 border border-zinc-700 text-white focus:border-white outline-none transition font-mono text-sm resize-y"
              placeholder="// Paste your codebase, file structure, or project description here..."
            />

            <button
              type="submit"
              disabled={loading || input.trim().length < 20}
              className="w-full px-6 py-4 bg-white text-black hover:bg-zinc-200 disabled:bg-zinc-700 disabled:text-zinc-500 font-bold transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Terminal className="w-5 h-5" />
                  Analyze Codebase
                </>
              )}
            </button>
          </form>
        )}

        {uploadMode === 'github' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                GitHub Repository URL
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 text-white focus:border-white outline-none transition"
                placeholder="https://github.com/username/repository"
              />
            </div>

            <GitHubRepoDropdown onSelectRepo={(url) => setGithubUrl(url)} />

            <button
              onClick={fetchGithubRepo}
              disabled={loading || !githubUrl.trim()}
              className="w-full px-6 py-4 bg-white text-black hover:bg-zinc-200 disabled:bg-zinc-700 disabled:text-zinc-500 font-bold transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  Fetching Repository...
                </>
              ) : (
                <>
                  <Github className="w-5 h-5" />
                  Analyze Repository
                </>
              )}
            </button>
          </div>
        )}

        {uploadMode === 'folder' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Select Project Folder (Max 30 files analyzed)
              </label>
              <input
                ref={folderInputRef}
                type="file"
                /* @ts-ignore */
                webkitdirectory=""
                directory=""
                multiple
                onChange={handleFolderUpload}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 text-white file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-white file:text-black file:font-bold hover:file:bg-zinc-200 cursor-pointer"
              />
            </div>
            <p className="text-sm text-zinc-500">
              Select a folder containing your project. We'll analyze the structure and key files.
            </p>
          </div>
        )}

        {uploadMode === 'zip' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Upload Project ZIP
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".zip"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleZipUpload(file);
                }}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 text-white file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-white file:text-black file:font-bold hover:file:bg-zinc-200 cursor-pointer"
              />
            </div>
            <p className="text-sm text-zinc-500">
              Note: ZIP extraction requires additional setup. Consider using the folder upload option instead.
            </p>
          </div>
        )}
      </div>

      <div className="bg-zinc-900 border border-zinc-800 p-6">
        <h3 className="font-bold mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          Tips for Best Results
        </h3>
        <ul className="text-sm text-zinc-400 space-y-2">
          <li>• Include your project structure, tech stack, and main features</li>
          <li>• For GitHub repos: make sure they're public or you have access</li>
          <li>• Folder uploads are limited to 30 files to stay within API limits</li>
          <li>• Use descriptive variable names and add comments for better analysis</li>
        </ul>
      </div>
    </div>
  );
};

export default InputSection;
