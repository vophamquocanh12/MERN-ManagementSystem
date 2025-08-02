/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
// src/pages/admin/AdminSalaryPage.jsx
import { useEffect, useState } from "react";
import api from "@/services/api";
import DataTable from "react-data-table-component";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { exportToExcel, exportToPDF } from "../../utils/exportUtils";
import { io } from "socket.io-client";

const AdminSalaryPage = () => {
  const [salaries, setSalaries] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await api.get("/employees");
        setEmployees(res.data.employees);
      } catch (error) {
        toast.error("❌ Lỗi khi tải dữ liệu nhân viên");
      }
    };
    fetchEmployees();
  }, []);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL);
    socket.on("new-salary", (sal) => {
      toast.info(`📢 Đã thêm lương cho nhân viên: ${sal.name}`);
      fetchSalaries();
    });
    return () => socket.disconnect();
  }, []);

  const fetchSalaries = async () => {
    try {
      const res = await api.get("/salaries");
      setSalaries(res.data.salaries);
      setFiltered(res.data.salaries);
    } catch (error) {
      columns.error("Failed to fetch salaries:", error);
    }
  };

  useEffect(() => {
    fetchSalaries();
  }, []);

  useEffect(() => {
    const result = salaries.filter((s) =>
      s.employee?.user?.name?.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, salaries]);

  const handleFormSubmit = async (formData) => {
    try {
      if (editData) {
        console.log(editData._id);
        
        await api.put(`/salaries/${editData._id}`, formData);
        toast.success("✅ Cập nhật lương thành công");
      } else {
        await api.post("/salaries", formData);
        toast.success("✅ Thêm lương mới thành công");
      }
      setModalOpen(false);
      fetchSalaries();
    } catch (error) {
      toast.error("❌ Lỗi khi lưu lương");
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
    if (!window.confirm("Bạn có chắc muốn xóa bản ghi lương này?")) return;
    try {
      await api.delete(`/salaries/${id}`);
      setSalaries((prev) => prev.filter((s) => s._id !== id));
      toast.success("🗑️ Bản ghi lương đã được xóa");
    } catch (error) {
      console.error("Xóa thất bại:", error);
      toast.error("❌ Lỗi khi xóa bản ghi lương");
    }
  };

  const customStyles = {
    rows: {
      style: {
        fontSize: "20px",
      },
    },
    headCells: {
      style: {
        fontSize: "20px",
        fontWeight: "bold",
      },
    },
    cells: {
      style: {
        paddingLeft: "5px",
        paddingRight: "5px",
      },
    },
  };

  const columns = [
    { name: "#", selector: (row, i) => i + 1, width: "60px" },
    { name: "Nhân viên", selector: (row) => row.employee?.user?.name },
    {
      name: "Phòng ban",
      selector: (row) => row.employee?.department?.name || "N/A",
    },
    { name: "Tháng", selector: (row) => row.month },
    {
      name: "Lương cơ bản",
      selector: (row) => row.basePay.toLocaleString(),
      sortable: true,
    },
    {
      name: "Thưởng",
      selector: (row) => row.bonuses.toLocaleString() || 0,
    },
    {
      name: "Khấu trừ",
      selector: (row) => row.deductions.toLocaleString() || 0,
    },
    {
      name: "Tổng nhận",
      selector: (row) => row.totalPay.toLocaleString(),
      sortable: true,
    },
    { name: "Ghi chú", selector: (row) => row.remarks || "—" },
    {
      name: "Hành động",
      cell: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="text-blue-600 hover:underline text-2xl"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => handleDelete(row._id)}
            className="text-red-600 hover:underline text-2xl"
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">💰 Quản lý lương nhân viên</h2>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm nhân viên"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border rounded w-full max-w-sm"
        />
        <div className="flex gap-3">
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-1 rounded"
          >
            + Tạo lương cho nhân viên
          </button>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={filtered}
        customStyles={customStyles}
        pagination
        highlightOnHover
        responsive
        striped
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
                  employee: e.target.employee.value,
                  month: e.target.month.value,
                  basePay: parseFloat(e.target.basePay.value),
                  bonuses: parseFloat(e.target.bonuses.value) || 0,
                  deductions: parseFloat(e.target.deductions.value) || 0,
                  remarks: e.target.remarks.value,
                };
                handleFormSubmit(formData);
              }}
            >
              <select
                name="employee"
                defaultValue={editData?.employee?._id || ""}
                required
                className="w-full border p-2 rounded mb-3"
              >
                <option value="">- - Chọn nhân viên --</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp?.user?.name}
                  </option>
                ))}
              </select>
              <input
                name="month"
                type="month"
                defaultValue={editData?.month || ""}
                required
                className="w-full border p-2 rounded mb-3"
              />
              <input
                name="basePay"
                type="number"
                defaultValue={editData?.basePay || ""}
                placeholder="Lương cơ bản (VNĐ)"
                required
                className="w-full border p-2 rounded mb-3"
              />
              <input
                name="bonuses"
                type="number"
                defaultValue={editData?.bonuses || ""}
                placeholder="Thưởng (VNĐ)"
                className="w-full border p-2 rounded mb-3"
              />
              <input
                name="deductions"
                type="number"
                defaultValue={editData?.deductions || ""}
                placeholder="Khấu trừ (VNĐ)"
                className="w-full border p-2 rounded mb-3"
              />

              <textarea
                name="remarks"
                defaultValue={editData?.remarks || ""}
                placeholder="Ghi chú"
                className="w-full border p-2 rounded mb-3"
              />
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

export default AdminSalaryPage;
