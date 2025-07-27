// frontend/src/utils/exportUtils.js

import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

// 📄 Export to PDF
export const exportToPDF = (data, title = "Report") => {
  const doc = new jsPDF();
  doc.text(title, 14, 20);
  doc.autoTable({
    startY: 30,
    head: [Object.keys(data[0])],
    body: data.map((row) => Object.values(row)),
  });
  doc.save(`${title}.pdf`);
};

// 📊 Export to Excel
export const exportToExcel = (data, filename = "report.xlsx") => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
  XLSX.writeFile(workbook, filename);
};
