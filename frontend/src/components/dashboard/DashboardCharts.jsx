/* eslint-disable no-unused-vars */
// frontend/src/components/dashboard/DashboardCharts.jsx
import React, { useEffect, useState } from "react";
import api from "@/services/api";

// Recharts components
//  import AttendanceChart from "../charts/AttendanceChart";
  import SalaryChart from "../charts/SalaryChart";
  import LeaveTrendChart from "../charts/LeaveTrendChart";
  import AttendancePieChart from "../charts/AttendancePieChart";
  import LeaveChart from "../dashboard/LeaveChart";
  import PayrollBarChart from "../charts/PayrollBarChart";

// Chart.js combo (bar + doughnut)
import AdminStatsChart from "../dashboard/AdminStatsChart";
import DepartmentChart from "../charts/DepartmentChart";

const DashboardCharts = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [salaryData, setSalaryData] = useState([]);
  const [leaveTrendData, setLeaveTrendData] = useState([]);
  const [attendanceSummaryData, setAttendanceSummaryData] = useState([]);
  const [leaveBarData, setLeaveBarData] = useState([]);
  const [payrollDeptData, setPayrollDeptData] = useState([]);
  const [adminStats, setAdminStats] = useState(null);
  const [departmentData, setDepartmentData] = useState([]);

  useEffect(() => {
    const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };

    const fetchAllChartData = async () => {
      try {
        const [
          attTrend,
          salaryStats,
          leaveTrend,
          attSummary,
          leaveMonthly,
          payrollDept,
          statsRes,
          deptChartRes,
        ] = await Promise.all([
          api.get("/attendance/trends", { headers }),
          api.get("/salaries/salary-stats", { headers }),
          api.get("/leaves/trends", { headers }),
          api.get("/attendance/summary", { headers }),
          api.get("/analytics/leaves-per-month", { headers }),
          api.get("/salaries/summary-by-department", { headers }),
          api.get("/analytics/dashboard-stats", { headers }),
          api.get("/departments/with-count", { headers }),
        ]);

        setAttendanceData(attTrend.data.data);
        setSalaryData(salaryStats.data.stats || salaryStats.data);
        setLeaveTrendData(leaveTrend.data);
        setAttendanceSummaryData(attSummary.data || attSummary);
        setLeaveBarData(leaveMonthly.data || leaveMonthly);
        setPayrollDeptData(payrollDept.data || payrollDept);
        setAdminStats(statsRes.data || statsRes);
        setDepartmentData(deptChartRes.data || []); // ✅ NEW
      } catch (err) {
        console.error("❌ Failed to load dashboard charts:", err.response?.data || err.message);
      }
    };

    fetchAllChartData();
  }, []);

  return (
    <div className="space-y-8">
      {/* 🔼 Grid of 4 charts */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <AttendanceChart data={attendanceData} />
        <SalaryChart data={salaryData} />
        <LeaveTrendChart data={leaveTrendData} />
        <AttendancePieChart data={attendanceSummaryData} />
      </div> */}

      {/* 🔽 Full-width stacked charts */}
      <div className="mt-6 grid grid-cols-1 gap-6">
        <LeaveChart data={leaveBarData} />
        <PayrollBarChart data={payrollDeptData} />
      </div>

      {/* 🏢 NEW Department chart */}
      {departmentData.length > 0 && (
        <div className="mt-6 bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Employees by Department</h3>
          <DepartmentChart data={departmentData} />
        </div>
      )}

      {/* 📊 Chart.js summary combo */}
      {adminStats && <AdminStatsChart stats={adminStats} />}
    </div>
  );
};

export default DashboardCharts;
