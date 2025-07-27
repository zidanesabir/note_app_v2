import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';

const LoginPage = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/notes');
    }
  }, [loading, isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-50">
        <LoadingSpinner size="lg" className="text-primary" />
      </div>
    );
  }

  return <LoginForm />;
};

export default LoginPage;