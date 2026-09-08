import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function UploadImage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');

  const steps = ['Upload', 'Detecting', 'Identifying Defects', 'Calculating Quality', 'Generating Report'];

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    setStep(1);

    const formData = new FormData();
    formData.append('file', file);

    const stepTimer = setInterval(() => {
      setStep((s) => (s < 3 ? s + 1 : s));
    }, 500);

    try {
      await axios.post(`http://localhost:8080/api/assessments/${id}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setStep(4);
      clearInterval(stepTimer);
      setTimeout(() => navigate(`/report/${id}`), 600);
    } catch (err) {
      clearInterval(stepTimer);
      setError('Image analysis విఫలమైంది. AI service (port 8000) మరియు backend running ఉన్నాయో చూడండి.');
      setLoading(false);
      setStep(0);
    }
  };

  return (
    <div className="page">
      <h2>AI Assessment Process</h2>

      {loading && (
        <div className="step-progress">
          {steps.map((label, i) => (
            <div key={label} className={`step-item ${i < step ? 'done' : i === step ? 'active' : ''}`}>
              <span className="step-num">{i < step ? '✓' : i + 1}</span>
              {label}
            </div>
          ))}
        </div>
      )}

      <div className="assessment-grid">
        <div className="form-card">
          {!preview ? (
            <div className="upload-box">
              <input type="file" accept="image/*" onChange={handleFileChange} />
              <p className="upload-hint">Drag &amp; drop onion sample images here, JPEG/PNG, max 10MB</p>
            </div>
          ) : (
            <img src={preview} alt="preview" className="preview-img" />
          )}
        </div>
        <div className="form-card">
          <h3>Sample Status</h3>
          {!file && <p className="upload-hint">ముందు ఫోటో ఎంచుకోండి.</p>}
          {file && !loading && <p className="upload-hint">{file.name} — ready to analyze</p>}
          {loading && <p className="upload-hint">Deep CNN assessment in progress...</p>}
          {error && <p className="error">{error}</p>}
          <button className="btn-primary" onClick={handleUpload} disabled={!file || loading}>
            {loading ? 'విశ్లేషిస్తోంది...' : 'Analyze with Quality AI Model'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UploadImage;