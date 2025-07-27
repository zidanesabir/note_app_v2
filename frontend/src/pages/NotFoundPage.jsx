import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-128px)] bg-neutral-50">
      <div className="text-center glass-card p-10 rounded-2xl border border-neutral-200">
        <h1 className="text-6xl font-bold text-gradient mb-4">404</h1>
        <p className="text-xl text-neutral-700 mb-6">Oops! The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn-primary py-2.5 px-6 rounded-lg font-semibold text-lg hover:shadow-glow">
          Go to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;