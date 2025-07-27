// ✅ src/pages/admin/LeaveRequestsTable.jsx
import React, { useEffect, useState } from "react";
import api from "@/services/api";

const LeaveRequestsTable = () => {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const fetchLeaves = async () => {
      const { data } = await api.get("/api/leaves", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setLeaves(data.leaves);
    };
    fetchLeaves();
  }, []);

  const handleAction = async (id, status) => {
    await api.patch(
      "/api/leaves/approve",
      { leaveId: id, status },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    setLeaves((prev) =>
      prev.map((l) => (l._id === id ? { ...l, status } : l))
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Leave Requests</h2>
      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-200">
            <th>Name</th>
            <th>Start</th>
            <th>End</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((leave) => (
            <tr key={leave._id} className="border-t">
              <td>{leave.employee?.name}</td>
              <td>{new Date(leave.startDate).toLocaleDateString()}</td>
              <td>{new Date(leave.endDate).toLocaleDateString()}</td>
              <td>{leave.status}</td>
              <td>
                {leave.status === "Pending" && (
                  <>
                    <button
                      onClick={() => handleAction(leave._id, "Approved")}
                      className="text-green-600 mr-2"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(leave._id, "Rejected")}
                      className="text-red-600"
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveRequestsTable;