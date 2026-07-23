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
  downloadBlob(
    new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
    `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.xlsx`
  );
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

// Normalize vaccination entry — supports both legacy string and new object format
function normalizeVacc(v) {
  if (!v) return null;
  if (typeof v === "string") return { name: v, date: null, status: "completed" };
  return { name: v.name || "Unknown", date: v.date || null, status: v.status || "completed" };
}

/**
 * Downloads or prints a comprehensive, professional Student Health Passport PDF.
 * Includes: student photo (if available), all personal details, parent/emergency
 * contact, vaccination history with dates, and a detailed medical condition section.
 */
export function downloadProfessionalPassport(student, aiSummary, reportType = "passport", action = "download") {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = 210;
  const margin = 14;
  const contentW = pageW - margin * 2;
  let y = 0;

  // ── Helpers ──────────────────────────────────────────────────
  const checkPage = (needed = 12) => {
    if (y + needed > 275) {
      doc.addPage();
      y = 20;
    }
  };

  const sectionHeader = (text, color = [30, 64, 175]) => {
    checkPage(14);
    doc.setFillColor(...color);
    doc.rect(margin, y, contentW, 8, "F");
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.setFont(undefined, "bold");
    doc.text(text, margin + 3, y + 5.5);
    doc.setFont(undefined, "normal");
    y += 12;
  };

  const field = (label, value, indent = 0) => {
    checkPage(8);
    const val = value !== undefined && value !== null && value !== "" ? String(value) : "N/A";
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.setFont(undefined, "bold");
    doc.text(`${label}:`, margin + indent, y);
    doc.setTextColor(15, 23, 42);
    doc.setFont(undefined, "normal");
    const lines = doc.splitTextToSize(val, contentW - 55 - indent);
    doc.text(lines, margin + 55 + indent, y);
    y += 6 * lines.length;
  };

  const divider = () => {
    checkPage(4);
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y, margin + contentW, y);
    y += 4;
  };

  // ── Cover Header ─────────────────────────────────────────────
  doc.setFillColor(30, 64, 175);
  doc.rect(0, 0, pageW, 38, "F");
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.setFont(undefined, "bold");
  doc.text("VitaLearn Nexus", margin, 16);
  doc.setFontSize(11);
  doc.setFont(undefined, "normal");
  doc.text(
    reportType === "medical" ? "Medical Report" : "Digital Student Health Passport",
    margin,
    25
  );
  doc.setFontSize(9);
  doc.text(`Generated: ${new Date().toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}`, margin, 33);

  // Passport ID top-right
  const passportId = `VLN-${String(student.id || student._id || "0000").padStart(4, "0")}`;
  doc.setFontSize(9);
  doc.setTextColor(200, 220, 255);
  doc.text(`Passport ID: ${passportId}`, pageW - margin, 16, { align: "right" });
  doc.text(`Roll No: ${student.rollNo || "N/A"}`, pageW - margin, 23, { align: "right" });

  y = 46;

  // ── Student Photo placeholder ─────────────────────────────────
  // Draw a photo box (actual image embedding requires base64; show placeholder)
  doc.setDrawColor(148, 163, 184);
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(pageW - margin - 32, 42, 32, 36, 3, 3, "FD");
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text("Student", pageW - margin - 16, 57, { align: "center" });
  doc.text("Photo", pageW - margin - 16, 62, { align: "center" });
  doc.text(student.name?.split(" ")[0] || "", pageW - margin - 16, 67, { align: "center" });

  // ── Section 1: Student Information ───────────────────────────
  sectionHeader("1. Student Information");
  field("Full Name", student.name);
  field("Roll / Admission No", `${student.rollNo || "N/A"} / ${student.admissionNumber || "N/A"}`);
  field("Class / Section", `${student.class || student.className || "N/A"} / ${student.section || "N/A"}`);
  field("Date of Birth", student.dob);
  field("Gender", student.gender);
  field("Blood Group", student.bloodGroup);
  field("Attendance", student.attendance);
  field("Passport Status", student.passportStatus || "N/A");
  divider();

  // ── Section 2: Parent & Emergency Contact ────────────────────
  sectionHeader("2. Parent / Guardian & Emergency Contact", [5, 150, 105]);
  field("Parent / Guardian Name", student.parent?.name);
  field("Contact Number", student.parent?.contact);
  field("Email Address", student.parent?.email);
  field("Emergency Contact", student.emergencyContact || student.parent?.contact);
  divider();

  // ── Section 3: Vitals ────────────────────────────────────────
  sectionHeader("3. Physical Vitals", [124, 58, 237]);
  field("Height", student.vitals?.height);
  field("Weight", student.vitals?.weight);
  field("BMI", student.vitals?.bmi);
  field("Vision", student.vitals?.vision);
  field("Blood Pressure", student.vitals?.bloodPressure);
  field("Heart Rate", student.vitals?.heartRate);
  field("Temperature", student.vitals?.temperature ? `${student.vitals.temperature}°F` : null);
  divider();

  // ── Section 4: Allergies ─────────────────────────────────────
  sectionHeader("4. Allergies", [220, 38, 38]);
  const allergies = (student.allergies || []).filter((a) => a && a !== "None");
  field("Known Allergies", allergies.length > 0 ? allergies.join(", ") : "None reported");
  divider();

  // ── Section 5: Vaccination History ───────────────────────────
  sectionHeader("5. Vaccination History", [5, 150, 105]);
  const vaccinations = (student.vaccinations || []).map(normalizeVacc).filter(Boolean);
  if (vaccinations.length === 0) {
    checkPage(8);
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text("No vaccination records available.", margin + 3, y);
    y += 8;
  } else {
    // Table header
    checkPage(10);
    doc.setFillColor(241, 245, 249);
    doc.rect(margin, y, contentW, 7, "F");
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.setFont(undefined, "bold");
    doc.text("Vaccine Name", margin + 3, y + 5);
    doc.text("Date Administered", margin + 70, y + 5);
    doc.text("Status", margin + 130, y + 5);
    doc.setFont(undefined, "normal");
    y += 9;

    vaccinations.forEach((v, i) => {
      checkPage(8);
      if (i % 2 === 0) {
        doc.setFillColor(248, 250, 252);
        doc.rect(margin, y - 1, contentW, 7, "F");
      }
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.text(v.name, margin + 3, y + 4);
      doc.text(v.date || "Not recorded", margin + 70, y + 4);
      if (v.status === "completed") {
        doc.setTextColor(5, 150, 105);
      } else {
        doc.setTextColor(217, 119, 6);
      }
      doc.text(v.status === "completed" ? "✓ Completed" : "⚠ Pending", margin + 130, y + 4);
      doc.setTextColor(15, 23, 42);
      y += 7;
    });
  }
  divider();

  // ── Section 6: Medical Condition (Detailed) ──────────────────
  if (reportType !== "passport") {
    sectionHeader("6. Medical Condition — Detailed Clinical Record", [220, 38, 38]);

  const conditions = (student.medicalConditions || []).filter((c) => c && c !== "None");
  field("Current Diagnosed Condition(s)", conditions.length > 0 ? conditions.join(", ") : "No active conditions");
  field("Medical History", student.medicalHistory || (conditions.length > 0 ? conditions.join(", ") : "None on record"));
  field("Date of Diagnosis", student.diagnosisDate || student.lastUpdate || "N/A");
  field("Severity / Status", student.healthCondition || student.risk || "N/A");
  field("Symptoms Reported", (student.symptoms || []).filter((s) => s !== "None").join(", ") || "None");
  field("Verified Symptoms", (student.verifiedSymptoms || []).filter(Boolean).join(", ") || "None verified");
  field("Doctor's Diagnosis", student.doctorNotes || "Pending clinical review");
  field("Prescribed Medications", student.prescription || "None prescribed");
  field("Treatment Provided", student.treatment || "Ongoing monitoring");
  field("Doctor's Recommendations", student.recommendation || student.doctorNotes || "Follow up as scheduled");
  field("Follow-up Schedule", student.followUpDate || student.appointments?.[0]?.scheduledAt || "Not scheduled");
  field("Special Precautions", student.specialPrecautions || (allergies.length > 0 ? `Avoid: ${allergies.join(", ")}` : "None"));
  field("Risk Classification", student.risk ? student.risk.charAt(0).toUpperCase() + student.risk.slice(1) : "N/A");
  field("Health Score", student.healthScore ? `${student.healthScore}/100` : "N/A");
  field("Last Updated", student.lastUpdate || "N/A");
    field("Last Updated By", student.reviewedByName || student.updatedByName || "School Health System");
    divider();

    // ── Section 7: AI Health Summary ─────────────────────────────
    sectionHeader("7. AI Health Summary", [99, 102, 241]);
    checkPage(10);
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    const summaryText = student.perfectSummary || aiSummary || "No AI summary available.";
    const summaryLines = doc.splitTextToSize(summaryText, contentW - 6);
    summaryLines.forEach((line) => {
      checkPage(7);
      doc.text(line, margin + 3, y);
      y += 6;
    });
    divider();

    // ── Section 8: Recent Reports ────────────────────────────────
    if (student.reports && student.reports.length > 0) {
      sectionHeader("8. Recent Medical Reports", [71, 85, 105]);
      student.reports.forEach((r) => {
        checkPage(8);
        field(`${r.date || "N/A"} — ${r.type || "Report"}`, r.status || "N/A");
      });
      divider();
    }
  }

  // ── Footer ───────────────────────────────────────────────────
  const totalPages = doc.internal.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(
      "VitaLearn Nexus — Confidential Medical Record. For authorized personnel only.",
      margin,
      290
    );
    doc.text(`Page ${p} of ${totalPages}`, pageW - margin, 290, { align: "right" });
  }

  if (action === "print") {
    doc.autoPrint();
    const blob = doc.output("bloburl");
    window.open(blob, "_blank");
  } else {
    const filename = reportType === "medical"
      ? `VitaLearn-MedicalReport-${student.rollNo || student.id}.pdf`
      : `VitaLearn-Passport-${student.rollNo || student.id}.pdf`;
    doc.save(filename);
  }
}

/**
 * Downloads a Medical Report PDF — same comprehensive content as the passport
 * but labelled as a Medical Report.
 */
export function downloadMedicalReport(student, aiSummary) {
  downloadProfessionalPassport(student, aiSummary, "medical");
}
