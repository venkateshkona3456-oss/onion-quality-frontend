import { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const COLORS = ['#2E7D4F', '#C0392B'];

function Analytics() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get('https://onion-quality-backend.onrender.com/api/assessments/analytics')
      .then((res) => setData(res.data))
      .catch(() => setError('Analytics load చేయడంలో సమస్య వచ్చింది.'));
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!data) return <p>Loading...</p>;

  const pieData = Object.entries(data.gradeDistribution).map(([name, value]) => ({ name, value }));
  const barData = Object.entries(data.monthlyTrend).map(([month, count]) => ({ month, count }));

  return (
    <div className="page">
      <h2>Quality Analytics Portal</h2>

      <div className="assessment-grid">
        <div className="form-card">
          <h3>Quality Grade Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>
                {pieData.map((entry, i) => (
                  <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="upload-hint">Total Lots: {data.totalLots}</div>
        </div>

        <div className="form-card">
          <h3>Sourcing Assessment Volume</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData}>
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#2E7D4F" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Analytics;