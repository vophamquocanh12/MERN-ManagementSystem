import { useEffect, useState } from "react";
import api from "@/services/api";

const LeaveDashboard = () => {
  const [leaves, setLeaves] = useState([]);

  const fetchLeaves = async () => {
    const { data } = await api.get("/leave/pending");
    setLeaves(data.leaves);
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleAction = async (id, status) => {
    await api.patch(`/leave/${id}/status`, { status });
    fetchLeaves();
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4 font-semibold">Leave Requests</h2>
      <table className="table-auto w-full border">
        <thead>
          <tr>
            <th>Name</th><th>Reason</th><th>From</th><th>To</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((leave) => (
            <tr key={leave._id} className="border-t">
              <td>{leave.employee.name}</td>
              <td>{leave.reason}</td>
              <td>{leave.from}</td>
              <td>{leave.to}</td>
              <td>
                <button onClick={() => handleAction(leave._id, "approved")} className="text-green-600 mr-2">Approve</button>
                <button onClick={() => handleAction(leave._id, "rejected")} className="text-red-600">Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveDashboard;
