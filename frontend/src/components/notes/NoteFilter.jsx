import Button from '../common/Button.jsx';

const NoteFilter = ({ currentFilter, onFilterChange }) => {
  const filterButtonClass = (filterName) => `
    px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out
    ${currentFilter === filterName
      ? 'bg-primary text-white shadow-md'
      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
    }
  `;

  return (
    <div className="flex flex-wrap justify-center gap-2">
      <Button
        className={filterButtonClass('all')}
        onClick={() => onFilterChange('all')}
      >
        All
      </Button>
      <Button
        className={filterButtonClass('private')}
        onClick={() => onFilterChange('private')}
      >
        Private
      </Button>
      <Button
        className={filterButtonClass('shared')}
        onClick={() => onFilterChange('shared')}
      >
        Shared
      </Button>
      <Button
        className={filterButtonClass('public')}
        onClick={() => onFilterChange('public')}
      >
        Public
      </Button>
    </div>
  );
};

export default NoteFilter;