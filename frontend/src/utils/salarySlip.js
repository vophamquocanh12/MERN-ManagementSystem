import jsPDF from "jspdf";
import "jspdf-autotable";

export const generateSalarySlip = (employee) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Salary Slip", 14, 20);

  doc.setFontSize(12);
  doc.text(`Employee: ${employee.name}`, 14, 30);
  doc.text(`Department: ${employee.department}`, 14, 38);
  doc.text(`Month: ${employee.salary.month}`, 14, 46);

  doc.autoTable({
    startY: 55,
    head: [["Earnings", "Amount"]],
    body: [
      ["Basic", `£${employee.salary.basic}`],
      ["Bonus", `£${employee.salary.bonus}`],
      ["Deductions", `£${employee.salary.deductions}`],
      ["Net Pay", `£${employee.salary.net}`],
    ],
  });

  doc.save(`${employee.name}_SalarySlip.pdf`);
};
