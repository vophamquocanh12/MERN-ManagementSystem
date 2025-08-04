// src/pages/admin/EmployeeList.jsx
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "@/services/api";
import DataTable from "react-data-table-component";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";


const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [gender, setGender] = useState("male");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await api.get("/departments");
        setDepartments(res.data.departments);
      } catch (error) {
        console.error("Lỗi khi tải phòng ban:", error);
      }
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL);
    socket.on("new-employee", (emp) => {
      toast.info(`📢 Đã thêm nhân viên: ${emp.name}`);
      fetchEmployees();
    });
    return () => socket.disconnect();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/employees");
      setEmployees(res.data.employees);
      setFiltered(res.data.employees);
    } catch (error) {
      console.error("Failed to fetch departments:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    const result = employees.filter((e) =>
      e.user?.name.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, employees]);

  const handleFormSubmit = async (formData) => {
    try {
      if (editData) {
        await api.put(`/employees/${editData._id}`, formData);
        toast.success("✅ Cập nhật nhân viên thành công");
      } else {
        await api.post("/employees", formData);
        toast.success("✅ Thêm nhân viên mới thành công");
      }
      setModalOpen(false);
      fetchEmployees();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(`⚠️ ${error.response.data.message}`);
      } else {
        toast.error("❌ Lỗi khi lưu nhân viên");
      }
    }
  };

  const handleAdd = () => {
    setEditData(null);
    setModalOpen(true);
  };

  const handleEdit = (data) => {
    setEditData(data);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa nhân viên này không?"))
      return;
    try {
      const res = await api.delete(`/employees/${id}`);
      setEmployees((prev) => prev.filter((emp) => emp._id !== id));
      toast.success(res.data.message);
    } catch (error) {
      console.error("Xóa thất bại:", error);
      toast.error("❌ Lỗi khi xóa nhân viên");
    }
  };

  const customStyles = {
    table: {
      style: {
        borderRadius: "0.5rem",
        overflow: "hidden",
      },
    },
    rows: {
      style: {
        fontSize: "24px",
        paddingTop: "12px",
        paddingBottom: "12px",
      },
    },
    headCells: {
      style: {
        fontSize: "20px",
        fontWeight: "700",
        backgroundColor: "#f9fafb",
        color: "#111827",
        paddingTop: "14px",
        paddingBottom: "14px",
      },
    },
    cells: {
      style: {
        paddingLeft: "12px",
        paddingRight: "12px",
      },
    },
  };

  const columns = [
    { name: "#", selector: (row, i) => i + 1, with: "10px" },
    {
      name: "Tên nhân viên",
      selector: (row) => row.user?.name,
      sortable: true,
    },
    { name: "Email", selector: (row) => row.user?.email, sortable: true },

    {
      name: "Phòng ban",
      selector: (row) => row.department?.name || "N/A",
      sortable: true,
    },
    {
      name: "Hành động",
      cell: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() =>
              navigate(`/admin-dashboard/employees/${row._id}`)
            }
            className="text-green-600 hover:underline text-3xl"
          >
            <FaEye />
          </button>
          <button
            onClick={() => handleEdit(row)}
            className="text-blue-600 hover:underline text-3xl"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => handleDelete(row._id)}
            className="text-red-600 hover:underline text-3xl"
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">👤 Quản lý nhân viên</h2>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border rounded w-full max-w-sm"
        />
        <div className="flex gap-3">
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-1 rounded"
          >
            + Thêm nhân viên
          </button>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={filtered}
        pagination
        highlightOnHover
        striped
        responsive
        customStyles={customStyles}
      />

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h3 className="tex-lg font-bold mb-4">
              {editData ? "Chỉnh sửa" : "Thêm"} nhân viên
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = {
                  name: e.target.name.value,
                  email: e.target.email.value,
                  password: e.target.password?.value || undefined,
                  department: e.target.department.value,
                };
                if (!editData) {
                  formData.gender = gender;
                }
                handleFormSubmit(formData);
              }}
            >
              <input
                name="name"
                defaultValue={editData?.user?.name || ""}
                placeholder="Tên nhân viên"
                required
                className="w-full border p-2 rounded mb-3"
              />

              <input
                name="email"
                type="email"
                defaultValue={editData?.user?.email || ""}
                placeholder="Email"
                required
                className="w-full border p-2 rounded mb-3"
              />
              <input
                name="password"
                type="password"
                placeholder="Mật khẩu"
                defaultValue={editData?.user?.password || ""}
                className="w-full border p-2 rounded mb-3"
                required={!editData} // chỉ required khi thêm mới
              />
              {!editData && (
                <select
                  name="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full border p-2 rounded mb-3"
                >
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                </select>
              )}
              <select
                name="department"
                defaultValue={editData?.department?._id || ""}
                required
                className="w-full border p-2 rounded mb-3"
              >
                <option value="">-- Chọn phòng ban --</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name}
                  </option>
                ))}
              </select>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Bỏ qua
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  {editData ? "Cập nhật" : "Thêm mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
