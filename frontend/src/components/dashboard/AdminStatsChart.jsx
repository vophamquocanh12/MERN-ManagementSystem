// frontend/src/components/charts/AdminStatsChart.jsx
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
Chart.register(BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

const AdminStatsChart = ({ stats }) => {
  const barData = {
    labels: ["Phòng ban", "Nhân viên", "Lương"],
    datasets: [
      {
        label: "Tổng",
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        data: [stats.departments, stats.employees, stats.salaries],
      },
    ],
  };

  // const doughnutData = {
  //   labels: ["Approved", "Pending", "Rejected"],
  //   datasets: [
  //     {
  //       backgroundColor: ["#34d399", "#fbbf24", "#f87171"],
  //       data: [stats.leaveApproved, stats.leavePending, stats.leaveRejected],
  //     },
  //   ],
  // };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg mb-3">📊 Phân phối thực thể</h3>
        <Bar data={barData} />
      </div>
      {/* <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg mb-3">📍 Leave Status Breakdown</h3>
        <Doughnut data={doughnutData} />
      </div> */}
    </div>
  );
};

export default AdminStatsChart;
