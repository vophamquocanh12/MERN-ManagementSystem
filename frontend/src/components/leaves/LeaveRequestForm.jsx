// src/components/leaves/LeaveRequestForm.jsx
import React, { useState } from "react";
import api from "@/services/api";
import { toast } from "react-toastify";

const LeaveRequestForm = () => {
  const [reason, setReason] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reason || !startDate || !endDate) {
      toast.error("❗ Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("reason", reason);
      formData.append("startDate", startDate);
      formData.append("endDate", endDate);
      if (file) {
        formData.append("document", file);
      }

      await api.post("/leave", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("✅ Leave request submitted!");
      setReason("");
      setStartDate("");
      setEndDate("");
      setFile(null);
    } catch (error) {
      console.error("❌ Leave request error:", error);
      toast.error(error.response?.data?.error || "Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-6 shadow rounded"
    >
      <h2 className="text-xl font-bold mb-4">Request Leave</h2>

      <div className="mb-3">
        <label className="block font-medium">Reason *</label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-3">
        <label className="block font-medium">Start Date *</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-3">
        <label className="block font-medium">End Date *</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium">Upload Document (optional)</label>
        <input
          type="file"
          accept=".pdf,.doc,.docx,.jpg,.png"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? "Submitting..." : "Submit Leave Request"}
      </button>
    </form>
  );
};

export default LeaveRequestForm;
