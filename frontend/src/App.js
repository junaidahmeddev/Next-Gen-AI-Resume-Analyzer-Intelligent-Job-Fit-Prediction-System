import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

/**
 * Main Frontend Component
 * Final Fix: 'Double Click' issue resolved by using single <label> container.
 */
function App() {
  // --- STATE MANAGEMENT ---
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  /**
   * API Communication Module
   * Updated to use Render Live Backend URL
   */
  const handleAnalyze = async () => {
    if (!file || !jd) {
      alert("Error: Please upload a Resume and enter a Job Description.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('job_description', jd);

    try {
      // LIVE BACKEND URL UPDATED BELOW
      const response = await axios.post('https://next-gen-ai-resume-analyzer-intelligent.onrender.com/analyze', formData);
      setResult(response.data);
    } catch (error) {
      console.error("API Error:", error);
      alert("Connection Failed: Ensure Render Backend is Live. Check your internet connection.");
    }
    setLoading(false);
  };

  // --- FILE HANDLING LOGIC ---
  const handleFileSelect = (selectedFile) => {
    if (selectedFile && (selectedFile.type === 'application/pdf' || 
        selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      setFile(selectedFile);
    } else {
      alert("Invalid File Format: Please select a .pdf or .docx file.");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  return (
    <div className="dashboard-container">
      {/* --- Sidebar --- */}
      <aside className="sidebar">
        <div className="logo-section">
          <h2 className="project-title">
            Resume Analyzer <br /> 
            <span>| Job Fit Prediction</span>
          </h2>
        </div>

        <div className="sidebar-features">
          <div className="feature-item">
            <span className="feature-icon">⚙️</span>
            <div className="feature-text">
              <strong>NLP Engine</strong>
              <p>TF-IDF Processing</p>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📊</span>
            <div className="feature-text">
              <strong>Matching Logic</strong>
              <p>Cosine Similarity</p>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🔍</span>
            <div className="feature-text">
              <strong>Gap Analysis</strong>
              <p>Skill Prediction</p>
            </div>
          </div>
        </div>

        <div className="status-container">
          <div className="nlp-badge">AI Core v1.0.4</div>
          <div className="status-dot">
            <span className="dot" style={{ backgroundColor: '#2ecc71' }}></span> System Online (Live)
          </div>
        </div>
      </aside>

      {/* --- Main Viewport --- */}
      <main className="main-viewport">
        <header className="header-bar">
          <div className="header-content">
            <h3>Analytics Dashboard</h3>
            <span className="engine-label">Vectorization: TF-IDF</span>
          </div>
        </header>

        <div className="content-grid">
          {/* Left Panel: Data Ingestion */}
          <section className="input-panel">
            <div className="card-header">Data Ingestion</div>
            <div className="input-body">
              
              <label 
                className={`file-upload ${dragOver ? 'drag-over' : ''}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                style={{ cursor: 'pointer', display: 'block' }}
              >
                <input 
                  type="file" 
                  onChange={(e) => handleFileSelect(e.target.files[0])}
                  accept=".pdf,.docx"
                  style={{ display: 'none' }}
                />
                <span className="upload-text" style={{ pointerEvents: 'none' }}>
                  {file ? `📄 ${file.name}` : "Drag & Drop Resume (PDF/DOCX) or Click to Browse"}
                </span>
              </label>

              <textarea 
                value={jd} 
                onChange={(e) => setJd(e.target.value)} 
                placeholder="Paste the targeted Job Description here..."
              ></textarea>
              
              <button onClick={handleAnalyze} disabled={loading} className="analyze-btn">
                {loading ? "Processing NLP..." : "Execute Prediction"}
              </button>
            </div>
          </section>

          {/* Right Panel: Results */}
          <section className="result-panel">
            {result ? (
              <div className="fade-in">
                <div className="score-summary">
                  <div className="radial-progress">
                    <span className="score-num">{result.match_score}%</span>
                    <span className="score-label">Cosine Similarity</span>
                  </div>
                  <div className="verdict-group">
                    <div className="verdict-box" data-verdict={result.verdict}>
                      {result.verdict}
                    </div>
                    <p className="ai-note">Match predicted via contextual analysis</p>
                  </div>
                </div>

                <div className="skills-grid">
                  <div className="skill-card match-card">
                    <h5>Identified Core Skills</h5>
                    <div className="tag-list">
                      {result.matching_skills?.length > 0 ? (
                        result.matching_skills.map((s, i) => <span key={i} className="tag-match">{s}</span>)
                      ) : (
                        <span className="no-data">No direct matches found</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="skill-card gap-card">
                    <h5>Technical Skill Gaps</h5>
                    <div className="tag-list">
                      {result.missing_skills?.length > 0 ? (
                        result.missing_skills.map((s, i) => <span key={i} className="tag-gap">+{s}</span>)
                      ) : (
                        <span className="tag-match">No major gaps detected</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📊</div>
                <p>Awaiting Data Input for Prediction Analysis</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;