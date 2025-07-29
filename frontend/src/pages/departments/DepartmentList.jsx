// src/pages/admin/DepartmentList.jsx
import { useEffect, useState } from "react";
import api from "@/services/api";
import DataTable from "react-data-table-component";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { exportToPDF, exportToExcel } from "../../utils/exportUtils";

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL);
    socket.on("new-department", (dept) => {
      toast.info(`📢 New department added: ${dept.name}`);
      fetchDepartments();
    });
    return () => socket.disconnect();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await api.get("/departments");
      setDepartments(res.data.departments);
      setFiltered(res.data.departments);
    } catch (err) {
      console.error("Failed to fetch departments:", err);
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
        toast.success("✅ Department updated");
      } else {
        await api.post("/departments", formData);
        toast.success("✅ Department added");
      }

      setModalOpen(false);
      fetchDepartments();
    } catch {
      toast.error("❌ Error saving department");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this department?")) return;

    try {
      await api.delete(`/departments/${id}`);
      setDepartments((prev) => prev.filter((dept) => dept._id !== id));
      toast.success("🗑️ Department deleted");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("❌ Error deleting department");
    }
  };

  const customStyles = {
    rows: {
      style: {
        fontSize: "30px"
      },
    },
    headCells: {
      style: {
        fontSize: "30px",
        fontWeight: "bold"
      },
    },
    cells: {
      style: {
        paddingLeft: "8px",
        paddingRight: "8px"
      },
    },
  };

  const columns = [
    { name: "#", selector: (row, i) => i + 1, width: "60px" },
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Description", selector: (row) => row.description },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          <button onClick={() => handleEdit(row)} className="text-blue-600 hover:underline text-3xl">
            <FaEdit />
          </button>
          <button onClick={() => handleDelete(row._id)} className="text-red-600 hover:underline text-3xl">
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Manage Departments</h2>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border rounded w-full max-w-sm"
        />
        <div className="flex gap-3">
          <button onClick={() => exportToExcel(filtered, "departments.xlsx")} className="bg-green-600 text-white px-3 py-1 rounded">
            Export to Excel
          </button>
          <button onClick={() => exportToPDF(filtered, "Departments Report")} className="bg-red-600 text-white px-3 py-1 rounded">
            Export to PDF
          </button>
          <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-1 rounded">
            + Add Department
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
            <h3 className="text-lg font-bold mb-4">{editData ? "Edit" : "Add"} Department</h3>
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
                placeholder="Department Name"
                required
                className="w-full border p-2 rounded mb-3"
              />
              <textarea
                name="description"
                defaultValue={editData?.description || ""}
                placeholder="Description"
                className="w-full border p-2 rounded mb-3"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
                  {editData ? "Update" : "Create"}
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
