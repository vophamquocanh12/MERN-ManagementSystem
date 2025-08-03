// src/components/charts/AttendancePercentageChart.jsx
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const AttendancePercentageChart = ({ data }) => {
  const chartData = {
    labels: data.map((item) => item.month),
    datasets: [
      {
        label: "Attendance %",
        data: data.map((item) => item.percentage),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (value) => `${value}%`,
        },
      },
    },
  };

  return (
    // <div className="bg-white rounded shadow p-4 w-full">
    //   <h3 className="text-lg font-semibold mb-3">📈 Attendance Percentage</h3>
    //   <Line data={chartData} options={options} />
    // </div>
    <></>
  );
};

export default AttendancePercentageChart;
