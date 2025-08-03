// 📁 src/components/dashboard/Charts.jsx
import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

// eslint-disable-next-line no-unused-vars
const Charts = ({ leaveData, employeeGrowth }) => {
  // Static fallback if props not passed
  // const pieData = {
  //   labels: ["Approved", "Pending", "Rejected"],
  //   datasets: [
  //     {
  //       label: "Leave Requests",
  //       data: leaveData || [14, 5, 3],
  //       backgroundColor: ["#4ade80", "#facc15", "#f87171"],
  //       borderWidth: 1,
  //     },
  //   ],
  // };

  // const barData = {
  //   labels: ["January", "February", "March", "April"],
  //   datasets: [
  //     {
  //       label: "New Employees",
  //       data: employeeGrowth || [2, 3, 5, 1],
  //       backgroundColor: "#60a5fa",
  //       borderRadius: 4,
  //     },
  //   ],
  // };

  return (
    // <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
    //   {/* <div className="bg-white p-4 rounded shadow transition-all duration-300 hover:shadow-md">
    //     <h3 className="text-lg font-semibold mb-3">📊 Leave Status</h3>
    //     <Pie data={pieData} />
    //   </div> */}

    //   {/* <div className="bg-white p-4 rounded shadow transition-all duration-300 hover:shadow-md">
    //     <h3 className="text-lg font-semibold mb-3">📈 Employee Growth</h3>
    //     <Bar data={barData} />
    //   </div> */}
    // </section>
    <></>
  );
};

export default Charts;
