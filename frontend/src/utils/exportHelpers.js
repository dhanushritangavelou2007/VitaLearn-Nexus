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

export function downloadProfessionalPassport(student, aiSummary) {
  const doc = new jsPDF();
  let y = 20;

  const addHeader = (text) => {
    doc.setFontSize(16);
    doc.setTextColor(30, 64, 175); // Blue
    doc.text(text, 14, y);
    y += 8;
  };

  const addText = (label, value) => {
    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139); // Slate-500
    doc.text(`${label}:`, 14, y);
    doc.setTextColor(15, 23, 42); // Slate-900
    
    // Simple text wrapping
    const textLines = doc.splitTextToSize(String(value), 140);
    doc.text(textLines, 50, y);
    y += 6 * textLines.length;
  };

  doc.setFontSize(22);
  doc.setTextColor(15, 23, 42);
  doc.text("VitaLearn Health Passport", 14, y);
  y += 12;

  addHeader("Student Information");
  addText("Name", student.name);
  addText("Roll No", student.rollNo);
  addText("Class", student.class);
  addText("Age/Gender", `${student.dob} / ${student.gender}`);
  addText("Blood Group", student.bloodGroup);
  y += 6;

  addHeader("Health Overview");
  addText("Status", student.risk);
  addText("Health Score", student.healthScore);
  addText("Attendance", student.attendance);
  addText("BMI", student.vitals?.bmi);
  y += 6;

  addHeader("Medical Records");
  addText("Allergies", student.allergies?.join(", ") || "None");
  addText("Conditions", student.medicalConditions?.join(", ") || "None");
  addText("Vaccinations", student.vaccinations?.join(", ") || "None");
  y += 6;

  addHeader("Emergency Contact");
  addText("Parent Name", student.parent?.name);
  addText("Contact", student.parent?.contact);
  y += 6;

  if (y > 250) {
    doc.addPage();
    y = 20;
  }

  addHeader("AI Health Summary");
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  const summaryLines = doc.splitTextToSize(aiSummary || "No summary generated.", 180);
  doc.text(summaryLines, 14, y);
  
  doc.save(`Vitalearn-Passport-${student.rollNo}.pdf`);
}
