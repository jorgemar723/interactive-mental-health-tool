import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import questions from '../data/gad7.json';

const GAD7Quiz = () => {
  const [responses, setResponses] = useState(Array(7).fill(null));
  const [score, setScore] = useState(null);
  const [previousResult, setPreviousResult] = useState(null);
  const [journal, setJournal] = useState('');
  const [savedJournal, setSavedJournal] = useState('');
  const [privateMode, setPrivateMode] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [journalSaved, setJournalSaved] = useState(false);
  const navigate = useNavigate();

  const options = [
    { value: 0, label: 'Not at all' },
    { value: 1, label: 'Several days' },
    { value: 2, label: 'More than half the days' },
    { value: 3, label: 'Nearly every day' }
  ];

  const getSeverity = (score) => {
    if (score <= 4) return 'Minimal Anxiety';
    if (score <= 9) return 'Mild Anxiety';
    if (score <= 14) return 'Moderate Anxiety';
    return 'Severe Anxiety';
  };

  const handleChange = (index, value) => {
    if (submitted) return; // Prevent changes after submission
    const newResponses = [...responses];
    newResponses[index] = parseInt(value);
    setResponses(newResponses);
  };

  useEffect(() => {
    const storedResult = localStorage.getItem('gad7Result');
    if (storedResult) {
      const result = JSON.parse(storedResult);
      setPreviousResult(result);
      // Load journal from the last result if it exists
      if (result.journal && !privateMode) {
        setJournal(result.journal);
        setSavedJournal(result.journal);
        setJournalSaved(true);
      }
    }
  }, [privateMode]);

  // Calculate score whenever responses change (but don't save to history yet)
  useEffect(() => {
    if (responses.every(r => r !== null)) {
      const total = responses.reduce((acc, curr) => acc + curr, 0);
      setScore(total);
    } else {
      setScore(null);
    }
  }, [responses]);

  // Save to history only when explicitly submitted
  const handleSubmit = () => {
    if (!responses.every(r => r !== null)) return;
    
    const total = responses.reduce((acc, curr) => acc + curr, 0);
    const severity = getSeverity(total);

    // Submit without journal - journal is optional and saved separately
    const timestampedResult = {
      score: total,
      severity,
      journal: null, // Journal will be added later if user saves it
      timestamp: new Date().toISOString()
    };

    localStorage.setItem('gad7Result', JSON.stringify(timestampedResult));

    const history = JSON.parse(localStorage.getItem('gad7History')) || [];
    history.push(timestampedResult);
    localStorage.setItem('gad7History', JSON.stringify(history));

    setSubmitted(true);
    setPreviousResult(timestampedResult);
    setJournalSaved(false); // Reset journal saved state
  };

  const handleJournalChange = (e) => {
    const value = e.target.value;
    setJournal(value);
    setJournalSaved(false); // Mark as unsaved when user types
  };

  const handleSaveJournal = () => {
    if (privateMode) return; // Don't save if private mode is enabled
    
    const history = JSON.parse(localStorage.getItem('gad7History')) || [];
    if (history.length > 0) {
      // Update the most recent entry (the one we just submitted)
      const lastEntry = history[history.length - 1];
      lastEntry.journal = journal;
      
      // Update in localStorage
      localStorage.setItem('gad7History', JSON.stringify(history));
      localStorage.setItem('gad7Result', JSON.stringify(lastEntry));
      
      setPreviousResult(lastEntry);
      setSavedJournal(journal);
      setJournalSaved(true);
    }
  };

  const clearJournal = () => {
    setJournal('');
    setSavedJournal('');
    setJournalSaved(false);
    
    // Also remove journal from the last result if it was saved
    if (submitted) {
      const history = JSON.parse(localStorage.getItem('gad7History')) || [];
      if (history.length > 0) {
        const lastEntry = history[history.length - 1];
        lastEntry.journal = null;
        localStorage.setItem('gad7History', JSON.stringify(history));
        localStorage.setItem('gad7Result', JSON.stringify(lastEntry));
        setPreviousResult(lastEntry);
      }
    }
  };

  const clearResult = () => {
    localStorage.removeItem('gad7Result');
    setPreviousResult(null);
    setResponses(Array(7).fill(null));
    setScore(null);
    setSubmitted(false);
  };

  return (
    <div className="quiz-container fade-in gad7">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Home
      </button>

      <h2 className="fade-heading">🌿 GAD-7 Anxiety Assessment</h2>

      {previousResult && (
        <div className="result">
          <h4>Last Completed Score</h4>
          <p>Score: {previousResult.score}</p>
          <p>Severity: {previousResult.severity}</p>
          <p>
            Taken on:{' '}
            {new Date(previousResult.timestamp).toLocaleString('en-US', {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}
          </p>
        </div>
      )}

      {questions.map((question, index) => (
        <div key={index} className="question-block">
          <p>{index + 1}. {question}</p>
          {options.map((opt) => (
            <label key={opt.value} style={{ marginRight: '10px' }}>
              <input
                type="radio"
                name={`question-${index}`}
                value={opt.value}
                checked={responses[index] === opt.value}
                onChange={(e) => handleChange(index, e.target.value)}
                disabled={submitted}
              />
              {opt.label}
            </label>
          ))}
        </div>
      ))}

      {score !== null && !submitted && (
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button 
            onClick={handleSubmit}
            className="submit-button"
            style={{
              padding: '12px 32px',
              fontSize: '1.1rem',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            ✓ Submit Quiz
          </button>
        </div>
      )}

      {submitted && score !== null && (
        <>
          <div className="result">
            <h3>Your Score: {score}</h3>
            <p>Severity: {getSeverity(score)}</p>
          </div>

          <div className="journal-box">
            <div className="journal-toggle">
              <label>
                <input
                  type="checkbox"
                  checked={privateMode}
                  onChange={() => {
                    setPrivateMode(prev => !prev);
                    if (!privateMode) {
                      setSavedJournal('');
                      setJournalSaved(false);
                    }
                  }}
                />
                Enable Private Mode (do not save)
              </label>
            </div>

            <h4>📝 Journal Reflection (Optional)</h4>
            <textarea
              placeholder="How are you feeling? Write a few thoughts..."
              value={journal}
              onChange={handleJournalChange}
              rows="6"
            />
            <p className="autosave-message">
              {privateMode
                ? "Private mode enabled — journal will not be saved"
                : journalSaved
                ? "✓ Journal saved"
                : journal.trim() !== ''
                ? "Journal not saved yet — click 'Save Journal' to save"
                : "Journal is optional — you can skip this"}
            </p>
            <div className="journal-buttons">
              {!privateMode && journal.trim() !== '' && !journalSaved && (
                <button 
                  onClick={handleSaveJournal}
                  style={{
                    padding: '10px 24px',
                    fontSize: '1rem',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    marginRight: '10px'
                  }}
                >
                  💾 Save Journal
                </button>
              )}
              <button onClick={clearJournal}>🗑️ Clear Journal</button>
              <button onClick={clearResult}>🗑️ Clear Quiz Result</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default GAD7Quiz;
