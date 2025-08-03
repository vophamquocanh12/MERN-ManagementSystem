import React, { useState, useEffect } from "react";
import useAuth from "../../contexts/useAuth";
import {
  getOwnEmployeeProfile,
  updateEmployeeProfile,
} from "../../services/employeeService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [bio, setBio] = useState(user.bio || "");
  const [skillsText, setSkillsText] = useState((user.skills || []).join(", "));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const data = await getOwnEmployeeProfile(); // API này nên trả về { employee: {...} }
        if (data?.employee) {
          setBio(data.employee.bio || "");
          setSkillsText((data.employee.skills || []).join(", "));
        }
      } catch (err) {
        console.error("Lỗi khi tải employee profile:", err);
      }
    };

    fetchEmployee();
  }, []);

  const handleUpdate = async () => {
    const payload = {
      name,
      email,
      bio,
      skills: skillsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      setLoading(true);

      const updated = await updateEmployeeProfile(payload);

      if (updated?.token && updated?.user) {
        login(updated.user, updated.token); // cập nhật context + lưu token

        toast.success("✅ Hồ sơ đã được cập nhật!");

        // ⚠️ Trì hoãn chuyển trang để AuthProvider reload token
        setTimeout(() => {
         navigate("/employee-dashboard/profile/view"); // hoặc dùng navigate
        }, 500);
      } else {
        toast.error("⚠️ Thiếu token hoặc thông tin người dùng!");
      }
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật:", error);
      toast.error("❌ Không cập nhật được hồ sơ.");
    } finally {
      setLoading(false);
    }
  };

  // const handleUpdate = async () => {
  //   const payload = {
  //     name,
  //     email,
  //     bio,
  //     skills: skillsText
  //       .split(",")
  //       .map((s) => s.trim())
  //       .filter(Boolean),
  //   };

  //   try {
  //     setLoading(true);
  //     const updated = await updateEmployeeProfile(payload); // gửi JSON
  //     login(updated.user);
  //     toast.info("✅ Hồ sơ đã được cập nhật thành công!");
  //      navigate("/employee-dashboard/profile/view");
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("❌ Không cập nhật được hồ sơ.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 to-teal-100 flex items-center justify-center px-4 py-8">
      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Chỉnh sửa hồ sơ
        </h2>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Họ và tên
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:outline-none"
            placeholder="Enter your name"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            disabled
          />
        </div>

        {/* Bio */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tiểu sử ngắn
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md resize-none focus:ring-teal-500 focus:outline-none"
            rows="3"
            placeholder="Một vài dòng giới thiệu về bản thân bạn..."
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kỹ năng
          </label>
          <textarea
            value={skillsText}
            onChange={(e) => setSkillsText(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md resize-none focus:ring-teal-500 focus:outline-none"
            rows="3"
            placeholder="Ví dụ: JavaScript, React, Node.js"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-md transition-all duration-200 disabled:opacity-60"
        >
          {loading ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </div>
    </div>
  );
};

export default Profile;
