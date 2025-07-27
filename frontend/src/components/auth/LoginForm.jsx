import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import InputField from '../common/InputField.jsx';
import Button from '../common/Button.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';
import Swal from 'sweetalert2';
import { Mail, Lock } from 'lucide-react';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const success = await login(email, password);
    if (!success) {
      setError('Login failed. Please check your credentials.');
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: 'Please check your email and password.',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        customClass: {
          popup: 'glass-card',
          title: 'text-neutral-800',
          content: 'text-neutral-700',
        },
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-neutral-50 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/5 w-72 h-72 bg-primary/10 rounded-full blur-2xl animate-float"></div>
        <div className="absolute bottom-1/3 right-1/5 w-60 h-60 bg-accent/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '1.5s' }}></div>
      </div>

      {/* Form Container */}
      <div className="relative z-10 w-full max-w-md form-glass p-8 rounded-3xl shadow-card animate-bounce-in border-gradient">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-heading font-bold text-gradient mb-2">Welcome Back!</h1>
          <p className="text-neutral-600">Sign in to explore your notes</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="mb-6 animate-slide-in">
              <p className="text-red-500 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Mail icon for Email Input */}
          <InputField
            label="Email Address"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
            className="input-glass pl-10 rounded-lg text-base py-2.5"
            icon={<Mail className="w-5 h-5 text-neutral-500" />}
          />

          {/* Lock icon for Password Input */}
          <InputField
            label="Password"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
            className="input-glass pl-10 rounded-lg text-base py-2.5"
            icon={<Lock className="w-5 h-5 text-neutral-500" />}
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full btn-primary btn-shimmer py-3 rounded-lg text-base font-semibold shadow-glow hover:shadow-glow-lg transition-all duration-300"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <LoadingSpinner size="sm" className="text-white" />
                Signing In...
              </div>
            ) : (
              'Sign In'
            )}
          </Button>

          <div className="text-center text-sm text-neutral-600">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="text-primary hover:text-primary-dark font-semibold hover:underline"
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;