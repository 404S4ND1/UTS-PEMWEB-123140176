import React, { useState } from 'react';

function SearchForm({ onSearch, loading }) {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('title');

  const handleSubmit = (e) => {
    e.preventDefault(); 
    if (query) {
      onSearch(query, searchType);
    }
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="search-query">Search Term</label>
        <input
          type="text"
          id="search-query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., The Lord of the Rings"
          required 
        />
      </div>
      
      <div>
        <label htmlFor="search-type">Search By</label>
        <select
          id="search-type"
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        >
          <option value="title">Title</option>
          <option value="author">Author</option>
        </select>
      </div>
      
      <button type="submit" disabled={loading}>
        {loading ? 'Searching...' : 'Search'}
      </button>
    </form>
  );
}

export default SearchForm;