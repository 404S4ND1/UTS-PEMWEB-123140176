// src/components/DetailCard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DetailCard({ workId, onClose }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!workId) return;

    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      setDetails(null);
      try {
        const url = `https://openlibrary.org${workId}.json`;
        const response = await axios.get(url);
        setDetails(response.data);
      } catch (err) {
        setError('Failed to fetch book details.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [workId]); 

  const getDescription = () => {
    if (!details?.description) return 'No description available.';
    return details.description.value || details.description;
  };

  return (
    <div className="detail-card-overlay" onClick={onClose}>
      <div className="detail-card" onClick={(e) => e.stopPropagation()}>
        <button className="detail-card-close" onClick={onClose}>&times;</button>
        
        {loading && <div className="loading-message">Loading details...</div>}
        {error && <div className="error-message">{error}</div>}
        
        {details && (
          <>
            <h2>{details.title}</h2>
            
            <h3>Description</h3>
            <p>{getDescription()}</p>

            <h3>Subjects</h3>
            {details.subjects && details.subjects.length > 0 ? (
              <ul>
                {details.subjects.slice(0, 10).map((subject) => (
                  <li key={subject}>{subject}</li>
                ))}
              </ul>
            ) : (
              <p>No subjects listed.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default DetailCard;