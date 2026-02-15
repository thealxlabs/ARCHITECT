// GitHub App OAuth callback handler
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const GitHubCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Just redirect to install success page with params
    const installation_id = searchParams.get('installation_id');
    const setup_action = searchParams.get('setup_action');
    
    const params = new URLSearchParams();
    if (installation_id) params.set('installation_id', installation_id);
    if (setup_action) params.set('setup_action', setup_action);
    
    navigate(`/install?${params.toString()}`);
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-white">Redirecting...</p>
      </div>
    </div>
  );
};

export default GitHubCallback;
