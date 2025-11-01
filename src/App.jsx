import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import DataTable from './components/DataTable';
import DetailCard from './components/DetailCard';

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [readingList, setReadingList] = useState(() => {
    const savedList = localStorage.getItem('readingList');
    return savedList ? JSON.parse(savedList) : [];
  });

  const [selectedWorkId, setSelectedWorkId] = useState(null);

  const [filterSubject, setFilterSubject] = useState('');

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  useEffect(() => {
    localStorage.setItem('readingList', JSON.stringify(readingList));
  }, [readingList]);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const handleThemeToggle = () => {
    setIsDarkMode(prevMode => !prevMode);
  };
  
  const handleSearch = async (query, type) => {
    setLoading(true);
    setError(null);
    setBooks([]);
    setSelectedWorkId(null);
    setFilterSubject(''); 

    try {
      let searchUrl = `https://openlibrary.org/search.json?`;
      if (type === 'author') {
        searchUrl += `author=${encodeURIComponent(query)}`;
      } else {
        searchUrl += `title=${encodeURIComponent(query)}`;
      }
      
      searchUrl += '&fields=key,title,author_name,first_publish_year,cover_i,subject&limit=20';

      const response = await axios.get(searchUrl);
      
      const transformedDocs = response.data.docs.map(doc => ({
        ...doc,
        key: doc.key 
      }));
      setBooks(transformedDocs);
      
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addToReadingList = (bookToAdd) => {
    if (!readingList.some(book => book.key === bookToAdd.key)) {
      setReadingList([...readingList, bookToAdd]);
      alert(`"${bookToAdd.title}" added to your reading list!`);
    } else {
      alert(`"${bookToAdd.title}" is already in your list.`);
    }
  };

  const removeFromReadingList = (bookKey) => {
    setReadingList(readingList.filter(book => book.key !== bookKey));
  };
  
  const allSubjects = React.useMemo(() => {
    const subjects = new Set();
    books.forEach(book => {
      book.subject?.forEach(s => subjects.add(s));
    });
    return Array.from(subjects).sort();
  }, [books]); 

  const filteredBooks = filterSubject
    ? books.filter(book => book.subject?.includes(filterSubject))
    : books;

  return (
    <>
      {}
      <Header onThemeToggle={handleThemeToggle} />

      <main className="container">
        
        <section id="search" className="section">
          <h2>Search Books</h2>
          <SearchForm onSearch={handleSearch} loading={loading} />
        </section>

        {books.length > 0 && (
          <div className="filter-controls">
            <label htmlFor="subject-filter">Filter by Subject: </label>
            <select 
              id="subject-filter"
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
            >
              <option value="">All Subjects</option>
              {allSubjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
        )}

        <section className="section">
          <h3>Search Results</h3>
          <DataTable
            books={filteredBooks}
            loading={loading}
            error={error}
            isReadingList={false}
            onAdd={addToReadingList}
            onShowDetail={setSelectedWorkId}
          />
        </section>

        <section id="reading-list" className="section">
          <h2>My Reading List</h2>
          <DataTable
            books={readingList}
            isReadingList={true}
            onRemove={removeFromReadingList}
            onShowDetail={setSelectedWorkId}
          />
        </section>

        {selectedWorkId && (
          <DetailCard 
            workId={selectedWorkId} 
            onClose={() => setSelectedWorkId(null)} 
          />
        )}

      </main>
    </>
  );
}

export default App;