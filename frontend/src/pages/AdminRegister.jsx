// src/pages/AdminRegister.jsx
import React, { useState } from 'react';
import api from "@/services/api";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuth from '../contexts/useAuth';

const AdminRegister = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin', // Force admin role
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.post(`${import.meta.env.VITE_API_URL}/auth/register`, formData);

      const { success, token, user, error: resError } = res.data;

      if (success && token) {
        localStorage.setItem('token', token);
        login(user);
        toast.success('Admin registered successfully ✅');
        navigate('/admin-dashboard');
      } else {
        toast.error(resError || 'Token not received. Registration failed.');
      }
    } catch (err) {
      const message = err.response?.data?.error || err.message || 'Registration failed.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center h-screen justify-center bg-gradient-to-b from-purple-700 from-50% to-gray-100 to-50% space-y-6">
      <h2 className="font-pacific text-3xl text-white">Admin Registration</h2>

      <div className="border shadow p-6 w-96 bg-white rounded">
        <h2 className="text-2xl font-bold mb-4">Register New Admin</h2>
        {error && <p className="text-red-500 mb-3">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input type="hidden" name="role" value="admin" />

          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              required
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              placeholder="Admin name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              required
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              placeholder="Admin email"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              required
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              placeholder="Create password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-700 hover:bg-purple-800 text-white py-2 rounded"
          >
            {loading ? 'Registering Admin...' : 'Register Admin'}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Already an admin?{' '}
          <a href="/login" className="text-purple-700 font-semibold">
            Đăng nhập
          </a>
        </p>
      </div>
    </div>
  );
};

export default AdminRegister;
