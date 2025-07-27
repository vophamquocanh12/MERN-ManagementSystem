import React, { useState, useEffect } from 'react';
import api from "@/services/api";
import toast from 'react-hot-toast';

const AttendanceForm = () => {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    employee: '',
    date: '',
    status: 'Present',
    remarks: '',
  });

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const { data } = await api.get('/auth/users');
        setEmployees(data.users);
      } catch {
        toast.error("Failed to load employees.");
      }
    };
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/attendance', form);
      toast.success('✅ Attendance recorded!');
      setForm({ employee: '', date: '', status: 'Present', remarks: '' });
    } catch (error) {
      toast.error(error?.response?.data?.error || 'Error recording attendance');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 shadow rounded">
      <h3 className="text-lg font-semibold">Record Attendance</h3>

      <select name="employee" onChange={handleChange} value={form.employee} required>
        <option value="">Select Employee</option>
        {employees.map((emp) => (
          <option key={emp._id} value={emp._id}>{emp.name}</option>
        ))}
      </select>

      <input type="date" name="date" onChange={handleChange} value={form.date} required />
      <select name="status" onChange={handleChange} value={form.status}>
        <option value="Present">Present</option>
        <option value="Absent">Absent</option>
        <option value="Leave">Leave</option>
      </select>

      <textarea name="remarks" placeholder="Remarks (optional)" onChange={handleChange} value={form.remarks} />

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Save Attendance
      </button>
    </form>
  );
};

export default AttendanceForm;
