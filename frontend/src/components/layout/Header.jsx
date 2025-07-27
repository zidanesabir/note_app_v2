import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import Button from '../common/Button.jsx';
import Modal from '../common/Modal.jsx';
import ReactMarkdown from 'react-markdown';
import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../lib/api.js';
import Swal from 'sweetalert2';

const Header = () => {
  const {
    isAuthenticated,
    user,
    logout,
    sharedNotesCount,
    sharedNotesList,
    showNotificationsModal,
    closeNotificationsModal,
    openNotificationsModal,
    updateSharedNotes,
  } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [deletingNotificationId, setDeletingNotificationId] = useState(null);
  const [isLoadingNotes, setIsLoadingNotes] = useState(false);

  // Fetch shared notes on mount
  useEffect(() => {
    if (isAuthenticated && updateSharedNotes) {
      setIsLoadingNotes(true);
      updateSharedNotes().finally(() => setIsLoadingNotes(false));
    }
  }, [isAuthenticated, updateSharedNotes]);

  // Close mobile menu when clicking outside or on escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.mobile-menu') && !event.target.closest('.menu-toggle')) {
        setIsMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Memoize the notification click handler
  const handleNotificationClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Notifications button clicked - showNotificationsModal before:', showNotificationsModal);
    openNotificationsModal();
  }, [openNotificationsModal, showNotificationsModal]);

  // Memoize the mobile notification click handler
  const handleMobileNotificationClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Mobile notifications button clicked - showNotificationsModal before:', showNotificationsModal);
    openNotificationsModal();
    closeMenu();
  }, [openNotificationsModal, showNotificationsModal]);

  // Function to delete/dismiss a notification
  const handleDeleteNotification = async (noteId, noteTitle) => {
    const result = await Swal.fire({
      title: 'Remove Notification?',
      text: `This will remove "${noteTitle}" from your notifications. The shared note will still be accessible.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Remove',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      customClass: {
        popup: 'glass-card rounded-2xl',
        title: 'text-gray-700',
        content: 'text-gray-600',
      },
    });

    if (result.isConfirmed) {
      setDeletingNotificationId(noteId);
      try {
        console.log('Attempting to delete notification with ID:', noteId);
        
        // Try multiple possible endpoints that might work with your backend
        let deleteResponse;
        try {
          // Primary endpoint
          deleteResponse = await apiClient.delete(`/api/notifications/shared-note/${noteId}`);
          console.log('Delete response (primary endpoint):', deleteResponse);
        } catch (primaryError) {
          console.log('Primary endpoint failed, trying alternative endpoints...');
          console.error('Primary endpoint error:', primaryError.response?.data || primaryError.message);
          
          // Alternative endpoints to try
          const alternativeEndpoints = [
            `/api/notifications/${noteId}`,
            `/api/shared-notes/${noteId}/notification`,
            `/api/notes/${noteId}/notification`,
            `/api/user/notifications/${noteId}`
          ];
          
          let successfulEndpoint = null;
          for (const endpoint of alternativeEndpoints) {
            try {
              console.log(`Trying endpoint: ${endpoint}`);
              deleteResponse = await apiClient.delete(endpoint);
              successfulEndpoint = endpoint;
              console.log(`Success with endpoint: ${endpoint}`, deleteResponse);
              break;
            } catch (altError) {
              console.log(`Failed with endpoint ${endpoint}:`, altError.response?.status, altError.response?.data?.message || altError.message);
            }
          }
          
          if (!successfulEndpoint) {
            // If all delete endpoints fail, try a different approach
            // Maybe your backend expects a POST or PUT request to mark as read/dismissed
            try {
              console.log('Trying to mark notification as read instead...');
              deleteResponse = await apiClient.post(`/api/notifications/${noteId}/mark-read`);
              console.log('Mark as read response:', deleteResponse);
            } catch (readError) {
              try {
                console.log('Trying PATCH to dismiss notification...');
                deleteResponse = await apiClient.patch(`/api/notifications/${noteId}`, { dismissed: true });
                console.log('PATCH dismiss response:', deleteResponse);
              } catch (patchError) {
                throw primaryError; // Throw the original error if all attempts fail
              }
            }
          }
        }

        // Refresh the shared notes list
        if (updateSharedNotes) {
          await updateSharedNotes();
        }

        Swal.fire({
          icon: 'success',
          title: 'Notification Removed',
          text: 'The notification has been removed successfully.',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          customClass: {
            popup: 'glass-card rounded-2xl',
            title: 'text-gray-700',
            content: 'text-gray-600',
          },
        });
      } catch (error) {
        console.error('All attempts to delete notification failed:', {
          noteId,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message,
          fullError: error
        });

        // Provide more specific error messages based on the response
        let errorMessage = 'Failed to remove notification. Please try again.';
        if (error.response?.status === 404) {
          errorMessage = 'Notification not found. It may have already been removed.';
        } else if (error.response?.status === 403) {
          errorMessage = 'You do not have permission to remove this notification.';
        } else if (error.response?.status === 401) {
          errorMessage = 'Please log in again to remove notifications.';
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMessage,
          footer: `<small>Error details: ${error.response?.status || 'Unknown'} - ${error.response?.statusText || error.message}</small>`,
          timer: 5000,
          timerProgressBar: true,
          showConfirmButton: true,
          customClass: {
            popup: 'glass-card rounded-2xl',
            title: 'text-gray-700',
            content: 'text-gray-600',
          },
        });
      } finally {
        setDeletingNotificationId(null);
      }
    }
  };

  // Function to mark all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      await apiClient.post('/api/notifications/mark-all-read');
      if (updateSharedNotes) {
        await updateSharedNotes();
      }
      Swal.fire({
        icon: 'success',
        title: 'All Notifications Marked as Read',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        customClass: {
          popup: 'glass-card rounded-2xl',
          title: 'text-gray-700',
          content: 'text-gray-600',
        },
      });
    } catch (error) {
      console.error('Failed to mark notifications as read:', error.response?.data || error.message);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to mark notifications as read. Please try again.',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        customClass: {
          popup: 'glass-card rounded-2xl',
          title: 'text-gray-700',
          content: 'text-gray-600',
        },
      });
    }
  };

  // Function to format date more user-friendly
  const formatNotificationDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date)) return 'N/A';
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      });
    }
  };

  // Debug: Log the current state
  console.log('Header render - showNotificationsModal:', showNotificationsModal, 'sharedNotesList:', sharedNotesList);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center h-14 sm:h-16 lg:h-18">
            {/* Logo */}
            <Link to="/" className="group flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
              <div className="relative">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shadow-md">
                  <span className="text-lg sm:text-xl lg:text-2xl">📝</span>
                </div>
              </div>
              <div className="hidden xs:block">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                  NotesApp
                </h1>
                <p className="text-xs text-gray-500 -mt-0.5 font-medium tracking-wide hidden sm:block">
                  Amazing Notes
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/notes"
                    className="flex items-center space-x-2 px-3 py-2 rounded-xl text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 font-medium"
                  >
                    <span className="text-lg">📚</span>
                    <span className="text-sm">My Notes</span>
                  </Link>
                  <button
                    onClick={handleNotificationClick}
                    className="relative flex items-center space-x-2 px-3 py-2 rounded-xl text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200 font-medium"
                    type="button"
                  >
                    <span className="text-lg">🔔</span>
                    <span className="text-sm">Notifications</span>
                    {sharedNotesCount > 0 && (
                      <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full animate-pulse">
                        {sharedNotesCount > 99 ? '99+' : sharedNotesCount}
                      </span>
                    )}
                  </button>
                  <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-200">
                    <div className="flex items-center space-x-2 bg-gray-50 hover:bg-indigo-50 px-3 py-2 rounded-xl transition-all duration-200">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                        {user?.email?.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-gray-800 leading-tight">
                          {user?.email?.split('@')[0]}
                        </p>
                        <p className="text-xs text-gray-500 leading-tight">
                          {user?.email?.split('@')[1]}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={logout}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200"
                    >
                      Logout
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-xl text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 font-medium text-sm"
                  >
                    Login
                  </Link>
                  <Link to="/register">
                    <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200">
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="menu-toggle lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Toggle Menu"
              aria-expanded={isMenuOpen}
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={closeMenu}></div>
          <nav className="mobile-menu fixed top-14 sm:top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-xl max-h-[calc(100vh-3.5rem)] sm:max-h-[calc(100vh-4rem)] overflow-y-auto">
            {isAuthenticated ? (
              <div className="px-4 py-6 space-y-4">
                {/* User Info */}
                <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-gray-50 to-indigo-50 rounded-2xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-xl flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                    {user?.email?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 truncate">
                      {user?.email?.split('@')[0]}
                    </p>
                    <p className="text-sm text-gray-600 truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>

                {/* Navigation Links */}
                <div className="space-y-2">
                  <Link
                    to="/notes"
                    onClick={closeMenu}
                    className="flex items-center space-x-3 p-4 rounded-2xl text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 group"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform duration-200">📚</span>
                    <div>
                      <p className="font-semibold">My Notes</p>
                      <p className="text-xs text-gray-500">View and manage your notes</p>
                    </div>
                  </Link>
                  <button
                    onClick={handleMobileNotificationClick}
                    className="w-full flex items-center space-x-3 p-4 rounded-2xl text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200 group"
                    type="button"
                  >
                    <div className="relative">
                      <span className="text-2xl group-hover:scale-110 transition-transform duration-200">🔔</span>
                      {sharedNotesCount > 0 && (
                        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full animate-pulse">
                          {sharedNotesCount > 99 ? '99+' : sharedNotesCount}
                        </span>
                      )}
                    </div>
                    <div className="text-left">
                      <p className="font-semibold">Notifications</p>
                      <p className="text-xs text-gray-500">
                        {sharedNotesCount > 0
                          ? `${sharedNotesCount} new ${sharedNotesCount === 1 ? 'note' : 'notes'} shared`
                          : 'No new notifications'}
                      </p>
                    </div>
                  </button>
                </div>

                {/* Logout Button */}
                <div className="pt-4 border-t border-gray-200">
                  <Button
                    onClick={() => {
                      logout();
                      closeMenu();
                    }}
                    className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-2xl font-bold transition-all duration-200"
                  >
                    Logout
                  </Button>
                </div>
              </div>
            ) : (
              <div className="px-4 py-6 space-y-3">
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="block p-4 rounded-2xl text-center text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 font-semibold"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="block"
                >
                  <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white py-3 rounded-2xl font-bold transition-all duration-200">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}

      {/* Enhanced Shared Notes Modal with Delete Functionality */}
      <Modal
        title={
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-xl">📬</span>
              </div>
              <div className="min-w-0">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                  Shared Notes
                </h3>
                <p className="text-sm text-gray-500 truncate">
                  {sharedNotesCount} {sharedNotesCount === 1 ? 'notification' : 'notifications'}
                </p>
              </div>
            </div>
            {sharedNotesList?.length > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg font-medium transition-all duration-200"
              >
                Mark All Read
              </button>
            )}
          </div>
        }
        isOpen={showNotificationsModal}
        onClose={closeNotificationsModal}
      >
        <div className="max-h-[60vh] sm:max-h-96 overflow-y-auto">
          {isLoadingNotes ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <span className="text-4xl">📝</span>
              </div>
              <p className="text-gray-600 font-semibold">Loading notifications...</p>
            </div>
          ) : !sharedNotesList || sharedNotesList.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">📝</span>
              </div>
              <p className="text-gray-600 font-semibold">No notifications yet</p>
              <p className="text-sm text-gray-500 mt-1">Notes shared with you will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sharedNotesList.map((note, index) => (
                <div
                  key={note.id}
                  className={`bg-white hover:bg-gray-50 p-4 sm:p-5 rounded-2xl border border-gray-200 hover:border-indigo-200 hover:shadow-md transition-all duration-200 relative ${
                    deletingNotificationId === note.id ? 'opacity-50' : ''
                  }`}
                >
                  {/* Delete Button */}
                  

                  <div className="flex items-start justify-between mb-3 pr-8">
                    <h4 className="font-bold text-gray-900 text-base sm:text-lg leading-tight flex-1 min-w-0 pr-2">
                      {note.title}
                    </h4>
                    <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-lg text-xs font-semibold whitespace-nowrap">
                      Shared
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="text-gray-700 text-sm leading-relaxed line-clamp-2 sm:line-clamp-3">
                      <ReactMarkdown>{note.content}</ReactMarkdown>
                    </div>
                  </div>

                  {/* Enhanced notification details */}
                  <div className="bg-gray-50 rounded-xl p-3 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-bold">
                            {note.owner_email?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-700">
                            Shared by: <span className="text-indigo-600">{note.owner_email || 'Unknown'}</span>
                          </p>
                          <div className="flex items-center space-x-3 text-xs text-gray-500">
                            <span>📅 {formatNotificationDate(note.updatedAt)}</span>
                            <span>🔗 {note.visibility_status || 'shared'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="text-xs text-gray-500">
                      <span className="inline-flex items-center space-x-1">
                        <span>🆔</span>
                        <span>Note ID: {note.id}</span>
                      </span>
                    </div>
                    <Link
                      to={`/notes/${note.id}`}
                      onClick={closeNotificationsModal}
                      className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap flex items-center space-x-2"
                    >
                      <span>View Note</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default Header;