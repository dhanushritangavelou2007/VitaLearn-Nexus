import { getRepository } from "../repositories/index.js";
import { generateAIHealthReport } from "../utils/aiEngine.js";

export async function listStudents({ page = 1, limit = 20, search = "", risk, className }, user) {
  const repo = getRepository("Student");
  const query = {};

  if (user) {
    if (user.role === "parent") {
      query["parent.email"] = user.email;
    } else if (user.role === "student") {
      // In demo mode, we assign student by demo-student-1 for the default student user
      query.id = "demo-student-1"; 
    }
  }

  if (search) {
    query.$or = [
      { name: new RegExp(search, "i") },
      { rollNo: new RegExp(search, "i") },
      { class: new RegExp(search, "i") },
    ];
  }
  if (risk) query.risk = risk;
  if (className) query.class = className;

  const skip = (Number(page) - 1) * Number(limit);
  
  // Handling promise correctly for both demo and db repos
  const items = await repo.find(query, { createdAt: -1 }, skip, Number(limit));
  const total = await repo.countDocuments(query);

  return {
    items,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)) || 1,
    },
  };
}

export async function getStudentById(id) {
  const repo = getRepository("Student");
  const student = await repo.findById(id);
  if (!student) return null;
  const aiReport = generateAIHealthReport(student);
  return { ...student.toObject ? student.toObject() : student, aiReport };
}

export async function updateStudent(id, payload) {
  const repo = getRepository("Student");
  let updated = await repo.findByIdAndUpdate(id, payload);
  if (updated) {
     const aiReport = generateAIHealthReport(updated);
     updated.healthScore = aiReport.score;
     updated.risk = aiReport.risk;
     updated = await repo.findByIdAndUpdate(id, { healthScore: aiReport.score, risk: aiReport.risk });
  }
  return updated;
}
