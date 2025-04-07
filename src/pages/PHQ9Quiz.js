import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import questions from '../data/phq9.json';

const PHQ9Quiz = () => {
  const [responses, setResponses] = useState(Array(9).fill(null));
  const [score, setScore] = useState(null);
  const [previousResult, setPreviousResult] = useState(null);
  const [journal, setJournal] = useState('');
  const [savedJournal, setSavedJournal] = useState('');
  const [privateMode, setPrivateMode] = useState(false);
  const navigate = useNavigate();

  const options = [
    { value: 0, label: 'Not at all' },
    { value: 1, label: 'Several days' },
    { value: 2, label: 'More than half the days' },
    { value: 3, label: 'Nearly every day' }
  ];

  const getSeverity = (score) => {
    if (score <= 4) return 'Minimal Depression';
    if (score <= 9) return 'Mild Depression';
    if (score <= 14) return 'Moderate Depression';
    if (score <= 19) return 'Moderately Severe Depression';
    return 'Severe Depression';
  };

  const handleChange = (index, value) => {
    const newResponses = [...responses];
    newResponses[index] = parseInt(value);
    setResponses(newResponses);
  };

  useEffect(() => {
    const storedResult = localStorage.getItem('phq9Result');
    if (storedResult) {
      setPreviousResult(JSON.parse(storedResult));
    }

    const storedJournal = localStorage.getItem('phq9Journal');
    if (storedJournal && !privateMode) {
      setJournal(storedJournal);
      setSavedJournal(storedJournal);
    }
  }, [privateMode]);

  useEffect(() => {
    if (responses.every(r => r !== null)) {
      const total = responses.reduce((acc, curr) => acc + curr, 0);
      const severity = getSeverity(total);
      setScore(total);

      const timestampedResult = {
        score: total,
        severity,
        journal: privateMode ? null : journal,
        timestamp: new Date().toISOString()
      };

      localStorage.setItem('phq9Result', JSON.stringify(timestampedResult));

      const history = JSON.parse(localStorage.getItem('phq9History')) || [];
      history.push(timestampedResult);
      localStorage.setItem('phq9History', JSON.stringify(history));
    } else {
      setScore(null);
    }
  }, [responses, journal, privateMode]);

  const handleJournalChange = (e) => {
    const value = e.target.value;
    setJournal(value);

    if (!privateMode) {
      localStorage.setItem('phq9Journal', value);
      setSavedJournal(value);
    }
  };

  const clearJournal = () => {
    localStorage.removeItem('phq9Journal');
    setJournal('');
    setSavedJournal('');
  };

  const clearResult = () => {
    localStorage.removeItem('phq9Result');
    setPreviousResult(null);
    setResponses(Array(9).fill(null));
    setScore(null);
  };

  return (
    <div className="quiz-container fade-in phq9">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Home
      </button>

      <h2 className="fade-heading">📘 PHQ-9 Depression Assessment</h2>

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
              />
              {opt.label}
            </label>
          ))}
        </div>
      ))}

      {score !== null && (
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
                      localStorage.removeItem('phq9Journal');
                      setSavedJournal('');
                    }
                  }}
                />
                Enable Private Mode (do not save)
              </label>
            </div>

            <h4>📝 Journal Reflection</h4>
            <textarea
              placeholder="How are you feeling today?"
              value={journal}
              onChange={handleJournalChange}
              rows="6"
            />
            <p className="autosave-message">
              {privateMode
                ? "Private mode enabled — not saved"
                : journal !== savedJournal
                ? "Saving..."
                : "Saved"}
            </p>
            <div className="journal-buttons">
              <button onClick={clearJournal}>🗑️ Clear Journal</button>
              <button onClick={clearResult}>🗑️ Clear Quiz Result</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PHQ9Quiz;
