import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../lib/api.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import NoteForm from '../components/notes/NoteForm.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import Swal from 'sweetalert2';

const CreateNotePage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const navigate = useNavigate();

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-lg border border-white/20 shadow-xl rounded-3xl p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-2xl">🔐</span>
          </div>
          <LoadingSpinner size="lg" className="text-indigo-500 mb-4" />
          <p className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Verifying your access...
          </p>
          <p className="text-sm text-gray-500 mt-2">Please wait while we authenticate you</p>
        </div>
      </div>
    );
  }

  const handleCreateSubmit = async (noteData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.post('/api/notes/', noteData);
      const createdNote = response.data;
      
      // Enhanced success notification with action buttons
      const result = await Swal.fire({
        icon: 'success',
        title: '🎉 Note Created Successfully!',
        html: `
          <div class="text-center">
            <p class="text-gray-600 mb-3">Your note "<strong>${noteData.title}</strong>" has been created!</p>
            <div class="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
              <p class="text-sm text-green-700">✨ What would you like to do next?</p>
            </div>
          </div>
        `,
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: '📋 View Notes',
     
        confirmButtonColor: '#4f46e5',
        cancelButtonColor: '#059669',
        reverseButtons: true,
        showClass: {
          popup: 'animate__animated animate__bounceIn'
        },
        customClass: {
          popup: 'bg-white/95 backdrop-blur-sm border border-green-200 rounded-3xl shadow-2xl',
          title: 'text-gray-800 text-xl font-bold',
          htmlContainer: 'text-gray-600',
          confirmButton: 'bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 mr-3',
          cancelButton: 'bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200'
        },
      });

      if (result.isConfirmed) {
        // User wants to view all notes - navigate and force reload
        navigate('/notes', { replace: true });
        // Force a page reload to ensure fresh data
        setTimeout(() => {
          window.location.reload();
        }, 100);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // User wants to view and share the specific note
        const noteId = createdNote?.id || createdNote?.note?.id;
        if (noteId) {
          navigate(`/notes/${noteId}`, { replace: true });
        } else {
          // Fallback to notes list if no ID available
          navigate('/notes', { replace: true });
          setTimeout(() => {
            window.location.reload();
          }, 100);
        }
      } else {
        // User closed the modal - default to notes list
        navigate('/notes', { replace: true });
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
      
    } catch (err) {
      console.error('Failed to create note:', err.response?.data || err.message);
      setError('Failed to create note. Please check your input.');
      
      // Enhanced error notification
      await Swal.fire({
        icon: 'error',
        title: '❌ Creation Failed',
        html: `
          <div class="text-center">
            <p class="text-gray-600 mb-3">We couldn't create your note right now.</p>
            <div class="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
              <p class="text-sm text-red-700">${err.response?.data?.message || 'Please check your connection and try again.'}</p>
            </div>
          </div>
        `,
        timer: 4000,
        timerProgressBar: true,
        showConfirmButton: true,
        confirmButtonText: 'Try Again',
        confirmButtonColor: '#ef4444',
        showClass: {
          popup: 'animate__animated animate__shakeX'
        },
        customClass: {
          popup: 'bg-white/95 backdrop-blur-sm border border-red-200 rounded-3xl shadow-2xl',
          title: 'text-gray-800 text-xl font-bold',
          htmlContainer: 'text-gray-600',
          confirmButton: 'bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-200',
          timerProgressBar: 'bg-gradient-to-r from-red-400 to-pink-400'
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-60 via-white to-purple-60">
     

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl mb-4 shadow-lg">
            <span className="text-3xl">✨</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Create New Note
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Capture your thoughts, ideas, and inspiration in a beautiful note that you can organize and share.
          </p>
        </div>

       
        {/* Form Container */}
        <div className="bg-white/80 backdrop-blur-lg border border-white/20 shadow-2xl rounded-3xl p-6 sm:p-8">
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <span className="text-xl">📝</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Note Details</h2>
                <p className="text-sm text-gray-600">Fill in the information below to create your note</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <NoteForm 
            onSubmit={handleCreateSubmit} 
            loading={loading} 
            error={error} 
            isEdit={false} 
          />
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm">💡</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Pro Tips</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  <span>Use descriptive titles to make your notes easy to find</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  <span>Markdown formatting is supported for rich text styling</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  <span>You can share your notes with others after creation</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/notes"
            className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
            <span>View All Notes</span>
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-white border border-gray-300 hover:border-indigo-300 hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 rounded-xl font-semibold transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Start Fresh</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateNotePage;