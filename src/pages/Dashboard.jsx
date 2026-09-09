import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get('https://onion-quality-backend.onrender.com/api/assessments/stats')
      .then((res) => setStats(res.data))
      .catch(() => setError('Dashboard data load చేయడంలో సమస్య వచ్చింది.'));
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!stats) return <p>Loading...</p>;

  return (
    <div className="page">
      <div className="page-top">
        <h2>Quality Procurement Dashboard</h2>
        <Link to="/" className="btn-primary btn-small">+ New Assessment</Link>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Total Assessments</div>
          <div className="stat-value">{stats.totalAssessments}</div>
          <div className="stat-sub">Lots recorded</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Grade A Lots</div>
          <div className="stat-value">{stats.gradeALots}</div>
          <div className="stat-sub">Meets premium criteria</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Average Quality</div>
          <div className="stat-value">{stats.averageQuality}%</div>
          <div className="stat-sub">Across all batches</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Reports Generated</div>
          <div className="stat-value">{stats.reportsGenerated}</div>
          <div className="stat-sub">Digital clearance certificates</div>
        </div>
      </div>

      <div className="dash-section">
        <div className="section-header">
          <h3>Recent Quality Assessments</h3>
          <Link to="/history">View All Records</Link>
        </div>
        <table className="history-table">
          <thead>
            <tr>
              <th>Lot Number</th>
              <th>Supplier</th>
              <th>Date</th>
              <th>Grade A%</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {stats.recentAssessments.map((a) => (
              <tr key={a.id}>
                <td>{a.lotNumber}</td>
                <td>{a.supplierName}</td>
                <td>{a.assessmentDate}</td>
                <td>{a.gradeAPercentage ?? '-'}</td>
                <td><Link to={`/report/${a.id}`}>View</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;