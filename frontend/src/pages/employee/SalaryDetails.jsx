/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import api from "../../services/api";

const EmployeeSalaryPage = () => {
  // const [salaries, setSalaries] = useState([]);
  //const [latestSalary, setLatestSalary] = useState(null);
  const [loading, setLoading] = useState(true);

  // eslint-disable-next-line no-unused-vars
  const [salaries, setSalaries] = useState([]);
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    const fetchSalary = async () => {
      try {
        const res = await api.get("/salaries/my");
        setSalaries(res.data.salaries);
        setFiltered(res.data.salaries);
      } catch (error) {
        console.log("Failed to fetch salarys:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSalary();
  }, []);

  if (loading) return <div className="p-6">🔄 Đang tải bảng lương...</div>;

  const customStyles = {
    table: {
      style: {
        borderRadius: "0.5rem",
        overflow: "hidden",
      },
    },
    rows: {
      style: {
        fontSize: "18px",
        paddingTop: "12px",
        paddingBottom: "12px",
      },
    },
    headCells: {
      style: {
        fontSize: "20px",
        fontWeight: "600",
        backgroundColor: "#f9fafb",
        color: "#111827",
        paddingTop: "14px",
        paddingBottom: "14px",
      },
    },
    cells: {
      style: {
        paddingLeft: "12px",
        paddingRight: "12px",
      },
    },
  };

  const columns = [
    { name: "Tháng", selector: (row) => row.month, sortable: true },
    {
      name: "Lương cơ bản",
      selector: (row) => row.basePay.toLocaleString("vi-VN"),
    },
    { name: "Thưởng", selector: (row) => row.bonuses.toLocaleString("vi-VN") },
    {
      name: "Khấu trừ",
      selector: (row) => row.deductions.toLocaleString("vi-VN"),
    },
    {
      name: "Tổng lương",
      selector: (row) => row.totalPay.toLocaleString("vi-VN"),
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-5"> Chi tiết lương</h2>

      <DataTable
        columns={columns}
        data={filtered}
        pagination
        highlightOnHover
        striped
        responsive
        customStyles={customStyles}
      />
    </div>
  );
};

export default EmployeeSalaryPage;
