// src/pages/employee/MyLeaveSummary.jsx
import React, { useEffect, useState } from 'react';
import api from "@/services/api";

const MyLeaveSummary = () => {
  const [leaves, setLeaves] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaveSummary = async () => {
      try {
        const { data } = await api.get(`${import.meta.env.VITE_API_URL}/leaves/my-summary`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (data.success) {
          setLeaves(data.data);
        } else {
          setError('Could not load leave summary.');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.response?.data?.error || 'Error loading summary.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveSummary();
  }, []);

  if (loading) return <p className="p-6">Loading leave summary...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">📝 My Leave Summary</h2>

      {leaves.length === 0 ? (
        <p>No leave records found.</p>
      ) : (
        <ul className="space-y-4">
          {leaves.map((leave) => (
            <li key={leave._id} className="p-4 border rounded shadow-sm">
              <p><strong>🗓️ Dates:</strong> {leave.startDate} - {leave.endDate}</p>
              <p><strong>🧾 Reason:</strong> {leave.reason}</p>
              <p><strong>📂 Status:</strong> <span className="font-medium text-blue-600">{leave.status}</span></p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyLeaveSummary;
