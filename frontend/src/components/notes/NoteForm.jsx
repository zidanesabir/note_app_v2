import { useState, useEffect } from 'react';
import Button from '../common/Button.jsx';
import InputField from '../common/InputField.jsx';
import Notification from '../common/Notification.jsx';
import { Save, FileText, Tags, Eye } from 'lucide-react';

const NoteForm = ({ note, onSubmit, loading, error, isEdit = false }) => {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [tags, setTags] = useState(note?.tags || '');
  const [visibilityStatus, setVisibilityStatus] = useState(note?.visibility_status || 'private');
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setContent(note.content || '');
      setTags(note.tags || '');
      setVisibilityStatus(note.visibility_status || 'private');
    }
  }, [note]);

  useEffect(() => {
    setFormError(error);
  }, [error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError(null);
    if (!title || !content) {
      setFormError("Title and Content are required.");
      return;
    }
    onSubmit({
      title,
      content,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '').join(','),
      visibility_status: visibilityStatus,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-8 rounded-3xl shadow-card w-full max-w-2xl mx-auto border-gradient">
      <h2 className="text-2xl font-heading font-bold mb-6 text-center text-gradient">{isEdit ? 'Edit Note' : 'Create New Note'}</h2>
      {formError && <Notification message={formError} type="error" />}

      <InputField
        label="Title"
        id="title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="input-glass rounded-lg text-base py-2.5"
        icon={<FileText className="w-5 h-5 text-neutral-500" />}
      />
      
      <div className="mb-4">
        <label htmlFor="content" className="block text-neutral-700 text-sm font-medium mb-1">Content (Markdown allowed):</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          placeholder="Start writing your note... (Markdown supported)"
          className="block w-full px-3 py-2 border border-neutral-200 rounded-lg shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary sm:text-sm h-48 input-glass"
        ></textarea>
      </div>

      <InputField
        label="Tags (comma-separated)"
        id="tags"
        type="text"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="work, idea, personal, important..."
        className="input-glass rounded-lg text-base py-2.5"
        icon={<Tags className="w-5 h-5 text-neutral-500" />}
      />

      <div className="mb-6">
        <label htmlFor="visibility" className="block text-neutral-700 text-sm font-medium mb-1">Visibility:</label>
        <select
          id="visibility"
          value={visibilityStatus}
          onChange={(e) => setVisibilityStatus(e.target.value)}
          className="w-full px-3 py-2 border border-neutral-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary sm:text-sm input-glass appearance-none pr-8 cursor-pointer"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.5em 1.5em' }}
        >
          <option value="private">Private</option>
          <option value="shared">Shared</option>
          <option value="public">Public</option>
        </select>
      </div>
      
      <div className="relative group">
        <Button
          type="submit"
          disabled={loading}
          className="w-full py-4 px-8 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 disabled:from-neutral-400 disabled:to-neutral-500 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 disabled:cursor-not-allowed disabled:transform-none"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {loading ? (
              <>
                <LoadingSpinner size="sm" className="text-white" />
                {isEdit ? 'Saving...' : 'Creating...'}
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                {isEdit ? 'Save Changes' : 'Create Note'}
              </>
            )}
          </span>
        </Button>
        {/* Glow on hover */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-600 to-accent-600 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300 -z-10"></div>
      </div>
    </form>
  );
};

export default NoteForm;