import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
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
        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-zinc-500 mb-8">Last Updated: February 14, 2026</p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Introduction</h2>
            <p className="text-zinc-300 leading-relaxed">
              ARCHITECT ("we," "our," or "us") is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, and safeguard your information 
              when you use our code analysis platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Information We Collect</h2>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Information You Provide</h3>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li>Account Information: Email address, display name, and password (encrypted)</li>
              <li>Authentication Data: OAuth tokens from GitHub or Google</li>
              <li>Code Data: Code snippets, repository URLs, or files you upload</li>
              <li>Analysis Results: Generated documentation, scores, and insights</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">Automatically Collected Information</h3>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li>Usage Data: Pages visited, features used, time spent</li>
              <li>Device Information: Browser type, operating system, IP address</li>
              <li>Cookies: Essential cookies for authentication and sessions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">How We Use Your Information</h2>
            <p className="text-zinc-300 mb-3">We use your information to:</p>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li>Provide and maintain the Service</li>
              <li>Authenticate your account and manage sessions</li>
              <li>Analyze your code and generate documentation</li>
              <li>Store your analysis history</li>
              <li>Improve our Service and develop new features</li>
              <li>Communicate with you about updates or issues</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Data Storage and Security</h2>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li><strong>Data Storage:</strong> Securely stored using Supabase with encryption</li>
              <li><strong>Code Analysis:</strong> Processed via OpenRouter AI, not stored permanently</li>
              <li><strong>Security:</strong> Row-level security, HTTPS, secure authentication</li>
              <li><strong>Retention:</strong> Analysis history stored until you delete it</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Third-Party Services</h2>
            <p className="text-zinc-300 mb-3">We use the following services:</p>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li>Supabase: Authentication and database</li>
              <li>OpenRouter: AI-powered code analysis</li>
              <li>Vercel: Application hosting</li>
              <li>GitHub/Google OAuth: Optional authentication</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Your Rights</h2>
            <p className="text-zinc-300 mb-3">You have the right to:</p>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li>Access: View all your stored data</li>
              <li>Update: Edit your profile information</li>
              <li>Delete: Remove analyses or delete your account</li>
              <li>Export: Download your analysis results</li>
              <li>Opt-Out: Stop using the Service at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Sharing of Information</h2>
            <p className="text-zinc-300 mb-3"><strong>We do NOT:</strong></p>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li>Sell your personal information</li>
              <li>Share your code with third parties (except AI processing)</li>
              <li>Use your code to train AI models</li>
              <li>Share your data for marketing purposes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Children's Privacy</h2>
            <p className="text-zinc-300">
              ARCHITECT is not intended for users under 13 years of age. 
              We do not knowingly collect information from children under 13.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <p className="text-zinc-300">
              If you have questions about this Privacy Policy, contact us at:
              <br />
              Email: <a href="mailto:2021wondy@gmail.com" className="text-white hover:underline">2021wondy@gmail.com</a>
              <br />
              GitHub: <a href="https://github.com/thealxlabs/architect" className="text-white hover:underline" target="_blank" rel="noopener noreferrer">github.com/thealxlabs/architect</a>
            </p>
          </section>

          <section className="border-t border-zinc-800 pt-8 mt-8">
            <p className="text-zinc-500 text-sm">
              By using ARCHITECT, you agree to this Privacy Policy.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
