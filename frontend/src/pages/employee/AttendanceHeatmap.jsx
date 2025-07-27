// 📁 src/pages/employee/AttendanceHeatmap.jsx
import React, { useEffect, useState } from "react";
import api from "@/services/api";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { addDays } from "date-fns";

const AttendanceHeatmap = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const { data } = await api.get("/attendance/my", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setRecords(
          data.records.map((record) => ({
            date: record.date.split("T")[0],
            count: record.status === "Present" ? 1 : 0,
          }))
        );
      } catch (err) {
        console.error("Failed to fetch attendance:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  if (loading) return <div className="p-4">Loading heatmap...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">📅 My Attendance Heatmap</h2>
      <CalendarHeatmap
        startDate={addDays(new Date(), -90)}
        endDate={new Date()}
        values={records}
        classForValue={(value) => {
          if (!value) return "color-empty";
          return `color-github-${value.count}`;
        }}
        showWeekdayLabels
      />
      <style>
        {`
          .color-github-1 { fill: #4caf50; }
          .color-empty { fill: #ebedf0; }
        `}
      </style>
    </div>
  );
};

export default AttendanceHeatmap;
