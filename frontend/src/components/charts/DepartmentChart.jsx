/* eslint-disable no-unused-vars */
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const DepartmentChart = ({ data }) => {
  const labels = data.map((dept) => dept.name);
  const counts = data.map((dept) => dept.employeeCount || 0); // Assuming backend sends employeeCount

  const chartData = {
    labels,
    datasets: [
      {
        label: "# of Employees",
        data: counts,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: { beginAtZero: true },
    },
  };

  return <></>;
};

export default DepartmentChart;
