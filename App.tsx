import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import AnalyzePage from './pages/AnalyzePage';
import ResultsPage from './pages/ResultsPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import GitHubCallback from './pages/GitHubCallback';
import InstallSuccess from './pages/InstallSuccess';
import ProtectedRoute from './components/ProtectedRoute';

// ---------------------------------------------------------------------------
// Error Boundary — catches render crashes so the whole app doesn't white-screen
// ---------------------------------------------------------------------------

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            <h1 className="text-6xl font-bold text-white mb-4">500</h1>
            <p className="text-zinc-400 mb-6">
              Something went wrong. {this.state.error?.message || ''}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = '/';
              }}
              className="px-6 py-3 bg-white text-black hover:bg-zinc-200 font-bold transition"
            >
              Go Home
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ---------------------------------------------------------------------------
// 404 Page
// ---------------------------------------------------------------------------

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-6xl font-bold text-white mb-2">404</h1>
        <p className="text-zinc-400 mb-6">Page not found.</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-white text-black hover:bg-zinc-200 font-bold transition"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          
          {/* GitHub App Routes */}
          <Route path="/auth/github/callback" element={<GitHubCallback />} />
          <Route path="/install" element={<InstallSuccess />} />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/analyze" 
            element={
              <ProtectedRoute>
                <AnalyzePage />
              </ProtectedRoute>
            } 
          />
          <Route path="/results/:id" element={<ResultsPage />} />
          <Route path="/share/:token" element={<ResultsPage />} />

          {/* 404 catch-all — must be last */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
