import React, { useState, useEffect } from "react";
import api from "@/services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const SalaryForm = () => {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    employee: "",
    month: "",
    basePay: "",
    bonuses: "",
    deductions: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch employee list for dropdown
    const fetchEmployees = async () => {
      try {
        const { data } = await api.get("/api/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setEmployees(data.users || []);
      } catch {
        toast.error("Failed to load employees");
      }
    };

    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { employee, month, basePay, bonuses, deductions } = formData;

    try {
      await api.post(
        "/api/salaries",
        {
          employee,
          month,
          basePay: Number(basePay),
          bonuses: Number(bonuses),
          deductions: Number(deductions),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Salary record added!");
      navigate("/admin-dashboard/salaries");
    } catch (error) {
      toast.error(error?.response?.data?.error || "Salary assignment failed");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Assign Salary</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Employee</label>
          <select
            name="employee"
            value={formData.employee}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.name} ({emp.email})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Month</label>
          <input
            type="month"
            name="month"
            value={formData.month}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block mb-1">Base Pay</label>
            <input
              type="number"
              name="basePay"
              value={formData.basePay}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Bonuses</label>
            <input
              type="number"
              name="bonuses"
              value={formData.bonuses}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Deductions</label>
            <input
              type="number"
              name="deductions"
              value={formData.deductions}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Submit Salary
        </button>
      </form>
    </div>
  );
};

export default SalaryForm;
