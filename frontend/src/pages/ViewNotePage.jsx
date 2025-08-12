import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import apiClient from '../lib/api.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import Notification from '../components/common/Notification.jsx';
import Button from '../components/common/Button.jsx';
import ReactMarkdown from 'react-markdown';
import Swal from 'sweetalert2';

const ViewNotePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
      return;
    }
    if (id && isAuthenticated) {
      fetchNote();
    }
  }, [id, isAuthenticated, authLoading, navigate]);

  const fetchNote = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/api/notes/${id}`);
      setNote(response.data);
    } catch (err) {
      console.error('Failed to fetch note:', err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Failed to load note. You might not have permission or it might not exist.');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || 'Failed to load note. You might not have permission or it might not exist.',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        customClass: {
          popup: 'glass-card',
          title: 'text-neutral-800',
          content: 'text-neutral-700',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    const publicUrlBase = window.location.origin;
    navigator.clipboard.writeText(`${publicUrlBase}/notes/${note.id}`);
    Swal.fire({
      icon: 'success',
      title: 'Link Copied!',
      text: 'Public link copied to clipboard.',
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
      customClass: {
        popup: 'glass-card',
        title: 'text-neutral-800',
        content: 'text-neutral-700',
      },
    });
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="glass-card p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/20 backdrop-blur-xl animate-scale-in">
          <LoadingSpinner size="lg" className="text-indigo-600 loading-glow" />
          <p className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mt-4 font-bold text-base sm:text-lg">
            Loading your note...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-4xl">
        <div className="bg-red-50/70 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-red-200/50 shadow-xl animate-scale-in">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <span className="text-2xl sm:text-3xl">❌</span>
          </div>
          <Notification message={error} type="error" />
          <Button
            onClick={() => navigate(-1)}
            className="mt-6 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-4xl">
        <div className="bg-white/70 backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-xl border border-white/20 animate-scale-in">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <span className="text-2xl sm:text-3xl">📝</span>
          </div>
          <p className="text-neutral-700 text-base sm:text-lg text-center mb-6">Note not found.</p>
          <Button
            onClick={() => navigate('/notes')}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Back to Notes
          </Button>
        </div>
      </div>
    );
  }

  const isOwner = user && note.owner_id === user.id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-60 via-white to-purple-50 font-sans">
      {/* Floating Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-r from-indigo-200/30 to-purple-200/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-48 sm:w-80 h-48 sm:h-80 bg-gradient-to-r from-pink-200/30 to-orange-200/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-3/4 w-40 sm:w-64 h-40 sm:h-64 bg-gradient-to-r from-cyan-200/30 to-blue-200/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-4xl relative z-10">
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6 sm:p-8 hover:shadow-2xl transition-all duration-300 animate-slide-in">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4 sm:mb-6 tracking-tight">
            {note.title}
          </h1>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs sm:text-sm text-neutral-600 mb-4 sm:mb-6 border-b border-neutral-200/50 pb-3 animate-fade-in">
            <div className="flex items-center gap-2 mb-2 sm:mb-0">
              <span className="font-semibold">Status:</span>
              <span className="capitalize font-semibold text-indigo-600">{note.visibility_status}</span>
            </div>
            {note.tags && (
              <div className="flex flex-wrap gap-2">
                <span className="font-semibold">Tags:</span>
                {note.tags.split(',').map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block bg-indigo-100 text-indigo-700 rounded-full px-2 py-0.5 text-xs sm:text-sm"
                  >
                    #{tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>

          {note.visibility_status === 'shared' && !isOwner && note.owner_email && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-neutral-100/70 backdrop-blur-sm rounded-xl border border-neutral-200/50 text-neutral-700 flex items-center gap-2 animate-fade-in">
              <span className="text-lg sm:text-xl">📢</span>
              <p className="text-xs sm:text-sm font-medium">
                Shared by: <span className="font-semibold text-indigo-600">{note.owner_email}</span>
              </p>
            </div>
          )}

          <div className="prose prose-sm sm:prose-base max-w-none text-neutral-800 leading-relaxed mb-6 sm:mb-8 pt-4 animate-fade-in">
            <ReactMarkdown>{note.content}</ReactMarkdown>
          </div>

          <div className="text-xs sm:text-sm text-neutral-500 border-t border-neutral-200/50 pt-3 sm:pt-4 mb-6 sm:mb-8 animate-fade-in">
            <p>Created: {new Date(note.createdAt).toLocaleString()}</p>
            <p>Last Updated: {new Date(note.updatedAt).toLocaleString()}</p>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 animate-scale-in">
            {isOwner && (
              <Button
                onClick={() => navigate(`/notes/${note.id}/edit`)}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-xl text-xs sm:text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Edit Note
              </Button>
            )}
            {note.visibility_status === 'public' && (
              <Button
                onClick={handleCopyLink}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-xl text-xs sm:text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Copy Public Link
              </Button>
            )}
            <Button
              onClick={() => navigate('/notes')}
              className="bg-gradient-to-r from-neutral-500 to-neutral-600 hover:from-neutral-600 hover:to-neutral-700 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-xl text-xs sm:text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Back to Notes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewNotePage;
