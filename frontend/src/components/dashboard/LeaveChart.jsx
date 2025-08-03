import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import api from "@/services/api";

const LeaveChart = () => {
  // eslint-disable-next-line no-unused-vars
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/analytics/leaves-per-month").then((res) => {
      setData(res.data);
    });
  }, []);

  return (
    // <div className="bg-white rounded shadow p-4 mt-6">
    //   <h3 className="text-lg font-semibold mb-4">📅 Leave Requests (Monthly)</h3>
    //   <ResponsiveContainer width="100%" height={300}>
    //     <BarChart data={data}>
    //       <CartesianGrid strokeDasharray="3 3" />
    //       <XAxis dataKey="month" />
    //       <YAxis />
    //       <Tooltip />
    //       <Bar dataKey="count" fill="#14b8a6" />
    //     </BarChart>
    //   </ResponsiveContainer>
    // </div>
    <></>
  );
};

export default LeaveChart;
