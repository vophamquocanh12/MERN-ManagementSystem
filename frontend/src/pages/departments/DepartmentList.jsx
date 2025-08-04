// src/pages/admin/DepartmentList.jsx
import { useEffect, useState } from "react";
import api from "@/services/api";
import DataTable from "react-data-table-component";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL);
    socket.on("new-department", (dept) => {
      toast.info(`📢 Đã thêm phòng ban: ${dept.name}`);
      fetchDepartments();
    });
    return () => socket.disconnect();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await api.get("/departments");
      setDepartments(res.data.departments);
      setFiltered(res.data.departments);
    } catch (error) {
      if (error.response && error.response.status === 400)
        toast.error(`⚠️ ${error.response.data.message}`);
      else toast.error("❌ Lỗi khi lưu phòng ban");
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    const result = departments.filter((d) =>
      d.name.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, departments]);

  const handleAdd = () => {
    setEditData(null);
    setModalOpen(true);
  };

  const handleEdit = (data) => {
    setEditData(data);
    setModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editData) {
        await api.put(`/departments/${editData._id}`, formData);
        toast.success("✅ Cập nhật phòng ban thành công");
      } else {
        await api.post("/departments", formData);
        toast.success("✅ Thêm phòng ban mới thành công");
      }

      setModalOpen(false);
      fetchDepartments();
    } catch {
      toast.error("❌ Lỗi khi lưu phòng ban");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa phòng ban này không?"))
      return;

    try {
      await api.delete(`/departments/${id}`);
      setDepartments((prev) => prev.filter((dept) => dept._id !== id));
      toast.success("🗑️ Phòng ban đã được xóa");
    } catch (error) {
      console.error("Xóa thất bại:", error);
      toast.error("❌ Lỗi khi xóa phòng ban");
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
    { name: "#", selector: (row, i) => i + 1, width: "60px" },
    { name: "Tên phòng ban", selector: (row) => row.name, sortable: true },
    { name: "Chi tiết mô tả", selector: (row) => row.description },
    {
      name: "Hành động",
      cell: (row) => (
        <div className="flex gap-2">
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
      <h2 className="text-xl font-semibold mb-4">🏢 Quản lý phòng ban</h2>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border rounded w-full max-w-sm"
        />
        <div className="flex gap-3">
          {/* <button onClick={() => exportToExcel(filtered, "departments.xlsx")} className="bg-green-600 text-white px-3 py-1 rounded">
            Export to Excel
          </button>
          <button onClick={() => exportToPDF(filtered, "Departments Report")} className="bg-red-600 text-white px-3 py-1 rounded">
            Export to PDF
          </button> */}
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-1 rounded"
          >
            + Thêm phòng ban
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
            <h3 className="text-lg font-bold mb-4">
              {editData ? "Chỉnh sửa" : "Thêm"} phòng ban
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = {
                  name: e.target.name.value,
                  description: e.target.description.value,
                };
                handleFormSubmit(formData);
              }}
            >
              <input
                name="name"
                defaultValue={editData?.name || ""}
                placeholder="Tên phòng ban"
                required
                className="w-full border p-2 rounded mb-3"
              />
              <textarea
                name="description"
                defaultValue={editData?.description || ""}
                placeholder="Chi tiết mô tả"
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

export default DepartmentList;
