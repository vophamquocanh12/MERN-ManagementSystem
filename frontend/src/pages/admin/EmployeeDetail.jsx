/* eslint-disable no-unused-vars */
import Breadcrumbs from "../../components/shared/Breadcrumbs";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/services/api";
import male from "../../assets/image/male.jpg";
import DataTable from "react-data-table-component";

const EmployeeDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await api.get(`/employees/${id}`);
        if (res.data.success) {
          setUser(res.data.employee.user); // ✅ nếu user nằm trong employee
          setEmployee(res.data.employee);
        } else {
          setError("Không tìm thấy nhân viên.");
        }
      } catch (err) {
        setError("Lỗi khi tải dữ liệu nhân viên.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [id]);

  if (loading) return <div className="p-6">🔄 Đang tải dữ liệu...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!employee || !user)
    return <div className="p-6">Không có dữ liệu nhân viên.</div>;
  const totalSalary = employee?.salary?.reduce(
    (sum, sal) => sum + (sal.totalPay || 0),
    0
  );
  const salaryColumns = [
    { name: "Tháng", selector: (row) => row.month, sortable: true },
    {
      name: "Lương cơ bản",
      selector: (row) => row.basePay.toLocaleString("vi-VN",) , sortable: true
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
      <Breadcrumbs customLabels={{ [id]: user.name }} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <div className="bg-white shadow-md rounded-md p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            👤 Hồ sơ của {user.name}
          </h2>

          <div className="flex items-center gap-5 mb-5">
            <img
              src={male}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border"
            />
            <div>
              <h3 className="text-xl font-semibold">{user.name}</h3>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>

          <div className="mb-4">
            <strong className="text-gray-700">Phòng ban:</strong>{" "}
            <span className="text-gray-800">
              {employee.department?.name || "Chưa được giao"}
            </span>
          </div>

          <div className="mb-4">
            <strong className="text-gray-700">Tiểu sử:</strong>
            <p className="mt-1 text-gray-700 whitespace-pre-line">
              {employee.bio || "Chưa có tiểu sử."}
            </p>
          </div>

          <div className="mb-4">
            <strong className="text-gray-700">Kỹ năng:</strong>
            <p className="mt-1 text-gray-700 flex flex-wrap gap-2">
              {employee.skills?.length > 0
                ? employee.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))
                : "Không có kỹ năng."}
            </p>
          </div>

          {employee.resume && (
            <div className="mb-4">
              <strong className="text-gray-700">Resume:</strong>{" "}
              <a
                href={employee.resume}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                📄 Xem hồ sơ
              </a>
            </div>
          )}
        </div>

        {/* Cột phải: Bảng lương */}
        <div className="bg-white shadow-md rounded-md p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            💰 Bảng lương
          </h2>
          <DataTable
            columns={salaryColumns}
            data={employee.salary || []}
            pagination
            highlightOnHover
            striped
            responsive
            customStyles={{
              rows: { style: { fontSize: "16px" } },
              headCells: { style: { fontSize: "18px", fontWeight: "bold" } },
            }}
          />

          {employee.salary?.length > 0 && (
            <div className="text-right mt-4 text-lg font-semibold text-gray-700">
              Tổng cộng: {" "} 
              {employee.salary
                .reduce((sum, sal) => sum + (sal.totalPay || 0), 0)
                .toLocaleString("vi-VN")} VNĐ
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;
