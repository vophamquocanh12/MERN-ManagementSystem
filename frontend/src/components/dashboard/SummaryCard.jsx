import React from "react";

const SummaryCard = ({ icon, label, count, color }) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded shadow">
      <div className={`text-2xl text-white p-3 rounded ${color}`}>{icon}</div>
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="text-lg font-bold">{count}</p>
      </div>
    </div>
  );
};

export default SummaryCard;
