import React, { useEffect, useState } from "react";
import api from "@/services/api";
import { format } from "date-fns";
import { toast } from "react-toastify";

const AttendancePage = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markedToday, setMarkedToday] = useState(false);

  const fetchAttendance = async () => {
    try {
      const res = await api.get("/api/attendance/my", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setRecords(res.data.records);

      // Check if today's attendance already exists
      const today = new Date().toISOString().slice(0, 10);
      const marked = res.data.records.some((rec) =>
        rec.date.startsWith(today)
      );
      setMarkedToday(marked);
    } catch {
      toast.error("Failed to fetch attendance.");
    } finally {
      setLoading(false);
    }
  };

  const markToday = async () => {
    try {
      await api.post(
        "/api/attendance/mark",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Attendance marked!");
      fetchAttendance();
    } catch (err) {
      toast.error(err.response?.data?.error || "Already marked or failed");
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">📅 My Attendance</h2>

      {!markedToday && (
        <button
          onClick={markToday}
          className="mb-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Mark Today’s Attendance
        </button>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record._id}>
                <td className="p-2 border">{format(new Date(record.date), "yyyy-MM-dd")}</td>
                <td className="p-2 border">{record.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AttendancePage;
