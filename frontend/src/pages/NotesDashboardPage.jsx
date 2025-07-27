import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../lib/api.js';
import NoteFilter from '../components/notes/NoteFilter.jsx';
import SearchBar from '../components/notes/SearchBar.jsx';
import Button from '../components/common/Button.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import Notification from '../components/common/Notification.jsx';
import InputField from '../components/common/InputField.jsx';
import Swal from 'sweetalert2';

const NotesDashboardPage = () => {
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [notesLoading, setNotesLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [noteToShareId, setNoteToShareId] = useState(null);
  const [shareEmail, setShareEmail] = useState('');
  const [shareLoading, setShareLoading] = useState(false);
  const [shareError, setShareError] = useState(null);
  const [showFullContent, setShowFullContent] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [notesPerPage, setNotesPerPage] = useState(10);
  const [totalNotes, setTotalNotes] = useState(0);
  const [viewMode, setViewMode] = useState('table');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotes();
    }
  }, [isAuthenticated, filter, searchQuery, currentPage]);

  const handleFilterChange = (newFilter) => {
    console.log('Filter changing from', filter, 'to', newFilter); // Debug log
    setFilter(newFilter);
    setCurrentPage(1); // Reset to first page when filter changes
    setNotification({
      message: `Filter changed to: ${newFilter === 'all' ? 'All' : newFilter.charAt(0).toUpperCase() + newFilter.slice(1)}`,
      type: 'info',
    });
  };

  const fetchNotes = useCallback(async () => {
    setNotesLoading(true);
    setError(null);
    try {
      const skip = (currentPage - 1) * notesPerPage;
      const limit = notesPerPage;

      const params = { 
        skip, 
        limit,
        page: currentPage // Some APIs prefer page number
      };
      
      // Try different parameter names that your API might expect
      if (filter !== 'all') {
        params.visibility_status = filter;
        params.status = filter; // Fallback
        params.filter = filter; // Another fallback
      }
      
      if (searchQuery && searchQuery.trim()) {
        params.q = searchQuery.trim();
        params.search = searchQuery.trim(); // Fallback
      }

      console.log('Fetching notes with params:', params); // Debug log
      console.log('Current filter:', filter); // Debug log
      
      const response = await apiClient.get('/api/notes/', { params });
      console.log('API response:', response.data); // Debug log
      
      // Handle different response structures
      const notesData = response.data.notes || response.data.data || response.data;
      const totalData = response.data.total || response.data.count || notesData.length;
      
      setNotes(Array.isArray(notesData) ? notesData : []);
      setTotalNotes(totalData);
      
      console.log('Notes set:', notesData); // Debug log
      console.log('Total notes:', totalData); // Debug log
      
    } catch (err) {
      console.error('Failed to fetch notes:', err.response?.data || err.message);
      setError('Failed to load notes. Please try again.');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load notes. Please try again.',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        customClass: {
          popup: 'glass-card',
          title: 'text-gray-600',
          content: 'text-gray-700',
        },
      });
    } finally {
      setNotesLoading(false);
    }
  }, [currentPage, notesPerPage, filter, searchQuery]);

  // Client-side filtering as backup (in case server-side filtering doesn't work)
  const filteredNotes = notes.filter(note => {
    if (filter === 'all') return true;
    
    // Check different possible property names
    const noteStatus = note.visibility_status || note.status || note.visibility;
    return noteStatus === filter;
  });

  const handleDelete = async (noteId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This note will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#a3a3a3',
      customClass: {
        popup: 'glass-card',
        title: 'text-gray-600',
        content: 'text-gray-700',
      },
    });

    if (result.isConfirmed) {
      try {
        await apiClient.delete(`/api/notes/${noteId}`);
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Your note has been deleted.',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          customClass: {
            popup: 'glass-card',
            title: 'text-gray-600',
            content: 'text-gray-700',
          },
        });
        if (notes.length === 1 && currentPage > 1) {
          setCurrentPage((prev) => prev - 1);
        } else {
          fetchNotes();
        }
      } catch (err) {
        console.error('Failed to delete note:', err.response?.data || err.message);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete note.',
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
          customClass: {
            popup: 'glass-card',
            title: 'text-gray-600',
            content: 'text-gray-700',
          },
        });
      }
    }
  };

  const handleShareClick = (noteId) => {
    setNoteToShareId(noteId);
    setShareModalOpen(true);
    setShareEmail('');
    setShareError(null);
  };

  const handleShareSubmit = async (e) => {
    e.preventDefault();
    setShareLoading(true);
    setShareError(null);
    try {
      const userLookupResponse = await apiClient.get(`/api/auth/users?email=${shareEmail}`);
      const targetUser = userLookupResponse.data[0];

      if (!targetUser) {
        setShareError('User with that email not found.');
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'User with that email not found.',
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
          customClass: {
            popup: 'glass-card',
            title: 'text-gray-600',
            content: 'text-gray-700',
          },
        });
        return;
      }

      await apiClient.post(`/api/notes/${noteToShareId}/share`, { userId: targetUser.id });

      Swal.fire({
        icon: 'success',
        title: 'Shared!',
        text: `Note shared with ${targetUser.email}!`,
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        customClass: {
          popup: 'glass-card',
          title: 'text-gray-600',
          content: 'text-gray-700',
        },
      });
      setShareModalOpen(false);
      fetchNotes();
    } catch (err) {
      console.error('Failed to share note:', err.response?.data || err.message);
      setShareError(err.response?.data?.message || 'Failed to share note.');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || 'Failed to share note.',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        customClass: {
          popup: 'glass-card',
          title: 'text-gray-600',
          content: 'text-gray-700',
        },
      });
    } finally {
      setShareLoading(false);
    }
  };

  const truncateContent = (content, maxLength = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const toggleContent = (noteId) => {
    setShowFullContent((prev) => ({ ...prev, [noteId]: !prev[noteId] }));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'private': return '🔒';
      case 'shared': return '👥';
      case 'public': return '🌍';
      default: return '📝';
    }
  };

  const getStatusColorClass = (status) => {
    switch (status) {
      case 'private': return 'bg-slate-100 text-slate-800 border-slate-200 shadow-sm';
      case 'shared': return 'bg-blue-100 text-blue-800 border-blue-200 shadow-sm';
      case 'public': return 'bg-emerald-100 text-emerald-800 border-emerald-200 shadow-sm';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 shadow-sm';
    }
  };

  // Use filtered notes for display (fallback to client-side filtering)
  const displayNotes = filter === 'all' ? notes : filteredNotes;
  const totalPages = Math.ceil(totalNotes / notesPerPage);

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  // Debug information
  useEffect(() => {
    console.log('Current state:', {
      filter,
      notes: notes.length,
      displayNotes: displayNotes.length,
      searchQuery,
      currentPage
    });
  }, [filter, notes, displayNotes, searchQuery, currentPage]);

  if (authLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="glass-card p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/20 backdrop-blur-xl">
          <LoadingSpinner size="lg" className="text-indigo-600 loading-glow" />
          <p className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mt-4 font-bold text-base sm:text-lg">
            Loading your notes...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-60 via-white to-purple-50 font-sans">
      {/* Floating Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-r from-indigo-200/30 to-purple-200/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-48 sm:w-80 h-48 sm:h-80 bg-gradient-to-r from-pink-200/30 to-orange-200/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-3/4 w-40 sm:w-64 h-40 sm:h-64 bg-gradient-to-r from-cyan-200/30 to-blue-200/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10 px-4 sm:px-6 py-6 sm:py-8">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12 animate-slide-in">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl mb-4 sm:mb-6 shadow-lg">
            <span className="text-3xl sm:text-4xl">📝</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 mb-4 tracking-tight">
            My Notes
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-xl sm:max-w-2xl mx-auto leading-relaxed">
            Organize, share, and collaborate on your ideas
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center mt-4 sm:mt-6 space-y-4 sm:space-y-0 sm:space-x-8 text-xs sm:text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
              <span>{totalNotes} total notes</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span>Showing {displayNotes.length} filtered</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Welcome, {user?.email?.split('@')[0]}</span>
            </div>
          </div>
        </div>

        {/* Notification */}
        {notification && (
          <div className="mb-6 sm:mb-8 animate-slide-in">
            <Notification message={notification.message} type={notification.type} duration={4000} />
          </div>
        )}

        {/* Control Panel */}
        <div className="mb-8 sm:mb-12 bg-white/70 backdrop-blur-xl p-4 sm:p-6 md:p-8 rounded-3xl shadow-xl border border-white/20 animate-slide-in" style={{ animationDelay: '0.2s' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="space-y-3">
              <label className="block text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wide">
                Filter Notes ({filter})
              </label>
              <NoteFilter currentFilter={filter} onFilterChange={handleFilterChange} />
            </div>
            <div className="space-y-3">
              <label className="block text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wide">
                Search Notes
              </label>
              <SearchBar
                onSearch={setSearchQuery}
                icon="🔍"
                label="Search by title or tag"
                className="border-indigo-200 rounded-xl bg-white/50 backdrop-blur"
              />
            </div>
            <div className="space-y-3">
              <label className="block text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wide">
                View Mode
              </label>
              <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`flex-1 py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                    viewMode === 'table' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:text-indigo-600'
                  }`}
                >
                  📋 Table
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex-1 py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                    viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:text-indigo-600'
                  }`}
                >
                  🎯 Grid
                </button>
              </div>
            </div>
            <div className="space-y-3">
              <label className="block text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wide">
                Actions
              </label>
              <Button
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-sm sm:text-base font-bold shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={() => navigate('/notes/create')}
              >
                ✨ Create Note
              </Button>
            </div>
          </div>
        </div>

        {/* Notes Content */}
        <div className="animate-slide-in" style={{ animationDelay: '0.4s' }}>
          {notesLoading ? (
            <div className="flex justify-center items-center py-16 sm:py-20">
              <div className="bg-white/70 backdrop-blur-xl p-6 sm:p-10 rounded-3xl shadow-xl border border-white/20">
                <LoadingSpinner size="lg" className="text-indigo-600 loading-glow" />
                <p className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mt-4 font-bold text-base sm:text-lg">
                  Loading notes...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-16 sm:py-20">
              <div className="bg-red-50/70 backdrop-blur-xl p-6 sm:p-10 rounded-3xl border border-red-200/50 max-w-sm sm:max-w-md mx-auto">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl sm:text-3xl">❌</span>
                </div>
                <Notification message={error} type="error" />
                <Button
                  onClick={fetchNotes}
                  className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold mt-4 transition-all duration-200"
                >
                  Try Again
                </Button>
              </div>
            </div>
          ) : displayNotes.length === 0 ? (
            <div className="text-center py-16 sm:py-20">
              <div className="bg-white/70 backdrop-blur-xl p-8 sm:p-12 rounded-3xl max-w-md sm:max-w-lg mx-auto border border-white/20 shadow-xl">
                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <span className="text-3xl sm:text-5xl">📝</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4">
                  {filter === 'all' ? 'No Notes Yet' : `No ${filter} Notes Found`}
                </h3>
                <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-lg">
                  {filter === 'all' 
                    ? 'Ready to capture your first idea?' 
                    : `Try changing the filter or create a new ${filter} note`
                  }
                </p>
                <Button
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-sm sm:text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={() => navigate('/notes/create')}
                >
                  ✨ Create Your First Note
                </Button>
              </div>
            </div>
          ) : viewMode === 'grid' ? (
            // Grid View
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {displayNotes.map((note, index) => {
                const isOwner = user && note.owner_id === user.id;
                const displayContent = showFullContent[note.id] ? note.content : truncateContent(note.content);
                const needsTruncation = note.content.length > 100;
                const noteStatus = note.visibility_status || note.status || note.visibility || 'private';

                return (
                  <div
                    key={note.id}
                    className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-4 sm:p-6 hover:shadow-xl transition-all duration-300 animate-slide-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate flex-1">{note.title}</h3>
                      <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColorClass(noteStatus)}`}>
                        <span className="mr-1">{getStatusIcon(noteStatus)}</span>
                        {noteStatus}
                      </span>
                    </div>
                    <div className="mb-4">
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                        {displayContent}
                        {needsTruncation && (
                          <button
                            onClick={() => toggleContent(note.id)}
                            className="text-indigo-600 hover:text-indigo-700 text-xs font-medium ml-1"
                          >
                            {showFullContent[note.id] ? '(Less)' : '(More)'}
                          </button>
                        )}
                      </p>
                      {noteStatus === 'shared' && !isOwner && note.owner_email && (
                        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                          <span>Shared by:</span>
                          <span className="font-semibold text-indigo-600">{note.owner_email}</span>
                        </p>
                      )}
                    </div>
                    {note.tags && (
                      <div className="mb-4 flex flex-wrap gap-1">
                        {note.tags.split(',').slice(0, 3).map((tag, i) => (
                          <span
                            key={i}
                            className="inline-block bg-indigo-100 text-indigo-700 rounded-full px-2 py-1 text-xs"
                          >
                            #{tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <span>{note.updatedAt ? new Date(note.updatedAt).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-2">
                      <Button
                        onClick={() => navigate(`/notes/${note.id}`)}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-3 rounded-lg text-xs font-medium"
                      >
                        View
                      </Button>
                      {isOwner && (
                        <>
                          <Button
                            onClick={() => navigate(`/notes/${note.id}/edit`)}
                            className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-3 rounded-lg text-xs font-medium"
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleShareClick(note.id)}
                            className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-3 rounded-lg text-xs font-medium"
                          >
                            Share
                          </Button>
                          <Button
                            onClick={() => handleDelete(note.id)}
                            className="bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-lg text-xs font-medium"
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // Table View (Visible on all devices)
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden border border-white/20">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
                    <tr>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden md:table-cell">
                        Content
                      </th>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden lg:table-cell">
                        Tags
                      </th>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden md:table-cell">
                        Updated
                      </th>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white/50 divide-y divide-gray-100">
                    {displayNotes.map((note, index) => {
                      const isOwner = user && note.owner_id === user.id;
                      const displayContent = showFullContent[note.id] ? note.content : truncateContent(note.content);
                      const needsTruncation = note.content.length > 100;
                      const noteStatus = note.visibility_status || note.status || note.visibility || 'private';

                      return (
                        <tr
                          key={note.id}
                          className="hover:bg-white/70 transition-all duration-200 animate-slide-in"
                          style={{ animationDelay: `${index * 0.05}s` }}
                        >
                          <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-gray-900">{note.title}</td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700 max-w-[150px] sm:max-w-xs hidden md:table-cell">
                            <div className="relative">
                              {displayContent}
                              {needsTruncation && (
                                <button
                                  onClick={() => toggleContent(note.id)}
                                  className="text-indigo-600 hover:text-indigo-700 text-xs font-medium ml-1"
                                >
                                  {showFullContent[note.id] ? '(Less)' : '(More)'}
                                </button>
                              )}
                              {noteStatus === 'shared' && !isOwner && note.owner_email && (
                                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                  <span>Shared by:</span>
                                  <span className="font-semibold text-indigo-600">{note.owner_email}</span>
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4">
                            <span
                              className={`px-2 sm:px-3 py-1 text-xs font-semibold rounded-full ${getStatusColorClass(noteStatus)}`}
                            >
                              <span className="mr-1">{getStatusIcon(noteStatus)}</span>
                              {noteStatus}
                            </span>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700 hidden lg:table-cell">
                            {note.tags
                              ? note.tags
                                  .split(',')
                                  .slice(0, 2)
                                  .map((tag, i) => (
                                    <span
                                      key={i}
                                      className="inline-block bg-indigo-100 text-indigo-700 rounded-full px-2 py-0.5 text-xs mr-1"
                                    >
                                      #{tag.trim()}
                                    </span>
                                  ))
                              : '-'}
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500 hidden md:table-cell">
                            {note.updatedAt ? new Date(note.updatedAt).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4">
                            <div className="flex flex-col space-y-1">
                              <Button
                                onClick={() => navigate(`/notes/${note.id}`)}
                                className="bg-indigo-500 hover:bg-indigo-600 text-white py-1 sm:py-1.5 px-2 sm:px-3 rounded-lg text-xs font-medium"
                              >
                                View
                              </Button>
                              {isOwner && (
                                <>
                                  <Button
                                    onClick={() => navigate(`/notes/${note.id}/edit`)}
                                    className="bg-amber-500 hover:bg-amber-600 text-white py-1 sm:py-1.5 px-2 sm:px-3 rounded-lg text-xs font-medium"
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    onClick={() => handleShareClick(note.id)}
                                    className="bg-purple-500 hover:bg-purple-600 text-white py-1 sm:py-1.5 px-2 sm:px-3 rounded-lg text-xs font-medium"
                                  >
                                    Share
                                  </Button>
                                  <Button
                                    onClick={() => handleDelete(note.id)}
                                    className="bg-red-500 hover:bg-red-600 text-white py-1 sm:py-1.5 px-2 sm:px-3 rounded-lg text-xs font-medium"
                                  >
                                    Delete
                                  </Button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pagination */}
          {displayNotes.length > 0 && (
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row justify-between items-center bg-white/70 backdrop-blur-xl p-4 sm:p-6 rounded-2xl border border-white/20 shadow-lg animate-slide-in">
              <Button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl'
                }`}
              >
                <span>←</span>
                <span>Previous</span>
              </Button>
              <div className="flex items-center space-x-4 my-4 sm:my-0">
                <span className="text-gray-600 text-xs sm:text-sm font-medium">
                  Page <span className="font-bold text-indigo-600">{currentPage}</span> of{' '}
                  <span className="font-bold text-indigo-600">{totalPages}</span>
                </span>
                <span className="text-xs text-gray-500 hidden sm:block">
                  Showing {((currentPage - 1) * notesPerPage) + 1}-{Math.min(currentPage * notesPerPage, totalNotes)} of{' '}
                  {totalNotes} notes
                </span>
              </div>
              <Button
                onClick={handleNextPage}
                disabled={currentPage === totalPages || displayNotes.length === 0}
                className={`flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  currentPage === totalPages || displayNotes.length === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl'
                }`}
              >
                <span>Next</span>
                <span>→</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Share Modal */}
      {shareModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl w-full max-w-sm sm:max-w-md shadow-2xl border border-white/20 animate-scale-in">
            <div className="text-center mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl sm:text-3xl">📤</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                Share Note
              </h3>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">Share this note with another user</p>
            </div>
            <form onSubmit={handleShareSubmit} className="space-y-6">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  User Email
                </label>
                <InputField
                  id="shareEmail"
                  type="email"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                  required
                  placeholder="user@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/50 backdrop-blur"
                />
              </div>
              {shareError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-red-600 text-xs sm:text-sm font-medium text-center">{shareError}</p>
                </div>
              )}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  onClick={() => setShareModalOpen(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 sm:py-3 rounded-xl font-bold transition-all duration-200"
                  disabled={shareLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-2 sm:py-3 rounded-xl font-bold shadow-lg transition-all duration-200"
                  disabled={shareLoading}
                >
                  {shareLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <LoadingSpinner size="sm" />
                      Sharing...
                    </div>
                  ) : (
                    '✨ Share Note'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesDashboardPage;