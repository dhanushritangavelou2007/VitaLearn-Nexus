import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function exportJsonAsPdf({ title, subtitle, rows = [] }) {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text(title, 14, 18);
  if (subtitle) {
    doc.setFontSize(10);
    doc.text(subtitle, 14, 26);
  }
  doc.setFontSize(11);
  rows.forEach((row, index) => {
    const y = 38 + index * 7;
    doc.text(row.join(" | "), 14, y);
  });
  doc.save(`${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.pdf`);
}

export function exportJsonAsExcel({ title, rows = [] }) {
  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, title);
  const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  downloadBlob(new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.xlsx`);
}

export function printElement(elementId) {
  const element = document.getElementById(elementId);
  if (!element) return;
  const win = window.open("", "_blank", "width=1200,height=900");
  if (!win) return;
  win.document.write(`<html><head><title>Print</title></head><body>${element.outerHTML}</body></html>`);
  win.document.close();
  win.focus();
  win.print();
  win.close();
}
