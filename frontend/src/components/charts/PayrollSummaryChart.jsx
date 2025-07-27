// src/components/charts/PayrollSummaryChart.jsx
import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import api from "@/services/api"; // ✅ Use central instance

const PayrollSummaryChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.get("/salaries/summary");
        setData(res.data);
      } catch (err) {
        console.error("Error fetching payroll summary:", err);
      }
    };

    fetchSummary();
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Monthly Payroll Summary</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <CartesianGrid strokeDasharray="3 3" />
          <Bar dataKey="total" fill="#6366f1" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PayrollSummaryChart;
