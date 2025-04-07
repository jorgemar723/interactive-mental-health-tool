import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Results = () => {
  const [filter, setFilter] = useState('all');
  const [combinedHistory, setCombinedHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const gad7 = JSON.parse(localStorage.getItem('gad7History')) || [];
    const phq9 = JSON.parse(localStorage.getItem('phq9History')) || [];

    const combined = [
      ...gad7.map(entry => ({ ...entry, type: 'GAD-7' })),
      ...phq9.map(entry => ({ ...entry, type: 'PHQ-9' }))
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    setCombinedHistory(combined);
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const handleDelete = (entryToDelete) => {
    const key = entryToDelete.type === 'GAD-7' ? 'gad7History' : 'phq9History';
    const updated = (JSON.parse(localStorage.getItem(key)) || []).filter(
      (entry) => entry.timestamp !== entryToDelete.timestamp
    );
    localStorage.setItem(key, JSON.stringify(updated));
    loadHistory(); // refresh displayed results
  };

  const filteredResults = combinedHistory.filter(entry =>
    filter === 'all' ? true : entry.type === filter
  );

  return (
    <main className="quiz-container fade-in results-page" id="results-page">
      <button
        className="back-button"
        onClick={() => navigate('/')}
        aria-label="Go back to home screen"
      >
        ← Back to Home
      </button>

      <h2 className="fade-heading">📂 Individual Quiz Results</h2>

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="filter-select">Filter:</label>
        <select
          id="filter-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          aria-label="Filter quiz results by type"
        >
          <option value="all">All</option>
          <option value="GAD-7">GAD-7</option>
          <option value="PHQ-9">PHQ-9</option>
        </select>
      </div>

      {filteredResults.length === 0 ? (
        <p>No results found for this filter.</p>
      ) : (
        <ul className="results-list">
          {filteredResults.map((entry, idx) => (
            <li key={`${entry.timestamp}-${idx}`} className="result-card" role="region" aria-label={`Quiz result ${idx + 1}`}>
              <h4>{entry.type} — {formatDate(entry.timestamp)}</h4>
              <p><strong>Score:</strong> {entry.score}</p>
              <p><strong>Severity:</strong> {entry.severity}</p>

              {entry.journal && (
                <div className="journal-entry">
                  <p><strong>📝 Journal:</strong></p>
                  <p>{entry.journal}</p>
                </div>
              )}

              <button
                onClick={() => handleDelete(entry)}
                className="delete-button"
                aria-label={`Delete this ${entry.type} result from ${formatDate(entry.timestamp)}`}
              >
                🗑️ Delete Result
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
};

export default Results;
