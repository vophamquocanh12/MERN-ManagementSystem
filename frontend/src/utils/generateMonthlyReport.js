import jsPDF from "jspdf";
import "jspdf-autotable";

export const generateMonthlyReport = (data, month) => {
  const doc = new jsPDF();
  doc.text(`Monthly Report - ${month}`, 14, 16);
  doc.autoTable({
    head: [["Name", "Department", "Leaves", "Salary"]],
    body: data.map((emp) => [
      emp.name,
      emp.department,
      emp.leaveCount,
      `${emp.salary}VNĐ`,
    ]),
  });
  doc.save(`Monthly_Report_${month}.pdf`);
};