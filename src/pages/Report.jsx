import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';

function Report() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/assessments/${id}/report`)
      .then((res) => setReport(res.data))
      .catch(() => setError('Report load చేయడంలో సమస్య వచ్చింది.'));
  }, [id]);

  if (error) return <p className="error">{error}</p>;
  if (!report) return <p className="page">Loading report...</p>;

  const gradeA = report.gradeAPercentage ?? 0;
  const urs = report.ursPercentage ?? 0;
  const gradeLabel = gradeA >= 50 ? 'Grade A Premium' : 'Needs Review';
const downloadPDF = () => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text('Onion Quality Assessment Report', 14, 20);
  doc.setFontSize(11);
  doc.text(`Lot Number: ${report.lotNumber}`, 14, 35);
  doc.text(`Supplier: ${report.supplierName}`, 14, 43);
  doc.text(`Procurement Center: ${report.procurementCenter}`, 14, 51);
  doc.text(`Assessment Date: ${report.assessmentDate}`, 14, 59);
  doc.text(`Sample Weight: ${report.sampleWeight} kg`, 14, 67);
  doc.setFontSize(14);
  doc.text(`Grade A: ${gradeA}%`, 14, 82);
  doc.text(`URS: ${urs}%`, 14, 92);
  doc.save(`Onion_Report_${report.lotNumber}.pdf`);
};
  return (
    <div className="page">
      <div className="page-top">
        <h2>Quality Assessment Result</h2>
      </div>

      <div className="result-header form-card">
        <div>
          <strong>Lot ID: {report.lotNumber}</strong>
          <span className="grade-pill">{gradeLabel}</span>
          <div className="upload-hint">
            Supplier: {report.supplierName} • Centre: {report.procurementCenter} • Verified on: {report.assessmentDate}
          </div>
        </div>
      </div>

      <div className="stat-grid stat-grid-5">
        <div className="stat-card">
          <div className="stat-label">Sample Weight</div>
          <div className="stat-value">{report.sampleWeight}</div>
          <div className="stat-sub">kg</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Grade A</div>
          <div className="stat-value grade-a-text">{gradeA}%</div>
          <div className="stat-sub">Meets standard</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">URS</div>
          <div className="stat-value grade-urs-text">{urs}%</div>
          <div className="stat-sub">Undersized/Rotten/Sprouted</div>
        </div>
      </div>

      <div className="assessment-grid">
        <div className="form-card">
          <h3>Analyzed Sample View</h3>
          <img
            src={`http://localhost:8080/${report.imagePath?.replace(/\\/g, '/')}`}
            alt="analyzed sample"
            className="preview-img"
          />
        </div>
        <div className="form-card">
          <h3>Detailed Grading Metrics</h3>
          <div className="metric-row">
            <span>Grade A Percentage</span>
            <strong className="grade-a-text">{gradeA}%</strong>
          </div>
          <div className="metric-row">
            <span>URS Percentage</span>
            <strong className="grade-urs-text">{urs}%</strong>
          </div>
        </div>
      </div>
<button className="btn-primary btn-small" onClick={downloadPDF} style={{ marginRight: 12 }}>
  Download PDF
</button>
      <Link to="/" className="btn-secondary">+ కొత్త Assessment</Link>
    </div>
  );
}

export default Report;