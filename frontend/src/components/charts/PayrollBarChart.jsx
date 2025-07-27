// src/components/charts/PayrollBarChart.jsx
import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import api from "@/services/api"; // ✅ Use central axios instance

const PayrollBarChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/salaries/summary-by-department");
        const formatted = res.data.map((item) => ({
          department: item._id || "Unknown",
          total: item.total,
        }));
        setData(formatted);
      } catch (err) {
        console.error("Error fetching payroll summary:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Payroll by Department</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="department" />
          <YAxis allowDecimals={false} />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Bar dataKey="total" fill="#6366f1" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PayrollBarChart;
