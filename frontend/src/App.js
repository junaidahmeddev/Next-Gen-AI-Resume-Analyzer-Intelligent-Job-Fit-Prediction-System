import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

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
      const response = await axios.post('https://next-gen-ai-resume-analyzer-intelligent.onrender.com/analyze', formData);
      setResult(response.data);
    } catch (error) {
      console.error("API Error:", error);
      alert("Connection Failed: Ensure Backend is Live.");
    }
    setLoading(false);
  };

  const handleFileSelect = (selectedFile) => {
    if (selectedFile && (selectedFile.type === 'application/pdf' || selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      setFile(selectedFile);
    } else {
      alert("Invalid File Format: Please select a .pdf or .docx file.");
    }
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="logo-section">
          <h2 className="project-title">Resume Analyzer <br /> <span>| Job Fit Prediction</span></h2>
        </div>
        <div className="sidebar-features">
          <div className="feature-item">
            <span className="feature-icon">⚙️</span>
            <div className="feature-text"><strong>NLP Engine</strong><p>TF-IDF Processing</p></div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📊</span>
            <div className="feature-text"><strong>Matching Logic</strong><p>Cosine Similarity</p></div>
          </div>
        </div>
        <div className="status-container">
          <div className="nlp-badge">AI Core v1.0.4</div>
          <div className="status-dot"><span className="dot"></span> System Online (Live)</div>
        </div>
      </aside>

      <main className="main-viewport">
        <header className="header-bar">
          <div className="header-content">
            <h3>Analytics Dashboard</h3>
            <span className="engine-label">Vectorization: TF-IDF</span>
          </div>
        </header>
        <div className="content-grid">
          <section className="input-panel">
            <div className="card-header">Data Ingestion</div>
            <label className={`file-upload ${dragOver ? 'drag-over' : ''}`}>
              <input type="file" onChange={(e) => handleFileSelect(e.target.files[0])} accept=".pdf,.docx" style={{ display: 'none' }} />
              <span>{file ? `📄 ${file.name}` : "Click to Upload Resume (PDF/DOCX)"}</span>
            </label>
            <textarea value={jd} onChange={(e) => setJd(e.target.value)} placeholder="Paste Job Description here..."></textarea>
            <button onClick={handleAnalyze} disabled={loading} className="analyze-btn">
              {loading ? "Processing NLP..." : "Execute Prediction"}
            </button>
          </section>

          <section className="result-panel">
            {result ? (
              <div className="fade-in">
                <div className="score-summary">
                  <div className="radial-progress">
                    <span className="score-num">{result.match_score}%</span>
                    <span className="score-label">Match Score</span>
                  </div>
                  <div className="verdict-box">{result.verdict}</div>
                </div>
                <div className="skill-card">
                  <h5>Identified Skills</h5>
                  <div className="tag-list">
                    {result.matching_skills?.map((s, i) => <span key={i} className="tag-match">{s}</span>)}
                  </div>
                </div>
                <div className="skill-card">
                  <h5>Technical Skill Gaps</h5>
                  <div className="tag-list">
                    {result.missing_skills?.map((s, i) => <span key={i} className="tag-gap">+{s}</span>)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="empty-state"><p>Awaiting Data Input for Prediction Analysis</p></div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
export default App;