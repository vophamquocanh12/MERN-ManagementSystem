// src/components/charts/SalaryChart.jsx
import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import api from "@/services/api";

const SalaryChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/salaries/summary")
      .then((res) => setData(res.data))
      .catch((err) => console.error("Failed to fetch salary stats:", err));
  }, []);

  return (
    <div className="bg-white rounded shadow p-4">
      <h3 className="text-lg font-semibold mb-3">📊 Monthly Salary Payout</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="totalPay" fill="#6366f1" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalaryChart;
