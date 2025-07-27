import InputField from '../common/InputField.jsx';
import { useState, useEffect, useCallback } from 'react';

const SearchBar = ({ onSearch, label, icon, className }) => {
  const [query, setQuery] = useState('');

  const debouncedSearch = useCallback(() => {
    const handler = setTimeout(() => {
      onSearch(query);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [query, onSearch]);

  useEffect(() => {
    const cleanup = debouncedSearch();
    return cleanup;
  }, [debouncedSearch]);


  return (
    <InputField
      label={label}
      icon={icon}
      id="search"
      type="text"
      placeholder="Search by title or tag..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      className={`w-full md:max-w-xs input-glass rounded-lg text-base py-2.5 ${className}`}
    />
  );
};

export default SearchBar;