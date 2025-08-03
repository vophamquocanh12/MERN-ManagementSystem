import React, { useState } from 'react';
import api from "@/services/api";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuth from '../contexts/useAuth';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee'); // 👈 Default role
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      console.log('env dump:', import.meta.env);
      const res = await api.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
        email,
        password,
        role, // 👈 Optionally send this to backend
      });

      const { success, token, user, error: resError } = res.data;

      if (success && token && user) {
        // Optional: verify selected role matches actual user role
        if (user.role !== role) {
          toast.error(
            `Vai trò không khớp: Bạn đã cố gắng đăng nhập với tư cách là ${role==="admin"?"quản lý":"nhân viên"}, nhưng vai trò của bạn là ${user.role==="admim"?"nhân viên":"quản lý"}`
          );
          return;
        }

        login(user, token);
        toast.success('Đăng nhập thành công ✅');

        // 🔁 Redirect based on actual user role
        const route = user.role === 'admin' ? '/admin-dashboard' : '/employee-dashboard';
        navigate(route);
      } else {
        toast.error(
          resError ||
            "Không nhận được mã thông báo hoặc người dùng. Đăng nhập không thành công."
        );
      }
    } catch (err) {
      const message = err?.response?.data?.error || err.message || 'Login failed.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center h-screen justify-center bg-gradient-to-b from-teal-600 from-50% to-gray-100 to-50% space-y-6">
      <h2 className="font-pacific text-3xl text-white">
        Hệ Thống Quản Lý Nhân Viên
      </h2>

      <div className="border shadow p-6 w-80 bg-white rounded">
        <h2 className="text-2xl font-bold mb-4">Đăng nhập</h2>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Vai trò</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-teal-500"
            >
              <option value="employee">Nhân viên</option>
              <option value="admin">Quản lý</option>
            </select>
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-700 mb-1">
              Tài khoản
            </label>
            <input
              type="email"
              id="email"
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 mb-1">
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-teal-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded transition duration-200"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
