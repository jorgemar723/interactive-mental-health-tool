import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing fade-in">
      <a href="#main-content" className="skip-link">Skip to main content</a>

      <h1 className="fade-heading">🧠 Mental Health Assessment</h1>
      <p>Welcome. Take a quick, confidential quiz to assess your anxiety or depression levels.</p>

      {/* This container class controls the layout */}
      <div id="main-content" className="home-buttons">
        <button onClick={() => navigate('/gad7')} aria-label="Start the GAD-7 Anxiety Quiz">
          Start GAD-7 Quiz
        </button>
        <button onClick={() => navigate('/phq9')} aria-label="Start the PHQ-9 Depression Quiz">
          Start PHQ-9 Quiz
        </button>
        <button
          onClick={() => navigate('/summary')}
          aria-label="View quiz history and summary"
        >
          📊 View Summary
        </button>
        <button
          onClick={() => navigate('/results')}
          aria-label="View individual quiz attempt results"
        >
          📂 View All Quiz Attempts
        </button>
      </div>
    </div>
  );
};

export default Landing;
