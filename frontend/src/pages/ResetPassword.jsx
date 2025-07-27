import React, { useState } from "react";
import api from "@/services/api";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      return toast.error("Passwords do not match.");
    }

    try {
      setLoading(true);
      const res = await api.post(`${import.meta.env.VITE_API_URL}/auth/reset-password/${token}`, { password });
      toast.success(res.data.message || "Password updated successfully.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.error || "Reset failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleReset}
        className="bg-white p-8 rounded shadow-md w-96 space-y-4"
      >
        <h2 className="text-2xl font-semibold mb-2">🔒 Reset Password</h2>

        <input
          type="password"
          placeholder="New password"
          required
          className="w-full px-3 py-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm password"
          required
          className="w-full px-3 py-2 border rounded"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
