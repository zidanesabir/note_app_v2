import { useEffect, useState } from 'react'; // <--- FIX IS HERE: '=>' changed to 'from'
import { useParams, useNavigate, Link } from 'react-router-dom';
import apiClient from '../lib/api.js';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import Notification from '../components/common/Notification.jsx';
import Button from '../components/common/Button.jsx';
import ReactMarkdown from 'react-markdown';

const PublicNoteViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchPublicNote();
    }
  }, [id]);

  const fetchPublicNote = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/api/notes/public/${id}`); // Node.js backend path
      setNote(response.data);
    } catch (err) {
      console.error('Failed to fetch public note:', err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Public note not found or not accessible.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-50">
        <LoadingSpinner size="lg" className="text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center">
        <Notification message={error} type="error" />
        <Button onClick={() => navigate('/')} className="mt-4 btn-primary rounded-lg">Back to Home</Button>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-neutral-700 text-lg">Note not found or no public access available.</p>
        <Button onClick={() => navigate('/')} className="mt-4 btn-primary rounded-lg">Back to Home</Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 glass-card rounded-2xl shadow-card mt-8 border border-neutral-200">
      <h1 className="text-3xl font-heading font-bold text-gradient mb-4">{note.title}</h1>
      
      <div className="text-sm text-neutral-600 mb-4 flex justify-between items-center border-b border-neutral-200 pb-3">
        <span>Status: <span className="capitalize font-semibold text-primary">{note.visibility_status}</span></span>
        {note.tags && (
          <span>Tags: <span className="font-semibold">{note.tags.split(',').join(', ')}</span></span>
        )}
      </div>

      {note.visibility_status === 'shared' && note.owner_email && (
        <div className="mb-4 p-3 bg-neutral-100 rounded-lg border border-neutral-200 text-neutral-700 flex items-center gap-2 animate-fade-in">
          <span className="text-lg">📢</span>
          <p className="text-sm font-medium">
            This note was shared by: <span className="font-semibold text-primary">{note.owner_email}</span>
          </p>
        </div>
      )}

      <div className="prose max-w-none text-neutral-800 leading-relaxed mb-6 pt-4">
        <ReactMarkdown>{note.content}</ReactMarkdown>
      </div>

      <div className="text-xs text-neutral-500 border-t pt-3 mt-4">
        <p>Created: {new Date(note.createdAt).toLocaleString()}</p>
        <p>Last Updated: {new Date(note.updatedAt).toLocaleString()}</p>
      </div>

      <div className="flex flex-wrap gap-3 mt-6">
        <Button
          onClick={() => navigate('/login')}
          className="btn-primary py-2 px-4 rounded-lg"
        >
          Login to manage your notes
        </Button>
      </div>
    </div>
  );
};

export default PublicNoteViewPage;