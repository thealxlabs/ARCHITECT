import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Zap, Shield, FileText, Github, FolderOpen, BarChart3, Eye, Upload } from 'lucide-react';
import ReportProblem from './ReportProblem';

interface HeroProps {
  onStart: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Fixed Header with Animated Logo */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/95 backdrop-blur-md border-b border-zinc-800' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Animated Logo */}
          <div className={`font-bold font-mono text-white transition-all duration-300 ${
            scrolled ? 'text-lg' : 'text-2xl'
          }`}>
            {scrolled ? '//A' : '//ARCHITECT'}
          </div>
          
          {/* Header Actions */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/thealxlabs/architect"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-white transition text-sm font-mono"
            >
              View Source
            </a>
            <button
              onClick={() => window.location.href = '/login'}
              className="px-4 py-2 text-white hover:text-zinc-300 font-bold text-sm transition"
            >
              Login
            </button>
            <button
              onClick={() => window.location.href = '/signup'}
              className="px-6 py-2 bg-white text-black hover:bg-zinc-200 font-bold text-sm transition"
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-800 bg-zinc-900/50">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-mono text-zinc-300">AI-Powered Code Intelligence</span>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-center mb-6 leading-tight">
            <span className="bg-gradient-to-b from-white via-zinc-200 to-zinc-600 text-transparent bg-clip-text">
              Understand Any Codebase
              <br />
              in Plain English
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-zinc-400 text-center max-w-3xl mx-auto mb-12">
            Upload your code and get instant documentation, quality scores, security analysis, 
            and honest feedback—all explained like you're talking to a friend.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={() => window.location.href = '/signup'}
              className="group px-8 py-4 bg-white text-black hover:bg-zinc-200 font-bold text-lg transition flex items-center justify-center gap-3"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="https://github.com/thealxlabs/architect"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 border border-zinc-700 hover:border-white text-white font-bold text-lg transition flex items-center justify-center gap-3"
            >
              <Github className="w-5 h-5" />
              View on GitHub
            </a>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto py-12 border-y border-zinc-800">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">1-10</div>
              <div className="text-sm text-zinc-500 font-mono">Quality Scores</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">6+</div>
              <div className="text-sm text-zinc-500 font-mono">Doc Types</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">100%</div>
              <div className="text-sm text-zinc-500 font-mono">Plain English</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">Free</div>
              <div className="text-sm text-zinc-500 font-mono">Open Source</div>
            </div>
          </div>
        </div>
      </div>

      {/* What It Does Section */}
      <div className="py-20 bg-gradient-to-b from-black to-zinc-950">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">What Does ARCHITECT Do?</h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Think of it as having a senior developer review your code and explain 
              everything in simple terms
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Upload */}
            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">1. Upload Your Code</h3>
              <p className="text-zinc-400">
                Paste code, enter a GitHub URL, or upload a whole folder. 
                We support all major languages.
              </p>
            </div>

            {/* Analyze */}
            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">2. AI Analyzes It</h3>
              <p className="text-zinc-400">
                Our AI reads your code, understands the structure, checks for 
                issues, and finds what's working well.
              </p>
            </div>

            {/* Results */}
            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">3. Get Clear Insights</h3>
              <p className="text-zinc-400">
                Receive docs, scores, and recommendations—all in plain English. 
                No confusing technical jargon.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-20 bg-zinc-950">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Everything You Get
          </h2>
          <p className="text-center text-zinc-400 mb-16 text-lg">
            A complete analysis of your codebase in minutes
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-zinc-900/50 border border-zinc-800 p-8 hover:border-zinc-600 transition">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Quality Scores (1-10)</h3>
              <p className="text-zinc-400">
                See exactly how good your code is. Get scores for quality, security, 
                performance, and documentation. No guessing.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-zinc-900/50 border border-zinc-800 p-8 hover:border-zinc-600 transition">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Plain English Docs</h3>
              <p className="text-zinc-400">
                README, architecture guides, setup instructions—all written like 
                you're explaining to a friend. No tech jargon.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-zinc-900/50 border border-zinc-800 p-8 hover:border-zinc-600 transition">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Security Analysis</h3>
              <p className="text-zinc-400">
                Find vulnerabilities before hackers do. Issues ranked by severity: 
                Critical, Important, or Minor.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-zinc-900/50 border border-zinc-800 p-8 hover:border-zinc-600 transition">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">What's Working Well</h3>
              <p className="text-zinc-400">
                See specific things you did right. Not just "good code"—we explain 
                WHY it's good and what makes it solid.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-zinc-900/50 border border-zinc-800 p-8 hover:border-zinc-600 transition">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Improvement Suggestions</h3>
              <p className="text-zinc-400">
                Get specific fixes for problems. Not just "refactor this"—we tell you 
                exactly what's wrong and how to fix it.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-zinc-900/50 border border-zinc-800 p-8 hover:border-zinc-600 transition">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mb-4">
                <FolderOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Flexible Input</h3>
              <p className="text-zinc-400">
                Paste code, import from GitHub URL, or upload entire folders. 
                Works with any language or framework.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-20 border-t border-zinc-800">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Simple Process, Powerful Results
          </h2>

          <div className="space-y-12">
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-white text-black rounded-full flex items-center justify-center font-bold text-xl">
                1
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Choose Your Input Method</h3>
                <p className="text-zinc-400 text-lg">
                  Paste code directly, enter a GitHub repository URL, or upload your entire project folder. 
                  ARCHITECT handles it all.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-white text-black rounded-full flex items-center justify-center font-bold text-xl">
                2
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Watch the Analysis</h3>
                <p className="text-zinc-400 text-lg">
                  See live progress as ARCHITECT reads your files, checks security, analyzes structure, 
                  and generates documentation. Usually takes 10-30 seconds.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-white text-black rounded-full flex items-center justify-center font-bold text-xl">
                3
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Get Your Results</h3>
                <p className="text-zinc-400 text-lg">
                  Receive complete documentation, quality scores, security analysis, and actionable recommendations—all 
                  in language anyone can understand.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-20 bg-gradient-to-b from-black to-zinc-950 border-t border-zinc-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Understand Your Code?
          </h2>
          <p className="text-xl text-zinc-400 mb-8">
            Start analyzing for free. No credit card required.
          </p>
          <button
            onClick={() => window.location.href = '/signup'}
            className="px-10 py-5 bg-white text-black hover:bg-zinc-200 font-bold text-xl transition"
          >
            Get Started Free
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 border-t border-zinc-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="font-mono text-zinc-500 text-sm">
              © 2026 //ARCHITECT by Alexander Wondwossen (@thealxlabs). All rights reserved.
            </div>
            <div className="flex gap-8">
              <a
                href="/privacy"
                className="text-zinc-400 hover:text-white transition text-sm"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="text-zinc-400 hover:text-white transition text-sm"
              >
                Terms of Service
              </a>
              <a
                href="https://github.com/thealxlabs/architect"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-white transition flex items-center gap-2 text-sm"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
      <ReportProblem />
    </div>
  );
};

export default Hero;
