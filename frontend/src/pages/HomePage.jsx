import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        navigate('/notes');
      } else {
        navigate('/login');
      }
    }
  }, [loading, isAuthenticated, navigate]);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-128px)] bg-neutral-50">
      {loading ? (
        <LoadingSpinner size="lg" className="text-primary" />
      ) : (
        <p className="text-xl text-neutral-700">Redirecting...</p>
      )}
    </div>
  );
};

export default HomePage;