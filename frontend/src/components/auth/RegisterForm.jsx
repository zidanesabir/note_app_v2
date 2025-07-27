import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import InputField from '../common/InputField.jsx';
import Button from '../common/Button.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';
import Swal from 'sweetalert2';
import { Mail, Lock } from 'lucide-react';

const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const success = await register(email, password);
    if (!success) {
      setError('Registration failed. Email might already be in use or password too weak.');
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: 'Email might already be in use or password is too weak.',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        customClass: {
          popup: 'glass-card',
          title: 'text-neutral-800',
          content: 'text-neutral-700',
        },
      });
    } else {
      Swal.fire({
        icon: 'success',
        title: 'Welcome Aboard!',
        text: 'Registration successful! Redirecting to your notes...',
        timer: 2000,
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
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/5 w-72 h-72 bg-primary/10 rounded-full blur-2xl animate-float"></div>
        <div className="absolute bottom-1/3 right-1/5 w-60 h-60 bg-accent/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-md form-glass p-8 rounded-3xl shadow-card animate-bounce-in border-gradient">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-heading font-bold text-gradient mb-2">Join Our Community!</h1>
          <p className="text-neutral-600">Create your account to start noting</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="mb-6 animate-slide-in">
              <p className="text-red-500 text-sm text-center">{error}</p>
            </div>
          )}

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

          <InputField
            label="Password"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Create a password"
            className="input-glass pl-10 rounded-lg text-base py-2.5"
            icon={<Lock className="w-5 h-5 text-neutral-500" />}
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full btn-accent btn-shimmer py-3 rounded-lg text-base font-semibold shadow-glow hover:shadow-glow-lg transition-all duration-300"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <LoadingSpinner size="sm" className="text-white" />
                Registering...
              </div>
            ) : (
              'Sign Up'
            )}
          </Button>

          <div className="text-center text-sm text-neutral-600 mt-6">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-primary hover:text-primary-dark font-semibold hover:underline"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;