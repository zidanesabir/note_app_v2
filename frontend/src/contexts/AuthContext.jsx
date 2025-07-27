import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../lib/api.js';

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  loading: true,
  login: () => Promise.resolve(false),
  register: () => Promise.resolve(false),
  logout: () => {},
  sharedNotesCount: 0,
  sharedNotesList: [],
  showNotificationsModal: false,
  openNotificationsModal: () => {},
  closeNotificationsModal: () => {},
  updateSharedNotes: () => Promise.resolve(),
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sharedNotesCount, setSharedNotesCount] = useState(0);
  const [sharedNotesList, setSharedNotesList] = useState([]);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const navigate = useNavigate();

  // Memoize the fetchSharedNotesData function to prevent unnecessary re-renders
  const fetchSharedNotesData = useCallback(async () => {
    if (!user) {
      setSharedNotesCount(0);
      setSharedNotesList([]);
      return;
    }
    try {
      const response = await apiClient.get('/api/notes/?status=shared&limit=1000');
      const notes = Array.isArray(response.data.notes) ? response.data.notes : [];
      setSharedNotesList(notes);
      setSharedNotesCount(notes.length);
      console.log('AuthContext: Fetched shared notes:', { count: notes.length, notes });
    } catch (error) {
      console.error('AuthContext: Failed to fetch shared notes:', error.response?.data?.message || error.message);
      setSharedNotesCount(0);
      setSharedNotesList([]);
    }
  }, [user]);

  // Memoize the updateSharedNotes function
  const updateSharedNotes = useCallback(async () => {
    await fetchSharedNotesData();
  }, [fetchSharedNotesData]);

  // Memoize modal functions to prevent unnecessary re-renders
  const openNotificationsModal = useCallback(() => {
    console.log('Opening notifications modal - before state change');
    setShowNotificationsModal(true);
    console.log('Opening notifications modal - after state change');
  }, []);

  const closeNotificationsModal = useCallback(() => {
    console.log('Closing notifications modal - before state change');
    setShowNotificationsModal(false);
    console.log('Closing notifications modal - after state change');
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (token) {
        try {
          const res = await apiClient.get('/api/auth/me');
          setUser(res.data);
        } catch (error) {
          console.error('AuthContext: Failed to load user from token:', error.response?.data?.message || error.message);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  // Separate useEffect for fetching shared notes when user changes
  useEffect(() => {
    if (user) {
      fetchSharedNotesData();
    } else {
      setSharedNotesCount(0);
      setSharedNotesList([]);
    }
  }, [user, fetchSharedNotesData]);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await apiClient.post('/api/auth/login', { email, password });
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', res.data.access_token);
      }
      const userRes = await apiClient.get('/api/auth/me');
      setUser(userRes.data);
      navigate('/notes');
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error('AuthContext: Login failed:', errorMessage);
      setUser(null);
      setSharedNotesCount(0);
      setSharedNotesList([]);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password) => {
    try {
      setLoading(true);
      await apiClient.post('/api/auth/register', { email, password });
      return await login(email, password);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error('AuthContext: Registration failed:', errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    setUser(null);
    setSharedNotesCount(0);
    setSharedNotesList([]);
    setShowNotificationsModal(false);
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        sharedNotesCount,
        sharedNotesList,
        showNotificationsModal,
        openNotificationsModal,
        closeNotificationsModal,
        updateSharedNotes,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};