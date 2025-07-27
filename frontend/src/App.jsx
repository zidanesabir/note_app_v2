import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import Layout from './components/layout/Layout.jsx';
import LoadingSpinner from './components/common/LoadingSpinner.jsx';

// Import all your page components (ensure .jsx extension for all)
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import NotesDashboardPage from './pages/NotesDashboardPage.jsx';
import CreateNotePage from './pages/CreateNotePage.jsx';
import ViewNotePage from './pages/ViewNotePage.jsx';
import EditNotePage from './pages/EditNotePage.jsx';
import PublicNoteViewPage from './pages/PublicNoteViewPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

// PrivateRoute component to protect routes
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-50">
        <div className="glass-card p-6 rounded-2xl">
          <LoadingSpinner size="lg" className="text-primary loading-glow" />
          <p className="text-gradient mt-3 font-semibold">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected Routes */}
            <Route path="/notes" element={<PrivateRoute><NotesDashboardPage /></PrivateRoute>} />
            <Route path="/notes/create" element={<PrivateRoute><CreateNotePage /></PrivateRoute>} />
            <Route path="/notes/:id" element={<PrivateRoute><ViewNotePage /></PrivateRoute>} />
            <Route path="/notes/:id/edit" element={<PrivateRoute><EditNotePage /></PrivateRoute>} />
            
            {/* Public Access Route (no auth needed) */}
            <Route path="/public/:id" element={<PublicNoteViewPage />} />

            {/* Catch-all for 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;