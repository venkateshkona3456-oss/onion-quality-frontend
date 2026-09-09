import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const PAGE_SIZE = 7;

function History() {
  const [assessments, setAssessments] = useState([]);
  const [search, setSearch] = useState('');
  const [onlyMine, setOnlyMine] = useState(false);
const currentUser = JSON.parse(localStorage.getItem('onionUser') || '{}');
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get('https://onion-quality-backend.onrender.com/api/assessments')
      .then((res) => setAssessments(res.data.reverse()))
      .catch(() => setError('History load చేయడంలో సమస్య వచ్చింది.'));
  }, []);

  const filtered = assessments
  .filter((a) =>
    (a.lotNumber || '').toLowerCase().includes(search.toLowerCase()) ||
    (a.supplierName || '').toLowerCase().includes(search.toLowerCase()) ||
    (a.procurementCenter || '').toLowerCase().includes(search.toLowerCase())
  )
  .filter((a) => !onlyMine || a.createdBy === currentUser.username);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const gradeBadge = (gradeA) => {
    if (gradeA == null) return <span className="badge">-</span>;
    if (gradeA >= 50) return <span className="badge badge-a">Grade A</span>;
    return <span className="badge badge-rejected">Rejected</span>;
  };

  return (
    <div className="page">
      <h2>Quality Assessment History</h2>

      <div className="form-card" style={{ marginBottom: 20 }}>
        <h3>Search &amp; Filter Procurement Lots</h3>
        <input
          type="text"
          placeholder="Lot, Supplier, Center తో వెతకండి..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="search-input"
        />
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, fontSize: 13 }}>
  <input type="checkbox" checked={onlyMine} onChange={(e) => setOnlyMine(e.target.checked)} style={{ width: 'auto' }} />
  నా Assessments మాత్రమే చూపించు
</label>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="dash-section">
        <table className="history-table">
          <thead>
            <tr>
              <th>Lot Number</th>
              <th>Supplier</th>
              <th>Procurement Center</th>
              <th>Date</th>
              <th>AI Grade</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((a) => (
              <tr key={a.id}>
                <td>{a.lotNumber}</td>
                <td>{a.supplierName}</td>
                <td>{a.procurementCenter}</td>
                <td>{a.assessmentDate}</td>
                <td>{gradeBadge(a.gradeAPercentage)}</td>
                <td><Link to={`/report/${a.id}`}>View</Link></td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          <span>Showing {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} lots</span>
          <div className="page-buttons">
            <button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
            <span>{page} / {totalPages}</span>
            <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default History;