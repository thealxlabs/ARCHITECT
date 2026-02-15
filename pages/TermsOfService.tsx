import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TermsOfService: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-zinc-800">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="font-bold font-mono text-2xl">//A</div>
          <button
            onClick={() => navigate('/')}
            className="text-zinc-400 hover:text-white transition text-sm flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-zinc-500 mb-8">Last Updated: February 14, 2026</p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
            <p className="text-zinc-300 leading-relaxed">
              By accessing or using ARCHITECT, you agree to be bound by these Terms of Service. 
              If you do not agree, do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Description of Service</h2>
            <p className="text-zinc-300 mb-3">ARCHITECT is an AI-powered code analysis platform that:</p>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li>Analyzes code and generates documentation</li>
              <li>Provides quality scores and security insights</li>
              <li>Stores analysis history for authenticated users</li>
              <li>Allows sharing of analysis results</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. User Accounts</h2>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li>You must provide accurate information when creating an account</li>
              <li>You are responsible for maintaining account security</li>
              <li>You must be at least 13 years old to use the Service</li>
              <li>You may delete your account at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Acceptable Use</h2>
            <h3 className="text-xl font-semibold mt-6 mb-3">You MAY:</h3>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li>Use the Service for personal or commercial code analysis</li>
              <li>Upload code you own or have permission to analyze</li>
              <li>Share analysis results using the provided feature</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">You MAY NOT:</h3>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li>Upload malicious code, malware, or exploits</li>
              <li>Attempt to bypass security measures</li>
              <li>Use the Service for illegal activities</li>
              <li>Abuse or harass other users</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. User Content</h2>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li>You retain all rights to code you upload</li>
              <li>We do not claim ownership of your code</li>
              <li>Analysis results are provided "as is"</li>
              <li>Shared content becomes publicly accessible</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Disclaimer of Warranties</h2>
            <p className="text-zinc-300">
              THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. 
              We do not guarantee accuracy of analysis results or uninterrupted operation.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Limitation of Liability</h2>
            <p className="text-zinc-300">
              We are not liable for any indirect, incidental, or consequential damages. 
              Our total liability is limited to $100 USD.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. Changes to Terms</h2>
            <p className="text-zinc-300">
              We may modify these Terms at any time. Continued use after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">9. Contact Information</h2>
            <p className="text-zinc-300">
              For questions about these Terms, contact:
              <br />
              Email: <a href="mailto:2021wondy@gmail.com" className="text-white hover:underline">2021wondy@gmail.com</a>
              <br />
              GitHub: <a href="https://github.com/thealxlabs/architect" className="text-white hover:underline" target="_blank" rel="noopener noreferrer">github.com/thealxlabs/architect</a>
            </p>
          </section>

          <section className="border-t border-zinc-800 pt-8 mt-8">
            <p className="text-zinc-500 text-sm">
              BY USING ARCHITECT, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND BY THESE TERMS OF SERVICE.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default TermsOfService;
