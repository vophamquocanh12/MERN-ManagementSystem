// src/components/charts/AttendancePieChart.jsx
import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import api from "@/services/api"; // ✅ centralized axios

const COLORS = ["#10b981", "#f87171", "#fbbf24"]; // Present, Absent, Leave

const AttendancePieChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.get("/attendance/summary");
        const formatted = res.data.map((item) => ({
          name: item._id,
          value: item.count,
        }));
        setData(formatted);
      } catch (err) {
        console.error("Error loading attendance summary:", err);
      }
    };

    fetchSummary();
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Attendance Overview</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={100} label>
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttendancePieChart;
