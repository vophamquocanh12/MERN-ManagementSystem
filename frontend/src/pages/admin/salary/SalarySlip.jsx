import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { generateSalarySlip } from "../../../utils/salarySlip"; 

const SalarySlip = ({ salary }) => {
  const slipRef = useRef();

  // 🖼️ Styled PDF using canvas
  const handleExportCanvas = async () => {
    try {
      const canvas = await html2canvas(slipRef.current);
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 10, 10, 190, 0); // fit width
      pdf.save(`Styled_Salary_Slip_${salary.month}.pdf`);
    } catch (err) {
      console.error("Failed to export styled PDF:", err);
    }
  };

  // 📊 Structured PDF using util
  const handleExportStructured = () => {
    const employee = {
      name: salary.employee.name,
      department: salary.employee.department || "N/A",
      salary: {
        month: salary.month,
        basic: salary.basePay,
        bonus: salary.bonuses,
        deductions: salary.deductions,
        net: salary.totalPay,
      },
    };


    generateSalarySlip(employee); // ✅ Reusable util
  };

  return (
    <div className="bg-white shadow p-4 rounded max-w-md mx-auto mt-4">
      <div className="text-sm">
        <h2 className="text-xl font-bold mb-2">Salary Slip</h2>
        <p><strong>Employee:</strong> {salary.employee.name}</p>
        <p><strong>Month:</strong> {salary.month}</p>
        <p><strong>Base Pay:</strong> {salary.basePay}VNĐ</p>
        <p><strong>Bonuses:</strong> {salary.bonuses}VNĐ</p>
        <p><strong>Deductions:</strong> {salary.deductions}VNĐ</p>
        <hr className="my-2" />
        <p className="font-semibold"><strong>Total Pay:</strong> {salary.totalPay}VNĐ</p>
      </div>

      <div className="mt-4 flex gap-3">
        <button onClick={handleExportCanvas} className="bg-blue-600 text-white px-4 py-2 rounded">
          Download Styled PDF
        </button>
        <button onClick={handleExportStructured} className="bg-green-600 text-white px-4 py-2 rounded">
          Download Table PDF
        </button>
      </div>
    </div>
  );
};

export default SalarySlip;
