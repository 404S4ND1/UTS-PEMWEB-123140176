import React from 'react';

const COVER_PLACEHOLDER = 'https://via.placeholder.com/60x90.png?text=No+Cover';

function DataTable({ 
  books, 
  loading, 
  error, 
  isReadingList = false, 
  onAdd, 
  onRemove, 
  onShowDetail 
}) {

  if (loading) {
    return <div className="loading-message">Loading results...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (books.length === 0) {
    return <div className="info-message">
      {isReadingList ? 'Your reading list is empty.' : 'No books found. Try a different search.'}
    </div>;
  }

  return (
    <div className="data-table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Cover</th>
            <th>Title</th>
            <th>Author(s)</th>
            <th>First Published</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => {
            const coverUrl = book.cover_i
              ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
              : COVER_PLACEHOLDER;
            
            return (
              <tr key={book.key}>
                <td>
                  <img src={coverUrl} alt={book.title} className="book-cover" />
                </td>
                <td>{book.title}</td>
                <td>{book.author_name?.join(', ') || 'Unknown'}</td>
                <td>{book.first_publish_year || 'N/A'}</td>
                <td>
                  {isReadingList ? (
                    <button 
                      className="action-btn btn-remove"
                      onClick={() => onRemove(book.key)}
                    >
                      Remove
                    </button>
                  ) : (
                    <button 
                      className="action-btn btn-add"
                      onClick={() => onAdd(book)}
                    >
                      Add to List
                    </button>
                  )}
                  <button 
                    className="action-btn btn-detail"
                    onClick={() => onShowDetail(book.key)}
                  >
                    Details
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;