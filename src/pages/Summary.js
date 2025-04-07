// same imports
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import './Summary.css';

const Summary = () => {
  const [gad7History, setGAD7History] = useState([]);
  const [phq9History, setPHQ9History] = useState([]);
  const [showCombined, setShowCombined] = useState(false);
  const [dateRange, setDateRange] = useState('all');
  const nodeRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const gad7 = JSON.parse(localStorage.getItem('gad7History')) || [];
    const phq9 = JSON.parse(localStorage.getItem('phq9History')) || [];
    setGAD7History(gad7);
    setPHQ9History(phq9);
  }, []);

  const formatDate = (timestamp) =>
    new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const isWithinRange = (date) => {
    const now = new Date();
    const entryDate = new Date(date);
    if (dateRange === '7') return now - entryDate <= 7 * 86400000;
    if (dateRange === '30') return now - entryDate <= 30 * 86400000;
    return true;
  };

  const handleFilterChange = (e) => setDateRange(e.target.value);

  const filteredGAD7 = gad7History.filter(e => isWithinRange(e.timestamp));
  const filteredPHQ9 = phq9History.filter(e => isWithinRange(e.timestamp));

  const getSeverity = (score, type) => {
    if (type === 'gad7') {
      if (score <= 4) return 'Minimal Anxiety';
      if (score <= 9) return 'Mild Anxiety';
      if (score <= 14) return 'Moderate Anxiety';
      return 'Severe Anxiety';
    } else {
      if (score <= 4) return 'Minimal Depression';
      if (score <= 9) return 'Mild Depression';
      if (score <= 14) return 'Moderate Depression';
      if (score <= 19) return 'Moderately Severe Depression';
      return 'Severe Depression';
    }
  };

  const calcAverage = (data) =>
    data.length ? (data.reduce((a, b) => a + b.score, 0) / data.length).toFixed(1) : null;

  const avgGAD7 = calcAverage(filteredGAD7);
  const avgPHQ9 = calcAverage(filteredPHQ9);

  const buildCombinedData = () => {
    const allDates = new Set([
      ...filteredGAD7.map(item => item.timestamp),
      ...filteredPHQ9.map(item => item.timestamp)
    ]);
    const sorted = [...allDates].sort((a, b) => new Date(a) - new Date(b));
    return sorted.map(date => ({
      name: formatDate(date),
      gad7: filteredGAD7.find(e => e.timestamp === date)?.score ?? null,
      phq9: filteredPHQ9.find(e => e.timestamp === date)?.score ?? null,
    }));
  };

  const clearHistory = (type) => {
    if (type === 'gad7') {
      localStorage.removeItem('gad7History');
      setGAD7History([]);
    } else if (type === 'phq9') {
      localStorage.removeItem('phq9History');
      setPHQ9History([]);
    }
  };

  const exportToJSON = (type) => {
    const data = type === 'gad7' ? gad7History : phq9History;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${type}_history.json`;
    link.click();
  };

  const exportToCSV = (type) => {
    const data = type === 'gad7' ? gad7History : phq9History;
    if (!data.length) return;
    const csv = [
      'Score,Severity,Timestamp',
      ...data.map(d => `${d.score},${d.severity},${d.timestamp}`)
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${type}_history.csv`;
    link.click();
  };

  return (
    <main className="quiz-container fade-in" id="summary-page">
      <button className="back-button" onClick={() => navigate('/')} aria-label="Go back to home">
        ← Back to Home
      </button>
      <h2 className="fade-heading">📊 Summary Dashboard</h2>

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="dateRange" style={{ marginRight: '8px' }}>📅 Filter:</label>
        <select
          id="dateRange"
          value={dateRange}
          onChange={handleFilterChange}
          aria-label="Filter results by date range"
        >
          <option value="all">All Time</option>
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
        </select>
      </div>

      <button
        onClick={() => setShowCombined(!showCombined)}
        style={{ marginBottom: '1rem' }}
        aria-label={showCombined ? "Show GAD-7 and PHQ-9 charts separately" : "Show combined chart view"}
      >
        {showCombined ? '🔄 Show Separate Charts' : '📊 Show Combined View'}
      </button>

      {(avgGAD7 || avgPHQ9) && (
        <div className="insight-box" role="region" aria-live="polite">
          {avgGAD7 && <p>🧠 Avg GAD-7: <strong>{avgGAD7}</strong> ({getSeverity(avgGAD7, 'gad7')})</p>}
          {avgPHQ9 && <p>🌀 Avg PHQ-9: <strong>{avgPHQ9}</strong> ({getSeverity(avgPHQ9, 'phq9')})</p>}
        </div>
      )}

      <SwitchTransition mode="out-in">
        <CSSTransition key={showCombined} nodeRef={nodeRef} timeout={300} classNames="fade-slide">
          <div ref={nodeRef} role="region" aria-label="Quiz score chart">
            {showCombined ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={buildCombinedData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="gad7" stroke="#317873" name="GAD-7 Score" />
                  <Line type="monotone" dataKey="phq9" stroke="#4a90e2" name="PHQ-9 Score" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <>
                <h3>GAD-7 History</h3>
                {filteredGAD7.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={filteredGAD7.map(e => ({ ...e, name: formatDate(e.timestamp) }))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 21]} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="score" fill="#317873" name="GAD-7 Score" />
                      </BarChart>
                    </ResponsiveContainer>
                    <div className="summary-buttons">
                      <button onClick={() => clearHistory('gad7')} aria-label="Clear GAD-7 quiz history">
                        🗑️ Clear GAD-7 History
                      </button>
                      <button onClick={() => exportToJSON('gad7')} aria-label="Export GAD-7 quiz history as JSON">
                        📁 Export GAD-7 JSON
                      </button>
                      <button onClick={() => exportToCSV('gad7')} aria-label="Export GAD-7 quiz history as CSV">
                        📊 Export GAD-7 CSV
                      </button>
                    </div>
                  </>
                ) : <p>No GAD-7 results in this range.</p>}

                <h3 style={{ marginTop: '2rem' }}>PHQ-9 History</h3>
                {filteredPHQ9.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={filteredPHQ9.map(e => ({ ...e, name: formatDate(e.timestamp) }))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 27]} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="score" fill="#4a90e2" name="PHQ-9 Score" />
                      </BarChart>
                    </ResponsiveContainer>
                    <div className="summary-buttons">
                      <button onClick={() => clearHistory('phq9')} aria-label="Clear PHQ-9 quiz history">
                        🗑️ Clear PHQ-9 History
                      </button>
                      <button onClick={() => exportToJSON('phq9')} aria-label="Export PHQ-9 quiz history as JSON">
                        📁 Export PHQ-9 JSON
                      </button>
                      <button onClick={() => exportToCSV('phq9')} aria-label="Export PHQ-9 quiz history as CSV">
                        📊 Export PHQ-9 CSV
                      </button>
                    </div>
                  </>
                ) : <p>No PHQ-9 results in this range.</p>}
              </>
            )}
          </div>
        </CSSTransition>
      </SwitchTransition>
    </main>
  );
};

export default Summary;
