import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function NewAssessment() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    supplierName: '',
    lotNumber: '',
    procurementCenter: '',
    sampleWeight: '',
    assessmentDate: new Date().toISOString().slice(0, 10),
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const currentUser = JSON.parse(localStorage.getItem('onionUser') || '{}');
const res = await axios.post('http://localhost:8080/api/assessments', {
  ...form,
  sampleWeight: parseFloat(form.sampleWeight),
  createdBy: currentUser.username,
});
      navigate(`/upload/${res.data.id}`);
    } catch (err) {
      setError('Assessment create చేయడంలో సమస్య వచ్చింది. Backend running ఉందో చూడండి.');
    }
  };

  return (
    <div className="page">
      <div className="page-top">
        <h2>Initiate New AI Assessment</h2>
      </div>

      <div className="assessment-grid">
        <div className="form-card">
          <h3>Procurement &amp; Lot Details</h3>
          <form onSubmit={handleSubmit} className="form form-2col">
            <label>
              Supplier Name
              <input name="supplierName" value={form.supplierName} onChange={handleChange} required />
            </label>
            <label>
              Lot Number
              <input name="lotNumber" value={form.lotNumber} onChange={handleChange} required />
            </label>
            <label>
              Procurement Center
              <input name="procurementCenter" value={form.procurementCenter} onChange={handleChange} required />
            </label>
            <label>
              Sample Weight (kg)
              <input name="sampleWeight" type="number" step="0.1" value={form.sampleWeight} onChange={handleChange} required />
            </label>
            <label>
              Assessment Date
              <input name="assessmentDate" type="date" value={form.assessmentDate} onChange={handleChange} required />
            </label>
            {error && <p className="error">{error}</p>}
            <button type="submit" className="btn-primary">Continue to Upload</button>
          </form>
        </div>

        <div className="form-card">
          <h3>Onion Sample Image Upload</h3>
          <p className="upload-hint">ఫొటో తర్వాతి స్క్రీన్‌లో upload చేయండి, ముందు ఈ వివరాలు submit చెయ్యండి.</p>
        </div>
      </div>
    </div>
  );
}

export default NewAssessment;