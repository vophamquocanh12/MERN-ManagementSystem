import { useEffect, useState } from "react";
import api from "@/services/api";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const EmployeeAnalytics = () => {
  const [genderData, setGenderData] = useState(null);
  const [departmentData, setDepartmentData] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await api.get("/employees/analytics", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const genderLabels = data.genderStats.map((g) => g._id || "Unspecified");
        const genderCounts = data.genderStats.map((g) => g.count);

        const deptLabels = data.departmentStats.map((d) => d._id || "Unknown");
        const deptCounts = data.departmentStats.map((d) => d.count);

        setGenderData({
          labels: genderLabels,
          datasets: [
            {
              label: "Gender Distribution",
              data: genderCounts,
              backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56", "#8B5CF6"],
            },
          ],
        });

        setDepartmentData({
          labels: deptLabels,
          datasets: [
            {
              label: "No. of Employees",
              data: deptCounts,
              backgroundColor: "#4ade80",
            },
          ],
        });
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold mb-4">📊 Employee Analytics</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">🎓 Gender Distribution</h3>
          {genderData ? <Pie data={genderData} /> : <p className="text-gray-500">Loading...</p>}
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">🏢 Employees by Department</h3>
          {departmentData ? <Bar data={departmentData} /> : <p className="text-gray-500">Loading...</p>}
        </div>
      </div>
    </div>
  );
};

export default EmployeeAnalytics;
