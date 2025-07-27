// src/components/charts/AttendanceChart.jsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const AttendanceChart = ({ data }) => {
  return (
    <div className="bg-white rounded shadow p-4 w-full">
      <h3 className="text-lg font-semibold mb-3">📅 Present vs Absent Days</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="present" stroke="#10b981" name="Present" />
          <Line type="monotone" dataKey="absent" stroke="#ef4444" name="Absent" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttendanceChart;
