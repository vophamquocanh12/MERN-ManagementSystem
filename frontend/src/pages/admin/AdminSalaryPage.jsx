// src/pages/admin/AdminSalaryPage.jsx
import { useEffect, useState } from "react";
import api from "@/services/api";
import DataTable from "react-data-table-component";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { exportToExcel, exportToPDF } from "../../utils/exportUtils";

const AdminSalaryPage = () => {
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchSalaries();
  }, []);

  const fetchSalaries = async () => {
    try {
      const res = await api.get(`${import.meta.env.VITE_API_URL}/salaries`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setSalaries(res.data.salaries || []);
    } catch (err) {
      toast.error("❌ Failed to fetch salaries");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = salaries.filter((s) =>
    s?.employee?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await api.delete(`${import.meta.env.VITE_API_URL}/salaries/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("🗑️ Salary deleted");
      fetchSalaries();
    } catch {
      toast.error("❌ Failed to delete salary");
    }
  };

  const columns = [
    { name: "#", selector: (_, i) => i + 1, width: "60px" },
    { name: "Employee", selector: (row) => row.employee?.name },
    { name: "Department", selector: (row) => row.employee?.department || "N/A" },
    { name: "Amount (£)", selector: (row) => row.amount, sortable: true },
    { name: "Bonus (£)", selector: (row) => row.bonus || 0 },
    { name: "Deductions (£)", selector: (row) => row.deductions || 0 },
    { name: "Total Pay (£)", selector: (row) => row.totalPay, sortable: true },
    {
      name: "Paid Date",
      selector: (row) => new Date(row.paidDate).toLocaleDateString(),
    },
    { name: "Remarks", selector: (row) => row.remarks || "—" },
    {
      name: "Actions",
      cell: (row) => (
        <button onClick={() => handleDelete(row._id)} className="text-red-600">
          <FaTrash />
        </button>
      ),
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">💰 All Salary Records</h2>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <input
          type="text"
          placeholder="Search by employee..."
          className="px-3 py-2 border rounded w-full max-w-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex gap-3">
          <button
            className="bg-green-600 text-white px-4 py-1 rounded"
            onClick={() => exportToExcel(filtered, "salaries.xlsx")}
          >
            Export to Excel
          </button>
          <button
            className="bg-red-600 text-white px-4 py-1 rounded"
            onClick={() => exportToPDF(filtered, "Salaries Report")}
          >
            Export to PDF
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        progressPending={loading}
        pagination
        highlightOnHover
        responsive
        striped
      />
    </div>
  );
};

export default AdminSalaryPage;
