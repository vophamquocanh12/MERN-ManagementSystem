// ✅ src/pages/employee/RequestLeaveForm.jsx
import React, { useState } from "react";
import api from "@/services/api";
import { useNavigate } from "react-router-dom";

const RequestLeaveForm = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(
        "/api/leaves",
        { startDate, endDate, reason },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Leave request submitted!");
      navigate("/employee-dashboard/leave");
    } catch {
      alert("Error submitting request");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Request Leave</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="input w-full"
          required
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="input w-full"
          required
        />
        <textarea
          placeholder="Reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="input w-full"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Submit Request
        </button>
      </form>
    </div>
  );
};

export default RequestLeaveForm;