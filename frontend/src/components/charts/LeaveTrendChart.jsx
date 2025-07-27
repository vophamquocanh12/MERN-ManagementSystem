// src/components/charts/LeaveTrendChart.jsx
import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import api from "@/services/api"; // ✅ centralized axios

const LeaveTrendChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchTrend = async () => {
      try {
        const res = await api.get("/leaves/trends");
        setData(res.data);
      } catch (err) {
        console.error("Error loading leave trends:", err);
      }
    };
    fetchTrend();
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Leave Trends (Monthly)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="month" />
          <YAxis allowDecimals={false} />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#10b981" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LeaveTrendChart;
