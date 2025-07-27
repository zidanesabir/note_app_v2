import Header from './Header.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';

const Layout = ({ children }) => {
  const { loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center font-sans">
        {/* Enhanced Loading Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-indigo-200/20 to-purple-200/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-200/20 to-orange-200/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-cyan-200/20 to-blue-200/20 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
        </div>
        
        <div className="relative z-10 bg-white/80 backdrop-blur-xl p-12 rounded-3xl shadow-2xl border border-white/20 animate-pulse-glow">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-bounce">
              <span className="text-4xl">📝</span>
            </div>
            <LoadingSpinner size="lg" className="text-indigo-600 loading-glow mb-4" />
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
              Initializing NotesApp
            </h2>
            <p className="text-gray-600 font-medium">
              Preparing your amazing notes experience...
            </p>
            <div className="flex justify-center space-x-1 mt-6">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-neutral-800 flex flex-col relative overflow-x-hidden">
      {/* Enhanced Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary-100/30 via-transparent to-transparent rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-accent-100/30 via-transparent to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-gradient-to-r from-secondary-200/20 to-accent-200/20 rounded-full blur-2xl animate-float"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-r from-primary-200/20 to-secondary-200/20 rounded-full blur-2xl animate-float" style={{animationDelay: '3s'}}></div>
      </div>
      
      {/* Header */}
      <Header />
      
      {/* Main Content Area */}
      <main className="flex-grow relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      
      {/* Enhanced Footer */}
      <footer className="relative z-10 mt-auto">
        {/* Footer background with gradient */}
        <div className="bg-gradient-to-r from-primary-50 via-accent-50 to-secondary-50 border-t border-white/30 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-8"> {/* Adjusted padding */}
            {/* Footer content grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {/* Brand Section */}
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-xl font-bold text-white">📝</span>
                  </div>
                  <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600">
                    NotesApp
                  </h3>
                </div>
                <p className="text-neutral-600 leading-relaxed">
                  Your amazing notes companion for organizing, sharing, and collaborating on ideas.
                </p>
              </div>

              {/* Features Section */}
              <div className="text-center">
                <h4 className="font-bold text-neutral-800 mb-4 text-lg">Features</h4>
                <ul className="space-y-2 text-neutral-600">
                  <li className="flex items-center justify-center space-x-2">
                    <span className="text-primary-500">✨</span>
                    <span>Rich Text Editing</span>
                  </li>
                  <li className="flex items-center justify-center space-x-2">
                    <span className="text-accent-500">🔄</span>
                    <span>Real-time Sharing</span>
                  </li>
                  <li className="flex items-center justify-center space-x-2">
                    <span className="text-secondary-500">🏷️</span>
                    <span>Smart Organization</span>
                  </li>
                  <li className="flex items-center justify-center space-x-2">
                    <span className="text-primary-500">🔒</span>
                    <span>Privacy Controls</span>
                  </li>
                </ul>
              </div>

              {/* Stats Section */}
              <div className="text-center md:text-right">
              
                <div className="space-y-3">
                  <div className="bg-white/60 backdrop-blur rounded-xl p-4 shadow-sm border border-white/40">
                    <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600">
                      ∞
                    </p>
                    <p className="text-sm text-neutral-600 font-medium">Notes Created</p>
                  </div>
                  <div className="bg-white/60 backdrop-blur rounded-xl p-4 shadow-sm border border-white/40">
                    <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-600 to-secondary-600">
                      24/7
                    </p>
                    <p className="text-sm text-neutral-600 font-medium">Always Available</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-neutral-200/50 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                {/* Copyright */}
                <div className="text-center md:text-left">
                  <p className="text-neutral-600 font-medium">
                    © {new Date().getFullYear()} NotesApp. Crafted with passion by{' '}
                    <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600">
                      Zidane Sabir
                    </span>
                  </p>
                </div>
                {/* Footer Links */}
               
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;