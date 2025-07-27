// src/components/employee/EmployeeForm.jsx
import { useState } from "react";
import api from "@/services/api";

const EmployeeForm = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
  });
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/employees", form); // ✅ Removed unused `res`
      setSuccess("✅ Employee registered!");
    } catch (err) {
      setSuccess(err.response?.data?.error || "❌ Something went wrong");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded shadow w-full max-w-md"
    >
      <h2 className="text-xl font-semibold mb-4">Register New Employee</h2>

      <input
        name="name"
        placeholder="Name"
        onChange={handleChange}
        value={form.name}
        className="input mb-2"
        required
      />
      <input
        name="email"
        placeholder="Email"
        onChange={handleChange}
        value={form.email}
        className="input mb-2"
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
        value={form.password}
        className="input mb-2"
        required
      />
      <input
        name="department"
        placeholder="Department"
        onChange={handleChange}
        value={form.department}
        className="input mb-4"
        required
      />

      <button type="submit" className="btn-primary w-full">
        Submit
      </button>

      {success && (
        <p className="mt-3 text-sm text-center text-green-600">{success}</p>
      )}
    </form>
  );
};

export default EmployeeForm;
