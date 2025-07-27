// src/components/charts/AttendanceOverview.jsx
import { useEffect, useState } from "react";
import api from "@/services/api";
import AttendanceChart from "./AttendanceChart";
import AttendancePercentageChart from "./AttendancePercentageChart";

const AttendanceOverview = () => {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log("✅ ENV", import.meta.env.VITE_API_URL);
        const res = await api.get("/attendance/stats");
        setStats(res.data.stats);
      } catch (err) {
        console.error("Failed to fetch attendance stats:", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <AttendanceChart data={stats} />
      <AttendancePercentageChart data={stats} />
    </div>
  );
};

export default AttendanceOverview;
