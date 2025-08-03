/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { FaCalendarCheck, FaMoneyBill, FaUserCheck } from "react-icons/fa";
import api from "@/services/api";
import { toast } from "react-toastify";

const EmployeeSummary = () => {

  const [salary, setSalary] = useState([])
  
  const fetchSalary = async () => {
    try {
      const res = await api.get('/salaries/my')
      setSalary(res.data.salaries)
    } catch (error) {
      toast.error("Không tải được dữ liệu lương");
    }
  }
  useEffect(() => {
    fetchSalary();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold mb-4">
        Chào mừng bạn đến với Trang tổng quan của bạn
      </h2>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {/* <div className="bg-blue-500 text-white p-4 rounded shadow">
          <div className="flex items-center gap-3">
            <FaCalendarCheck size={24} />
            <div>
              <p className="text-sm">Leaves Taken</p>
              <h3 className="text-lg font-bold">{data.leavesTaken}</h3>
            </div>
          </div>
        </div> */}

        <div className="bg-green-600 text-white p-4 rounded shadow">
          <div className="flex items-center gap-3">
            <FaMoneyBill size={24} />
            <div>
              <p className="text-sm">Lương</p>
              <h3 className="text-lg font-bold">
                {salary.length > 0
                  ? `${salary[0].totalPay.toLocaleString()} VNĐ`
                  : "0 VNĐ"}
              </h3>
            </div>
          </div>
        </div>

        {/* <div className="bg-purple-600 text-white p-4 rounded shadow">
          <div className="flex items-center gap-3">
            <FaUserCheck size={24} />
            <div>
              <p className="text-sm">Attendance</p>
              <h3 className="text-lg font-bold">
                ✅ {data.attendance.present} | ❌ {data.attendance.absent}
              </h3>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default EmployeeSummary;
